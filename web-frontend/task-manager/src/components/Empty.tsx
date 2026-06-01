import { ClipboardList } from 'lucide-react'
import { motion } from 'framer-motion'

export default function Empty() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col items-center justify-center py-16 text-slate-400 dark:text-slate-500"
    >
      <ClipboardList className="w-16 h-16 mb-4 stroke-1" />
      <p className="text-lg font-medium">暂无任务</p>
      <p className="text-sm mt-1">在上方输入框添加你的第一个任务</p>
    </motion.div>
  )
}
