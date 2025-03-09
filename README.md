# MCP Tutorial Project

This project is a microservices-based application that demonstrates various integrations and functionalities through a Model-Controller-Provider (MCP) architecture.

## Project Structure

```
mcp_tutorial/
├── mcp-client/         # Client-side application
├── mcp-server/         # Server-side microservices
│   ├── weather/        # Weather service
│   └──filesystem/      # File management service
├── dist/               # Compiled distribution files
└── need/              # Additional resources
```

## Features

- Weather service integration
- File management system
- (ToDo))Multiple storage backend support:
  - [ ] Redis
  - [ ] PostgreSQL
  - [ ] Memory storage
  - [ ] Google Drive
  - [ ] GitHub
  - [ ] GitLab
  - [ ] Slack integration
- Modern client interface

## Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- Redis (optional)
- PostgreSQL (optional)

## Installation

1. Clone the repository:

```bash
git clone https://github.com/fak111/mcp_tutorial.git
cd mcp_tutorial
```

2. Install dependencies for each service:

```bash
# Install client dependencies
cd mcp-client
npm install

# Install server dependencies
cd ../mcp-server
npm install
```

3. Configure environment variables:

- Create `.env` files in respective service directories
- Set up necessary API keys and connection strings

## Running the Application

1. Start the server:

```bash
cd mcp-server
# if can node
node ..js
```

2. Start the client:

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

#run
uv run client_no_api.py dumy.js

```

## Development

- The project uses TypeScript for type safety
- Each service can be developed and deployed independently
- Follow the microservices architecture pattern

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- Thanks to all contributors
- Built with modern web technologies and best practices
