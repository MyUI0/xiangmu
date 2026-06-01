# 日志分析平台

一个功能完整的日志分析系统，提供 Web 界面和命令行工具。

## 功能特性

- **Web 管理界面**: 简洁美观的 UI，支持日志上传、查看和分析
- **日志分析**: 自动分析日志级别分布、错误统计、IP/URL 提取
- **告警功能**: 基于规则的告警检测，支持自定义规则
- **搜索功能**: 支持正则表达式搜索日志内容
- **命令行工具**: 提供独立的脚本进行日志分析
- **数据持久化**: 使用 SQLite 存储文件和分析结果

## 项目结构

```
log-analyzer/
├── backend/
│   ├── app.py          # Flask 应用主文件
│   ├── analyzer.py     # 日志分析模块
│   └── database.py     # 数据库管理模块
├── templates/
│   └── index.html      # 前端页面
├── static/
│   ├── css/
│   │   └── style.css   # 样式文件
│   └── js/
│       └── main.js     # 前端逻辑
├── scripts/
│   └── analyze_log.py  # 命令行分析工具
├── logs/               # 日志文件存储目录
├── data/               # 数据库文件目录
├── requirements.txt    # Python 依赖
├── start.sh            # 启动脚本
└── README.md
```

## 安装与运行

### 环境要求

- Python 3.7+
- Linux 或 macOS 系统

### 快速开始

1. 进入项目目录：

```bash
cd /workspace/linux-ops/log-analyzer
```

2. 运行启动脚本：

```bash
chmod +x start.sh
./start.sh
```

3. 访问 Web 界面

打开浏览器访问：`http://localhost:5001`

### 手动安装

```bash
# 安装依赖
pip3 install -r requirements.txt

# 确保目录存在
mkdir -p logs data

# 启动服务
cd backend
python3 app.py
```

## 使用说明

### Web 界面

1. **仪表盘**: 查看统计概览、最新告警和文件
2. **日志管理**: 上传日志文件、查看内容、执行分析
3. **告警中心**: 查看和管理告警信息，标记已解决
4. **规则管理**: 查看和添加告警规则

### 命令行工具

```bash
cd scripts
python3 analyze_log.py /path/to/your/logfile.log
```

### 告警规则

系统预置以下告警规则：

- 错误日志: 匹配 ERROR、FATAL、EXCEPTION
- 警告日志: 匹配 WARN 或 WARNING
- 404错误: 匹配 404 Not Found
- 500错误: 匹配 500 Internal Server Error

你可以在"规则管理"页面添加自定义规则，支持正则表达式匹配。

## API 接口

- `GET /api/dashboard` - 获取仪表盘数据
- `GET /api/log-files` - 获取日志文件列表
- `POST /api/upload` - 上传日志文件
- `POST /api/analyze/<file_id>` - 分析日志文件
- `GET /api/log-content/<file_id>` - 获取日志内容
- `POST /api/search` - 搜索日志
- `GET /api/alerts` - 获取告警列表
- `POST /api/alerts/<alert_id>/resolve` - 解决告警
- `GET /api/alert-rules` - 获取告警规则
- `POST /api/alert-rules` - 添加告警规则

## 技术栈

- **后端**: Python + Flask
- **前端**: HTML5 + CSS3 + JavaScript (原生)
- **数据库**: SQLite
- **日志解析**: 正则表达式

## 注意事项

- 建议使用非 root 用户运行
- 确保防火墙开放 5001 端口
- 大文件分析时可能需要较长时间
