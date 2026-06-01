export interface MetricData {
  cpu: number
  memory: number
  network: number
  temperature: number
}

export interface DataPoint {
  time: string
  value: number
}

export interface Alert {
  id: string
  metric: string
  message: string
  level: 'warning' | 'danger'
  time: string
  resolved: boolean
}

export interface AlertRule {
  id: string
  metric: string
  metricLabel: string
  warningThreshold: number
  dangerThreshold: number
  enabled: boolean
}
