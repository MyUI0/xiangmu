import { useState, useEffect } from 'react'
import { useNoteStore } from '@/store/useNoteStore'
import { getCurrentTime } from '@/lib/utils'

export default function StatusBar() {
  const activeNoteId = useNoteStore((s) => s.activeNoteId)
  const [currentTime, setCurrentTime] = useState(getCurrentTime())
  const [wordCount, setWordCount] = useState(0)
  const [charCount, setCharCount] = useState(0)

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(getCurrentTime())
    }, 1000)
    return () => clearInterval(timer)
  }, [])

  // 暴露更新方法
  useEffect(() => {
    // 通过自定义事件接收统计更新
    const handler = (e: Event) => {
      const detail = (e as CustomEvent).detail
      setWordCount(detail.words)
      setCharCount(detail.chars)
    }
    window.addEventListener('editor-stats', handler)
    return () => window.removeEventListener('editor-stats', handler)
  }, [])

  return (
    <div className="flex items-center justify-between border-t border-slate-200 bg-white px-4 py-1.5 text-xs text-slate-500 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-400">
      <div className="flex items-center gap-4">
        {activeNoteId ? (
          <>
            <span>{wordCount} 字</span>
            <span>{charCount} 字符</span>
          </>
        ) : (
          <span>未选择笔记</span>
        )}
      </div>
      <div className="flex items-center gap-4">
        <span>自动保存已开启</span>
        <span>{currentTime}</span>
      </div>
    </div>
  )
}
