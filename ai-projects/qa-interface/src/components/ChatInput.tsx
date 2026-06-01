import { useState, useRef, useEffect, type KeyboardEvent } from 'react'
import { Send } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useChatStore } from '@/store/useChatStore'

export default function ChatInput() {
  const [value, setValue] = useState('')
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const isTyping = useChatStore((s) => s.isTyping)
  const addMessage = useChatStore((s) => s.addMessage)

  // 自动调整高度
  useEffect(() => {
    const textarea = textareaRef.current
    if (textarea) {
      textarea.style.height = 'auto'
      textarea.style.height = Math.min(textarea.scrollHeight, 200) + 'px'
    }
  }, [value])

  const handleSend = () => {
    const trimmed = value.trim()
    if (!trimmed || isTyping) return
    addMessage(trimmed)
    setValue('')
  }

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.ctrlKey && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  return (
    <div className="border-t border-slate-200 bg-white p-4 dark:border-slate-700 dark:bg-slate-900">
      <div className="mx-auto flex max-w-3xl items-end gap-3">
        <div className="relative flex-1">
          <textarea
            ref={textareaRef}
            value={value}
            onChange={(e) => setValue(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="输入你的问题... (Enter 发送, Ctrl+Enter 换行)"
            rows={1}
            disabled={isTyping}
            className={cn(
              'w-full resize-none rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm',
              'text-slate-900 placeholder-slate-400',
              'transition-colors focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-100',
              'dark:border-slate-600 dark:bg-slate-800 dark:text-slate-100 dark:placeholder-slate-500',
              'dark:focus:border-blue-500 dark:focus:ring-blue-900',
              'disabled:cursor-not-allowed disabled:opacity-60'
            )}
          />
        </div>
        <button
          onClick={handleSend}
          disabled={!value.trim() || isTyping}
          className={cn(
            'flex h-11 w-11 shrink-0 items-center justify-center rounded-xl transition-all',
            value.trim() && !isTyping
              ? 'bg-blue-500 text-white shadow-md hover:bg-blue-600 active:scale-95'
              : 'bg-slate-100 text-slate-400 dark:bg-slate-800 dark:text-slate-600'
          )}
        >
          <Send className="h-4 w-4" />
        </button>
      </div>
    </div>
  )
}
