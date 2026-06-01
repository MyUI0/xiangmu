// 统计页面
const util = require('../../utils/util.js');
const app = getApp();

Page({
  data: {
    // 当前选中的年月
    currentYear: 0,
    currentMonth: 0,
    monthText: '',
    // 统计类型：expense 支出，income 收入
    statsType: 'expense',
    // 总收入
    totalIncome: '0.00',
    // 总支出
    totalExpense: '0.00',
    // 结余
    balance: 0,
    balanceText: '0.00',
    // 分类统计
    categoryStats: [],
    // 每日趋势
    dailyTrend: []
  },

  onLoad() {
    const now = new Date();
    this.setData({
      currentYear: now.getFullYear(),
      currentMonth: now.getMonth()
    });
    this.updateMonthText();
    this.calculateStats();
  },

  onShow() {
    this.calculateStats();
  },

  // 更新月份显示文本
  updateMonthText() {
    const { currentYear, currentMonth } = this.data;
    const monthStr = currentMonth + 1;
    this.setData({
      monthText: `${currentYear}年${monthStr}月`
    });
  },

  // 上个月
  prevMonth() {
    let { currentYear, currentMonth } = this.data;
    currentMonth--;
    if (currentMonth < 0) {
      currentMonth = 11;
      currentYear--;
    }
    this.setData({
      currentYear,
      currentMonth
    });
    this.updateMonthText();
    this.calculateStats();
  },

  // 下个月
  nextMonth() {
    let { currentYear, currentMonth } = this.data;
    currentMonth++;
    if (currentMonth > 11) {
      currentMonth = 0;
      currentYear++;
    }
    this.setData({
      currentYear,
      currentMonth
    });
    this.updateMonthText();
    this.calculateStats();
  },

  // 切换统计类型
  switchStatsType(e) {
    const type = e.currentTarget.dataset.type;
    this.setData({
      statsType: type
    });
    this.calculateCategoryStats();
  },

  // 计算统计数据
  calculateStats() {
    const records = app.globalData.records;
    const { currentYear, currentMonth } = this.data;
    
    // 筛选当前月份的记录
    const monthRecords = records.filter(record => {
      const date = new Date(record.date);
      return date.getFullYear() === currentYear && date.getMonth() === currentMonth;
    });
    
    // 计算总收入和总支出
    let totalIncome = 0;
    let totalExpense = 0;
    
    monthRecords.forEach(record => {
      if (record.type === 'expense') {
        totalExpense += parseFloat(record.amount);
      } else {
        totalIncome += parseFloat(record.amount);
      }
    });
    
    const balance = totalIncome - totalExpense;
    
    this.setData({
      totalIncome: util.formatAmount(totalIncome),
      totalExpense: util.formatAmount(totalExpense),
      balance,
      balanceText: util.formatAmount(Math.abs(balance))
    });
    
    this.calculateCategoryStats();
    this.calculateDailyTrend();
  },

  // 计算分类统计
  calculateCategoryStats() {
    const records = app.globalData.records;
    const { currentYear, currentMonth, statsType } = this.data;
    
    // 筛选当前月份、当前类型的记录
    const typeRecords = records.filter(record => {
      const date = new Date(record.date);
      return date.getFullYear() === currentYear && 
             date.getMonth() === currentMonth &&
             record.type === statsType;
    });
    
    // 获取分类列表
    const categories = statsType === 'expense' 
      ? app.globalData.expenseCategories 
      : app.globalData.incomeCategories;
    
    // 按分类汇总
    const categoryMap = {};
    let totalAmount = 0;
    
    typeRecords.forEach(record => {
      if (!categoryMap[record.category]) {
        categoryMap[record.category] = 0;
      }
      categoryMap[record.category] += parseFloat(record.amount);
      totalAmount += parseFloat(record.amount);
    });
    
    // 生成统计列表
    const categoryStats = categories.map(category => {
      const amount = categoryMap[category.id] || 0;
      const percent = totalAmount > 0 ? ((amount / totalAmount) * 100).toFixed(1) : 0;
      return {
        id: category.id,
        name: category.name,
        icon: category.icon,
        color: category.color,
        amount: util.formatAmount(amount),
        percent: percent
      };
    }).filter(item => parseFloat(item.amount) > 0);
    
    // 按金额降序排序
    categoryStats.sort((a, b) => parseFloat(b.amount) - parseFloat(a.amount));
    
    this.setData({
      categoryStats
    });
  },

  // 计算每日趋势
  calculateDailyTrend() {
    const records = app.globalData.records;
    const { currentYear, currentMonth, statsType } = this.data;
    
    // 获取当月的天数
    const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
    
    // 初始化每日数据
    const dailyMap = {};
    for (let i = 1; i <= daysInMonth; i++) {
      dailyMap[i] = 0;
    }
    
    // 筛选当前月份、当前类型的记录
    const typeRecords = records.filter(record => {
      const date = new Date(record.date);
      return date.getFullYear() === currentYear && 
             date.getMonth() === currentMonth &&
             record.type === statsType;
    });
    
    // 按日汇总
    typeRecords.forEach(record => {
      const date = new Date(record.date);
      const day = date.getDate();
      dailyMap[day] += parseFloat(record.amount);
    });
    
    // 找出最大值
    let maxAmount = 0;
    Object.values(dailyMap).forEach(amount => {
      if (amount > maxAmount) {
        maxAmount = amount;
      }
    });
    
    // 生成趋势数据
    const dailyTrend = [];
    const daysToShow = Math.min(daysInMonth, 15); // 最多显示15天
    const startDay = Math.max(1, daysInMonth - daysToShow + 1);
    
    for (let i = startDay; i <= daysInMonth; i++) {
      const amount = dailyMap[i];
      const height = maxAmount > 0 ? (amount / maxAmount) * 100 : 0;
      dailyTrend.push({
        date: i,
        day: `${i}`,
        amount: util.formatAmount(amount),
        height: height > 0 ? Math.max(height, 5) : 0 // 最小高度5%
      });
    }
    
    this.setData({
      dailyTrend
    });
  }
});
