# 自动部署工具

一个简单易用的项目部署管理平台，提供Web界面和部署脚本执行功能。

## 功能特性

- Web界面管理部署任务
- 支持自定义部署脚本
- 实时任务状态监控
- 任务日志查看
- 配置管理

## 项目结构

```
deploy-tool/
├── backend/              # 后端服务
│   ├── __init__.py
│   └── app.py           # Flask应用
├── frontend/            # 前端界面
│   ├── templates/       # HTML模板
│   └── static/          # 静态资源
├── scripts/             # 部署脚本
├── config/              # 配置文件
├── logs/                # 日志目录
├── requirements.txt     # Python依赖
├── start.sh            # 启动脚本
└── README.md
```

## 快速开始

### 1. 启动服务

```bash
cd /workspace/linux-ops/deploy-tool
chmod +x start.sh
./start.sh
```

### 2. 访问界面

打开浏览器访问: http://localhost:5000

### 3. 添加部署脚本

在 `scripts/` 目录下添加自定义的 `.sh` 部署脚本。

## API接口

| 接口 | 方法 | 说明 |
|------|------|------|
| / | GET | 主页 |
| /api/config | GET | 获取配置 |
| /api/config | POST | 更新配置 |
| /api/scripts | GET | 列出脚本 |
| /api/deploy | POST | 执行部署 |
| /api/tasks | GET | 获取任务列表 |
| /api/tasks/:id | GET | 获取任务详情 |
| /api/logs | GET | 获取日志 |

## 配置说明

配置文件: `config/config.yaml`

```yaml
server:
  host: 0.0.0.0
  port: 5000
deploy:
  workspace: /tmp/deploy
```

## 部署脚本

部署脚本放置在 `scripts/` 目录下，必须是 `.sh` 文件。

### 示例脚本

参考 `scripts/example-deploy.sh` 创建自己的部署脚本。

## 注意事项

1. 确保部署脚本有执行权限
2. 生产环境建议使用gunicorn启动
3. 建议配置Nginx反向代理

## 许可证

MIT License
