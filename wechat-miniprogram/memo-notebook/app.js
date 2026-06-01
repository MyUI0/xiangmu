App({
  onLaunch: function () {
    console.log('备忘录小程序启动')
  },
  
  globalData: {
    notes: []
  },
  
  // 从本地存储加载笔记
  loadNotes: function() {
    try {
      const notes = wx.getStorageSync('notes')
      if (notes) {
        this.globalData.notes = notes
      }
    } catch (e) {
      console.error('加载笔记失败', e)
    }
  },
  
  // 保存笔记到本地存储
  saveNotes: function() {
    try {
      wx.setStorageSync('notes', this.globalData.notes)
    } catch (e) {
      console.error('保存笔记失败', e)
    }
  }
})