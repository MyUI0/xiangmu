import { Link, useLocation } from 'react-router-dom'
import { Sparkles, User, Moon, Sun } from 'lucide-react'
import { useTheme } from '@/hooks/useTheme'

export default function Header() {
  const location = useLocation()
  const { toggleTheme, isDark } = useTheme()

  const navItems = [
    { path: '/', label: '首页', icon: Sparkles },
    { path: '/profile', label: '个人中心', icon: User },
  ]

  return (
    <header className="sticky top-0 z-50 backdrop-blur-xl bg-white/80 dark:bg-slate-900/80 border-b border-slate-200 dark:border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center gap-2">
            <Sparkles className="w-6 h-6 text-indigo-500" />
            <span className="text-xl font-bold bg-gradient-to-r from-indigo-500 to-purple-500 bg-clip-text text-transparent">
              智能推荐
            </span>
          </Link>

          <nav className="flex items-center gap-1">
            {navItems.map(({ path, label, icon: Icon }) => (
              <Link
                key={path}
                to={path}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  location.pathname === path
                    ? 'bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400'
                    : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                <Icon className="w-4 h-4" />
                {label}
              </Link>
            ))}
            <button
              onClick={toggleTheme}
              className="ml-2 p-2 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>
          </nav>
        </div>
      </div>
    </header>
  )
}
