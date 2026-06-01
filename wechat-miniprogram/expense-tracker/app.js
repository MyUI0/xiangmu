// 小程序入口文件
App({
  // 全局数据
  globalData: {
    // 支出分类
    expenseCategories: [
      { id: 'food', name: '餐饮', icon: '🍜', color: '#ff6b6b' },
      { id: 'transport', name: '交通', icon: '🚗', color: '#4ecdc4' },
      { id: 'shopping', name: '购物', icon: '🛒', color: '#45b7d1' },
      { id: 'entertainment', name: '娱乐', icon: '🎮', color: '#96ceb4' },
      { id: 'medical', name: '医疗', icon: '💊', color: '#ffeaa7' },
      { id: 'education', name: '教育', icon: '📚', color: '#dfe6e9' },
      { id: 'housing', name: '住房', icon: '🏠', color: '#a29bfe' },
      { id: 'other', name: '其他', icon: '📦', color: '#b2bec3' }
    ],
    // 收入分类
    incomeCategories: [
      { id: 'salary', name: '工资', icon: '💰', color: '#667eea' },
      { id: 'bonus', name: '奖金', icon: '🎉', color: '#764ba2' },
      { id: 'investment', name: '投资', icon: '📈', color: '#6b48ff' },
      { id: 'parttime', name: '兼职', icon: '💼', color: '#f093fb' },
      { id: 'other', name: '其他', icon: '📦', color: '#c474f0' }
    ],
    // 记账记录
    records: []
  },

  // 小程序启动
  onLaunch() {
    // 从本地存储加载数据
    this.loadRecords();
  },

  // 加载记录数据
  loadRecords() {
    try {
      const records = wx.getStorageSync('expense_records');
      if (records) {
        this.globalData.records = records;
      }
    } catch (e) {
      console.error('加载数据失败', e);
    }
  },

  // 保存记录数据
  saveRecords() {
    try {
      wx.setStorageSync('expense_records', this.globalData.records);
    } catch (e) {
      console.error('保存数据失败', e);
    }
  },

  // 添加记录
  addRecord(record) {
    record.id = Date.now();
    record.createTime = new Date().toISOString();
    this.globalData.records.unshift(record);
    this.saveRecords();
  },

  // 删除记录
  deleteRecord(id) {
    const index = this.globalData.records.findIndex(r => r.id === id);
    if (index !== -1) {
      this.globalData.records.splice(index, 1);
      this.saveRecords();
    }
  },

  // 获取分类信息
  getCategory(type, categoryId) {
    const categories = type === 'expense' 
      ? this.globalData.expenseCategories 
      : this.globalData.incomeCategories;
    return categories.find(c => c.id === categoryId) || categories[categories.length - 1];
  }
});
