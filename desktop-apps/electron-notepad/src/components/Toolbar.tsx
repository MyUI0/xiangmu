import { useCallback } from 'react'
import {
  Bold,
  Italic,
  Underline,
  Strikethrough,
  List,
  ListOrdered,
  Heading1,
  Heading2,
  Quote,
  Undo2,
  Redo2,
  Download,
  FileText,
  Code,
  Type,
} from 'lucide-react'
import { useNoteStore } from '@/store/useNoteStore'
import { cn } from '@/lib/utils'

interface ToolbarProps {
  onExportTxt: () => void
  onExportHtml: () => void
}

export default function Toolbar({ onExportTxt, onExportHtml }: ToolbarProps) {
  const activeNoteId = useNoteStore((s) => s.activeNoteId)

  const exec = useCallback(
    (command: string, value?: string) => {
      document.execCommand(command, false, value)
    },
    []
  )

  const handleButtonClick = useCallback(
    (command: string, value?: string) => {
      return (e: React.MouseEvent) => {
        e.preventDefault()
        exec(command, value)
      }
    },
    [exec]
  )

  const ToolButton = ({
    icon: Icon,
    title,
    command,
    value,
    className,
  }: {
    icon: React.ElementType
    title: string
    command: string
    value?: string
    className?: string
  }) => (
    <button
      onMouseDown={handleButtonClick(command, value)}
      className={cn(
        'rounded-md p-1.5 text-slate-600 transition-colors hover:bg-slate-200 hover:text-slate-800 dark:text-slate-400 dark:hover:bg-slate-700 dark:hover:text-slate-200',
        className
      )}
      title={title}
      disabled={!activeNoteId}
    >
      <Icon size={16} />
    </button>
  )

  const Divider = () => (
    <div className="mx-1 h-5 w-px bg-slate-200 dark:bg-slate-600" />
  )

  return (
    <div className="flex items-center gap-0.5 border-b border-slate-200 bg-white px-3 py-1.5 dark:border-slate-700 dark:bg-slate-800">
      {/* Text formatting */}
      <ToolButton icon={Bold} title="粗体 (Ctrl+B)" command="bold" />
      <ToolButton icon={Italic} title="斜体 (Ctrl+I)" command="italic" />
      <ToolButton icon={Underline} title="下划线 (Ctrl+U)" command="underline" />
      <ToolButton icon={Strikethrough} title="删除线" command="strikeThrough" />

      <Divider />

      {/* Headings */}
      <ToolButton icon={Heading1} title="标题 1" command="formatBlock" value="h1" />
      <ToolButton icon={Heading2} title="标题 2" command="formatBlock" value="h2" />
      <ToolButton icon={Type} title="正文" command="formatBlock" value="p" />

      <Divider />

      {/* Lists */}
      <ToolButton icon={List} title="无序列表" command="insertUnorderedList" />
      <ToolButton icon={ListOrdered} title="有序列表" command="insertOrderedList" />

      <Divider />

      {/* Quote & Code */}
      <ToolButton icon={Quote} title="引用" command="formatBlock" value="blockquote" />
      <ToolButton icon={Code} title="代码" command="formatBlock" value="pre" />

      <Divider />

      {/* Undo / Redo */}
      <ToolButton icon={Undo2} title="撤销 (Ctrl+Z)" command="undo" />
      <ToolButton icon={Redo2} title="重做 (Ctrl+Y)" command="redo" />

      <Divider />

      {/* Export */}
      <button
        onClick={onExportTxt}
        className="flex items-center gap-1 rounded-md px-2 py-1 text-xs text-slate-600 transition-colors hover:bg-slate-200 hover:text-slate-800 dark:text-slate-400 dark:hover:bg-slate-700 dark:hover:text-slate-200"
        title="导出为纯文本"
        disabled={!activeNoteId}
      >
        <Download size={14} />
        <span>TXT</span>
      </button>
      <button
        onClick={onExportHtml}
        className="flex items-center gap-1 rounded-md px-2 py-1 text-xs text-slate-600 transition-colors hover:bg-slate-200 hover:text-slate-800 dark:text-slate-400 dark:hover:bg-slate-700 dark:hover:text-slate-200"
        title="导出为 HTML"
        disabled={!activeNoteId}
      >
        <FileText size={14} />
        <span>HTML</span>
      </button>
    </div>
  )
}
