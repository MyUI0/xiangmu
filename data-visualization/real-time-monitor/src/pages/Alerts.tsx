import { motion } from 'framer-motion'
import AlertRuleForm from '@/components/AlertRuleForm'
import AlertList from '@/components/AlertList'
import { useMonitorStore } from '@/store/useMonitorStore'
import { useAlerts } from '@/hooks/useAlerts'
import { useState } from 'react'

export default function Alerts() {
  const alertRules = useMonitorStore((s) => s.alertRules)
  const updateAlertRule = useMonitorStore((s) => s.updateAlertRule)
  const { alerts, resolveAlert } = useAlerts()
  const [tab, setTab] = useState<'rules' | 'history'>('rules')

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold text-slate-200">报警管理</h1>
        <div className="flex gap-2">
          <button
            onClick={() => setTab('rules')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              tab === 'rules'
                ? 'bg-cyan-500/20 text-cyan-400'
                : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200'
            }`}
          >
            报警规则
          </button>
          <button
            onClick={() => setTab('history')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              tab === 'history'
                ? 'bg-cyan-500/20 text-cyan-400'
                : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200'
            }`}
          >
            报警历史 ({alerts.length})
          </button>
        </div>
      </div>

      {tab === 'rules' ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="grid grid-cols-1 md:grid-cols-2 gap-6"
        >
          {alertRules.map((rule) => (
            <AlertRuleForm
              key={rule.id}
              rule={rule}
              onUpdate={updateAlertRule}
            />
          ))}
        </motion.div>
      ) : (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="max-h-[calc(100vh-200px)] overflow-y-auto"
        >
          <AlertList alerts={alerts} onResolve={resolveAlert} showResolve={true} />
        </motion.div>
      )}
    </div>
  )
}
