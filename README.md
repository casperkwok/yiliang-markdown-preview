# Markdown 排版预览助手

<p align="center">
  <img src="public/logo.png" alt="Markdown 排版预览助手" width="200"/>
</p>

<p align="center">
  <b>点击单元格，即可预览该单元格中的全文内容，支持 Markdown 格式</b>
</p>

<p align="center">
  <a href="#功能特点">功能特点</a> •
  <a href="#安装">安装</a> •
  <a href="#使用方法">使用方法</a> •
  <a href="#开发">开发</a> 
</p>

## 简介

**Markdown 排版预览助手**是一款专为自媒体和内容创作者设计的多维表格插件，旨在解决多维表格单元格空间有限、内容预览不便的痛点。通过这款插件，您可以轻松预览和编辑单元格中的 Markdown 内容，提高内容创作效率。

## 功能特点

- **一键放大预览**：点击即跳出单元格限制，清晰预览全文内容
- **Markdown 格式支持**：完整支持 Markdown 语法，实时渲染预览效果
- **一键复制**：排版好的内容直接复制，生成公众号、自媒体平台支持的样式
- **字数统计**：精准统计文章字数，帮助控制内容长度
- **阅读时间预估**：自动计算预估阅读时间，优化内容节奏
- **简洁界面**：专注于内容创作的直观界面设计

## 安装

### 环境要求

- Node.js: 16.19.0

### 方法一：从插件市场安装

1. 在多维表格中，点击右侧边栏的"插件"图标
2. 搜索"Markdown 排版预览助手"
3. 点击"使用"按钮

### 方法二：使用Vercel部署版本

1. 直接访问服务器地址：[preview-plus.vercel.app](https://preview-plus.vercel.app)
2. 无需安装，直接在浏览器中使用
3. 支持所有主流浏览器

### 方法三：本地开发安装

```bash
# 克隆仓库
git clone https://github.com/casperkwok/preview-plus.git

# 进入项目目录
cd preview-plus

# 安装依赖
npm install

# 启动开发服务器
npm run dev
```

## 使用方法

1. 在多维表格中，选择包含 Markdown 内容的单元格
2. 点击右侧边栏中的"Markdown 排版预览助手"图标
3. 在预览面板中查看渲染后的 Markdown 内容
4. 使用"复制"按钮一键复制格式化后的内容
5. 查看字数统计和阅读时间预估信息

## 开发

本项目使用以下技术栈：

- React
- TypeScript
- Vite
- Tailwind CSS
- Node.js 16.19.0

### 开发环境设置

```bash
# 安装依赖
npm install

# 启动开发服务器
npm run dev

# 构建生产版本
npm run build

# 运行测试
npm run test
```

<p align="center">
  Made with ❤️ by Casper & Sunkim
</p> 