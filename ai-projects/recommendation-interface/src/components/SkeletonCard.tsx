import { motion } from 'framer-motion'

export default function SkeletonCard() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="bg-white dark:bg-slate-800 rounded-2xl overflow-hidden shadow-md"
    >
      <div className="w-full h-48 bg-slate-200 dark:bg-slate-700 animate-pulse" />
      <div className="p-5 space-y-3">
        <div className="h-4 w-16 bg-slate-200 dark:bg-slate-700 rounded-full animate-pulse" />
        <div className="h-5 w-3/4 bg-slate-200 dark:bg-slate-700 rounded animate-pulse" />
        <div className="h-4 w-full bg-slate-200 dark:bg-slate-700 rounded animate-pulse" />
        <div className="h-4 w-2/3 bg-slate-200 dark:bg-slate-700 rounded animate-pulse" />
        <div className="flex justify-between items-center pt-2">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-full bg-slate-200 dark:bg-slate-700 animate-pulse" />
            <div className="h-3 w-16 bg-slate-200 dark:bg-slate-700 rounded animate-pulse" />
          </div>
          <div className="w-5 h-5 bg-slate-200 dark:bg-slate-700 rounded-full animate-pulse" />
        </div>
      </div>
    </motion.div>
  )
}
