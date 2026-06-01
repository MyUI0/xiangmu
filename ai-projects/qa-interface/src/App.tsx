import { useState, useEffect } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { useThemeStore } from '@/hooks/useTheme'
import Sidebar from '@/components/Sidebar'
import Header from '@/components/Header'
import Chat from '@/pages/Chat'
import Settings from '@/pages/Settings'

export default function App() {
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const setTheme = useThemeStore((s) => s.setTheme)
  const isDark = useThemeStore((s) => s.isDark)

  // 初始化主题
  useEffect(() => {
    setTheme(isDark)
  }, [])

  // 响应式侧边栏：桌面端默认展开，移动端默认收起
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setSidebarOpen(false)
      } else {
        setSidebarOpen(true)
      }
    }
    handleResize()
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  return (
    <BrowserRouter>
      <div className="flex h-screen overflow-hidden bg-white dark:bg-slate-900">
        <Sidebar
          isOpen={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
        />
        <div className="flex flex-1 flex-col overflow-hidden">
          <Header
            onToggleSidebar={() => setSidebarOpen((prev) => !prev)}
          />
          <Routes>
            <Route path="/" element={<Chat />} />
            <Route path="/settings" element={<Settings />} />
          </Routes>
        </div>
      </div>
    </BrowserRouter>
  )
}
