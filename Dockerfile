# 阶段 1: 构建阶段
FROM node:20.18.3-alpine AS builder

# 设置npm镜像源为国内源
RUN npm config set registry https://registry.npmmirror.com

# 安装指定版本的pnpm
RUN npm install -g pnpm@9.10.0

# 设置工作目录
WORKDIR /app

# 复制package.json和pnpm-lock.yaml
COPY package.json pnpm-lock.yaml ./

# 安装依赖
RUN pnpm install

# 复制源代码
COPY . .

# 构建应用
RUN pnpm build

# 阶段 2: 最终镜像 (仅包含静态文件)
FROM alpine:latest

# 设置工作目录 (可以根据喜好修改，OpenResty配置会引用这个路径的映射)
WORKDIR /app

# 从构建阶段复制构建产物到最终镜像的工作目录
COPY --from=builder /app/dist .

# 不需要 EXPOSE 和 CMD，因为这个镜像只用于存储静态文件
# 外部的 OpenResty/Nginx 将通过挂载卷的方式访问 /app 目录 