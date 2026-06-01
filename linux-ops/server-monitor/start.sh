#!/bin/bash

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$SCRIPT_DIR"

echo "正在检查Python环境..."

if ! command -v python3 &> /dev/null; then
    echo "错误: 未找到python3"
    exit 1
fi

echo "正在安装依赖..."
pip3 install -r requirements.txt

echo "正在启动服务器监控系统..."
cd backend
python3 app.py
