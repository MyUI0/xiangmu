import { Menu, Settings, Moon, Sun } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useThemeStore } from '@/hooks/useTheme'
import { cn } from '@/lib/utils'

interface HeaderProps {
  onToggleSidebar: () => void
}

export default function Header({ onToggleSidebar }: HeaderProps) {
  const navigate = useNavigate()
  const isDark = useThemeStore((s) => s.isDark)
  const toggleTheme = useThemeStore((s) => s.toggleTheme)

  return (
    <header className="flex h-14 items-center justify-between border-b border-slate-200 bg-white px-4 dark:border-slate-700 dark:bg-slate-900">
      <div className="flex items-center gap-2">
        <button
          onClick={onToggleSidebar}
          className="flex h-9 w-9 items-center justify-center rounded-lg text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-700 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-slate-200"
          title="切换侧边栏"
        >
          <Menu className="h-5 w-5" />
        </button>
        <h1 className="text-lg font-bold text-slate-800 dark:text-slate-200">
          智能问答
        </h1>
      </div>

      <div className="flex items-center gap-1">
        <button
          onClick={toggleTheme}
          className={cn(
            'flex h-9 w-9 items-center justify-center rounded-lg transition-colors',
            'text-slate-500 hover:bg-slate-100 hover:text-slate-700',
            'dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-slate-200'
          )}
          title={isDark ? '切换到亮色模式' : '切换到暗色模式'}
        >
          {isDark ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
        </button>
        <button
          onClick={() => navigate('/settings')}
          className={cn(
            'flex h-9 w-9 items-center justify-center rounded-lg transition-colors',
            'text-slate-500 hover:bg-slate-100 hover:text-slate-700',
            'dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-slate-200'
          )}
          title="设置"
        >
          <Settings className="h-5 w-5" />
        </button>
      </div>
    </header>
  )
}
