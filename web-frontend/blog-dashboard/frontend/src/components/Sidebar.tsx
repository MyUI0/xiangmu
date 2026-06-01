import { Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, FileText, Users, Settings, BookOpen } from 'lucide-react';

const navItems = [
  { path: '/', label: '仪表盘', icon: LayoutDashboard },
  { path: '/articles', label: '文章管理', icon: FileText },
  { path: '/categories', label: '分类管理', icon: BookOpen },
  { path: '/users', label: '用户管理', icon: Users },
  { path: '/settings', label: '系统设置', icon: Settings },
];

export default function Sidebar() {
  const location = useLocation();

  return (
    <div className="w-64 bg-slate-900 text-white min-h-screen fixed left-0 top-0">
      <div className="p-6 border-b border-slate-700">
        <h1 className="text-xl font-bold flex items-center gap-2">
          <LayoutDashboard className="w-6 h-6 text-blue-400" />
          Blog Admin
        </h1>
      </div>
      <nav className="p-4">
        <ul className="space-y-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            return (
              <li key={item.path}>
                <Link
                  to={item.path}
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                    isActive
                      ? 'bg-blue-600 text-white'
                      : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span className="font-medium">{item.label}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </div>
  );
}
