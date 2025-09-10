
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
└── README.md            # 说明文档
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

## 快速开始

1. 克隆仓库：

```bash
git clone https://github.com/fak111/mcp_tutorial.git
cd mcp_tutorial
```

2. 配置 api（推荐学习时用书生的s1 模型 [https://internlm.intern-ai.org.cn/api/strategy](书生)）：

```bash
cd mcp-client
cp .env.example .env
```

- 在相应的服务目录中创建 `.env`文件,填写 `API_KEY`

3. 启动

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
uv add mcp anthropic python-dotenv google-api-python-client google-auth-oauthlib 'httpx[socks]' openai
```

4. 运行

```bash
# 天气
uv run client_interns1.py ../mcp-server/weather/build/index.js
# 用法
Beijing天气怎么样

Tokyo风速是多少
```
---
```bash
#文件
uv run client_fixed.py ../mcp-server/filesystem/dist/index.js ../

# 用法

列出当前目录下的所有文件

# 读取文件
读取 README.md 文件的内容

# 创建文件
创建一个名为 test.txt 的文件，内容为 "Hello World"

# 搜索文件
搜索所有 .md 文件
```

## 语言支持

应用程序支持英文和中文两种语言。您可以通过用户界面中的语言选择器切换语言。所有文档都提供两种语言版本：

- 英文：README.md
- 中文：README_zh.md

## 贡献指南

1. Fork本仓库
2. 创建特性分支 (`git checkout -b feature/amazing-feature`)
3. 提交更改 (`git commit -m '添加某个很棒的特性'`)
4. 推送到分支 (`git push origin feature/amazing-feature`)
5. 创建Pull Request

## 许可证

本项目基于MIT许可证 - 详情请查看LICENSE文件。
