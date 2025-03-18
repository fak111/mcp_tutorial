# MCP Gmail Service

一个基于 MCP 的 Gmail 邮件发送服务。使用 Google OAuth 进行认证，支持直接使用 Gmail API 发送邮件。

## 功能特点

- 使用 Google OAuth 进行认证
- 自动打开浏览器完成 Google 账号授权
- 支持发送邮件到任意邮箱地址
- 使用授权用户的 Gmail 账号发送邮件

## 环境要求

1. 需要在 [Google Cloud Console](https://console.cloud.google.com/) 创建项目并启用 Gmail API
2. 获取 OAuth 2.0 客户端 ID 和密钥

## 环境变量

```bash
GOOGLE_CLIENT_ID=your_client_id
GOOGLE_CLIENT_SECRET=your_client_secret
```

## 安装

```bash
pnpm install
```

## 构建

```bash
pnpm run build
```

## 运行

```bash
pnpm start
```

启动后，服务器会：

1. 自动打开浏览器，引导你完成 Google 账号授权
2. 授权完成后，你可以使用 send_email 工具发送邮件

## 使用示例

```typescript
// 发送邮件
await server.send_email({
    address: "recipient@example.com",
    content: "Hello from MCP Gmail Service!"
});

exec send_email {"address": "zhuliderb@gmail.com", "content": "Hello from MCP! i am now 21:18"}
```
