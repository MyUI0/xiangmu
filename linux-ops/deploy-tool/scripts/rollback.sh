#!/bin/bash
# 回滚脚本

set -e

echo "========================================="
echo "回滚任务"
echo "时间: $(date '+%Y-%m-%d %H:%M:%S')"
echo "========================================="

PROJECT_DIR="/tmp/deploy/example"
BACKUP_DIR="/tmp/deploy/backup"

if [ ! -d "${BACKUP_DIR}" ]; then
    echo "错误: 备份目录不存在"
    exit 1
fi

# 获取最新的备份
LATEST_BACKUP=$(ls -1t "${BACKUP_DIR}" | head -1)

if [ -z "${LATEST_BACKUP}" ]; then
    echo "错误: 没有找到备份"
    exit 1
fi

echo "1. 找到最新备份: ${LATEST_BACKUP}"

# 删除当前版本
if [ -d "${PROJECT_DIR}/current" ]; then
    echo "2. 删除当前版本..."
    rm -rf "${PROJECT_DIR}/current"
fi

# 恢复备份
echo "3. 恢复备份..."
mv "${BACKUP_DIR}/${LATEST_BACKUP}" "${PROJECT_DIR}/current"

echo "========================================="
echo "回滚完成！"
echo "回滚到: ${LATEST_BACKUP}"
echo "========================================="
