import { useState, useRef, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { GripVertical, Trash2 } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useTaskStore } from '@/store/useTaskStore'
import type { Task } from '@/types'

interface TaskCardProps {
  task: Task
}

export default function TaskCard({ task }: TaskCardProps) {
  const { toggleTask, removeTask, updateTask } = useTaskStore()
  const [isEditing, setIsEditing] = useState(false)
  const [editValue, setEditValue] = useState(task.content)
  const inputRef = useRef<HTMLInputElement>(null)

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: task.id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  }

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus()
      inputRef.current.select()
    }
  }, [isEditing])

  const handleDoubleClick = () => {
    setIsEditing(true)
    setEditValue(task.content)
  }

  const handleSave = () => {
    const trimmed = editValue.trim()
    if (trimmed) {
      updateTask(task.id, trimmed)
    } else {
      setEditValue(task.content)
    }
    setIsEditing(false)
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSave()
    } else if (e.key === 'Escape') {
      setEditValue(task.content)
      setIsEditing(false)
    }
  }

  const formatTime = (iso: string) => {
    const date = new Date(iso)
    const now = new Date()
    const isToday =
      date.getDate() === now.getDate() &&
      date.getMonth() === now.getMonth() &&
      date.getFullYear() === now.getFullYear()

    if (isToday) {
      return date.toLocaleTimeString('zh-CN', {
        hour: '2-digit',
        minute: '2-digit',
      })
    }
    return date.toLocaleDateString('zh-CN', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, x: -100, scale: 0.95, transition: { duration: 0.2 } }}
      ref={setNodeRef}
      style={style}
      className={cn(
        'group flex items-center gap-3 rounded-xl border bg-white px-4 py-3 shadow-sm transition-shadow dark:bg-slate-800',
        isDragging && 'z-50 opacity-60 shadow-lg ring-2 ring-blue-400 dark:ring-blue-500',
        task.completed && 'opacity-60'
      )}
    >
      {/* Drag handle */}
      <button
        className="cursor-grab text-slate-300 hover:text-slate-500 dark:text-slate-600 dark:hover:text-slate-400 touch-none"
        {...attributes}
        {...listeners}
      >
        <GripVertical className="w-4 h-4" />
      </button>

      {/* Checkbox */}
      <button
        onClick={() => toggleTask(task.id)}
        className={cn(
          'flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2 transition-colors',
          task.completed
            ? 'border-green-500 bg-green-500 text-white'
            : 'border-slate-300 hover:border-green-400 dark:border-slate-600 dark:hover:border-green-400'
        )}
      >
        {task.completed && (
          <motion.svg
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="w-3 h-3"
            viewBox="0 0 12 12"
          >
            <path
              d="M2 6l3 3 5-5"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </motion.svg>
        )}
      </button>

      {/* Content */}
      <div className="flex-1 min-w-0">
        {isEditing ? (
          <input
            ref={inputRef}
            value={editValue}
            onChange={(e) => setEditValue(e.target.value)}
            onBlur={handleSave}
            onKeyDown={handleKeyDown}
            className="w-full rounded-lg border border-blue-300 bg-transparent px-2 py-1 text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 dark:border-blue-600 dark:focus:border-blue-400"
          />
        ) : (
          <p
            onDoubleClick={handleDoubleClick}
            className={cn(
              'text-sm leading-relaxed cursor-default select-none',
              task.completed && 'line-through text-slate-400 dark:text-slate-500'
            )}
          >
            {task.content}
          </p>
        )}
        <p className="mt-0.5 text-xs text-slate-400 dark:text-slate-500">
          {formatTime(task.createdAt)}
        </p>
      </div>

      {/* Delete button */}
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => removeTask(task.id)}
        className="shrink-0 rounded-lg p-1.5 text-slate-300 opacity-0 transition-opacity hover:bg-red-50 hover:text-red-500 group-hover:opacity-100 dark:text-slate-600 dark:hover:bg-red-950 dark:hover:text-red-400"
      >
        <Trash2 className="w-4 h-4" />
      </motion.button>
    </motion.div>
  )
}
