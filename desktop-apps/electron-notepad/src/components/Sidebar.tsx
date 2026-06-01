import { useState, useRef, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Plus,
  Search,
  Trash2,
  FileText,
  Check,
  X,
  PanelLeftClose,
} from 'lucide-react'
import { useNoteStore } from '@/store/useNoteStore'
import { cn, formatTime } from '@/lib/utils'

export default function Sidebar() {
  const notes = useNoteStore((s) => s.notes)
  const activeNoteId = useNoteStore((s) => s.activeNoteId)
  const createNote = useNoteStore((s) => s.createNote)
  const deleteNote = useNoteStore((s) => s.deleteNote)
  const setActiveNote = useNoteStore((s) => s.setActiveNote)
  const renameNote = useNoteStore((s) => s.renameNote)
  const toggleSidebar = useNoteStore((s) => s.toggleSidebar)

  const [searchQuery, setSearchQuery] = useState('')
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const [renamingId, setRenamingId] = useState<string | null>(null)
  const [renameValue, setRenameValue] = useState('')
  const renameInputRef = useRef<HTMLInputElement>(null)

  const filteredNotes = notes.filter((note) =>
    note.title.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const handleCreate = useCallback(() => {
    createNote()
  }, [createNote])

  const handleDelete = useCallback(
    (id: string, e: React.MouseEvent) => {
      e.stopPropagation()
      setDeletingId(id)
    },
    []
  )

  const confirmDelete = useCallback(
    (id: string) => {
      deleteNote(id)
      setDeletingId(null)
    },
    [deleteNote]
  )

  const handleStartRename = useCallback(
    (id: string, currentTitle: string, e: React.MouseEvent) => {
      e.stopPropagation()
      setRenamingId(id)
      setRenameValue(currentTitle)
      setTimeout(() => renameInputRef.current?.select(), 0)
    },
    []
  )

  const confirmRename = useCallback(() => {
    if (renamingId && renameValue.trim()) {
      renameNote(renamingId, renameValue.trim())
    }
    setRenamingId(null)
  }, [renamingId, renameValue, renameNote])

  const cancelRename = useCallback(() => {
    setRenamingId(null)
  }, [])

  return (
    <motion.div
      initial={{ width: 280 }}
      animate={{ width: 280 }}
      exit={{ width: 0 }}
      className="flex h-full flex-col border-r border-slate-200 bg-slate-50 dark:border-slate-700 dark:bg-slate-900"
    >
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-200 px-4 py-3 dark:border-slate-700">
        <h2 className="text-sm font-semibold text-slate-700 dark:text-slate-300">
          笔记列表
        </h2>
        <div className="flex items-center gap-1">
          <button
            onClick={handleCreate}
            className="rounded-md p-1.5 text-slate-500 transition-colors hover:bg-slate-200 hover:text-slate-700 dark:text-slate-400 dark:hover:bg-slate-700 dark:hover:text-slate-200"
            title="新建笔记"
          >
            <Plus size={18} />
          </button>
          <button
            onClick={toggleSidebar}
            className="rounded-md p-1.5 text-slate-500 transition-colors hover:bg-slate-200 hover:text-slate-700 dark:text-slate-400 dark:hover:bg-slate-700 dark:hover:text-slate-200"
            title="收起侧边栏"
          >
            <PanelLeftClose size={18} />
          </button>
        </div>
      </div>

      {/* Search */}
      <div className="px-3 py-2">
        <div className="flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-1.5 dark:border-slate-600 dark:bg-slate-800">
          <Search size={14} className="text-slate-400" />
          <input
            type="text"
            placeholder="搜索笔记..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-transparent text-sm text-slate-700 placeholder-slate-400 outline-none dark:text-slate-300"
          />
        </div>
      </div>

      {/* Notes List */}
      <div className="flex-1 overflow-y-auto px-2 py-1">
        <AnimatePresence>
          {filteredNotes.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-slate-400">
              <FileText size={32} className="mb-2 opacity-50" />
              <p className="text-sm">
                {notes.length === 0 ? '还没有笔记' : '没有匹配的笔记'}
              </p>
              {notes.length === 0 && (
                <button
                  onClick={handleCreate}
                  className="mt-2 text-xs text-indigo-500 hover:text-indigo-600 dark:text-indigo-400"
                >
                  创建第一篇笔记
                </button>
              )}
            </div>
          ) : (
            filteredNotes.map((note) => (
              <motion.div
                key={note.id}
                layout
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.15 }}
                onClick={() => setActiveNote(note.id)}
                className={cn(
                  'group relative mb-1 cursor-pointer rounded-lg px-3 py-2.5 transition-colors',
                  note.id === activeNoteId
                    ? 'bg-white shadow-sm dark:bg-slate-800'
                    : 'hover:bg-white/60 dark:hover:bg-slate-800/60'
                )}
              >
                {/* Active indicator */}
                {note.id === activeNoteId && (
                  <motion.div
                    layoutId="activeIndicator"
                    className="absolute left-0 top-1/2 h-6 w-1 -translate-y-1/2 rounded-r-full"
                    style={{ backgroundColor: 'var(--accent-color, #6366f1)' }}
                    transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                  />
                )}

                {/* Title */}
                {renamingId === note.id ? (
                  <div className="flex items-center gap-1" onClick={(e) => e.stopPropagation()}>
                    <input
                      ref={renameInputRef}
                      type="text"
                      value={renameValue}
                      onChange={(e) => setRenameValue(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') confirmRename()
                        if (e.key === 'Escape') cancelRename()
                      }}
                      className="w-full rounded border border-slate-300 bg-white px-2 py-0.5 text-sm text-slate-700 outline-none focus:border-indigo-500 dark:border-slate-600 dark:bg-slate-700 dark:text-slate-200"
                      autoFocus
                    />
                    <button
                      onClick={confirmRename}
                      className="shrink-0 rounded p-0.5 text-green-500 hover:bg-green-50 dark:hover:bg-green-900/20"
                    >
                      <Check size={14} />
                    </button>
                    <button
                      onClick={cancelRename}
                      className="shrink-0 rounded p-0.5 text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700"
                    >
                      <X size={14} />
                    </button>
                  </div>
                ) : (
                  <h3 className="truncate text-sm font-medium text-slate-800 dark:text-slate-200">
                    {note.title}
                  </h3>
                )}

                {/* Meta */}
                <p className="mt-0.5 text-xs text-slate-400 dark:text-slate-500">
                  {formatTime(note.updatedAt)}
                </p>

                {/* Actions */}
                {deletingId === note.id ? (
                  <div
                    className="absolute right-2 top-2 flex items-center gap-1 rounded-md bg-white px-2 py-1 shadow-lg dark:bg-slate-700"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <span className="text-xs text-slate-500 dark:text-slate-400">
                      确认删除?
                    </span>
                    <button
                      onClick={() => confirmDelete(note.id)}
                      className="rounded p-0.5 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20"
                    >
                      <Check size={14} />
                    </button>
                    <button
                      onClick={() => setDeletingId(null)}
                      className="rounded p-0.5 text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-600"
                    >
                      <X size={14} />
                    </button>
                  </div>
                ) : (
                  <div className="absolute right-2 top-2 hidden items-center gap-0.5 group-hover:flex">
                    <button
                      onClick={(e) => handleStartRename(note.id, note.title, e)}
                      className="rounded p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-600 dark:hover:bg-slate-700 dark:hover:text-slate-300"
                      title="重命名"
                    >
                      <FileText size={12} />
                    </button>
                    <button
                      onClick={(e) => handleDelete(note.id, e)}
                      className="rounded p-1 text-slate-400 hover:bg-red-50 hover:text-red-500 dark:hover:bg-red-900/20"
                      title="删除"
                    >
                      <Trash2 size={12} />
                    </button>
                  </div>
                )}
              </motion.div>
            ))
          )}
        </AnimatePresence>
      </div>

      {/* Footer */}
      <div className="border-t border-slate-200 px-4 py-2 dark:border-slate-700">
        <p className="text-xs text-slate-400 dark:text-slate-500">
          共 {notes.length} 篇笔记
        </p>
      </div>
    </motion.div>
  )
}
