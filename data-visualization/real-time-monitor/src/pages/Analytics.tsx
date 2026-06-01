import { useState, useMemo } from 'react'
import { motion } from 'framer-motion'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  PointElement,
  LineElement,
  Filler,
  Title,
  Tooltip,
  Legend,
} from 'chart.js'
import { Bar, Pie, Line } from 'react-chartjs-2'

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  PointElement,
  LineElement,
  Filler,
  Title,
  Tooltip,
  Legend
)

type TimeRange = '1h' | '6h' | '24h' | '7d'

const timeRanges: { value: TimeRange; label: string }[] = [
  { value: '1h', label: '1小时' },
  { value: '6h', label: '6小时' },
  { value: '24h', label: '24小时' },
  { value: '7d', label: '7天' },
]

function generateLabels(range: TimeRange): string[] {
  const count = range === '1h' ? 12 : range === '6h' ? 24 : range === '24h' ? 24 : 7
  const labels: string[] = []
  for (let i = 0; i < count; i++) {
    if (range === '7d') {
      const d = new Date(Date.now() - (6 - i) * 86400000)
      labels.push(`${d.getMonth() + 1}/${d.getDate()}`)
    } else {
      labels.push(`${i}`)
    }
  }
  return labels
}

function generateData(count: number, min: number, max: number): number[] {
  return Array.from({ length: count }, () =>
    Math.floor(Math.random() * (max - min + 1)) + min
  )
}

export default function Analytics() {
  const [timeRange, setTimeRange] = useState<TimeRange>('24h')

  const labels = useMemo(() => generateLabels(timeRange), [timeRange])
  const dataCount = labels.length

  const barData = {
    labels,
    datasets: [
      {
        label: 'CPU平均使用率',
        data: generateData(dataCount, 20, 80),
        backgroundColor: 'rgba(6, 182, 212, 0.6)',
        borderColor: 'rgba(6, 182, 212, 1)',
        borderWidth: 1,
        borderRadius: 4,
      },
      {
        label: '内存平均使用率',
        data: generateData(dataCount, 30, 90),
        backgroundColor: 'rgba(139, 92, 246, 0.6)',
        borderColor: 'rgba(139, 92, 246, 1)',
        borderWidth: 1,
        borderRadius: 4,
      },
    ],
  }

  const pieData = {
    labels: ['CPU', '内存', '网络', '温度'],
    datasets: [
      {
        data: [35, 30, 20, 15],
        backgroundColor: [
          'rgba(6, 182, 212, 0.8)',
          'rgba(139, 92, 246, 0.8)',
          'rgba(34, 197, 94, 0.8)',
          'rgba(249, 115, 22, 0.8)',
        ],
        borderColor: 'rgba(15, 23, 42, 0.8)',
        borderWidth: 2,
      },
    ],
  }

  const areaData = {
    labels,
    datasets: [
      {
        label: '网络流量 (Mbps)',
        data: generateData(dataCount, 10, 100),
        borderColor: 'rgba(34, 197, 94, 1)',
        backgroundColor: 'rgba(34, 197, 94, 0.1)',
        fill: true,
        tension: 0.4,
        pointRadius: 2,
        borderWidth: 2,
      },
      {
        label: '请求量 (req/s)',
        data: generateData(dataCount, 50, 500),
        borderColor: 'rgba(6, 182, 212, 1)',
        backgroundColor: 'rgba(6, 182, 212, 0.1)',
        fill: true,
        tension: 0.4,
        pointRadius: 2,
        borderWidth: 2,
      },
    ],
  }

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      x: {
        grid: { color: 'rgba(148, 163, 184, 0.1)' },
        ticks: { color: 'rgba(148, 163, 184, 0.5)', font: { size: 10 } },
      },
      y: {
        grid: { color: 'rgba(148, 163, 184, 0.1)' },
        ticks: { color: 'rgba(148, 163, 184, 0.5)', font: { size: 10 } },
      },
    },
    plugins: {
      legend: {
        labels: { color: 'rgba(148, 163, 184, 0.8)', font: { size: 12 } },
      },
      tooltip: {
        backgroundColor: 'rgba(15, 23, 42, 0.9)',
        titleColor: 'rgba(148, 163, 184, 1)',
        bodyColor: 'rgba(148, 163, 184, 1)',
        borderColor: 'rgba(148, 163, 184, 0.2)',
        borderWidth: 1,
      },
    },
  }

  const pieOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom' as const,
        labels: { color: 'rgba(148, 163, 184, 0.8)', font: { size: 12 }, padding: 20 },
      },
      tooltip: {
        backgroundColor: 'rgba(15, 23, 42, 0.9)',
        titleColor: 'rgba(148, 163, 184, 1)',
        bodyColor: 'rgba(148, 163, 184, 1)',
      },
    },
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Time Range Selector */}
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold text-slate-200">数据分析</h1>
        <div className="flex gap-2">
          {timeRanges.map((range) => (
            <button
              key={range.value}
              onClick={() => setTimeRange(range.value)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                timeRange === range.value
                  ? 'bg-cyan-500/20 text-cyan-400'
                  : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200'
              }`}
            >
              {range.label}
            </button>
          ))}
        </div>
      </div>

      {/* Bar Chart */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-slate-900/50 border border-slate-800 rounded-xl p-6 mb-8"
      >
        <h2 className="text-lg font-semibold text-slate-200 mb-4">资源使用对比</h2>
        <div className="h-80">
          <Bar data={barData} options={chartOptions} />
        </div>
      </motion.div>

      {/* Pie + Area */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-slate-900/50 border border-slate-800 rounded-xl p-6"
        >
          <h2 className="text-lg font-semibold text-slate-200 mb-4">资源占比分布</h2>
          <div className="h-80">
            <Pie data={pieData} options={pieOptions} />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-slate-900/50 border border-slate-800 rounded-xl p-6"
        >
          <h2 className="text-lg font-semibold text-slate-200 mb-4">流量趋势</h2>
          <div className="h-80">
            <Line data={areaData} options={chartOptions} />
          </div>
        </motion.div>
      </div>
    </div>
  )
}
