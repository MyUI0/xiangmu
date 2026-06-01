import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { Heart } from 'lucide-react'
import type { ContentItem } from '@/types'
import { useStore } from '@/store/useStore'

interface ContentCardProps {
  item: ContentItem
}

export default function ContentCard({ item }: ContentCardProps) {
  const favorites = useStore((s) => s.favorites)
  const toggleFavorite = useStore((s) => s.toggleFavorite)
  const isFav = favorites.includes(item.id)

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      whileHover={{ y: -6, boxShadow: '0 20px 40px rgba(0,0,0,0.12)' }}
      transition={{ duration: 0.3 }}
      className="bg-white dark:bg-slate-800 rounded-2xl overflow-hidden shadow-md"
    >
      <Link to={`/detail/${item.id}`}>
        <div className="relative overflow-hidden">
          <img
            src={item.image}
            alt={item.title}
            className="w-full h-48 object-cover transition-transform duration-500 hover:scale-110"
            loading="lazy"
          />
          <span className="absolute top-3 left-3 px-3 py-1 text-xs font-medium rounded-full bg-indigo-500 text-white">
            {item.category}
          </span>
        </div>
      </Link>
      <div className="p-5">
        <Link to={`/detail/${item.id}`}>
          <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2 line-clamp-2 hover:text-indigo-500 transition-colors">
            {item.title}
          </h3>
        </Link>
        <p className="text-sm text-slate-500 dark:text-slate-400 mb-4 line-clamp-2">
          {item.description}
        </p>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-full bg-indigo-100 dark:bg-indigo-900 flex items-center justify-center text-xs font-bold text-indigo-600 dark:text-indigo-300">
              {item.author[0]}
            </div>
            <span className="text-xs text-slate-500 dark:text-slate-400">{item.author}</span>
          </div>
          <motion.button
            whileTap={{ scale: 0.8 }}
            onClick={() => toggleFavorite(item.id)}
            className="p-2 rounded-full hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
          >
            <Heart
              className={`w-5 h-5 transition-colors ${
                isFav ? 'fill-red-500 text-red-500' : 'text-slate-400'
              }`}
            />
          </motion.button>
        </div>
      </div>
    </motion.div>
  )
}
