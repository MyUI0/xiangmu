import { motion, AnimatePresence } from 'framer-motion'
import { X, Sun, Moon, Monitor } from 'lucide-react'
import { useNoteStore } from '@/store/useNoteStore'
import type { ThemeMode } from '@/types'
import { cn } from '@/lib/utils'

interface SettingsModalProps {
  open: boolean
  onClose: () => void
}

const accentColors = [
  { name: '靛蓝', value: '#6366f1' },
  { name: '紫罗兰', value: '#8b5cf6' },
  { name: '玫红', value: '#ec4899' },
  { name: '红色', value: '#ef4444' },
  { name: '橙色', value: '#f97316' },
  { name: '琥珀', value: '#f59e0b' },
  { name: '翠绿', value: '#10b981' },
  { name: '青色', value: '#06b6d4' },
]

const themeOptions: { value: ThemeMode; label: string; icon: React.ElementType }[] = [
  { value: 'light', label: '浅色', icon: Sun },
  { value: 'dark', label: '深色', icon: Moon },
  { value: 'system', label: '跟随系统', icon: Monitor },
]

export default function SettingsModal({ open, onClose }: SettingsModalProps) {
  const theme = useNoteStore((s) => s.theme)
  const accentColor = useNoteStore((s) => s.accentColor)
  const setTheme = useNoteStore((s) => s.setTheme)
  const setAccentColor = useNoteStore((s) => s.setAccentColor)

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/40"
            onClick={onClose}
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="fixed left-1/2 top-1/2 z-50 w-full max-w-md -translate-x-1/2 -translate-y-1/2 rounded-xl bg-white p-6 shadow-2xl dark:bg-slate-800"
          >
            {/* Header */}
            <div className="mb-6 flex items-center justify-between">
              <h2 className="text-lg font-semibold text-slate-800 dark:text-slate-200">
                设置
              </h2>
              <button
                onClick={onClose}
                className="rounded-lg p-1.5 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-600 dark:hover:bg-slate-700 dark:hover:text-slate-300"
              >
                <X size={18} />
              </button>
            </div>

            {/* Theme */}
            <div className="mb-6">
              <h3 className="mb-3 text-sm font-medium text-slate-600 dark:text-slate-400">
                主题模式
              </h3>
              <div className="grid grid-cols-3 gap-2">
                {themeOptions.map(({ value, label, icon: Icon }) => (
                  <button
                    key={value}
                    onClick={() => setTheme(value)}
                    className={cn(
                      'flex flex-col items-center gap-2 rounded-lg border-2 px-3 py-3 transition-colors',
                      theme === value
                        ? 'border-indigo-500 bg-indigo-50 text-indigo-600 dark:border-indigo-400 dark:bg-indigo-900/20 dark:text-indigo-400'
                        : 'border-slate-200 text-slate-600 hover:border-slate-300 hover:bg-slate-50 dark:border-slate-600 dark:text-slate-400 dark:hover:border-slate-500 dark:hover:bg-slate-700'
                    )}
                  >
                    <Icon size={20} />
                    <span className="text-xs font-medium">{label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Accent Color */}
            <div>
              <h3 className="mb-3 text-sm font-medium text-slate-600 dark:text-slate-400">
                强调色
              </h3>
              <div className="flex flex-wrap gap-3">
                {accentColors.map((color) => (
                  <button
                    key={color.value}
                    onClick={() => setAccentColor(color.value)}
                    className="group flex flex-col items-center gap-1.5"
                    title={color.name}
                  >
                    <div
                      className={cn(
                        'h-8 w-8 rounded-full transition-transform group-hover:scale-110',
                        accentColor === color.value && 'ring-2 ring-offset-2 ring-offset-white dark:ring-offset-slate-800'
                      )}
                      style={{
                        backgroundColor: color.value,
                        ...(accentColor === color.value
                          ? { ringColor: color.value }
                          : {}),
                      }}
                    />
                    <span className="text-xs text-slate-500 dark:text-slate-400">
                      {color.name}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
