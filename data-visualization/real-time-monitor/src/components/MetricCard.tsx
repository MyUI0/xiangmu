import { motion } from 'framer-motion'
import { Cpu, MemoryStick, Wifi, Thermometer } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'

interface MetricCardProps {
  title: string
  value: number
  unit?: string
  icon: string
}

const iconMap: Record<string, LucideIcon> = {
  cpu: Cpu,
  memory: MemoryStick,
  network: Wifi,
  temperature: Thermometer,
}

function getStatus(value: number): { label: string; color: string; bg: string; border: string } {
  if (value >= 90) {
    return { label: '危险', color: 'text-red-400', bg: 'bg-red-500/10', border: 'border-red-500/30' }
  }
  if (value >= 70) {
    return { label: '警告', color: 'text-amber-400', bg: 'bg-amber-500/10', border: 'border-amber-500/30' }
  }
  return { label: '正常', color: 'text-emerald-400', bg: 'bg-emerald-500/10', border: 'border-emerald-500/30' }
}

export default function MetricCard({ title, value, icon }: MetricCardProps) {
  const status = getStatus(value)
  const Icon = iconMap[icon] || Cpu

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -4, boxShadow: '0 10px 30px rgba(0,0,0,0.3)' }}
      className={`relative overflow-hidden rounded-xl border ${status.border} ${status.bg} p-6 backdrop-blur-sm`}
    >
      <div className="flex items-start justify-between mb-4">
        <div className={`p-2.5 rounded-lg ${status.bg}`}>
          <Icon className={`w-5 h-5 ${status.color}`} />
        </div>
        <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${status.color} ${status.bg}`}>
          {status.label}
        </span>
      </div>
      <div>
        <p className="text-sm text-slate-400 mb-1">{title}</p>
        <p className={`text-3xl font-bold ${status.color}`}>
          {value}
          <span className="text-sm ml-1">%</span>
        </p>
      </div>
      {/* Progress bar */}
      <div className="mt-4 h-1.5 bg-slate-800 rounded-full overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${Math.min(value, 100)}%` }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          className={`h-full rounded-full ${
            value >= 90
              ? 'bg-red-500'
              : value >= 70
                ? 'bg-amber-500'
                : 'bg-emerald-500'
          }`}
        />
      </div>
    </motion.div>
  )
}
