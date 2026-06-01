# Linux服务器监控系统

一个轻量级的Linux服务器资源监控系统，提供Web界面展示实时监控数据。

## 功能特性

- 实时监控CPU使用率
- 内存使用情况监控
- 磁盘空间占用情况
- 网络流量统计
- 进程列表（CPU TOP 10）
- 系统基本信息展示
- 历史数据存储（SQLite）
- 响应式Web界面

## 项目结构

```
server-monitor/
├── backend/
│   ├── app.py          # Flask Web服务器
│   ├── monitor.py      # 系统监控模块
│   └── database.py     # 数据库管理模块
├── templates/
│   └── index.html      # 前端页面
├── static/
│   ├── css/
│   │   └── style.css   # 样式文件
│   └── js/
│       └── main.js     # 前端逻辑
├── data/               # 数据存储目录
├── logs/               # 日志目录
├── requirements.txt    # Python依赖
├── start.sh            # 启动脚本
└── README.md
```

## 安装与运行

### 环境要求

- Python 3.7+
- Linux系统

### 快速开始

1. 克隆或下载项目到本地

2. 运行启动脚本：
```bash
chmod +x start.sh
./start.sh
```

或者手动安装和运行：

```bash
# 安装依赖
pip3 install -r requirements.txt

# 启动服务
cd backend
python3 app.py
```

3. 访问Web界面

打开浏览器访问：`http://服务器IP:5000`

## 配置说明

- 默认监听端口：5000
- 数据收集间隔：5秒
- 数据保留时间：7天

可以在 `backend/app.py` 中修改这些配置。

## API接口

### 获取最新监控数据
```
GET /api/metrics
```

### 获取历史数据
```
GET /api/history?hours=24
```

## 技术栈

- 后端：Python + Flask
- 前端：HTML + CSS + JavaScript
- 数据库：SQLite
- 监控库：psutil

## 注意事项

- 建议使用非root用户运行
- 确保防火墙开放5000端口
- 数据存储在data目录下，定期清理即可
