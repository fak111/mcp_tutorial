# MCP Client

A Python-based client implementation for interacting with MCP (Model Control Protocol) servers. This client provides a command-line interface for executing tools and interacting with MCP-compatible servers.

## Features

- Connect to MCP servers using stdio communication
- Interactive command-line interface
- Support for both Python and JavaScript MCP servers
- Tool execution capabilities
- JSON parameter support

## Requirements

- Python >= 3.13
- Dependencies:
  - anthropic >= 0.49.0
  - mcp >= 1.3.0
  - python-dotenv >= 1.0.1

## Installation

1. Clone the repository
2. Create a virtual environment:
   ```bash
   cd mcp-client

   # Create virtual environment
   uv venv

   # Activate virtual environment
   # On Windows:
   .venv\Scripts\activate
   # On Unix or MacOS:
   source .venv/bin/activate

   # Install required packages
   uv add mcp anthropic python-dotenv
   ```
3. run:
   ```bash
   uv run client_no_api.py ../mcp-server/weather/src/index.js
   ```

## Usage

### Basic Usage

Run the client by providing the path to your MCP server script:

```bash
python client_no_api.py <path_to_server_script>
```

### Available Commands

The client supports the following commands:

1. List available tools:

   ```bash
   tools
   ```
2. Execute a tool:

   ```bash
   exec <tool_name> <arguments>
   ```

   Arguments can be provided as a JSON string or simple text depending on the tool.
3. Quit the client:

   ```bash
   quit
   ```

### Examples

```bash
# List available tools
tools

# Execute weather tool with city parameter
exec get_weather London

# Execute a tool with JSON parameters
exec some_tool {"param1": "value1", "param2": "value2"}
```

## Project Structure

- `client_no_api.py`: Main client implementation without LLM dependencies
- `client.py`: Alternative client implementation
- `pyproject.toml`: Project configuration and dependencies
- `.env`: Environment variables configuration
- `main.py`: Entry point for the application

## Environment Variables

Create a `.env` file in the project root and add any required environment variables:

```env
# Example environment variables
API_KEY=your_api_key_here
```

## Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a new Pull Request

## License

[Add your license information here]
