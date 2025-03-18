#!/usr/bin/env node

import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";
import fetch from 'node-fetch';

const COZE_API_URL = 'https://api.coze.cn/v1/workflow/run';
const COZE_WORKFLOW_ID = '7480421707456397348';
const COZE_API_KEY = 'pat_eOi2JPFJqxfcDr5ssao2G3tWx9VqTv5HhvK4hPBBHkVktuXT92sqYCXNyjdbtyhA';

interface CozeResponse {
    code: number;
    msg: string;
    data: string;
}

interface PodcastData {
    content_type: number;
    data: string;
    original_result: null;
    type_for_model: number;
}

// Create MCP server
const server = new McpServer({
    name: "Podcast Generation Server",
    version: "1.0.0"
});

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
                    workflow_id: COZE_WORKFLOW_ID,
                    parameters: {
                        user_id: "12345",
                        user_name: "User",
                        user_input: params.prompt
                    }
                })
            });

            if (!response.ok) {
                throw new Error(`API request failed with status ${response.status}`);
            }

            const result = await response.json() as CozeResponse;

            if (result.code !== 0) {
                throw new Error(`API returned error code ${result.code}: ${result.msg}`);
            }

            // Parse the data string which contains the podcast URL
            const data = JSON.parse(result.data) as PodcastData;
            const podcastUrl = data.data;

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
