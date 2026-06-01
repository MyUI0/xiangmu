# 备忘录小程序

一个简洁美观的微信小程序备忘录/记事本应用。

## 功能特性

- ✅ 笔记列表展示
- ✅ 新建笔记
- ✅ 编辑笔记
- ✅ 删除笔记
- ✅ 搜索笔记
- ✅ 本地数据存储
- ✅ 导出笔记（复制到剪贴板）
- ✅ 统计笔记数量
- ✅ 清空所有笔记
- ✅ 美观的界面设计

## 项目结构

```
memo-notebook/
├── app.js                 # 小程序入口逻辑
├── app.json               # 小程序全局配置
├── app.wxss               # 小程序全局样式
├── sitemap.json           # 站点地图配置
├── pages/
│   ├── index/             # 首页（笔记列表）
│   │   ├── index.js
│   │   ├── index.json
│   │   ├── index.wxml
│   │   └── index.wxss
│   ├── edit/              # 编辑页
│   │   ├── edit.js
│   │   ├── edit.json
│   │   ├── edit.wxml
│   │   └── edit.wxss
│   └── settings/          # 设置页
│       ├── settings.js
│       ├── settings.json
│       ├── settings.wxml
│       └── settings.wxss
└── images/                # 图片资源目录（需自行添加图标）
    ├── note.png
    ├── note-active.png
    ├── setting.png
    └── setting-active.png
```

## 使用说明

1. 在微信开发者工具中打开此项目
2. 在 `images/` 目录下添加底部导航栏所需的图标：
   - `note.png` - 笔记图标（未选中）
   - `note-active.png` - 笔记图标（选中）
   - `setting.png` - 设置图标（未选中）
   - `setting-active.png` - 设置图标（选中）
3. 点击编译运行
4. 在模拟器或真机上预览和测试

## 技术栈

- 微信小程序原生开发
- 本地存储（wx.setStorageSync / wx.getStorageSync）

## 数据结构

笔记数据结构：

```javascript
{
  id: String,           // 笔记ID（时间戳）
  title: String,        // 笔记标题
  content: String,      // 笔记内容
  createTime: String,   // 创建时间（YYYY-MM-DD HH:mm）
  updateTime: String    // 更新时间（YYYY-MM-DD HH:mm）
}
```

## 注意事项

- 所有数据存储在本地，卸载小程序会清空数据
- 建议定期使用导出功能备份笔记
- 标题限制50字符，内容限制10000字符
