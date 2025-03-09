import asyncio
import sys
import json
import os
from typing import Optional
from contextlib import AsyncExitStack

from mcp import ClientSession, StdioServerParameters
from mcp.client.stdio import stdio_client

class MCPClient:
    def __init__(self):
        self.session: Optional[ClientSession] = None
        self.exit_stack = AsyncExitStack()

    async def connect_to_server(self, server_script_path: str):
        """Connect to MCP server without LLM dependencies"""
        server_params = StdioServerParameters(
            command="docker",
            args=["run", "-i", "--rm", "-v", f"{os.getcwd()}:/workspace", "mcp/filesystem", "/workspace"],
            env=None
        )
        # -v 简单但功能有限
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
        print("\nExample usage:")
        print("1. List tools: tools")
        print("2. Execute tool: exec get_weather London")
        print("3. Quit: quit")

        while True:
            try:
                cmd = input("\nCommand (tools/exec <tool> <args>/quit): ").strip()

                if cmd.lower() == 'quit':
                    break
                elif cmd.lower() == 'tools':
                    response = await self.session.list_tools()
                    print("\nAvailable tools:", [t.name for t in response.tools])
                elif cmd.startswith('exec '):
                    parts = cmd.split(' ', 2)
                    if len(parts) < 3:
                        print("Error: Missing tool name or arguments")
                        continue

                    _, tool_name, args = parts

                    # If args is a JSON string, parse it
                    try:
                        if args.startswith('{'):
                            params = json.loads(args)
                        else:
                            # If it's just a simple string, use it as the city parameter
                            params = {"city": args}

                        result = await self.session.call_tool(tool_name, params)
                        if hasattr(result, 'content'):
                            for content_item in result.content:
                                if hasattr(content_item, 'text'):
                                    print(f"\nResult: {content_item.text}")
                                elif isinstance(content_item, dict):
                                    print(f"\nResult: {content_item.get('text', str(content_item))}")
                        else:
                            print(f"\nResult: {result}")
                    except json.JSONDecodeError:
                        print("Error: Invalid JSON format in arguments")
                    except Exception as e:
                        print(f"Error: {str(e)}")
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
