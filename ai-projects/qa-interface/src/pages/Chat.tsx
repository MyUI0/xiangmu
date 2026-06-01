import { useRef, useEffect } from 'react'
import { useChatStore } from '@/store/useChatStore'
import Empty from '@/components/Empty'
import ChatBubble from '@/components/ChatBubble'
import ChatInput from '@/components/ChatInput'

export default function Chat() {
  const conversations = useChatStore((s) => s.conversations)
  const activeConversationId = useChatStore((s) => s.activeConversationId)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const activeConversation = conversations.find((c) => c.id === activeConversationId)
  const messages = activeConversation?.messages ?? []

  // 自动滚动到底部
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages.length, messages[messages.length - 1]?.content])

  return (
    <div className="flex flex-1 flex-col overflow-hidden">
      {/* 消息区域 */}
      <div className="flex-1 overflow-y-auto">
        {messages.length === 0 ? (
          <Empty />
        ) : (
          <div className="mx-auto max-w-3xl space-y-4 p-4">
            {messages.map((message) => (
              <ChatBubble key={message.id} message={message} />
            ))}
            <div ref={messagesEndRef} />
          </div>
        )}
      </div>

      {/* 输入区域 */}
      <ChatInput />
    </div>
  )
}
