# Weather MCP Service

This is a TypeScript-based weather service MCP (Mission Control Protocol) that provides weather information for different cities.

## Quick Start

You can run this MCP service directly using npx:

```bash
npx @fak111/weather-mcp
```

That's it! The service will start automatically and be ready to use with Cursor AI.

## Example Usage

You can use this MCP to get weather information for various cities through Cursor AI. For example:

```typescript
// Get weather for New York
mcp__get_weather({ city: "New York" })
```

Available cities include:
- New York
- London
- Tokyo
- Beijing

## Development

If you want to modify the service:

1. Clone the repository:
```bash
git clone https://github.com/fak111/mcp_tutorial.git
```

2. Install dependencies:
```bash
pnpm install
```

3. Make your changes in the `src` directory

4. Build the project:
```bash
pnpm build
```

5. Run locally:
```bash
pnpm start
```

## License

MIT
