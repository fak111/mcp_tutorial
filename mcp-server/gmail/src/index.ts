#!/usr/bin/env node

import 'dotenv/config';
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";
import open from 'open';
import { GmailService } from './gmail.js';

// 创建 MCP 服务器
const server = new McpServer({
    name: "Gmail Service Server",
    version: "1.0.0"
});

// 获取 Gmail 服务实例
const gmailService = GmailService.getInstance();

// 启动认证服务器并获取认证 URL
const authUrl = await gmailService.startAuthServer();
if (authUrl) {
    console.error('请在浏览器中完成 Google 账号授权...');
    await open(authUrl);
}

const userEmail = gmailService.getUserEmail();
if (userEmail) {
    console.error(`使用邮箱: ${userEmail}`);
}

// 定义发送邮件工具
server.tool(
    "send_email",
    {
        address: z.string().email().describe("Recipient email address"),
        content: z.string().describe("Email content"),
    },
    async ({ address, content }) => {
        try {
            await gmailService.sendEmail(address, content);
            return {
                content: [{ type: "text", text: "Email sent successfully" }],
            };
        } catch (error) {
            return {
                content: [{ type: "text", text: `Failed to send email: ${error}` }],
                isError: true,
            };
        }
    }
);

// 启动服务器
const transport = new StdioServerTransport();
await server.connect(transport);
