#!/usr/bin/env python3
import asyncio
import json
from typing import Optional
from contextlib import AsyncExitStack

from mcp import ClientSession, StdioServerParameters
from mcp.client.stdio import stdio_client
from openai import OpenAI
from dotenv import load_dotenv
import os

load_dotenv()


class MCPClient:
    def __init__(self):
        self.session: Optional[ClientSession] = None
        self.exit_stack = AsyncExitStack()
        self.client = OpenAI(
            base_url=os.getenv("INTERN_BASE_URL"),
            api_key=os.getenv("INTERN_API_KEY"),
        )

    async def connect_to_server(
        self, server_script_path: str, additional_args: list = None
    ):
        """Connect to an MCP server"""
        is_python = server_script_path.endswith(".py")
        is_js = server_script_path.endswith(".js")
        if not (is_python or is_js):
            raise ValueError("Server script must be a .py or .js file")

        command = "python" if is_python else "node"
        args = [server_script_path]
        if additional_args:
            args.extend(additional_args)

        server_params = StdioServerParameters(command=command, args=args, env=None)

        stdio_transport = await self.exit_stack.enter_async_context(
            stdio_client(server_params)
        )
        self.stdio, self.write = stdio_transport
        self.session = await self.exit_stack.enter_async_context(
            ClientSession(self.stdio, self.write)
        )

        await self.session.initialize()

        # List available tools
        response = await self.session.list_tools()
        tools = response.tools
        print("\nConnected to server with tools:", [tool.name for tool in tools])

    async def process_query(self, query: str) -> str:
        """Process a query using AI and available tools"""

        # Get available tools
        response = await self.session.list_tools()
        available_tools = [
            {
                "type": "function",
                "function": {
                    "name": tool.name,
                    "description": tool.description or f"Tool for {tool.name}",
                    "parameters": tool.inputSchema,
                },
            }
            for tool in response.tools
        ]

        # Create system message with tool usage instructions
        system_message = {
            "role": "system",
            "content": """You are a helpful assistant with access to filesystem tools.

IMPORTANT: When calling tools, you MUST provide arguments as a JSON object with the correct parameter names.

For example:
- To read a file: {"path": "/path/to/file.txt"}
- To list directory: {"path": "/path/to/directory"}
- To write file: {"path": "/path/to/file.txt", "content": "file content"}

NEVER pass arguments as strings directly. Always use the proper JSON object format.""",
        }

        messages = [system_message, {"role": "user", "content": query}]

        # AI API call
        response = self.client.chat.completions.create(
            model=os.getenv("INTERN_MODEL", "intern-s1"),
            max_tokens=int(os.getenv("MAX_TOKENS", "1000")),
            messages=messages,
            tools=available_tools,
        )

        # Process response and handle tool calls
        final_text = []
        message = response.choices[0].message

        if getattr(message, "tool_calls", None):
            # Add assistant message with tool_calls
            assistant_msg = {
                "role": "assistant",
                "content": message.content or "",
                "tool_calls": [
                    {
                        "id": tc.id,
                        "type": "function",
                        "function": {
                            "name": tc.function.name,
                            "arguments": tc.function.arguments,
                        },
                    }
                    for tc in message.tool_calls
                ],
            }
            messages.append(assistant_msg)

            # Execute each tool call
            for tc in message.tool_calls:
                tool_name = tc.function.name
                try:
                    tool_args = json.loads(tc.function.arguments)
                    print(f"\n[DEBUG] Calling tool {tool_name} with args: {tool_args}")

                    # Validate arguments
                    if not isinstance(tool_args, dict):
                        error_msg = f"Error: Tool arguments must be a dictionary, got {type(tool_args)}"
                        final_text.append(error_msg)
                        print(f"[ERROR] {error_msg}")
                        continue

                    result = await self.session.call_tool(tool_name, tool_args)
                    print(f"[DEBUG] Tool result: {result}")

                    # Extract text content from result
                    result_text = ""
                    if getattr(result, "content", None):
                        parts = []
                        for p in result.content:
                            if getattr(p, "type", None) == "text":
                                parts.append(p.text)
                            else:
                                parts.append(str(p))
                        result_text = "\n".join(parts)
                    else:
                        result_text = str(result)

                    final_text.append(result_text)

                    # Add tool result to messages
                    messages.append(
                        {
                            "role": "tool",
                            "tool_call_id": tc.id,
                            "content": result_text,
                        }
                    )

                except json.JSONDecodeError as e:
                    error_msg = f"Error parsing tool arguments: {e}"
                    final_text.append(error_msg)
                    print(f"[ERROR] {error_msg}")
                    print(f"[ERROR] Raw arguments: {tc.function.arguments}")
                except Exception as e:
                    error_msg = f"Error calling tool {tool_name}: {e}"
                    final_text.append(error_msg)
                    print(f"[ERROR] {error_msg}")

            # Get final response from AI
            follow = self.client.chat.completions.create(
                model=os.getenv("INTERN_MODEL", "intern-s1"),
                max_tokens=int(os.getenv("MAX_TOKENS", "1000")),
                messages=messages,
            )
            follow_msg = follow.choices[0].message
            if follow_msg.content:
                final_text.append(follow_msg.content)
        else:
            # No tool calls: just add assistant content
            if message.content:
                final_text.append(message.content)

        return "\n".join(final_text)

    async def chat_loop(self):
        """Run an interactive chat loop"""
        print("\nMCP Client Started !!!")
        print("Type your queries or 'quit' to exit.")

        while True:
            try:
                query = input("\nQuery: ").strip()

                if query.lower() == "quit":
                    break

                response = await self.process_query(query)
                print("\n" + response)

            except Exception as e:
                print(f"\nError: {str(e)}")

    async def cleanup(self):
        """Clean up resources"""
        await self.exit_stack.aclose()


async def main():
    import sys

    if len(sys.argv) < 2:
        print(
            "Usage: python client_fixed.py <path_to_server_script> [additional_args...]"
        )
        sys.exit(1)

    client = MCPClient()
    try:
        additional_args = sys.argv[2:] if len(sys.argv) > 2 else None
        await client.connect_to_server(sys.argv[1], additional_args)
        await client.chat_loop()
    finally:
        await client.cleanup()


if __name__ == "__main__":
    asyncio.run(main())
