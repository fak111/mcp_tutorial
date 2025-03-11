#!/usr/bin/env node

import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";
import fetch from 'node-fetch';

const COZE_API_URL = 'https://api.coze.cn/v3/chat';
const COZE_BOT_ID = '7480425426293473280';
const COZE_API_KEY = 'pat_eOi2JPFJqxfcDr5ssao2G3tWx9VqTv5HhvK4hPBBHkVktuXT92sqYCXNyjdbtyhA';

// Create MCP server
const server = new McpServer({
    name: "Podcast Generation Server",
    version: "1.0.0"
});

// Helper function to extract podcast URL from streaming response
async function extractPodcastUrl(response: Response): Promise<string | null> {
    const reader = response.body!.getReader();
    let podcastUrl: string | null = null;

    while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        // Convert the chunk to text
        const chunk = new TextDecoder().decode(value);
        const lines = chunk.split('\n');

        for (const line of lines) {
            if (!line.trim()) continue;

            // Parse event and data
            const [eventPart, dataPart] = line.split('data:').map(part => part.trim());
            if (!dataPart) continue;

            try {
                const data = JSON.parse(dataPart);

                // Look for the message with the podcast URL
                if (data.type === 'tool_response' && data.content) {
                    if (data.content.startsWith('https://lf-bot-studio-plugin-resource.coze.cn')) {
                        podcastUrl = data.content;
                        break;
                    }
                }
            } catch (e) {
                // Skip invalid JSON
                continue;
            }
        }

        if (podcastUrl) break;
    }

    return podcastUrl;
}

// Define the podcast tool using zod schema for type safety
server.tool(
    "get_podcast",
    {
        prompt: z.string().min(1).describe("The prompt for podcast generation or URL to generate podcast from")
    },
    async (params) => {
        try {
            if (!params || !params.prompt) {
                return {
                    content: [{
                        type: "text",
                        text: "Error: Prompt parameter is required"
                    }],
                    isError: true
                };
            }

            const response = await fetch(COZE_API_URL, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${COZE_API_KEY}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    bot_id: COZE_BOT_ID,
                    user_id: "123",
                    stream: true,
                    auto_save_history: true,
                    additional_messages: [
                        {
                            role: "user",
                            content: params.prompt,
                            content_type: "text"
                        }
                    ]
                })
            });

            if (!response.ok) {
                throw new Error(`API request failed with status ${response.status}`);
            }

            const podcastUrl = await extractPodcastUrl(response);

            if (!podcastUrl) {
                throw new Error("Failed to generate podcast URL");
            }

            return {
                content: [{
                    type: "text",
                    text: podcastUrl
                }]
            };
        } catch (error) {
            return {
                content: [{
                    type: "text",
                    text: `Error: ${error instanceof Error ? error.message : String(error)}`
                }],
                isError: true
            };
        }
    }
);

// Start the server with stdio transport
const transport = new StdioServerTransport();
await server.connect(transport);
