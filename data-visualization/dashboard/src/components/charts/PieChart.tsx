
import { Doughnut } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { ChartData } from '@/types';

ChartJS.register(ArcElement, Title, Tooltip, Legend);

interface PieChartProps {
  data: ChartData;
  title?: string;
}

export function PieChart({ data, title }: PieChartProps) {
  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'right' as const,
        labels: {
          color: '#e2e8f0',
          padding: 20,
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
  };

  return <Doughnut data={data} options={options} />;
}

