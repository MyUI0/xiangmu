const app = getApp()

// 格式化时间
function formatTime(date) {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  const hour = String(date.getHours()).padStart(2, '0')
  const minute = String(date.getMinutes()).padStart(2, '0')
  return `${year}-${month}-${day} ${hour}:${minute}`
}

Page({
  data: {
    note: {
      id: '',
      title: '',
      content: '',
      createTime: '',
      updateTime: ''
    },
    isEdit: false
  },

  onLoad: function(options) {
    if (options.id) {
      // 编辑现有笔记
      const note = app.globalData.notes.find(n => n.id === options.id)
      if (note) {
        this.setData({
          note: { ...note },
          isEdit: true
        })
        wx.setNavigationBarTitle({
          title: '编辑笔记'
        })
      }
    } else {
      // 新建笔记
      wx.setNavigationBarTitle({
        title: '新建笔记'
      })
    }
  },

  // 标题输入
  onTitleInput: function(e) {
    this.setData({
      'note.title': e.detail.value
    })
  },

  // 内容输入
  onContentInput: function(e) {
    this.setData({
      'note.content': e.detail.value
    })
  },

  // 保存笔记
  saveNote: function() {
    const { note, isEdit } = this.data
    const now = formatTime(new Date())

    if (!note.title.trim() && !note.content.trim()) {
      wx.showToast({
        title: '笔记不能为空',
        icon: 'none'
      })
      return
    }

    if (isEdit) {
      // 更新现有笔记
      const index = app.globalData.notes.findIndex(n => n.id === note.id)
      if (index !== -1) {
        app.globalData.notes[index] = {
          ...note,
          updateTime: now
        }
        wx.showToast({
          title: '保存成功',
          icon: 'success'
        })
      }
    } else {
      // 新建笔记
      const newNote = {
        id: Date.now().toString(),
        title: note.title,
        content: note.content,
        createTime: now,
        updateTime: now
      }
      app.globalData.notes.unshift(newNote)
      wx.showToast({
        title: '保存成功',
        icon: 'success'
      })
    }

    app.saveNotes()
    
    // 延迟返回，让用户看到保存成功的提示
    setTimeout(() => {
      wx.navigateBack()
    }, 500)
  },

  // 删除笔记
  deleteNote: function() {
    wx.showModal({
      title: '确认删除',
      content: '删除后无法恢复，确定要删除吗？',
      success: (res) => {
        if (res.confirm) {
          const index = app.globalData.notes.findIndex(n => n.id === this.data.note.id)
          if (index !== -1) {
            app.globalData.notes.splice(index, 1)
            app.saveNotes()
            wx.showToast({
              title: '删除成功',
              icon: 'success'
            })
            setTimeout(() => {
              wx.navigateBack()
            }, 500)
          }
        }
      }
    })
  }
})