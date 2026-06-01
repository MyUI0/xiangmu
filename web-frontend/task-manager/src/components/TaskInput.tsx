import { useState } from 'react'
import { Plus } from 'lucide-react'
import { useTaskStore } from '@/store/useTaskStore'

export default function TaskInput() {
  const [value, setValue] = useState('')
  const addTask = useTaskStore((s) => s.addTask)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const trimmed = value.trim()
    if (trimmed) {
      addTask(trimmed)
      setValue('')
    }
  }

  return (
    <form onSubmit={handleSubmit} className="relative">
      <div className="flex items-center gap-3 rounded-xl border border-slate-200 bg-white px-4 py-3 shadow-sm transition-colors focus-within:border-blue-400 focus-within:ring-2 focus-within:ring-blue-100 dark:border-slate-700 dark:bg-slate-800 dark:focus-within:border-blue-500 dark:focus-within:ring-blue-900">
        <Plus className="w-5 h-5 shrink-0 text-slate-400" />
        <input
          type="text"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder="添加新任务，按回车确认..."
          className="flex-1 bg-transparent text-sm outline-none placeholder:text-slate-400 dark:placeholder:text-slate-500"
        />
      </div>
    </form>
  )
}
