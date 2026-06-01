export interface ContentItem {
  id: number
  title: string
  description: string
  content: string
  category: '科技' | '设计' | '生活' | '编程'
  image: string
  author: string
  publishDate: string
  tags: string[]
}

export interface UserPreferences {
  favoriteCategories: string[]
  theme: 'light' | 'dark'
}
