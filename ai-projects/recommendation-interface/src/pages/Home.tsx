import { useState, useEffect, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import ContentCard from '@/components/ContentCard'
import CategoryNav from '@/components/CategoryNav'
import SearchBar from '@/components/SearchBar'
import SkeletonCard from '@/components/SkeletonCard'
import Empty from '@/components/Empty'
import { useStore } from '@/store/useStore'

export default function Home() {
  const items = useStore((s) => s.items)
  const filter = useStore((s) => s.filter)
  const search = useStore((s) => s.search)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 800)
    return () => clearTimeout(timer)
  }, [])

  const filtered = useMemo(() => {
    let result = items
    if (filter !== '全部') {
      result = result.filter((item) => item.category === filter)
    }
    if (search.trim()) {
      const q = search.toLowerCase()
      result = result.filter(
        (item) =>
          item.title.toLowerCase().includes(q) ||
          item.description.toLowerCase().includes(q) ||
          item.tags.some((t) => t.toLowerCase().includes(q))
      )
    }
    return result
  }, [items, filter, search])

  return (
    <div>
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 py-20 px-4">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-10 left-10 w-72 h-72 bg-white rounded-full blur-3xl" />
          <div className="absolute bottom-10 right-10 w-96 h-96 bg-yellow-300 rounded-full blur-3xl" />
        </div>
        <div className="relative max-w-4xl mx-auto text-center">
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-6"
          >
            发现你的
            <span className="block mt-2">专属内容世界</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-lg text-white/80 mb-8"
          >
            AI驱动的智能推荐，为你精选最优质的内容
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="max-w-md mx-auto"
          >
            <SearchBar />
          </motion.div>
        </div>
      </section>

      {/* Content Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <CategoryNav />
          <span className="text-sm text-slate-500 dark:text-slate-400">
            共 {filtered.length} 条内容
          </span>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {Array.from({ length: 8 }).map((_, i) => (
              <SkeletonCard key={i} />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <Empty message="没有找到匹配的内容" />
        ) : (
          <AnimatePresence mode="popLayout">
            <motion.div
              layout
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
            >
              {filtered.map((item) => (
                <ContentCard key={item.id} item={item} />
              ))}
            </motion.div>
          </AnimatePresence>
        )}
      </section>
    </div>
  )
}
