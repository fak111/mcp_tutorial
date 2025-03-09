#!/usr/bin/env node

import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";

// Mock weather data
const weatherData = {
    "New York": {
        temperature: 20,
        condition: "Sunny",
        humidity: 65,
        windSpeed: 10,
    },
    "London": {
        temperature: 15,
        condition: "Cloudy",
        humidity: 75,
        windSpeed: 8,
    },
    "Tokyo": {
        temperature: 25,
        condition: "Clear",
        humidity: 60,
        windSpeed: 5,
    },
    "Beijing": {
        temperature: 18,
        condition: "Partly Cloudy",
        humidity: 70,
        windSpeed: 12,
    },
};

type WeatherInfo = {
    temperature: number;
    condition: string;
    humidity: number;
    windSpeed: number;
};

// Create MCP server
const server = new McpServer({
    name: "Weather Information Server",
    version: "1.0.0"
});

// Define the weather tool using zod schema for type safety
server.tool(
    "get_weather",
    { city: z.string().describe("The name of the city to get weather information for") },
    async ({ city }) => {
        const cityWeather = weatherData[city as keyof typeof weatherData];

        if (!cityWeather) {
            return {
                content: [{
                    type: "text",
                    text: `Error: Weather information not available for ${city}`
                }],
                isError: true
            };
        }

        return {
            content: [{
                type: "text",
                text: JSON.stringify(cityWeather, null, 2)
            }]
        };
    }
);

// Start the server with stdio transport
const transport = new StdioServerTransport();
await server.connect(transport);
