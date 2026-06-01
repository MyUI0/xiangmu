import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { MetricData, DataPoint, Alert, AlertRule } from '@/types'

function randomBetween(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

function generateInitialData(): DataPoint[] {
  const points: DataPoint[] = []
  const now = Date.now()
  for (let i = 29; i >= 0; i--) {
    const time = new Date(now - i * 2000)
    points.push({
      time: time.toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
      value: randomBetween(20, 80),
    })
  }
  return points
}

function generateInitialAlerts(): Alert[] {
  return [
    {
      id: '1',
      metric: 'CPU',
      message: 'CPU使用率超过90%',
      level: 'danger',
      time: new Date(Date.now() - 60000).toLocaleTimeString('zh-CN'),
      resolved: false,
    },
    {
      id: '2',
      metric: '内存',
      message: '内存使用率达到75%',
      level: 'warning',
      time: new Date(Date.now() - 120000).toLocaleTimeString('zh-CN'),
      resolved: true,
    },
    {
      id: '3',
      metric: '温度',
      message: '服务器温度超过85°C',
      level: 'danger',
      time: new Date(Date.now() - 300000).toLocaleTimeString('zh-CN'),
      resolved: false,
    },
    {
      id: '4',
      metric: '网络',
      message: '网络带宽使用率偏高',
      level: 'warning',
      time: new Date(Date.now() - 180000).toLocaleTimeString('zh-CN'),
      resolved: true,
    },
  ]
}

function generateInitialAlertRules(): AlertRule[] {
  return [
    {
      id: 'cpu',
      metric: 'cpu',
      metricLabel: 'CPU使用率',
      warningThreshold: 70,
      dangerThreshold: 90,
      enabled: true,
    },
    {
      id: 'memory',
      metric: 'memory',
      metricLabel: '内存使用率',
      warningThreshold: 75,
      dangerThreshold: 90,
      enabled: true,
    },
    {
      id: 'network',
      metric: 'network',
      metricLabel: '网络带宽',
      warningThreshold: 70,
      dangerThreshold: 90,
      enabled: true,
    },
    {
      id: 'temperature',
      metric: 'temperature',
      metricLabel: '服务器温度',
      warningThreshold: 70,
      dangerThreshold: 85,
      enabled: true,
    },
  ]
}

interface MonitorStore {
  metrics: MetricData
  cpuHistory: DataPoint[]
  memoryHistory: DataPoint[]
  networkHistory: DataPoint[]
  temperatureHistory: DataPoint[]
  alerts: Alert[]
  alertRules: AlertRule[]
  updateMetrics: () => void
  resolveAlert: (id: string) => void
  updateAlertRule: (id: string, updates: Partial<AlertRule>) => void
}

export const useMonitorStore = create<MonitorStore>()(
  persist(
    (set, get) => ({
      metrics: {
        cpu: randomBetween(30, 60),
        memory: randomBetween(40, 70),
        network: randomBetween(20, 50),
        temperature: randomBetween(40, 65),
      },
      cpuHistory: generateInitialData(),
      memoryHistory: generateInitialData(),
      networkHistory: generateInitialData(),
      temperatureHistory: generateInitialData(),
      alerts: generateInitialAlerts(),
      alertRules: generateInitialAlertRules(),

      updateMetrics: () => {
        const prev = get().metrics
        const newMetrics: MetricData = {
          cpu: Math.min(100, Math.max(0, prev.cpu + randomBetween(-8, 8))),
          memory: Math.min(100, Math.max(0, prev.memory + randomBetween(-5, 5))),
          network: Math.min(100, Math.max(0, prev.network + randomBetween(-10, 10))),
          temperature: Math.min(100, Math.max(0, prev.temperature + randomBetween(-3, 3))),
        }

        const now = new Date().toLocaleTimeString('zh-CN', {
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
        })

        const newPoint = (value: number): DataPoint => ({ time: now, value })
        const pushHistory = (prev: DataPoint[], value: number) =>
          [...prev.slice(-29), newPoint(value)]

        // Check alerts
        const rules = get().alertRules
        const newAlerts: Alert[] = [...get().alerts]
        const metricMap: Record<string, number> = {
          cpu: newMetrics.cpu,
          memory: newMetrics.memory,
          network: newMetrics.network,
          temperature: newMetrics.temperature,
        }

        for (const rule of rules) {
          if (!rule.enabled) continue
          const val = metricMap[rule.metric]
          if (val >= rule.dangerThreshold) {
            const exists = newAlerts.find(
              (a) => a.metric === rule.metricLabel && !a.resolved && a.level === 'danger'
            )
            if (!exists) {
              newAlerts.unshift({
                id: `${rule.metric}-${Date.now()}`,
                metric: rule.metricLabel,
                message: `${rule.metricLabel}达到 ${val}%，超过危险阈值 ${rule.dangerThreshold}%`,
                level: 'danger',
                time: now,
                resolved: false,
              })
            }
          } else if (val >= rule.warningThreshold) {
            const exists = newAlerts.find(
              (a) => a.metric === rule.metricLabel && !a.resolved && a.level === 'warning'
            )
            if (!exists) {
              newAlerts.unshift({
                id: `${rule.metric}-${Date.now()}`,
                metric: rule.metricLabel,
                message: `${rule.metricLabel}达到 ${val}%，超过警告阈值 ${rule.warningThreshold}%`,
                level: 'warning',
                time: now,
                resolved: false,
              })
            }
          }
        }

        set({
          metrics: newMetrics,
          cpuHistory: pushHistory(get().cpuHistory, newMetrics.cpu),
          memoryHistory: pushHistory(get().memoryHistory, newMetrics.memory),
          networkHistory: pushHistory(get().networkHistory, newMetrics.network),
          temperatureHistory: pushHistory(get().temperatureHistory, newMetrics.temperature),
          alerts: newAlerts.slice(0, 50),
        })
      },

      resolveAlert: (id) =>
        set((state) => ({
          alerts: state.alerts.map((a) => (a.id === id ? { ...a, resolved: true } : a)),
        })),

      updateAlertRule: (id, updates) =>
        set((state) => ({
          alertRules: state.alertRules.map((r) =>
            r.id === id ? { ...r, ...updates } : r
          ),
        })),
    }),
    {
      name: 'monitor-store',
      partialize: (state) => ({
        alertRules: state.alertRules,
      }),
    }
  )
)
