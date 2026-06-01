# Docker 容器管理平台

一个功能完整的 Docker 容器管理平台，提供 Web 界面和命令行工具，方便开发者和运维人员管理 Docker 容器和镜像。

## 功能特性

### Web 界面
- 📦 **容器管理**：查看、启动、停止、重启、删除容器
- 🖼️ **镜像管理**：查看本地 Docker 镜像列表
- 📊 **系统信息**：展示 Docker 系统信息和资源使用情况
- ✨ **创建容器**：支持通过界面快速创建新容器
- 🔍 **容器详情**：查看容器的详细配置信息

### 命令行工具
- 📝 **容器操作**：启动、停止、重启、删除容器
- 📋 **列表查看**：查看容器和镜像列表
- 📜 **日志查看**：查看容器运行日志
- 🚪 **进入容器**：交互式进入容器内部
- 🧹 **资源清理**：清理未使用的 Docker 资源

## 项目结构

```
docker-manager/
├── backend/              # 后端服务
│   ├── package.json      # Node.js 依赖配置
│   └── server.js         # Express 服务器
├── frontend/             # 前端界面
│   ├── index.html        # 主页面
│   ├── styles.css        # 样式文件
│   └── app.js            # 前端逻辑
├── scripts/              # 管理脚本
│   ├── docker-manager.sh # 命令行工具
│   └── install.sh        # 安装脚本
└── README.md             # 项目文档
```

## 环境要求

- **Node.js**: v14.0 或更高版本
- **npm**: 6.0 或更高版本
- **Docker**: 19.03 或更高版本
- **操作系统**: Linux、macOS 或 Windows (WSL2)

## 快速开始

### 1. 安装依赖

```bash
# 进入项目目录
cd docker-manager

# 运行安装脚本
./scripts/install.sh
```

或者手动安装：

```bash
# 进入后端目录
cd backend

# 安装依赖
npm install

# 设置脚本执行权限
chmod +x ../scripts/docker-manager.sh
```

### 2. 启动服务

#### 方式一：使用脚本启动
```bash
./scripts/docker-manager.sh web
```

#### 方式二：手动启动
```bash
cd backend
npm start
```

服务启动后，在浏览器中访问：`http://localhost:3000`

### 3. 使用命令行工具

```bash
# 查看帮助
./scripts/docker-manager.sh help

# 查看容器列表
./scripts/docker-manager.sh ps

# 启动容器
./scripts/docker-manager.sh start <容器名称或ID>

# 停止容器
./scripts/docker-manager.sh stop <容器名称或ID>

# 查看容器日志
./scripts/docker-manager.sh logs <容器名称或ID>
```

## 使用说明

### Web 界面

1. **容器管理**
   - 查看所有容器的状态
   - 点击按钮启动、停止、重启或删除容器
   - 点击"详情"查看容器的完整配置信息
   - 点击"创建容器"快速部署新容器

2. **镜像管理**
   - 查看本地所有镜像
   - 显示镜像名称、标签、大小和创建时间

3. **系统信息**
   - 查看 Docker 版本信息
   - 查看系统资源使用情况
   - 查看容器和镜像统计数据

### 命令行工具

完整命令列表：

| 命令 | 说明 |
|------|------|
| `ps`, `containers` | 显示所有容器列表 |
| `images` | 显示所有镜像列表 |
| `start <容器>` | 启动指定容器 |
| `stop <容器>` | 停止指定容器 |
| `restart <容器>` | 重启指定容器 |
| `rm <容器> [force]` | 删除容器，force 为强制删除 |
| `logs <容器>` | 查看容器日志 |
| `exec <容器> [shell]` | 进入容器，默认 /bin/sh |
| `info` | 显示 Docker 系统信息 |
| `cleanup` | 清理未使用的 Docker 资源 |
| `web` | 启动 Web 管理界面 |
| `help`, `-h`, `--help` | 显示帮助信息 |

## API 接口

后端提供以下 REST API 接口：

| 方法 | 路径 | 说明 |
|------|------|------|
| GET | `/api/containers` | 获取所有容器列表 |
| GET | `/api/containers/:id` | 获取指定容器详情 |
| POST | `/api/containers/:id/start` | 启动容器 |
| POST | `/api/containers/:id/stop` | 停止容器 |
| POST | `/api/containers/:id/restart` | 重启容器 |
| DELETE | `/api/containers/:id` | 删除容器 |
| GET | `/api/images` | 获取所有镜像列表 |
| GET | `/api/system/info` | 获取 Docker 系统信息 |
| POST | `/api/exec` | 执行 Docker 命令 |

## 技术栈

- **后端**: Node.js + Express
- **前端**: 原生 HTML + CSS + JavaScript
- **Docker API**: dockerode (Node.js Docker SDK)
- **命令行**: Bash 脚本

## 注意事项

1. 确保 Docker 守护进程正在运行
2. 当前用户需要有 Docker 操作权限（可加入 docker 用户组）
3. Web 界面默认运行在 3000 端口，可通过环境变量 `PORT` 修改
4. 删除操作不可恢复，请谨慎操作

## 故障排除

### 无法连接 Docker

如果遇到 Docker 连接问题，请检查：
```bash
# 检查 Docker 是否运行
docker info

# 如果没有运行，启动 Docker
# Linux:
sudo systemctl start docker

# macOS/Windows:
# 打开 Docker Desktop
```

### 端口被占用

如果 3000 端口被占用，可以修改端口：
```bash
# Linux/macOS
PORT=8080 npm start

# Windows (PowerShell)
$env:PORT=8080; npm start
```

### 权限问题

如果遇到权限问题，可以将当前用户添加到 docker 组：
```bash
sudo usermod -aG docker $USER
# 然后重新登录
```

## 开发说明

### 本地开发

```bash
# 克隆项目
git clone <repository-url>
cd docker-manager

# 安装依赖
cd backend
npm install

# 开发模式运行（需要安装 nodemon）
npm run dev
```

### 项目结构说明

- `backend/server.js`: Express 服务器，处理 API 请求
- `frontend/`: 前端静态文件，由 Express 托管
- `scripts/`: 命令行工具和安装脚本

## 许可证

MIT License

## 贡献

欢迎提交 Issue 和 Pull Request！

## 联系方式

如有问题或建议，欢迎通过 Issue 联系。
