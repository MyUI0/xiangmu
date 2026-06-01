import { useState } from 'react'
import { motion } from 'framer-motion'
import MetricCard from '@/components/MetricCard'
import RealTimeChart from '@/components/RealTimeChart'
import AlertList from '@/components/AlertList'
import { useMonitorStore } from '@/store/useMonitorStore'
import { useRealTimeData } from '@/hooks/useRealTimeData'
import { useAlerts } from '@/hooks/useAlerts'
import type { DataPoint } from '@/types'

const metricConfigs = [
  { key: 'cpu', title: 'CPU使用率', icon: 'cpu', color: 'rgba(6, 182, 212, 1)' },
  { key: 'memory', title: '内存使用率', icon: 'memory', color: 'rgba(139, 92, 246, 1)' },
  { key: 'network', title: '网络带宽', icon: 'network', color: 'rgba(34, 197, 94, 1)' },
  { key: 'temperature', title: '服务器温度', icon: 'temperature', color: 'rgba(249, 115, 22, 1)' },
] as const

export default function Dashboard() {
  useRealTimeData()
  const metrics = useMonitorStore((s) => s.metrics)
  const cpuHistory = useMonitorStore((s) => s.cpuHistory)
  const memoryHistory = useMonitorStore((s) => s.memoryHistory)
  const networkHistory = useMonitorStore((s) => s.networkHistory)
  const temperatureHistory = useMonitorStore((s) => s.temperatureHistory)
  const alertRules = useMonitorStore((s) => s.alertRules)
  const { unresolvedAlerts, resolveAlert } = useAlerts()

  const [selectedMetric, setSelectedMetric] = useState('cpu')

  const selectedConfig = metricConfigs.find((m) => m.key === selectedMetric)!
  const selectedHistory = ({
    cpu: cpuHistory,
    memory: memoryHistory,
    network: networkHistory,
    temperature: temperatureHistory,
  } as Record<string, DataPoint[]>)[selectedMetric] ?? cpuHistory

  const selectedRule = alertRules.find((r) => r.metric === selectedMetric)

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {metricConfigs.map((config) => (
          <MetricCard
            key={config.key}
            title={config.title}
            value={metrics[config.key]}
            icon={config.icon}
          />
        ))}
      </div>

      {/* Chart Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="mb-8"
      >
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-slate-200">实时数据</h2>
          <div className="flex gap-2">
            {metricConfigs.map((config) => (
              <button
                key={config.key}
                onClick={() => setSelectedMetric(config.key)}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                  selectedMetric === config.key
                    ? 'bg-cyan-500/20 text-cyan-400'
                    : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200'
                }`}
              >
                {config.title}
              </button>
            ))}
          </div>
        </div>
        <div className="h-80">
          <RealTimeChart
            data={selectedHistory}
            label={selectedConfig.title}
            color={selectedConfig.color}
            warningThreshold={selectedRule?.warningThreshold}
            dangerThreshold={selectedRule?.dangerThreshold}
          />
        </div>
      </motion.div>

      {/* Alerts Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-slate-200">
            最新报警
            {unresolvedAlerts.length > 0 && (
              <span className="ml-2 px-2 py-0.5 text-xs rounded-full bg-red-500/20 text-red-400">
                {unresolvedAlerts.length}
              </span>
            )}
          </h2>
        </div>
        <div className="max-h-96 overflow-y-auto">
          <AlertList alerts={unresolvedAlerts.slice(0, 10)} onResolve={resolveAlert} />
        </div>
      </motion.div>
    </div>
  )
}
