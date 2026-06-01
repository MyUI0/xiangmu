import { motion } from 'framer-motion'
import { Sun, Moon, CheckSquare } from 'lucide-react'
import { useTheme } from '@/hooks/useTheme'

export default function Header() {
  const { isDark, toggleTheme } = useTheme()

  return (
    <header className="flex items-center justify-between">
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-green-400 to-emerald-600 shadow-lg shadow-green-200 dark:shadow-green-900">
          <CheckSquare className="w-5 h-5 text-white" />
        </div>
        <div>
          <h1 className="text-xl font-bold tracking-tight">任务管理器</h1>
          <p className="text-xs text-slate-500 dark:text-slate-400">管理你的日常任务</p>
        </div>
      </div>

      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={toggleTheme}
        className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-600 shadow-sm transition-colors hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-400 dark:hover:bg-slate-700"
      >
        <motion.div
          initial={false}
          animate={{ rotate: isDark ? 180 : 0 }}
          transition={{ duration: 0.3 }}
        >
          {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
        </motion.div>
      </motion.button>
    </header>
  )
}
