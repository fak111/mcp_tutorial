import asyncio
import sys
import os
from typing import Optional
from contextlib import AsyncExitStack
from dotenv import load_dotenv

from mcp import ClientSession, StdioServerParameters
from mcp.client.stdio import stdio_client

load_dotenv()  # Load environment variables from .env

NODE_PATH = "/opt/homebrew/bin/node"  # Full path to node executable

class MCPClient:
    def __init__(self):
        self.session: Optional[ClientSession] = None
        self.exit_stack = AsyncExitStack()

    async def connect_to_server(self, server_script_path: str):
        """Connect to MCP server without LLM dependencies"""
        if not (server_script_path.endswith('.py') or server_script_path.endswith('.js')):
            raise ValueError("Server script must be a .py or .js file")

        command = "python" if server_script_path.endswith('.py') else NODE_PATH
        server_params = StdioServerParameters(
            command=command,
            args=[server_script_path],
            env={
                "GOOGLE_CLIENT_ID": os.getenv("GOOGLE_CLIENT_ID"),
                "GOOGLE_CLIENT_SECRET": os.getenv("GOOGLE_CLIENT_SECRET"),
                "PATH": os.environ.get("PATH", "")  # Pass the current PATH
            }
        )

        stdio_transport = await self.exit_stack.enter_async_context(stdio_client(server_params))
        self.stdio, self.write = stdio_transport
        self.session = await self.exit_stack.enter_async_context(
            ClientSession(self.stdio, self.write))

        await self.session.initialize()
        response = await self.session.list_tools()
        print("\nConnected to server with tools:", [tool.name for tool in response.tools])

    async def process_query(self, query: str) -> str:
        """Direct tool execution without LLM mediation"""
        # Step 1: List available tools
        tools_response = await self.session.list_tools()

        # Step 2: Direct tool selection (example: first tool)
        if not tools_response.tools:
            return "No available tools"

        selected_tool = tools_response.tools[0]

        # Step 3: Execute tool with raw input
        try:
            result = await self.session.call_tool(
                selected_tool.name,
                {"input": query}  # Pass raw input directly
            )
            return f"Tool {selected_tool.name} executed\nResult: {result.content}"
        except Exception as e:
            return f"Tool execution failed: {str(e)}"

    async def chat_loop(self):
        """Interactive command interface"""
        print("\nMCP Command Client Started!")
        while True:
            try:
                raw_cmd = input("\nCommand (tools/exec <tool> <args>/quit): ")
                # Only convert the command part to lowercase, not the arguments
                if raw_cmd.lower() == 'quit':
                    break
                elif raw_cmd.lower() == 'tools':
                    response = await self.session.list_tools()
                    print("\nAvailable tools:", [t.name for t in response.tools])
                elif raw_cmd.lower().startswith('exec '):
                    # Split preserving case for arguments
                    parts = raw_cmd.split(' ', 2)
                    if len(parts) < 3:
                        print("Error: Missing tool name or arguments")
                        continue

                    _, tool_name, arg = parts
                    tool_name = tool_name.lower()  # tool name can be lowercase

                    # Special handling for get_weather tool
                    if tool_name == 'get_weather':
                        # Format the city parameter correctly, preserving case
                        params = {"city": arg.strip()}
                    elif tool_name == 'get_podcast':
                        params = {"prompt": arg.strip()}
                    elif tool_name == 'send_email':
                        # Try to parse the argument as JSON
                        try:
                            import json
                            params = json.loads(arg)
                        except json.JSONDecodeError:
                            print("Error: Invalid JSON format for email parameters")
                            continue
                    else:
                        # Default handling for other tools
                        params = {"args": arg}

                    result = await self.session.call_tool(tool_name, params)
                    print(f"\nTool Result: {result.content}")
                else:
                    print("Unknown command")
            except Exception as e:
                print(f"Error: {str(e)}")

    async def cleanup(self):
        await self.exit_stack.aclose()

async def main():
    if len(sys.argv) < 2:
        print("Usage: python client.py <path_to_server_script>")
        sys.exit(1)

    client = MCPClient()
    try:
        await client.connect_to_server(sys.argv[1])
        await client.chat_loop()
    finally:
        await client.cleanup()

if __name__ == "__main__":
    asyncio.run(main())
