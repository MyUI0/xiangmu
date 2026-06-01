import { motion } from 'framer-motion'
import { FileText, Plus } from 'lucide-react'
import { useNoteStore } from '@/store/useNoteStore'

export default function Empty() {
  const createNote = useNoteStore((s) => s.createNote)

  return (
    <div className="flex flex-1 flex-col items-center justify-center text-slate-400 dark:text-slate-500">
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
        className="flex flex-col items-center"
      >
        <div className="mb-4 rounded-full bg-slate-100 p-6 dark:bg-slate-800">
          <FileText size={48} className="text-slate-300 dark:text-slate-600" />
        </div>
        <h3 className="mb-1 text-lg font-medium text-slate-500 dark:text-slate-400">
          开始记录你的想法
        </h3>
        <p className="mb-6 text-sm text-slate-400 dark:text-slate-500">
          选择一篇笔记或创建新笔记开始编辑
        </p>
        <button
          onClick={createNote}
          className="flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium text-white transition-colors"
          style={{ backgroundColor: 'var(--accent-color, #6366f1)' }}
        >
          <Plus size={16} />
          新建笔记
        </button>
      </motion.div>
    </div>
  )
}
