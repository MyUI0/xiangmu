export interface Task {
  id: string
  content: string
  completed: boolean
  order: number
  createdAt: string
}

export type FilterType = 'all' | 'active' | 'completed'
