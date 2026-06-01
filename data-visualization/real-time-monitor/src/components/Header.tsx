import { Link, useLocation } from 'react-router-dom'
import { Activity, BarChart3, Bell } from 'lucide-react'

export default function Header() {
  const location = useLocation()

  const navItems = [
    { path: '/', label: '仪表板', icon: Activity },
    { path: '/analytics', label: '数据分析', icon: BarChart3 },
    { path: '/alerts', label: '报警管理', icon: Bell },
  ]

  return (
    <header className="sticky top-0 z-50 backdrop-blur-xl bg-slate-950/80 border-b border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center gap-2">
            <Activity className="w-6 h-6 text-cyan-400" />
            <span className="text-xl font-bold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
              实时监控
            </span>
          </Link>

          <nav className="flex items-center gap-1">
            {navItems.map(({ path, label, icon: Icon }) => (
              <Link
                key={path}
                to={path}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  location.pathname === path
                    ? 'bg-cyan-500/10 text-cyan-400'
                    : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200'
                }`}
              >
                <Icon className="w-4 h-4" />
                {label}
              </Link>
            ))}
          </nav>
        </div>
      </div>
    </header>
  )
}
