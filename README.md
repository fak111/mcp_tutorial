# MCP 教程项目

本项目是一个基于微服务架构的应用程序，通过模型-控制器-提供者（MCP）架构展示各种集成功能。

[中文](README.md) | [English](README_en.md)

📺 [在 Bilibili 观看教程视频](https://space.bilibili.com/1617153613?spm_id_from=333.33.0.0)

## 项目结构

```
mcp_tutorial/
├── mcp-client/           # 客户端应用
├── mcp-server/          # 服务端微服务
│   ├── podcast/         # 播客服务
│   ├── weather/         # 天气服务
│   ├── gmail/           # Gmail服务
│   └── filesystem/      # 文件管理服务
└── need/                # 附加资源和工具
```

## 功能特性

- 多语言支持（英文/中文）
- 天气服务集成
- 文件管理系统
- 基于Coze API的播客生成
- Gmail服务集成：
  - 发送和接收邮件
  - 邮件通知
  - 附件处理
- (待开发)多存储后端支持：
  - [ ] Redis
  - [ ] PostgreSQL
  - [ ] 内存存储
  - [ ] Google Drive
  - [ ] GitHub
  - [ ] GitLab
  - [ ] Slack集成
- 现代化客户端界面

## 环境要求

- Node.js (v14或更高版本)
- npm或yarn
- Redis (可选)
- PostgreSQL (可选)
- Google Cloud Platform账户 (用于Gmail API)

## 安装说明

1. 克隆仓库：

```bash
git clone https://github.com/fak111/mcp_tutorial.git
cd mcp_tutorial
```

2. 安装各服务依赖：

```bash
# 安装客户端依赖
cd mcp-client
npm install

# 安装服务端依赖
cd ../mcp-server
npm install
```

3. 配置环境变量：

- 在相应的服务目录中创建`.env`文件
- 设置必要的API密钥和连接字符串
- 配置Gmail API凭据：
  - 在Google Cloud Console中创建项目
  - 启用Gmail API
  - 设置OAuth 2.0凭据
  - 将凭据添加到`.env`文件中

## 运行应用

1. 启动服务器：

```bash
cd mcp-server
# 如果可以使用node
node ..js
```

2. 启动客户端：

```bash
cd mcp-client
# 创建虚拟环境
uv venv

# 激活虚拟环境
# Windows系统：
.venv\Scripts\activate
# Unix或MacOS系统：
source .venv/bin/activate

# 安装所需包
uv add mcp anthropic python-dotenv google-api-python-client google-auth-oauthlib

# 运行
uv run client_no_api.py dumy.js
```

## 语言支持

应用程序支持英文和中文两种语言。您可以通过用户界面中的语言选择器切换语言。所有文档都提供两种语言版本：

- 英文：README.md
- 中文：README_zh.md

## 开发说明

- 项目使用TypeScript确保类型安全
- 每个服务可以独立开发和部署
- 遵循微服务架构模式
- 支持i18n多语言实现

## 贡献指南

1. Fork本仓库
2. 创建特性分支 (`git checkout -b feature/amazing-feature`)
3. 提交更改 (`git commit -m '添加某个很棒的特性'`)
4. 推送到分支 (`git push origin feature/amazing-feature`)
5. 创建Pull Request

## 许可证

本项目基于MIT许可证 - 详情请查看LICENSE文件。

## 致谢

- 感谢所有贡献者
- 使用现代网络技术和最佳实践构建
