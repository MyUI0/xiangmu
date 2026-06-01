// 添加记录页面
const util = require('../../utils/util.js');
const app = getApp();

Page({
  data: {
    // 当前类型：expense 支出，income 收入
    currentType: 'expense',
    // 金额
    amount: '',
    // 日期
    date: '',
    dateText: '',
    // 选中的分类
    selectedCategory: '',
    // 分类列表
    categories: [],
    // 备注
    remark: '',
    // 是否可以保存
    canSave: false
  },

  onLoad() {
    const today = new Date();
    const dateStr = util.formatDate(today);
    
    this.setData({
      date: dateStr,
      dateText: this.formatDateDisplay(today),
      categories: app.globalData.expenseCategories,
      selectedCategory: app.globalData.expenseCategories[0].id
    });
    
    this.checkCanSave();
  },

  onShow() {
    // 页面显示时更新分类列表
    this.updateCategories();
  },

  // 更新分类列表
  updateCategories() {
    const categories = this.data.currentType === 'expense' 
      ? app.globalData.expenseCategories 
      : app.globalData.incomeCategories;
    
    let selectedCategory = this.data.selectedCategory;
    // 如果当前选中的分类在新列表中不存在，则选择第一个
    const exists = categories.some(c => c.id === selectedCategory);
    if (!exists) {
      selectedCategory = categories[0].id;
    }
    
    this.setData({
      categories,
      selectedCategory
    });
  },

  // 切换类型
  switchType(e) {
    const type = e.currentTarget.dataset.type;
    this.setData({
      currentType: type
    });
    this.updateCategories();
  },

  // 金额输入
  onAmountInput(e) {
    let value = e.detail.value;
    
    // 限制小数点后两位
    if (value.includes('.')) {
      const parts = value.split('.');
      if (parts[1] && parts[1].length > 2) {
        value = parts[0] + '.' + parts[1].substring(0, 2);
      }
    }
    
    this.setData({
      amount: value
    });
    this.checkCanSave();
  },

  // 日期选择
  onDateChange(e) {
    const dateStr = e.detail.value;
    const date = new Date(dateStr);
    this.setData({
      date: dateStr,
      dateText: this.formatDateDisplay(date)
    });
  },

  // 格式化日期显示
  formatDateDisplay(date) {
    const today = util.getTodayStart();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (util.isSameDay(date, today)) {
      return '今天';
    } else if (util.isSameDay(date, yesterday)) {
      return '昨天';
    } else {
      return util.formatDate(date);
    }
  },

  // 选择分类
  selectCategory(e) {
    const id = e.currentTarget.dataset.id;
    this.setData({
      selectedCategory: id
    });
  },

  // 备注输入
  onRemarkInput(e) {
    this.setData({
      remark: e.detail.value
    });
  },

  // 检查是否可以保存
  checkCanSave() {
    const { amount, selectedCategory } = this.data;
    const canSave = amount && parseFloat(amount) > 0 && selectedCategory;
    this.setData({
      canSave
    });
  },

  // 保存记录
  saveRecord() {
    if (!this.data.canSave) return;

    const record = {
      type: this.data.currentType,
      amount: util.formatAmount(this.data.amount),
      category: this.data.selectedCategory,
      date: this.data.date,
      remark: this.data.remark.trim()
    };

    app.addRecord(record);

    wx.showToast({
      title: '保存成功',
      icon: 'success',
      duration: 1500
    });

    // 清空表单
    setTimeout(() => {
      this.setData({
        amount: '',
        remark: '',
        canSave: false
      });
      // 切换到记录页面
      wx.switchTab({
        url: '/pages/index/index'
      });
    }, 1500);
  }
});
