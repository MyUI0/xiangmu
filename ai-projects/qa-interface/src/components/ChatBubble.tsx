import { motion } from 'framer-motion'
import { Bot, User } from 'lucide-react'
import type { Message } from '@/types'
import { cn } from '@/lib/utils'

interface ChatBubbleProps {
  message: Message
}

export default function ChatBubble({ message }: ChatBubbleProps) {
  const isUser = message.role === 'user'

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: 'easeOut' }}
      className={cn('flex w-full gap-3', isUser ? 'flex-row-reverse' : 'flex-row')}
    >
      {/* Avatar */}
      <div
        className={cn(
          'flex h-8 w-8 shrink-0 items-center justify-center rounded-full',
          isUser
            ? 'bg-blue-500 text-white'
            : 'bg-slate-200 text-slate-600 dark:bg-slate-700 dark:text-slate-300'
        )}
      >
        {isUser ? <User className="h-4 w-4" /> : <Bot className="h-4 w-4" />}
      </div>

      {/* Bubble */}
      <div
        className={cn(
          'max-w-[75%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed whitespace-pre-wrap break-words',
          isUser
            ? 'rounded-tr-md bg-blue-500 text-white'
            : 'rounded-tl-md bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-200'
        )}
      >
        {message.content}
        {/* 打字光标 */}
        {!isUser && message.content === '' && (
          <span className="ml-0.5 inline-block h-4 w-0.5 animate-pulse bg-slate-400 align-middle" />
        )}
      </div>
    </motion.div>
  )
}
