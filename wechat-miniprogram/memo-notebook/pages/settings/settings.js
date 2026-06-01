const app = getApp()

Page({
  data: {
    noteCount: 0
  },

  onLoad: function() {
    this.updateNoteCount()
  },

  onShow: function() {
    this.updateNoteCount()
  },

  // 更新笔记数量
  updateNoteCount: function() {
    this.setData({
      noteCount: app.globalData.notes.length
    })
  },

  // 导出笔记
  exportNotes: function() {
    const notes = app.globalData.notes
    if (notes.length === 0) {
      wx.showToast({
        title: '暂无笔记可导出',
        icon: 'none'
      })
      return
    }

    // 生成导出文本
    let exportText = '备忘录笔记导出\n\n'
    notes.forEach((note, index) => {
      exportText += `【笔记${index + 1}】\n`
      exportText += `标题：${note.title}\n`
      exportText += `内容：${note.content}\n`
      exportText += `创建时间：${note.createTime}\n`
      exportText += `更新时间：${note.updateTime}\n`
      exportText += '----------------\n'
    })

    // 复制到剪贴板
    wx.setClipboardData({
      data: exportText,
      success: () => {
        wx.showToast({
          title: '已复制到剪贴板',
          icon: 'success'
        })
      }
    })
  },

  // 清空所有笔记
  clearAllNotes: function() {
    const noteCount = app.globalData.notes.length
    if (noteCount === 0) {
      wx.showToast({
        title: '暂无可清空的笔记',
        icon: 'none'
      })
      return
    }

    wx.showModal({
      title: '确认清空',
      content: `确定要清空所有 ${noteCount} 条笔记吗？此操作无法恢复！`,
      confirmColor: '#E74C3C',
      success: (res) => {
        if (res.confirm) {
          app.globalData.notes = []
          app.saveNotes()
          this.updateNoteCount()
          wx.showToast({
            title: '已清空所有笔记',
            icon: 'success'
          })
        }
      }
    })
  }
})