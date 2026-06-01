import { motion, AnimatePresence } from 'framer-motion'
import { AlertTriangle, CheckCircle, Bell } from 'lucide-react'
import type { Alert } from '@/types'

interface AlertListProps {
  alerts: Alert[]
  onResolve?: (id: string) => void
  showResolve?: boolean
}

export default function AlertList({ alerts, onResolve, showResolve = true }: AlertListProps) {
  if (alerts.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-slate-500">
        <Bell className="w-12 h-12 mb-3" />
        <p>暂无报警记录</p>
      </div>
    )
  }

  return (
    <div className="space-y-3">
      <AnimatePresence>
        {alerts.map((alert) => (
          <motion.div
            key={alert.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            className={`flex items-start gap-3 p-4 rounded-xl border backdrop-blur-sm ${
              alert.level === 'danger'
                ? 'bg-red-500/5 border-red-500/20'
                : 'bg-amber-500/5 border-amber-500/20'
            } ${alert.resolved ? 'opacity-60' : ''}`}
          >
            {alert.resolved ? (
              <CheckCircle className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
            ) : alert.level === 'danger' ? (
              <AlertTriangle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
            ) : (
              <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
            )}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-sm font-medium text-slate-200">{alert.metric}</span>
                <span
                  className={`text-xs px-2 py-0.5 rounded-full ${
                    alert.level === 'danger'
                      ? 'bg-red-500/20 text-red-400'
                      : 'bg-amber-500/20 text-amber-400'
                  }`}
                >
                  {alert.level === 'danger' ? '危险' : '警告'}
                </span>
                {alert.resolved && (
                  <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400">
                    已解决
                  </span>
                )}
              </div>
              <p className="text-sm text-slate-400">{alert.message}</p>
              <p className="text-xs text-slate-500 mt-1">{alert.time}</p>
            </div>
            {showResolve && !alert.resolved && onResolve && (
              <button
                onClick={() => onResolve(alert.id)}
                className="shrink-0 text-xs px-3 py-1.5 rounded-lg bg-slate-800 text-slate-300 hover:bg-slate-700 transition-colors"
              >
                解决
              </button>
            )}
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  )
}
