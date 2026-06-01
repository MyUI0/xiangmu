import { motion } from 'framer-motion'
import { ListFilter, Circle, CheckCircle2 } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useTaskStore } from '@/store/useTaskStore'
import type { FilterType } from '@/types'

const filters: { key: FilterType; label: string; icon: typeof ListFilter }[] = [
  { key: 'all', label: '全部', icon: ListFilter },
  { key: 'active', label: '待办', icon: Circle },
  { key: 'completed', label: '已完成', icon: CheckCircle2 },
]

export default function TaskFilters() {
  const filter = useTaskStore((s) => s.filter)
  const setFilter = useTaskStore((s) => s.setFilter)

  return (
    <div className="flex gap-1 rounded-xl bg-slate-100 p-1 dark:bg-slate-800">
      {filters.map(({ key, label, icon: Icon }) => (
        <button
          key={key}
          onClick={() => setFilter(key)}
          className={cn(
            'relative flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium transition-colors',
            filter === key
              ? 'text-slate-900 dark:text-slate-100'
              : 'text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-300'
          )}
        >
          {filter === key && (
            <motion.div
              layoutId="activeFilter"
              className="absolute inset-0 rounded-lg bg-white shadow-sm dark:bg-slate-700"
              transition={{ type: 'spring', stiffness: 400, damping: 30 }}
            />
          )}
          <span className="relative z-10 flex items-center gap-1.5">
            <Icon className="w-3.5 h-3.5" />
            {label}
          </span>
        </button>
      ))}
    </div>
  )
}
