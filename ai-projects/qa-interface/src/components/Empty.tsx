import { motion } from 'framer-motion'
import { MessageSquareText } from 'lucide-react'

export default function Empty() {
  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-4 p-8">
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        className="flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-500 to-purple-600 shadow-lg"
      >
        <MessageSquareText className="h-10 w-10 text-white" />
      </motion.div>
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="text-center"
      >
        <h2 className="mb-2 text-2xl font-bold text-slate-800 dark:text-slate-200">
          智能问答助手
        </h2>
        <p className="max-w-md text-slate-500 dark:text-slate-400">
          在下方输入你的问题，我会尽力为你解答。
          试试问我关于学习、编程、健康、旅游等话题吧！
        </p>
      </motion.div>
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.4 }}
        className="mt-4 flex flex-wrap justify-center gap-2"
      >
        {['你好', '讲个笑话', '推荐电影', '学习建议', '旅游推荐'].map((text) => (
          <span
            key={text}
            className="cursor-default rounded-full border border-slate-200 bg-slate-50 px-3 py-1.5 text-sm text-slate-600 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300"
          >
            {text}
          </span>
        ))}
      </motion.div>
    </div>
  )
}
