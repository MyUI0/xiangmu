import { useMonitorStore } from '@/store/useMonitorStore'

export function useAlerts() {
  const alerts = useMonitorStore((s) => s.alerts)
  const resolveAlert = useMonitorStore((s) => s.resolveAlert)

  const unresolvedAlerts = alerts.filter((a) => !a.resolved)
  const resolvedAlerts = alerts.filter((a) => a.resolved)

  return { alerts, unresolvedAlerts, resolvedAlerts, resolveAlert }
}
