import { motion } from 'framer-motion'
import { useStore } from '@/store/useStore'

const categories = ['全部', '科技', '设计', '生活', '编程']

export default function CategoryNav() {
  const filter = useStore((s) => s.filter)
  const setFilter = useStore((s) => s.setFilter)

  return (
    <div className="flex flex-wrap gap-2">
      {categories.map((cat) => (
        <motion.button
          key={cat}
          whileTap={{ scale: 0.95 }}
          onClick={() => setFilter(cat)}
          className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
            filter === cat
              ? 'bg-indigo-500 text-white shadow-md shadow-indigo-200 dark:shadow-indigo-900/30'
              : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
          }`}
        >
          {cat}
        </motion.button>
      ))}
    </div>
  )
}
