import { motion, AnimatePresence } from 'framer-motion'
import { Heart, Clock, Trash2, Settings } from 'lucide-react'
import { Link } from 'react-router-dom'
import { useStore } from '@/store/useStore'
import Empty from '@/components/Empty'

export default function Profile() {
  const items = useStore((s) => s.items)
  const favorites = useStore((s) => s.favorites)
  const history = useStore((s) => s.history)
  const clearHistory = useStore((s) => s.clearHistory)

  const favItems = items.filter((i) => favorites.includes(i.id))
  const historyItems = history.map((id) => items.find((i) => i.id === id)).filter(Boolean)

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <motion.h1
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-3xl font-bold text-slate-900 dark:text-white mb-10"
      >
        个人中心
      </motion.h1>

      {/* Favorites */}
      <section className="mb-12">
        <div className="flex items-center gap-2 mb-6">
          <Heart className="w-5 h-5 text-red-500" />
          <h2 className="text-xl font-semibold text-slate-900 dark:text-white">
            我的收藏 ({favItems.length})
          </h2>
        </div>
        {favItems.length === 0 ? (
          <Empty message="还没有收藏任何内容" />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <AnimatePresence>
              {favItems.map((item) => (
                <motion.div
                  key={item.id}
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                >
                  <Link
                    to={`/detail/${item.id}`}
                    className="block bg-white dark:bg-slate-800 rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-shadow"
                  >
                    <img
                      src={item.image}
                      alt={item.title}
                      className="w-full h-36 object-cover"
                      loading="lazy"
                    />
                    <div className="p-4">
                      <h3 className="font-medium text-slate-900 dark:text-white line-clamp-1">
                        {item.title}
                      </h3>
                      <p className="text-sm text-slate-500 dark:text-slate-400 mt-1 line-clamp-2">
                        {item.description}
                      </p>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </section>

      {/* History */}
      <section className="mb-12">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <Clock className="w-5 h-5 text-indigo-500" />
            <h2 className="text-xl font-semibold text-slate-900 dark:text-white">
              浏览历史 ({historyItems.length})
            </h2>
          </div>
          {historyItems.length > 0 && (
            <button
              onClick={clearHistory}
              className="flex items-center gap-1 text-sm text-red-500 hover:text-red-600 transition-colors"
            >
              <Trash2 className="w-4 h-4" />
              清除历史
            </button>
          )}
        </div>
        {historyItems.length === 0 ? (
          <Empty message="还没有浏览记录" />
        ) : (
          <div className="space-y-3">
            <AnimatePresence>
              {historyItems.map((item) =>
                item ? (
                  <motion.div
                    key={item.id}
                    layout
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                  >
                    <Link
                      to={`/detail/${item.id}`}
                      className="flex items-center gap-4 p-4 bg-white dark:bg-slate-800 rounded-xl shadow-sm hover:shadow-md transition-shadow"
                    >
                      <img
                        src={item.image}
                        alt={item.title}
                        className="w-16 h-16 rounded-lg object-cover shrink-0"
                        loading="lazy"
                      />
                      <div className="flex-1 min-w-0">
                        <h3 className="font-medium text-slate-900 dark:text-white line-clamp-1">
                          {item.title}
                        </h3>
                        <p className="text-sm text-slate-500 dark:text-slate-400 line-clamp-1 mt-1">
                          {item.description}
                        </p>
                      </div>
                      <span className="text-xs text-slate-400 shrink-0">
                        {item.category}
                      </span>
                    </Link>
                  </motion.div>
                ) : null
              )}
            </AnimatePresence>
          </div>
        )}
      </section>

      {/* Preferences */}
      <section>
        <div className="flex items-center gap-2 mb-6">
          <Settings className="w-5 h-5 text-slate-500" />
          <h2 className="text-xl font-semibold text-slate-900 dark:text-white">
            偏好设置
          </h2>
        </div>
        <div className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-sm">
          <h3 className="text-sm font-medium text-slate-500 dark:text-slate-400 mb-3">
            感兴趣的分类
          </h3>
          <p className="text-slate-600 dark:text-slate-300">
            系统会根据你的收藏和浏览记录自动优化推荐内容。
            你收藏和浏览越多分类的内容，推荐就越精准。
          </p>
          <div className="mt-4 flex flex-wrap gap-2">
            {['科技', '设计', '生活', '编程'].map((cat) => {
              const count = favItems.filter((i) => i.category === cat).length
              return (
                <span
                  key={cat}
                  className={`px-3 py-1.5 rounded-full text-sm ${
                    count > 0
                      ? 'bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400'
                      : 'bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-400'
                  }`}
                >
                  {cat} {count > 0 && `(${count})`}
                </span>
              )
            })}
          </div>
        </div>
      </section>
    </div>
  )
}
