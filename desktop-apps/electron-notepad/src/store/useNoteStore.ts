import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { Note, ThemeMode } from '@/types'
import { generateId, stripHtml } from '@/lib/utils'

interface NoteStore {
  notes: Note[]
  activeNoteId: string | null
  theme: ThemeMode
  accentColor: string
  sidebarOpen: boolean

  createNote: () => string
  deleteNote: (id: string) => void
  updateNote: (id: string, updates: Partial<Pick<Note, 'title' | 'content'>>) => void
  renameNote: (id: string, newTitle: string) => void
  setActiveNote: (id: string | null) => void
  setTheme: (theme: ThemeMode) => void
  setAccentColor: (color: string) => void
  toggleSidebar: () => void
  getActiveNote: () => Note | undefined
}

export const useNoteStore = create<NoteStore>()(
  persist(
    (set, get) => ({
      notes: [],
      activeNoteId: null,
      theme: 'system',
      accentColor: '#6366f1',
      sidebarOpen: true,

      createNote: () => {
        const now = new Date().toISOString()
        const note: Note = {
          id: generateId(),
          title: '无标题笔记',
          content: '',
          createdAt: now,
          updatedAt: now,
        }
        set((state) => ({
          notes: [note, ...state.notes],
          activeNoteId: note.id,
        }))
        return note.id
      },

      deleteNote: (id) => {
        set((state) => {
          const newNotes = state.notes.filter((n) => n.id !== id)
          const newActiveId =
            state.activeNoteId === id
              ? newNotes.length > 0
                ? newNotes[0].id
                : null
              : state.activeNoteId
          return { notes: newNotes, activeNoteId: newActiveId }
        })
      },

      updateNote: (id, updates) => {
        set((state) => ({
          notes: state.notes.map((n) =>
            n.id === id
              ? {
                  ...n,
                  ...updates,
                  updatedAt: new Date().toISOString(),
                  // 自动从内容中提取标题
                  ...(updates.content !== undefined
                    ? {
                        title:
                          updates.title ??
                          (() => {
                            const text = stripHtml(updates.content).trim()
                            return text.length > 0
                              ? text.substring(0, 50)
                              : '无标题笔记'
                          })(),
                      }
                    : {}),
                }
              : n
          ),
        }))
      },

      renameNote: (id, newTitle) => {
        set((state) => ({
          notes: state.notes.map((n) =>
            n.id === id
              ? { ...n, title: newTitle, updatedAt: new Date().toISOString() }
              : n
          ),
        }))
      },

      setActiveNote: (id) => {
        set({ activeNoteId: id })
      },

      setTheme: (theme) => {
        set({ theme })
      },

      setAccentColor: (color) => {
        set({ accentColor: color })
      },

      toggleSidebar: () => {
        set((state) => ({ sidebarOpen: !state.sidebarOpen }))
      },

      getActiveNote: () => {
        const { notes, activeNoteId } = get()
        return notes.find((n) => n.id === activeNoteId)
      },
    }),
    {
      name: 'notepad-storage',
    }
  )
)
