#!/bin/bash

cd "$(dirname "$0")"

echo "正在启动日志分析平台..."

if [ ! -d "logs" ]; then
    mkdir -p logs
fi

if [ ! -d "data" ]; then
    mkdir -p data
fi

pip3 install -r requirements.txt

cd backend
python3 app.py
