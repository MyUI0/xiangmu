#!/bin/bash
# 示例部署脚本

set -e

echo "========================================="
echo "开始执行部署任务"
echo "时间: $(date '+%Y-%m-%d %H:%M:%S')"
echo "========================================="

# 配置
PROJECT_DIR="/tmp/deploy/example"
BACKUP_DIR="/tmp/deploy/backup"

# 创建目录
echo "1. 创建工作目录..."
mkdir -p "${PROJECT_DIR}"
mkdir -p "${BACKUP_DIR}"

# 备份当前版本（如果存在）
if [ -d "${PROJECT_DIR}/current" ]; then
    echo "2. 备份当前版本..."
    BACKUP_NAME="backup-$(date '+%Y%m%d-%H%M%S')"
    mv "${PROJECT_DIR}/current" "${BACKUP_DIR}/${BACKUP_NAME}"
fi

# 创建新版本目录
echo "3. 创建新版本目录..."
mkdir -p "${PROJECT_DIR}/current"

# 部署内容（示例）
echo "4. 部署应用..."
cat > "${PROJECT_DIR}/current/index.html" << 'EOF'
<!DOCTYPE html>
<html>
<head>
    <title>部署示例</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            text-align: center;
            padding: 50px;
        }
        h1 {
            color: #4CAF50;
        }
    </style>
</head>
<body>
    <h1>部署成功！</h1>
    <p>部署时间: $(date '+%Y-%m-%d %H:%M:%S')</p>
    <p>这是一个自动部署的示例页面</p>
</body>
</html>
EOF

# 创建版本文件
echo "$(date '+%Y%m%d-%H%M%S')" > "${PROJECT_DIR}/current/VERSION"

echo "========================================="
echo "部署完成！"
echo "部署目录: ${PROJECT_DIR}/current"
echo "========================================="
