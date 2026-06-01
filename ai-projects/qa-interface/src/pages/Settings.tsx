import { ArrowLeft, Moon, Sun, Trash2 } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useThemeStore } from '@/hooks/useTheme'
import { useChatStore } from '@/store/useChatStore'
import { cn } from '@/lib/utils'

export default function Settings() {
  const navigate = useNavigate()
  const isDark = useThemeStore((s) => s.isDark)
  const toggleTheme = useThemeStore((s) => s.toggleTheme)
  const conversations = useChatStore((s) => s.conversations)
  const deleteConversation = useChatStore((s) => s.deleteConversation)

  const handleClearAll = () => {
    if (window.confirm('确定要删除所有对话记录吗？此操作不可撤销。')) {
      conversations.forEach((conv) => deleteConversation(conv.id))
    }
  }

  return (
    <div className="flex flex-1 flex-col overflow-hidden">
      {/* 顶部导航 */}
      <div className="flex items-center gap-3 border-b border-slate-200 px-4 py-3 dark:border-slate-700">
        <button
          onClick={() => navigate('/')}
          className="flex h-9 w-9 items-center justify-center rounded-lg text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-700 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-slate-200"
        >
          <ArrowLeft className="h-5 w-5" />
        </button>
        <h2 className="text-lg font-semibold text-slate-800 dark:text-slate-200">设置</h2>
      </div>

      {/* 设置内容 */}
      <div className="flex-1 overflow-y-auto">
        <div className="mx-auto max-w-2xl space-y-6 p-6">
          {/* 外观设置 */}
          <section>
            <h3 className="mb-3 text-sm font-medium uppercase tracking-wider text-slate-500 dark:text-slate-400">
              外观
            </h3>
            <div className="rounded-xl border border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-800">
              <div className="flex items-center justify-between p-4">
                <div className="flex items-center gap-3">
                  {isDark ? (
                    <Moon className="h-5 w-5 text-blue-400" />
                  ) : (
                    <Sun className="h-5 w-5 text-amber-500" />
                  )}
                  <div>
                    <p className="text-sm font-medium text-slate-800 dark:text-slate-200">
                      {isDark ? '暗色模式' : '亮色模式'}
                    </p>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      切换应用的显示主题
                    </p>
                  </div>
                </div>
                <button
                  onClick={toggleTheme}
                  className={cn(
                    'relative h-7 w-12 rounded-full transition-colors duration-300',
                    isDark ? 'bg-blue-500' : 'bg-slate-300'
                  )}
                >
                  <span
                    className={cn(
                      'absolute top-0.5 left-0.5 h-6 w-6 rounded-full bg-white shadow transition-transform duration-300',
                      isDark ? 'translate-x-5' : 'translate-x-0'
                    )}
                  />
                </button>
              </div>
            </div>
          </section>

          {/* 数据管理 */}
          <section>
            <h3 className="mb-3 text-sm font-medium uppercase tracking-wider text-slate-500 dark:text-slate-400">
              数据管理
            </h3>
            <div className="rounded-xl border border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-800">
              <div className="flex items-center justify-between p-4">
                <div className="flex items-center gap-3">
                  <Trash2 className="h-5 w-5 text-red-400" />
                  <div>
                    <p className="text-sm font-medium text-slate-800 dark:text-slate-200">
                      清除所有对话
                    </p>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      删除所有对话记录（{conversations.length} 条）
                    </p>
                  </div>
                </div>
                <button
                  onClick={handleClearAll}
                  disabled={conversations.length === 0}
                  className={cn(
                    'rounded-lg px-3 py-1.5 text-sm font-medium transition-colors',
                    conversations.length > 0
                      ? 'bg-red-50 text-red-600 hover:bg-red-100 dark:bg-red-900/20 dark:text-red-400 dark:hover:bg-red-900/40'
                      : 'cursor-not-allowed bg-slate-50 text-slate-300 dark:bg-slate-800 dark:text-slate-600'
                  )}
                >
                  清除
                </button>
              </div>
            </div>
          </section>

          {/* 关于 */}
          <section>
            <h3 className="mb-3 text-sm font-medium uppercase tracking-wider text-slate-500 dark:text-slate-400">
              关于
            </h3>
            <div className="rounded-xl border border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-800">
              <div className="p-4">
                <p className="text-sm font-medium text-slate-800 dark:text-slate-200">
                  智能问答助手
                </p>
                <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                  版本 1.0.0
                </p>
                <p className="mt-2 text-xs text-slate-500 dark:text-slate-400">
                  基于 React + TypeScript + Vite 构建，使用 Zustand 进行状态管理，
                  Tailwind CSS 进行样式设计。所有对话数据存储在浏览器本地。
                </p>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  )
}
