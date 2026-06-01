import { useRef, useEffect } from 'react'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js'
import { Line } from 'react-chartjs-2'
import type { DataPoint } from '@/types'

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
)

interface RealTimeChartProps {
  data: DataPoint[]
  label: string
  color: string
  warningThreshold?: number
  dangerThreshold?: number
}

export default function RealTimeChart({
  data,
  label,
  color,
  warningThreshold,
  dangerThreshold,
}: RealTimeChartProps) {
  const chartRef = useRef<ChartJS<'line'>>(null)

  useEffect(() => {
    const chart = chartRef.current
    if (!chart) return
    const tooltip = chart.options.plugins?.tooltip as Record<string, unknown> | undefined
    if (tooltip) {
      (tooltip as Record<string, unknown>).enabled = true
    }
  }, [])

  const annotations: Record<string, unknown>[] = []

  if (warningThreshold !== undefined) {
    annotations.push({
      type: 'line',
      yMin: warningThreshold,
      yMax: warningThreshold,
      borderColor: 'rgba(245, 158, 11, 0.5)',
      borderWidth: 1,
      borderDash: [5, 5],
      label: {
        display: true,
        content: `警告: ${warningThreshold}%`,
        position: 'start',
        color: 'rgba(245, 158, 11, 0.7)',
        font: { size: 10 },
      },
    })
  }

  if (dangerThreshold !== undefined) {
    annotations.push({
      type: 'line',
      yMin: dangerThreshold,
      yMax: dangerThreshold,
      borderColor: 'rgba(239, 68, 68, 0.5)',
      borderWidth: 1,
      borderDash: [5, 5],
      label: {
        display: true,
        content: `危险: ${dangerThreshold}%`,
        position: 'start',
        color: 'rgba(239, 68, 68, 0.7)',
        font: { size: 10 },
      },
    })
  }

  const chartData = {
    labels: data.map((d) => d.time),
    datasets: [
      {
        label,
        data: data.map((d) => d.value),
        borderColor: color,
        backgroundColor: color.replace('1)', '0.1)'),
        fill: true,
        tension: 0.4,
        pointRadius: 0,
        pointHoverRadius: 4,
        borderWidth: 2,
      },
    ],
  }

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    animation: {
      duration: 500,
    },
    scales: {
      x: {
        display: true,
        grid: {
          color: 'rgba(148, 163, 184, 0.1)',
        },
        ticks: {
          color: 'rgba(148, 163, 184, 0.5)',
          maxTicksLimit: 8,
          font: { size: 10 },
        },
      },
      y: {
        display: true,
        min: 0,
        max: 100,
        grid: {
          color: 'rgba(148, 163, 184, 0.1)',
        },
        ticks: {
          color: 'rgba(148, 163, 184, 0.5)',
          font: { size: 10 },
          callback: (value: string | number) => `${value}%`,
        },
      },
    },
    plugins: {
      legend: {
        display: true,
        labels: {
          color: 'rgba(148, 163, 184, 0.8)',
          font: { size: 12 },
        },
      },
      tooltip: {
        backgroundColor: 'rgba(15, 23, 42, 0.9)',
        titleColor: 'rgba(148, 163, 184, 1)',
        bodyColor: 'rgba(148, 163, 184, 1)',
        borderColor: 'rgba(148, 163, 184, 0.2)',
        borderWidth: 1,
        callbacks: {
          label: (context: { parsed: { y: number | null } }) => `${context.parsed.y ?? 0}%`,
        },
      },
    },
  }

  return (
    <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-4">
      <Line ref={chartRef} data={chartData} options={options} />
    </div>
  )
}
