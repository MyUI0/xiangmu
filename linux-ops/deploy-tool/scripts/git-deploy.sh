#!/bin/bash
# Git部署脚本

set -e

echo "========================================="
echo "Git部署任务"
echo "时间: $(date '+%Y-%m-%d %H:%M:%S')"
echo "========================================="

# 配置
REPO_URL="${1:-https://github.com/example/repo.git}"
BRANCH="${2:-main}"
DEPLOY_DIR="/tmp/deploy/git-app"

echo "1. 创建部署目录..."
mkdir -p "${DEPLOY_DIR}"

cd "${DEPLOY_DIR}"

if [ -d ".git" ]; then
    echo "2. 更新现有仓库..."
    git fetch origin
    git checkout "${BRANCH}"
    git pull origin "${BRANCH}"
else
    echo "2. 克隆仓库..."
    git clone -b "${BRANCH}" "${REPO_URL}" .
fi

echo "3. 当前版本信息..."
git log -1 --oneline

echo "========================================="
echo "Git部署完成！"
echo "部署目录: ${DEPLOY_DIR}"
echo "========================================="
