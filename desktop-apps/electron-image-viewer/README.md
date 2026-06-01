# Electron 图片查看器

一个简单易用的桌面图片查看器应用，支持图片浏览和基本编辑功能。

## 功能特性

- **图片浏览**：支持打开单张或多张图片，左侧显示缩略图列表，点击可切换
- **图片编辑**：
  - 亮度、对比度、饱和度调整
  - 黑白滤镜
  - 反相滤镜
  - 图片缩放
  - 图片旋转
- **保存功能**：编辑后可以保存图片

## 项目结构

```
electron-image-viewer/
├── main.js          # Electron主进程
├── index.html       # 渲染进程HTML
├── renderer.js      # 渲染进程JavaScript
├── package.json     # 项目配置
└── README.md        # 说明文档
```

## 安装和运行

### 安装依赖

```bash
npm install
```

如果网络不好，可以尝试使用国内镜像：

```bash
npm config set registry https://registry.npmmirror.com
npm install
```

### 运行应用

```bash
npm start
```

### 开发模式

开发模式会自动打开开发者工具：

```bash
npm run dev
```

## 使用说明

1. 点击"打开图片"按钮，选择要查看的图片（可多选）
2. 在左侧缩略图列表中点击切换图片
3. 使用右侧编辑面板调整图片效果
4. 使用底部控制栏缩放、旋转图片
5. 点击"保存图片"保存编辑后的图片
6. 点击"重置图片"恢复到原始状态
