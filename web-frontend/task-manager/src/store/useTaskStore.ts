import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { Task, FilterType } from '@/types'

interface TaskState {
  tasks: Task[]
  filter: FilterType
  addTask: (content: string) => void
  removeTask: (id: string) => void
  toggleTask: (id: string) => void
  updateTask: (id: string, content: string) => void
  reorderTasks: (activeId: string, overId: string) => void
  setFilter: (filter: FilterType) => void
}

export const useTaskStore = create<TaskState>()(
  persist(
    (set) => ({
      tasks: [],
      filter: 'all',

      addTask: (content: string) =>
        set((state) => ({
          tasks: [
            ...state.tasks,
            {
              id: crypto.randomUUID(),
              content: content.trim(),
              completed: false,
              order: state.tasks.length,
              createdAt: new Date().toISOString(),
            },
          ],
        })),

      removeTask: (id: string) =>
        set((state) => ({
          tasks: state.tasks
            .filter((t) => t.id !== id)
            .map((t, i) => ({ ...t, order: i })),
        })),

      toggleTask: (id: string) =>
        set((state) => ({
          tasks: state.tasks.map((t) =>
            t.id === id ? { ...t, completed: !t.completed } : t
          ),
        })),

      updateTask: (id: string, content: string) =>
        set((state) => ({
          tasks: state.tasks.map((t) =>
            t.id === id ? { ...t, content: content.trim() } : t
          ),
        })),

      reorderTasks: (activeId: string, overId: string) =>
        set((state) => {
          const oldIndex = state.tasks.findIndex((t) => t.id === activeId)
          const newIndex = state.tasks.findIndex((t) => t.id === overId)
          if (oldIndex === -1 || newIndex === -1) return state

          const newTasks = [...state.tasks]
          const [removed] = newTasks.splice(oldIndex, 1)
          newTasks.splice(newIndex, 0, removed)

          return {
            tasks: newTasks.map((t, i) => ({ ...t, order: i })),
          }
        }),

      setFilter: (filter: FilterType) => set({ filter }),
    }),
    {
      name: 'task-storage',
    }
  )
)
