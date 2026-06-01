import { useParams, Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowLeft, Calendar, User, Tag, Heart } from 'lucide-react'
import { useStore } from '@/store/useStore'
import ContentCard from '@/components/ContentCard'
import { useMemo } from 'react'

export default function Detail() {
  const { id } = useParams<{ id: string }>()
  const items = useStore((s) => s.items)
  const favorites = useStore((s) => s.favorites)
  const toggleFavorite = useStore((s) => s.toggleFavorite)
  const addToHistory = useStore((s) => s.addToHistory)
  const navigate = useNavigate()

  const item = useMemo(() => items.find((i) => i.id === Number(id)), [items, id])

  if (!item) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center">
        <p className="text-xl text-slate-500 mb-4">内容不存在</p>
        <Link to="/" className="text-indigo-500 hover:underline">
          返回首页
        </Link>
      </div>
    )
  }

  // Add to history on visit
  addToHistory(item.id)

  const isFav = favorites.includes(item.id)
  const related = items
    .filter((i) => i.category === item.category && i.id !== item.id)
    .slice(0, 4)

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <motion.button
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 text-slate-500 hover:text-indigo-500 mb-6 transition-colors"
      >
        <ArrowLeft className="w-5 h-5" />
        <span>返回</span>
      </motion.button>

      <motion.article
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="relative rounded-2xl overflow-hidden mb-8">
          <img
            src={item.image}
            alt={item.title}
            className="w-full h-64 sm:h-96 object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
          <span className="absolute bottom-4 left-4 px-4 py-1.5 text-sm font-medium rounded-full bg-indigo-500 text-white">
            {item.category}
          </span>
        </div>

        <div className="flex items-center justify-between mb-4">
          <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 dark:text-white">
            {item.title}
          </h1>
          <motion.button
            whileTap={{ scale: 0.8 }}
            onClick={() => toggleFavorite(item.id)}
            className="p-3 rounded-full hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors shrink-0"
          >
            <Heart
              className={`w-6 h-6 transition-colors ${
                isFav ? 'fill-red-500 text-red-500' : 'text-slate-400'
              }`}
            />
          </motion.button>
        </div>

        <div className="flex flex-wrap items-center gap-4 text-sm text-slate-500 dark:text-slate-400 mb-6">
          <div className="flex items-center gap-1.5">
            <User className="w-4 h-4" />
            <span>{item.author}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Calendar className="w-4 h-4" />
            <span>{item.publishDate}</span>
          </div>
        </div>

        <div className="flex flex-wrap gap-2 mb-8">
          {item.tags.map((tag) => (
            <span
              key={tag}
              className="flex items-center gap-1 px-3 py-1 text-xs rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300"
            >
              <Tag className="w-3 h-3" />
              {tag}
            </span>
          ))}
        </div>

        <div className="prose prose-lg dark:prose-invert max-w-none">
          <p className="text-lg leading-relaxed text-slate-700 dark:text-slate-300">
            {item.description}
          </p>
          <div className="mt-6 text-slate-600 dark:text-slate-400 leading-relaxed whitespace-pre-line">
            {item.content}
          </div>
        </div>
      </motion.article>

      {related.length > 0 && (
        <section className="mt-16">
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-6">
            相关推荐
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {related.map((r) => (
              <ContentCard key={r.id} item={r} />
            ))}
          </div>
        </section>
      )}
    </div>
  )
}
