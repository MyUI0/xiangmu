import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { mockData } from '@/data/mockData'
import type { ContentItem } from '@/types'

interface StoreState {
  items: ContentItem[]
  favorites: number[]
  history: number[]
  filter: string
  search: string
  setFilter: (filter: string) => void
  setSearch: (search: string) => void
  toggleFavorite: (id: number) => void
  addToHistory: (id: number) => void
  clearHistory: () => void
}

export const useStore = create<StoreState>()(
  persist(
    (set) => ({
      items: mockData,
      favorites: [],
      history: [],
      filter: '全部',
      search: '',
      setFilter: (filter) => set({ filter }),
      setSearch: (search) => set({ search }),
      toggleFavorite: (id) =>
        set((state) => ({
          favorites: state.favorites.includes(id)
            ? state.favorites.filter((fid) => fid !== id)
            : [...state.favorites, id],
        })),
      addToHistory: (id) =>
        set((state) => ({
          history: [id, ...state.history.filter((hid) => hid !== id)].slice(0, 50),
        })),
      clearHistory: () => set({ history: [] }),
    }),
    {
      name: 'recommendation-store',
    }
  )
)
