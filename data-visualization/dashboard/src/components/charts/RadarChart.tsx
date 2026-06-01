
import { Radar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { ChartData } from '@/types';

ChartJS.register(
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Title,
  Tooltip,
  Legend
);

interface RadarChartProps {
  data: ChartData;
  title?: string;
}

export function RadarChart({ data, title }: RadarChartProps) {
  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top' as const,
        labels: {
          color: '#e2e8f0',
        },
      },
      title: {
        display: !!title,
        text: title,
        color: '#f1f5f9',
        font: {
          size: 16,
          weight: 'bold' as const,
        },
      },
    },
    scales: {
      r: {
        grid: {
          color: 'rgba(255, 255, 255, 0.1)',
        },
        angleLines: {
          color: 'rgba(255, 255, 255, 0.1)',
        },
        pointLabels: {
          color: '#94a3b8',
        },
        ticks: {
          color: '#94a3b8',
        },
      },
    },
  };

  return <Radar data={data} options={options} />;
}

