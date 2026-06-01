import { motion, AnimatePresence } from 'framer-motion'
import { Plus, Trash2, X, MessageSquare } from 'lucide-react'
import { useChatStore } from '@/store/useChatStore'
import { cn } from '@/lib/utils'

interface SidebarProps {
  isOpen: boolean
  onClose: () => void
}

function formatTime(timestamp: number): string {
  const date = new Date(timestamp)
  const now = new Date()
  const isToday =
    date.getFullYear() === now.getFullYear() &&
    date.getMonth() === now.getMonth() &&
    date.getDate() === now.getDate()

  if (isToday) {
    return date.toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' })
  }

  const yesterday = new Date(now)
  yesterday.setDate(yesterday.getDate() - 1)
  const isYesterday =
    date.getFullYear() === yesterday.getFullYear() &&
    date.getMonth() === yesterday.getMonth() &&
    date.getDate() === yesterday.getDate()

  if (isYesterday) {
    return '昨天'
  }

  return date.toLocaleDateString('zh-CN', { month: 'short', day: 'numeric' })
}

export default function Sidebar({ isOpen, onClose }: SidebarProps) {
  const conversations = useChatStore((s) => s.conversations)
  const activeConversationId = useChatStore((s) => s.activeConversationId)
  const createConversation = useChatStore((s) => s.createConversation)
  const deleteConversation = useChatStore((s) => s.deleteConversation)
  const setActiveConversation = useChatStore((s) => s.setActiveConversation)

  const handleNew = () => {
    createConversation()
    onClose()
  }

  const handleSelect = (id: string) => {
    setActiveConversation(id)
    onClose()
  }

  const handleDelete = (e: React.MouseEvent, id: string) => {
    e.stopPropagation()
    deleteConversation(id)
  }

  return (
    <>
      {/* 遮罩层（移动端） */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-40 bg-black/50 md:hidden"
            onClick={onClose}
          />
        )}
      </AnimatePresence>

      {/* 侧边栏 */}
      <motion.aside
        initial={false}
        animate={{ x: isOpen ? 0 : -280 }}
        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        className={cn(
          'fixed left-0 top-0 z-50 flex h-full w-[280px] flex-col',
          'border-r border-slate-200 bg-slate-50 dark:border-slate-700 dark:bg-slate-950',
          'md:relative md:z-auto'
        )}
      >
        {/* 头部 */}
        <div className="flex items-center justify-between border-b border-slate-200 px-4 py-3 dark:border-slate-700">
          <h2 className="text-base font-semibold text-slate-800 dark:text-slate-200">
            对话历史
          </h2>
          <div className="flex items-center gap-1">
            <button
              onClick={handleNew}
              className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-500 transition-colors hover:bg-slate-200 hover:text-slate-700 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-slate-200"
              title="新建对话"
            >
              <Plus className="h-4 w-4" />
            </button>
            <button
              onClick={onClose}
              className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-500 transition-colors hover:bg-slate-200 hover:text-slate-700 md:hidden dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-slate-200"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* 对话列表 */}
        <div className="flex-1 overflow-y-auto p-2">
          {conversations.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-slate-400 dark:text-slate-600">
              <MessageSquare className="mb-3 h-10 w-10" />
              <p className="text-sm">暂无对话</p>
              <p className="mt-1 text-xs">点击 + 开始新对话</p>
            </div>
          ) : (
            <div className="flex flex-col gap-1">
              {conversations.map((conv) => (
                <motion.div
                  key={conv.id}
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.99 }}
                  onClick={() => handleSelect(conv.id)}
                  className={cn(
                    'group flex cursor-pointer items-start gap-3 rounded-lg px-3 py-2.5 transition-colors',
                    conv.id === activeConversationId
                      ? 'bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300'
                      : 'text-slate-700 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800'
                  )}
                >
                  <MessageSquare className="mt-0.5 h-4 w-4 shrink-0 opacity-60" />
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium">{conv.title}</p>
                    <p className="mt-0.5 text-xs opacity-60">{formatTime(conv.updatedAt)}</p>
                  </div>
                  <button
                    onClick={(e) => handleDelete(e, conv.id)}
                    className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded opacity-0 transition-opacity group-hover:opacity-100 hover:bg-red-100 hover:text-red-500 dark:hover:bg-red-900/30 dark:hover:text-red-400"
                    title="删除对话"
                  >
                    <Trash2 className="h-3 w-3" />
                  </button>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </motion.aside>
    </>
  )
}
