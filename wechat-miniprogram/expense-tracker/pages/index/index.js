// 记录列表页面
const util = require('../../utils/util.js');
const app = getApp();

Page({
  data: {
    // 本月支出
    monthExpense: '0.00',
    // 本月收入
    monthIncome: '0.00',
    // 分组后的记录
    groupedRecords: [],
    // 是否显示详情弹窗
    showDetail: false,
    // 当前查看的记录
    currentRecord: null
  },

  onLoad() {
    this.loadData();
  },

  onShow() {
    this.loadData();
  },

  // 加载数据
  loadData() {
    const records = app.globalData.records;
    const now = new Date();
    
    // 计算本月收支
    let monthExpense = 0;
    let monthIncome = 0;
    
    records.forEach(record => {
      const recordDate = new Date(record.date);
      if (recordDate.getFullYear() === now.getFullYear() && 
          recordDate.getMonth() === now.getMonth()) {
        if (record.type === 'expense') {
          monthExpense += parseFloat(record.amount);
        } else {
          monthIncome += parseFloat(record.amount);
        }
      }
    });

    // 处理记录，添加分类信息
    const processedRecords = records.map(record => {
      const categoryInfo = app.getCategory(record.type, record.category);
      const recordDate = new Date(record.date);
      return {
        ...record,
        categoryInfo,
        timeText: util.formatTime(new Date(record.createTime)),
        dateKey: util.formatDate(recordDate)
      };
    });

    // 按日期分组
    const grouped = this.groupRecordsByDate(processedRecords);

    this.setData({
      monthExpense: util.formatAmount(monthExpense),
      monthIncome: util.formatAmount(monthIncome),
      groupedRecords: grouped
    });
  },

  // 按日期分组记录
  groupRecordsByDate(records) {
    const groups = {};
    
    records.forEach(record => {
      const dateKey = record.dateKey;
      if (!groups[dateKey]) {
        groups[dateKey] = {
          date: dateKey,
          dateText: this.formatDateText(new Date(record.date)),
          records: [],
          dayExpense: 0,
          dayIncome: 0
        };
      }
      groups[dateKey].records.push(record);
      
      if (record.type === 'expense') {
        groups[dateKey].dayExpense += parseFloat(record.amount);
      } else {
        groups[dateKey].dayIncome += parseFloat(record.amount);
      }
    });

    // 转换为数组并计算每日结余
    return Object.values(groups).map(group => {
      const balance = group.dayIncome - group.dayExpense;
      let balanceText = '';
      if (balance > 0) {
        balanceText = `+¥${util.formatAmount(balance)}`;
      } else if (balance < 0) {
        balanceText = `-¥${util.formatAmount(Math.abs(balance))}`;
      } else {
        balanceText = '¥0.00';
      }
      return {
        ...group,
        balanceText
      };
    });
  },

  // 格式化日期显示文本
  formatDateText(date) {
    const today = util.getTodayStart();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (util.isSameDay(date, today)) {
      return `今天 ${util.getWeekDay(date)}`;
    } else if (util.isSameDay(date, yesterday)) {
      return `昨天 ${util.getWeekDay(date)}`;
    } else {
      return `${util.formatDate(date)} ${util.getWeekDay(date)}`;
    }
  },

  // 显示记录详情
  showRecordDetail(e) {
    const record = e.currentTarget.dataset.record;
    this.setData({
      showDetail: true,
      currentRecord: record
    });
  },

  // 隐藏详情
  hideDetail() {
    this.setData({
      showDetail: false,
      currentRecord: null
    });
  },

  // 阻止冒泡
  stopPropagation() {
    // 空函数，阻止事件冒泡
  },

  // 删除记录
  deleteRecord() {
    const record = this.data.currentRecord;
    if (!record) return;

    wx.showModal({
      title: '确认删除',
      content: '确定要删除这条记录吗？',
      success: (res) => {
        if (res.confirm) {
          app.deleteRecord(record.id);
          this.hideDetail();
          this.loadData();
          wx.showToast({
            title: '删除成功',
            icon: 'success'
          });
        }
      }
    });
  }
});
