import { useState, useCallback } from 'react'
import { AnimatePresence } from 'framer-motion'
import { Settings, PanelLeft } from 'lucide-react'
import { useNoteStore } from '@/store/useNoteStore'
import { stripHtml } from '@/lib/utils'
import Sidebar from '@/components/Sidebar'
import Toolbar from '@/components/Toolbar'
import Editor from '@/components/Editor'
import StatusBar from '@/components/StatusBar'
import Empty from '@/components/Empty'
import SettingsModal from '@/components/SettingsModal'

export default function Home() {
  const activeNoteId = useNoteStore((s) => s.activeNoteId)
  const notes = useNoteStore((s) => s.notes)
  const sidebarOpen = useNoteStore((s) => s.sidebarOpen)
  const toggleSidebar = useNoteStore((s) => s.toggleSidebar)

  const [settingsOpen, setSettingsOpen] = useState(false)

  const handleStatsUpdate = useCallback((words: number, chars: number) => {
    window.dispatchEvent(
      new CustomEvent('editor-stats', { detail: { words, chars } })
    )
  }, [])

  const handleExportTxt = useCallback(() => {
    const note = notes.find((n) => n.id === activeNoteId)
    if (!note) return

    const text = stripHtml(note.content)
    const blob = new Blob([text], { type: 'text/plain;charset=utf-8' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${note.title}.txt`
    a.click()
    URL.revokeObjectURL(url)
  }, [notes, activeNoteId])

  const handleExportHtml = useCallback(() => {
    const note = notes.find((n) => n.id === activeNoteId)
    if (!note) return

    const html = `<!DOCTYPE html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${note.title}</title>
  <style>
    body {
      max-width: 800px;
      margin: 2rem auto;
      padding: 0 1rem;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      line-height: 1.8;
      color: #1e293b;
    }
    h1 { font-size: 1.5rem; font-weight: 700; }
    h2 { font-size: 1.25rem; font-weight: 600; }
    blockquote { border-left: 3px solid #6366f1; padding-left: 1rem; opacity: 0.8; }
    ul, ol { padding-left: 1.5rem; }
  </style>
</head>
<body>
  <h1>${note.title}</h1>
  <div>${note.content}</div>
</body>
</html>`

    const blob = new Blob([html], { type: 'text/html;charset=utf-8' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${note.title}.html`
    a.click()
    URL.revokeObjectURL(url)
  }, [notes, activeNoteId])

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-white dark:bg-slate-800">
      {/* Sidebar */}
      <AnimatePresence>
        {sidebarOpen && <Sidebar />}
      </AnimatePresence>

      {/* Main Content */}
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Top bar */}
        <div className="flex items-center justify-between border-b border-slate-200 bg-white px-3 py-1 dark:border-slate-700 dark:bg-slate-800">
          <div className="flex items-center gap-1">
            {!sidebarOpen && (
              <button
                onClick={toggleSidebar}
                className="rounded-md p-1.5 text-slate-500 transition-colors hover:bg-slate-200 hover:text-slate-700 dark:text-slate-400 dark:hover:bg-slate-700 dark:hover:text-slate-200"
                title="展开侧边栏"
              >
                <PanelLeft size={18} />
              </button>
            )}
          </div>
          <button
            onClick={() => setSettingsOpen(true)}
            className="rounded-md p-1.5 text-slate-500 transition-colors hover:bg-slate-200 hover:text-slate-700 dark:text-slate-400 dark:hover:bg-slate-700 dark:hover:text-slate-200"
            title="设置"
          >
            <Settings size={18} />
          </button>
        </div>

        {/* Toolbar */}
        {activeNoteId && (
          <Toolbar onExportTxt={handleExportTxt} onExportHtml={handleExportHtml} />
        )}

        {/* Editor or Empty */}
        {activeNoteId ? (
          <Editor onStatsUpdate={handleStatsUpdate} />
        ) : (
          <Empty />
        )}

        {/* Status Bar */}
        <StatusBar />
      </div>

      {/* Settings Modal */}
      <SettingsModal open={settingsOpen} onClose={() => setSettingsOpen(false)} />
    </div>
  )
}
