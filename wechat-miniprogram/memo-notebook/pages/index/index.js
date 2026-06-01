const app = getApp()

Page({
  data: {
    notes: [],
    filteredNotes: [],
    searchText: ''
  },

  onLoad: function() {
    // 加载笔记
    app.loadNotes()
    this.setData({
      notes: app.globalData.notes,
      filteredNotes: app.globalData.notes
    })
  },

  onShow: function() {
    // 页面显示时刷新笔记列表
    this.setData({
      notes: app.globalData.notes
    })
    this.filterNotes()
  },

  // 搜索输入
  onSearchInput: function(e) {
    const searchText = e.detail.value
    this.setData({ searchText })
    this.filterNotes()
  },

  // 过滤笔记
  filterNotes: function() {
    const { notes, searchText } = this.data
    if (!searchText) {
      this.setData({ filteredNotes: notes })
      return
    }

    const filteredNotes = notes.filter(note => 
      note.title.toLowerCase().includes(searchText.toLowerCase()) || 
      note.content.toLowerCase().includes(searchText.toLowerCase())
    )
    this.setData({ filteredNotes })
  },

  // 打开笔记
  openNote: function(e) {
    const id = e.currentTarget.dataset.id
    wx.navigateTo({
      url: `/pages/edit/edit?id=${id}`
    })
  },

  // 添加新笔记
  addNote: function() {
    wx.navigateTo({
      url: '/pages/edit/edit'
    })
  }
})