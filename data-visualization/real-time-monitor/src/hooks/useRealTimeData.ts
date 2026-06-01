import { useEffect } from 'react'
import { useMonitorStore } from '@/store/useMonitorStore'

export function useRealTimeData() {
  const updateMetrics = useMonitorStore((s) => s.updateMetrics)

  useEffect(() => {
    const interval = setInterval(() => {
      updateMetrics()
    }, 2000)
    return () => clearInterval(interval)
  }, [updateMetrics])
}
