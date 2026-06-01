import { Search, X } from 'lucide-react'
import { useState } from 'react'
import { useStore } from '@/store/useStore'

export default function SearchBar() {
  const search = useStore((s) => s.search)
  const setSearch = useStore((s) => s.setSearch)
  const [local, setLocal] = useState(search)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setSearch(local)
  }

  const handleClear = () => {
    setLocal('')
    setSearch('')
  }

  return (
    <form onSubmit={handleSubmit} className="relative w-full max-w-md">
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
      <input
        type="text"
        value={local}
        onChange={(e) => setLocal(e.target.value)}
        placeholder="搜索内容..."
        className="w-full pl-10 pr-10 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
      />
      {local && (
        <button
          type="button"
          onClick={handleClear}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
        >
          <X className="w-4 h-4" />
        </button>
      )}
    </form>
  )
}
