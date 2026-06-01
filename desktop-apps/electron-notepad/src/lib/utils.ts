import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).substring(2)
}

export function formatTime(dateStr: string): string {
  const date = new Date(dateStr)
  const now = new Date()
  const diff = now.getTime() - date.getTime()

  if (diff < 60000) return '刚刚'
  if (diff < 3600000) return `${Math.floor(diff / 60000)} 分钟前`
  if (diff < 86400000) return `${Math.floor(diff / 3600000)} 小时前`
  if (diff < 604800000) return `${Math.floor(diff / 86400000)} 天前`

  return date.toLocaleDateString('zh-CN', {
    month: 'short',
    day: 'numeric',
  })
}

export function stripHtml(html: string): string {
  const div = document.createElement('div')
  div.innerHTML = html
  return div.textContent || div.innerText || ''
}

export function countWords(text: string): number {
  const trimmed = text.trim()
  if (!trimmed) return 0
  // 中文按字符计数，英文按空格分词
  const chineseChars = (trimmed.match(/[\u4e00-\u9fff]/g) || []).length
  const englishWords = trimmed
    .replace(/[\u4e00-\u9fff]/g, '')
    .trim()
    .split(/\s+/)
    .filter((w) => w.length > 0).length
  return chineseChars + englishWords
}

export function getCurrentTime(): string {
  return new Date().toLocaleTimeString('zh-CN', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  })
}
