#!/bin/bash
# 启动部署工具

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "${SCRIPT_DIR}"

# 检查Python环境
if ! command -v python3 &> /dev/null; then
    echo "错误: 未找到Python3，请先安装Python3"
    exit 1
fi

# 创建虚拟环境（如果不存在）
if [ ! -d "venv" ]; then
    echo "创建Python虚拟环境..."
    python3 -m venv venv
fi

# 激活虚拟环境
source venv/bin/activate

# 安装依赖
echo "安装依赖..."
pip install -r requirements.txt

# 设置脚本权限
chmod +x scripts/*.sh

echo "========================================="
echo "部署工具启动中..."
echo "访问地址: http://localhost:5000"
echo "========================================="

# 启动服务
cd backend
python3 app.py
