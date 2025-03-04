# Weather MCP Service

This is a TypeScript-based weather service MCP (Mission Control Protocol) that provides weather information for different cities.

## Prerequisites

- Node.js (v14 or higher)
- pnpm (recommended) or npm

## Installation

1. Clone the repository:
```bash
git clone [your-repository-url]
```

2. Install dependencies:
```bash
pnpm install
# or if using npm
npm install
```

3. Build the project:
```bash
pnpm build
# or if using npm
npm run build
```

## Usage

Run the MCP service:
```bash
node build/index.js
```

The service will be available for use with Cursor AI, allowing you to query weather information for various cities.

## Example Usage

You can use this MCP to get weather information for any city through Cursor AI. For example:
```typescript
// Get weather for New York
mcp__get_weather({ city: "New York" })
```

## Development

To make changes to the service:

1. Modify the source code in the `src` directory
2. Rebuild the project:
```bash
pnpm build
```
3. Restart the service

## License

MIT
