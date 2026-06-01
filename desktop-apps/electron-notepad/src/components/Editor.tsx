import { useRef, useCallback, useEffect, useState } from 'react'
import { useNoteStore } from '@/store/useNoteStore'
import { stripHtml, countWords } from '@/lib/utils'

interface EditorProps {
  onStatsUpdate: (words: number, chars: number) => void
}

export default function Editor({ onStatsUpdate }: EditorProps) {
  const activeNoteId = useNoteStore((s) => s.activeNoteId)
  const notes = useNoteStore((s) => s.notes)
  const updateNote = useNoteStore((s) => s.updateNote)

  const editorRef = useRef<HTMLDivElement>(null)
  const saveTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const [content, setContent] = useState('')

  const activeNote = notes.find((n) => n.id === activeNoteId)

  // 同步编辑器内容
  useEffect(() => {
    if (editorRef.current && activeNote) {
      if (editorRef.current.innerHTML !== activeNote.content) {
        editorRef.current.innerHTML = activeNote.content
        setContent(activeNote.content)
      }
    } else if (editorRef.current && !activeNoteId) {
      editorRef.current.innerHTML = ''
      setContent('')
    }
  }, [activeNoteId, activeNote])

  // 更新统计
  useEffect(() => {
    const text = stripHtml(content)
    onStatsUpdate(countWords(text), text.length)
  }, [content, onStatsUpdate])

  const handleInput = useCallback(() => {
    const html = editorRef.current?.innerHTML || ''
    setContent(html)

    // Debounce 自动保存
    if (saveTimerRef.current) {
      clearTimeout(saveTimerRef.current)
    }
    saveTimerRef.current = setTimeout(() => {
      if (activeNoteId) {
        updateNote(activeNoteId, { content: html })
      }
    }, 500)
  }, [activeNoteId, updateNote])

  // 清理定时器
  useEffect(() => {
    return () => {
      if (saveTimerRef.current) {
        clearTimeout(saveTimerRef.current)
      }
    }
  }, [])

  // 处理粘贴 - 清理格式
  const handlePaste = useCallback((e: React.ClipboardEvent) => {
    e.preventDefault()
    const text = e.clipboardData.getData('text/plain')
    document.execCommand('insertText', false, text)
  }, [])

  if (!activeNote) {
    return null
  }

  return (
    <div className="flex-1 overflow-y-auto p-6">
      <div
        ref={editorRef}
        contentEditable
        suppressContentEditableWarning
        onInput={handleInput}
        onPaste={handlePaste}
        className="editor-content max-w-4xl mx-auto text-slate-800 dark:text-slate-200"
        style={{ caretColor: 'var(--accent-color, #6366f1)' }}
      />
    </div>
  )
}
