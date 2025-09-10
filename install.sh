#!/bin/bash
# MCP 环境一键安装配置脚本

set -e  # 遇到错误立即退出

echo "================================"
echo "开始安装 MCP 开发环境"
echo "================================"

# 1. 安装 Node.js
echo "🔧 正在安装 Node.js..."
apt update
apt install -y curl
curl -fsSL https://deb.nodesource.com/setup_20.x | bash -
apt-get install -y nodejs

echo "✅ Node.js 安装完成"

# 2. 配置镜像源
echo "🌐 配置淘宝镜像..."
npm config set registry https://registry.npmmirror.com

# 3. 验证安装
echo "🔍 验证安装..."
echo "Node.js 版本: $(node --version)"
echo "npm 版本: $(npm --version)"
echo "镜像配置: $(npm config get registry)"

# 4. 安装 pnpm
echo "📦 安装 pnpm..."
npm install -g pnpm --registry=https://registry.npmmirror.com
echo "pnpm 版本: $(pnpm --version)"

# 5. 安装天气 MCP 服务器
echo "⛅ 安装天气 MCP 服务器..."
cd mcp-server/weather
pnpm install --registry=https://registry.npmmirror.com
pnpm run build
echo "✅ 天气 MCP 安装完成"

# 6. 安装文件系统 MCP 服务器
echo "📁 安装文件系统 MCP 服务器..."
cd ../filesystem
pnpm install --registry=https://registry.npmmirror.com
pnpm run build
echo "✅ 文件系统 MCP 安装完成"

# 7. 返回初始目录
cd ../../

echo "================================"
echo "🎉 MCP 环境安装完成！"
echo "================================"
echo "可用服务:"
echo "  - 天气 MCP: mcp-server/weather"
echo "  - 文件系统 MCP: mcp-server/filesystem"
echo "================================"
