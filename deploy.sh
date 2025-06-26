#!/bin/bash

# 部署脚本 for 静态文件 Docker 镜像
set -e

# 显示使用说明
show_help() {
  echo "用法: ./deploy.sh [选项]"
  echo "选项:"
  echo "  --build             只构建Docker镜像"
  echo "  --deploy            构建并将静态文件部署到数据卷"
  echo "  --name NAME         指定数据卷名称前缀 (默认: miaoruzhi-preview-plus)"
  echo "                      (容器将临时创建并命名为 \${NAME}-updater)"
  echo "  --target-path PATH  指定目标部署路径 (默认: /opt/1panel/apps/openresty/openresty/www/sites/preview.miaoruzhi.com/index)"
  echo "  --help              显示帮助信息"
}

# 默认值
APP_NAME="miaoruzhi-preview-plus"
IMAGE_NAME="${APP_NAME}:latest"
VOLUME_NAME="${APP_NAME}-data"
TARGET_PATH="/opt/1panel/apps/openresty/openresty/www/sites/preview.miaoruzhi.com/index"
MODE=""

# 解析命令行参数
while [[ "$#" -gt 0 ]]; do
  case $1 in
    --build) MODE="build"; shift ;;
    --deploy) MODE="deploy"; shift ;;
    --name)
      APP_NAME="$2"
      IMAGE_NAME="${APP_NAME}:latest"
      VOLUME_NAME="${APP_NAME}-data"
      shift 2
      ;;
    --target-path)
      TARGET_PATH="$2"
      shift 2
      ;;
    --help) show_help; exit 0 ;;
    *) echo "未知参数: $1"; show_help; exit 1 ;;
  esac
done

# 如果没有指定模式，默认为deploy
if [ -z "$MODE" ]; then
  MODE="deploy"
fi

# 构建Docker镜像
build_image() {
  echo "🔨 构建Docker镜像: $IMAGE_NAME"
  docker build --no-cache -t $IMAGE_NAME .
  echo "✅ 镜像构建完成!"
}

# 部署应用 (将静态文件放入目标路径)
deploy_app() {
  echo "🚀 开始部署静态文件到目标路径: $TARGET_PATH"
  TEMP_UPDATER_CONTAINER_NAME="${APP_NAME}-updater"

  # 检查目标路径是否存在，不存在则创建
  if [ ! -d "$TARGET_PATH" ]; then
    echo "📂 创建目标路径: $TARGET_PATH"
    sudo mkdir -p "$TARGET_PATH"
  else
    echo "📂 使用已存在的目标路径: $TARGET_PATH"
    # 清理旧文件
    echo "🗑️ 清理旧文件..."
    sudo rm -rf "$TARGET_PATH"/*
  fi

  # 运行一个临时容器将构建好的文件复制到目标路径
  echo "📂 将构建产物复制到目标路径..."
  docker run --rm --name "$TEMP_UPDATER_CONTAINER_NAME" -v "${TARGET_PATH}:/app_dist_target" "${IMAGE_NAME}" sh -c 'cp -a /app/. /app_dist_target/'

  # 确保临时容器被移除
  docker rm -f $TEMP_UPDATER_CONTAINER_NAME &> /dev/null || true

  echo "✅ 部署完成! 静态文件已更新到目标路径 '$TARGET_PATH' 中。"
}

# 执行指定操作
if [ "$MODE" = "build" ]; then
  build_image
elif [ "$MODE" = "deploy" ]; then
  build_image
  deploy_app
fi 