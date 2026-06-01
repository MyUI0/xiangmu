import { useState } from 'react'
import { motion } from 'framer-motion'
import { Save, RotateCcw } from 'lucide-react'
import type { AlertRule } from '@/types'

interface AlertRuleFormProps {
  rule: AlertRule
  onUpdate: (id: string, updates: Partial<AlertRule>) => void
}

export default function AlertRuleForm({ rule, onUpdate }: AlertRuleFormProps) {
  const [localWarning, setLocalWarning] = useState(rule.warningThreshold)
  const [localDanger, setLocalDanger] = useState(rule.dangerThreshold)

  const handleSave = () => {
    onUpdate(rule.id, {
      warningThreshold: localWarning,
      dangerThreshold: localDanger,
    })
  }

  const handleReset = () => {
    setLocalWarning(rule.warningThreshold)
    setLocalDanger(rule.dangerThreshold)
  }

  const handleToggle = () => {
    onUpdate(rule.id, { enabled: !rule.enabled })
  }

  return (
    <motion.div
      layout
      className="bg-slate-900/50 border border-slate-800 rounded-xl p-6"
    >
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-slate-200">{rule.metricLabel}</h3>
          <p className="text-sm text-slate-500">配置报警阈值</p>
        </div>
        <button
          onClick={handleToggle}
          className={`relative w-12 h-6 rounded-full transition-colors ${
            rule.enabled ? 'bg-cyan-500' : 'bg-slate-700'
          }`}
        >
          <motion.div
            animate={{ x: rule.enabled ? 24 : 2 }}
            transition={{ type: 'spring', stiffness: 500, damping: 30 }}
            className="absolute top-1 w-4 h-4 rounded-full bg-white"
          />
        </button>
      </div>

      <div className="space-y-6">
        {/* Warning Threshold */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="text-sm text-amber-400 font-medium">警告阈值</label>
            <span className="text-sm text-slate-400">{localWarning}%</span>
          </div>
          <input
            type="range"
            min={0}
            max={100}
            value={localWarning}
            onChange={(e) => setLocalWarning(Number(e.target.value))}
            className="w-full h-2 bg-slate-800 rounded-full appearance-none cursor-pointer accent-amber-500"
          />
          <div className="flex justify-between text-xs text-slate-600 mt-1">
            <span>0%</span>
            <span>100%</span>
          </div>
        </div>

        {/* Danger Threshold */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="text-sm text-red-400 font-medium">危险阈值</label>
            <span className="text-sm text-slate-400">{localDanger}%</span>
          </div>
          <input
            type="range"
            min={0}
            max={100}
            value={localDanger}
            onChange={(e) => setLocalDanger(Number(e.target.value))}
            className="w-full h-2 bg-slate-800 rounded-full appearance-none cursor-pointer accent-red-500"
          />
          <div className="flex justify-between text-xs text-slate-600 mt-1">
            <span>0%</span>
            <span>100%</span>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-3 pt-2">
          <button
            onClick={handleSave}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-cyan-500/20 text-cyan-400 hover:bg-cyan-500/30 transition-colors text-sm font-medium"
          >
            <Save className="w-4 h-4" />
            保存
          </button>
          <button
            onClick={handleReset}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-slate-800 text-slate-400 hover:bg-slate-700 transition-colors text-sm font-medium"
          >
            <RotateCcw className="w-4 h-4" />
            重置
          </button>
        </div>
      </div>
    </motion.div>
  )
}
