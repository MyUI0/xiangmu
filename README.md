
# 项目资源库

一个包含各类前端项目的完整资源库，涵盖AI项目、数据可视化、游戏、前端应用、Linux运维工具等多个类别。

## 📁 项目结构

```
/workspace/
├── ai-projects/              # AI 相关项目
│   ├── speech-synthesis/    # 语音合成演示应用
│   ├── qa-interface/        # 智能问答界面
│   └── recommendation-interface/ # 推荐系统界面
├── data-visualization/      # 数据可视化项目
│   ├── dashboard/           # 数据仪表盘
│   └── real-time-monitor/   # 实时数据监控
├── games/                   # 游戏类项目
│   ├── snake-game/          # 贪吃蛇游戏
│   └── 2048-game/           # 2048 游戏
├── web-frontend/            # 前端应用项目
│   ├── e-commerce/          # 电商平台
│   ├── blog-dashboard/      # 博客管理后台
│   ├── portfolio/           # 个人作品集
│   ├── pretext-demo/        # 演示项目
│   └── weather-app/         # 天气查询应用
├── ui-libs/                 # UI 组件库
│   ├── react-components/    # React 组件库
│   └── vue-components/      # Vue 组件库
├── desktop-apps/            # 桌面应用
│   ├── electron-notepad/    # Electron 记事本
│   └── electron-image-viewer/ # 图片查看器
├── linux-ops/               # Linux 运维工具
│   ├── server-monitor/      # 服务器监控系统
│   ├── docker-manager/      # Docker 管理平台
│   ├── log-analyzer/        # 日志分析平台
│   └── deploy-tool/         # 自动部署工具
└── wechat-miniprogram/      # 微信小程序
    ├── expense-tracker/     # 记账助手
    └── memo-notebook/       # 备忘录
```

## 🚀 快速开始

### 各项目运行指南

#### 1. 语音合成应用 (AI项目)
```bash
cd /workspace/ai-projects/speech-synthesis
npm install
npm run dev
# 访问 http://localhost:5175
```

#### 2. 数据可视化仪表盘
```bash
cd /workspace/data-visualization/dashboard
npm install
npm run dev
# 访问 http://localhost:5176
```

#### 3. 贪吃蛇游戏
```bash
cd /workspace/games/snake-game
python3 -m http.server 8080
# 访问 http://localhost:8080
```

#### 4. 电商平台
```bash
cd /workspace/web-frontend/e-commerce
npm install
npm run dev
# 访问 http://localhost:3001
```

#### 5. 服务器监控系统
```bash
cd /workspace/linux-ops/server-monitor
./start.sh
```

#### 6. Docker 管理平台
```bash
cd /workspace/linux-ops/docker-manager
./scripts/install.sh
./scripts/docker-manager.sh web
```

## 📋 项目特性概览

### AI 项目
- **语音合成**: Web Speech API，波形可视化，历史记录
- **问答界面**: 智能对话，美观设计
- **推荐系统**: 个性化推荐展示

### 数据可视化
- **数据仪表盘**: 多种图表类型，统计卡片
- **实时监控**: 动态数据展示，报警功能

### 游戏项目
- **贪吃蛇**: Canvas 渲染，霓虹效果，音效系统
- **2048**: 优雅设计，响应式布局

### 前端应用
- **电商平台**: 商品展示，购物车，搜索筛选
- **博客后台**: 文章管理，数据统计
- **个人作品集**: 精美展示，响应式设计
- **天气应用**: 天气动画，7日预报

### Linux 运维工具
- **服务器监控**: 实时资源监控
- **Docker管理**: 容器管理，Web界面
- **日志分析**: 日志解析，报警系统
- **自动部署**: 部署脚本，Web控制台

## 🛠️ 技术栈

- **前端框架**: React 18, Vue 3
- **构建工具**: Vite
- **UI 框架**: Tailwind CSS
- **图表库**: Chart.js, react-chartjs-2
- **图标库**: Lucide React
- **桌面应用**: Electron
- **后端框架**: Flask, Express (部分项目)
- **数据库**: SQLite (部分项目)

## 📝 开发说明

### 通用开发指南
1. 进入对应项目目录
2. 安装依赖 (Node 项目: `npm install`, Python 项目: 查看 README)
3. 按照项目说明启动开发服务器
4. 访问对应地址进行预览

### 贡献说明
每个项目都包含完整的源码和注释，欢迎学习和修改！

## 📄 许可证

本项目仅供学习和参考使用。

