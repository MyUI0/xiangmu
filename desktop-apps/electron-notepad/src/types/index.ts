export interface Note {
  id: string
  title: string
  content: string  // HTML 格式内容
  createdAt: string
  updatedAt: string
}

export type ThemeMode = 'light' | 'dark' | 'system'
