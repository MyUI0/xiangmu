# 微信小程序 - 记账助手

一个简洁美观的微信小程序记账应用，帮助用户记录和分析日常收支。

## 功能特点

### 1. 记账功能
- 支持支出和收入两种类型记录
- 预设常用分类，带图标和颜色区分
- 支持自定义日期
- 可选添加备注
- 金额自动格式化，保留两位小数

### 2. 记录列表
- 按日期分组显示记录
- 显示本月收支概览
- 点击记录查看详情
- 支持删除记录
- 数据本地存储

### 3. 统计分析
- 月份切换，查看不同月份数据
- 总收入、总支出、结余概览
- 支出/收入分类统计，带百分比
- 彩色进度条可视化分类占比
- 每日趋势图，直观展示收支变化

## 项目结构

```
expense-tracker/
├── app.js                 # 小程序入口文件
├── app.json               # 小程序全局配置
├── app.wxss               # 全局样式
├── project.config.json    # 项目配置
├── sitemap.json           # 站点地图配置
├── utils/
│   └── util.js            # 工具函数
└── pages/
    ├── index/             # 记录列表页
    │   ├── index.js
    │   ├── index.json
    │   ├── index.wxml
    │   └── index.wxss
    ├── add/               # 记账页
    │   ├── add.js
    │   ├── add.json
    │   ├── add.wxml
    │   └── add.wxss
    └── stats/             # 统计页
        ├── stats.js
        ├── stats.json
        ├── stats.wxml
        └── stats.wxss
```

## 分类说明

### 支出分类
- 🍜 餐饮 - #ff6b6b
- 🚗 交通 - #4ecdc4
- 🛒 购物 - #45b7d1
- 🎮 娱乐 - #96ceb4
- 💊 医疗 - #ffeaa7
- 📚 教育 - #dfe6e9
- 🏠 住房 - #a29bfe
- 📦 其他 - #b2bec3

### 收入分类
- 💰 工资 - #667eea
- 🎉 奖金 - #764ba2
- 📈 投资 - #6b48ff
- 💼 兼职 - #f093fb
- 📦 其他 - #c474f0

## 使用说明

### 开发环境
1. 下载并安装 [微信开发者工具](https://developers.weixin.qq.com/miniprogram/dev/devtools/download.html)
2. 打开微信开发者工具，选择"导入项目"
3. 选择项目目录：`/workspace/wechat-miniprogram/expense-tracker/`
4. 填写 AppID（测试可使用"测试号"）
5. 点击"导入"开始开发

### 添加图标
项目中使用了 emoji 作为分类图标，简单易用。如需使用自定义图标：
1. 在项目根目录创建 `images/` 文件夹
2. 准备 tabBar 图标文件（建议 81px * 81px）
3. 修改 `app.json` 中的 tabBar 配置

## 数据存储

使用微信小程序本地存储 API（`wx.setStorageSync` / `wx.getStorageSync`），数据保存在用户设备本地。

数据格式：
```javascript
{
  id: 时间戳,
  type: 'expense' | 'income',
  amount: '0.00',
  category: 'food',
  date: '2024-01-01',
  remark: '备注',
  createTime: 'ISO时间字符串'
}
```

## 设计特点

- 采用渐变紫色 (#667eea → #764ba2) 为主色调
- 卡片式设计，清晰区分不同模块
- 使用 emoji 图标，简洁友好
- 支持深色/浅色文字对比
- 流畅的交互动画

## 后续优化建议

1. 数据导出功能
2. 预算管理
3. 更多图表类型（饼图、折线图）
4. 云存储同步
5. 分类自定义
6. 多账本功能
7. 账单搜索

## 技术栈

- 微信小程序原生开发
- WXML / WXSS / JavaScript
- 本地存储 Storage API
