#!/bin/bash

# 修复所有项目的 Tailwind CSS 配置
# 将 Tailwind CSS 4 降级到 3.4，并创建必要的配置文件

echo "🔧 开始修复 Tailwind CSS 配置..."

# 需要处理的项目目录列表
PROJECTS=(
  "ai-projects/qa-interface"
  "ai-projects/recommendation-interface"
  "ai-projects/image-recognition"
  "ai-projects/speech-synthesis"
  "data-visualization/dashboard"
  "data-visualization/real-time-monitor"
  "ui-libs/react-components"
  "ui-libs/vue-components"
  "web-frontend/blog-dashboard/frontend"
  "web-frontend/e-commerce"
  "web-frontend/weather-app"
  "web-frontend/task-manager"
  "games/2048-game"
  "desktop-apps/electron-notepad"
)

for project in "${PROJECTS[@]}"; do
  if [ -d "$project" ]; then
    echo ""
    echo "📁 处理项目: $project"
    
    # 1. 修复 package.json - 将 tailwindcss 4 改为 3.4
    if [ -f "$project/package.json" ]; then
      # 使用 sed 替换 tailwindcss 版本
      sed -i 's/"tailwindcss": "\^4\.0\.0"/"tailwindcss": "^3.4.0"/g' "$project/package.json"
      sed -i 's/"tailwindcss": "\^4\.[0-9]\+\.[0-9]\+"/"tailwindcss": "^3.4.0"/g' "$project/package.json"
      echo "  ✓ 更新 package.json"
    fi
    
    # 2. 创建 tailwind.config.js（如果不存在）
    if [ ! -f "$project/tailwind.config.js" ]; then
      cat > "$project/tailwind.config.js" << 'EOF'
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}
EOF
      echo "  ✓ 创建 tailwind.config.js"
    fi
    
    # 3. 修复 src/index.css
    if [ -f "$project/src/index.css" ]; then
      # 备份原文件
      cp "$project/src/index.css" "$project/src/index.css.bak"
      
      # 检查是否使用了 Tailwind CSS 4 的语法
      if grep -q '@import "tailwindcss"' "$project/src/index.css"; then
        # 替换为 Tailwind CSS 3 的语法
        cat > "$project/src/index.css" << 'EOF'
@tailwind base;
@tailwind components;
@tailwind utilities;

body {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
}
EOF
        echo "  ✓ 更新 src/index.css"
      fi
    fi
    
    # 4. 确保 postcss.config.js 正确
    if [ -f "$project/postcss.config.js" ]; then
      cat > "$project/postcss.config.js" << 'EOF'
export default {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
}
EOF
      echo "  ✓ 更新 postcss.config.js"
    fi
    
  else
    echo "⚠️  跳过不存在的项目: $project"
  fi
done

echo ""
echo "✅ 修复完成！"
echo ""
echo "接下来请执行:"
echo "  1. 删除所有 node_modules 目录: find . -name 'node_modules' -type d -exec rm -rf {} + 2>/dev/null || true"
echo "  2. 删除 package-lock.json: find . -name 'package-lock.json' -exec rm -f {} \;"
echo "  3. 重新安装依赖: npm install"
echo "  4. 重新构建: npm run build"
