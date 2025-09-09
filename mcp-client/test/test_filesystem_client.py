#!/usr/bin/env python3
import asyncio
import json
from mcp import ClientSession, StdioServerParameters
from mcp.client.stdio import stdio_client
from contextlib import AsyncExitStack

async def test_filesystem_server():
    """Test the filesystem server with direct tool calls"""
    
    # Server parameters
    server_params = StdioServerParameters(
        command="node",
        args=["../mcp-server/filesystem/dist/index.js", "/Users/zhangbeibei/code/github/mcp_tutorial"],
        env=None
    )
    
    async with AsyncExitStack() as exit_stack:
        # Connect to server
        stdio_transport = await exit_stack.enter_async_context(
            stdio_client(server_params)
        )
        stdio, write = stdio_transport
        session = await exit_stack.enter_async_context(
            ClientSession(stdio, write)
        )
        
        await session.initialize()
        
        # List available tools
        tools_response = await session.list_tools()
        print("Available tools:", [tool.name for tool in tools_response.tools])
        
        # Test list_directory tool
        try:
            print("\n=== Testing list_directory ===")
            result = await session.call_tool("list_directory", {"path": "/Users/zhangbeibei/code/github/mcp_tutorial"})
            print("Result:", result)
        except Exception as e:
            print(f"Error calling list_directory: {e}")
        
        # Test read_text_file tool
        try:
            print("\n=== Testing read_text_file ===")
            result = await session.call_tool("read_text_file", {"path": "/Users/zhangbeibei/code/github/mcp_tutorial/README.md"})
            print("Result:", result)
        except Exception as e:
            print(f"Error calling read_text_file: {e}")

if __name__ == "__main__":
    asyncio.run(test_filesystem_server())
