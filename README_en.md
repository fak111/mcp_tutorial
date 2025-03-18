# MCP Tutorial Project

This project is a microservices-based application that demonstrates various integrations and functionalities through a Model-Controller-Provider (MCP) architecture.

[中文](README.md) | [English](README_en.md)

📺 [Watch Tutorial Video on Bilibili](https://space.bilibili.com/1617153613?spm_id_from=333.33.0.0)

## Project Structure

```
mcp_tutorial/
├── mcp-client/           # Client-side application
├── mcp-server/          # Server-side microservices
│   ├── podcast/         # Podcast service
│   ├── weather/         # Weather service
│   ├── gmail/           # Gmail service
│   └── filesystem/      # File management service
└── need/                # Additional resources and utilities
```

## Features

- Multi-language support (English/中文)
- Weather service integration
- File management system
- Podcast generate by Coze api
- Gmail service integration:
  - Send and receive emails
  - Email notifications
  - Attachment handling
- (ToDo)Multiple storage backend support:
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
- Google Cloud Platform account (for Gmail API)

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
- Configure Gmail API credentials:
  - Create a project in Google Cloud Console
  - Enable Gmail API
  - Set up OAuth 2.0 credentials
  - Add credentials to `.env` file

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
uv add mcp anthropic python-dotenv google-api-python-client google-auth-oauthlib

#run
uv run client_no_api.py dumy.js
```

## Language Support

The application supports both English and Chinese languages. You can switch between languages using the language selector in the user interface. All documentation is available in both languages:

- English: README.md
- Chinese: README_zh.md

## Development

- The project uses TypeScript for type safety
- Each service can be developed and deployed independently
- Follow the microservices architecture pattern
- Supports i18n for multi-language implementation

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
