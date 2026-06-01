import { motion, AnimatePresence } from 'framer-motion'
import { ListTodo, Circle, CheckCircle2 } from 'lucide-react'
import { useTaskStore } from '@/store/useTaskStore'

function StatItem({
  icon: Icon,
  label,
  value,
  color,
}: {
  icon: typeof ListTodo
  label: string
  value: number
  color: string
}) {
  return (
    <div className="flex items-center gap-2">
      <div className={`flex items-center justify-center rounded-lg p-1.5 ${color}`}>
        <Icon className="w-4 h-4" />
      </div>
      <div>
        <AnimatePresence mode="popLayout">
          <motion.span
            key={value}
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="block text-lg font-bold leading-none"
          >
            {value}
          </motion.span>
        </AnimatePresence>
        <span className="text-xs text-slate-500 dark:text-slate-400">{label}</span>
      </div>
    </div>
  )
}

export default function StatsBar() {
  const tasks = useTaskStore((s) => s.tasks)
  const total = tasks.length
  const active = tasks.filter((t) => !t.completed).length
  const completed = tasks.filter((t) => t.completed).length

  return (
    <div className="flex items-center justify-center gap-6">
      <StatItem
        icon={ListTodo}
        label="总数"
        value={total}
        color="bg-blue-100 text-blue-600 dark:bg-blue-900 dark:text-blue-400"
      />
      <StatItem
        icon={Circle}
        label="待办"
        value={active}
        color="bg-amber-100 text-amber-600 dark:bg-amber-900 dark:text-amber-400"
      />
      <StatItem
        icon={CheckCircle2}
        label="已完成"
        value={completed}
        color="bg-green-100 text-green-600 dark:bg-green-900 dark:text-green-400"
      />
    </div>
  )
}
