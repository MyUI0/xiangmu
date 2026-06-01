
import { useState } from 'react';
import { StatCard } from '@/components/cards/StatCard';
import { LineChart } from '@/components/charts/LineChart';
import { BarChart } from '@/components/charts/BarChart';
import { PieChart } from '@/components/charts/PieChart';
import { RadarChart } from '@/components/charts/RadarChart';
import { ControlPanel } from '@/components/layout/ControlPanel';
import {
  statData,
  lineChartData,
  barChartData,
  pieChartData,
  radarChartData,
  generateRandomData,
} from '@/data/mockData';

export function Home() {
  const [stats, setStats] = useState(statData);

  const handleRefresh = () => {
    setStats(
      stats.map((stat) => ({
        ...stat,
        value: generateRandomData(),
        change: parseFloat((Math.random() * 20 - 10).toFixed(1)),
      }))
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">数据仪表盘</h1>
          <p className="text-slate-400">实时数据可视化分析平台</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat) => (
            <StatCard key={stat.id} data={stat} />
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20 shadow-xl">
            <div className="h-80">
              <LineChart data={lineChartData} title="访问趋势" />
            </div>
          </div>
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20 shadow-xl">
            <div className="h-80">
              <BarChart data={barChartData} title="产品销量" />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-24">
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20 shadow-xl">
            <div className="h-80">
              <PieChart data={pieChartData} title="访问来源" />
            </div>
          </div>
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20 shadow-xl">
            <div className="h-80">
              <RadarChart data={radarChartData} title="产品评价" />
            </div>
          </div>
        </div>

        <ControlPanel onRefresh={handleRefresh} />
      </div>
    </div>
  );
}

