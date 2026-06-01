# 博客管理后台

一个现代化的博客管理后台系统，包含前端 React 界面和后端 Flask 服务。

## 技术栈

### 前端
- React 18 + TypeScript
- Vite
- Tailwind CSS
- React Router
- Zustand (状态管理)
- Lucide React (图标)
- Recharts (图表)

### 后端
- Flask
- SQLite
- Flask-CORS

## 项目结构

```
blog-dashboard/
├── frontend/          # 前端项目
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── store/
│   │   └── types/
│   └── package.json
└── backend/           # 后端项目
    ├── app.py
    └── requirements.txt
```

## 快速开始

### 1. 安装后端依赖并启动服务

```bash
cd backend
pip install -r requirements.txt
python app.py
```

后端服务将在 http://localhost:5000 运行

### 2. 安装前端依赖并启动开发服务器

```bash
cd frontend
npm install
npm run dev
```

前端开发服务器将在 http://localhost:5173 运行

## 功能特性

- 📊 **仪表盘** - 数据统计概览，包括总文章数、访问量、评论数等
- 📝 **文章管理** - 创建、编辑、删除文章，支持搜索和分类筛选
- 🏷️ **分类管理** - 管理文章分类
- 📈 **数据可视化** - 访问趋势图表和分类分布图表

## API 接口

### 文章相关
- `GET /api/articles` - 获取所有文章
- `GET /api/articles/:id` - 获取单篇文章
- `POST /api/articles` - 创建文章
- `PUT /api/articles/:id` - 更新文章
- `DELETE /api/articles/:id` - 删除文章

### 统计数据
- `GET /api/statistics` - 获取统计数据
- `GET /api/trends` - 获取访问趋势
- `GET /api/categories` - 获取分类统计
