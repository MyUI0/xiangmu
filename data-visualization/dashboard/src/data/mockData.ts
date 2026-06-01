
import { StatData, ChartData } from '@/types';

export const statData: StatData[] = [
  {
    id: '1',
    label: '总用户',
    value: 12847,
    change: 12.5,
    icon: 'users',
    color: 'blue',
  },
  {
    id: '2',
    label: '总收入',
    value: 89420,
    change: 8.2,
    icon: 'dollar',
    color: 'green',
  },
  {
    id: '3',
    label: '订单数量',
    value: 3421,
    change: -2.4,
    icon: 'cart',
    color: 'orange',
  },
  {
    id: '4',
    label: '转化率',
    value: 4.8,
    change: 1.2,
    icon: 'trending',
    color: 'purple',
  },
];

export const lineChartData: ChartData = {
  labels: ['1月', '2月', '3月', '4月', '5月', '6月'],
  datasets: [
    {
      label: '访问量',
      data: [6500, 5900, 8000, 8100, 5600, 5500],
      borderColor: '#14B8A6',
      backgroundColor: 'rgba(20, 184, 166, 0.1)',
      tension: 0.4,
      fill: true,
    },
    {
      label: '用户数',
      data: [2800, 4800, 4000, 1900, 8600, 2700],
      borderColor: '#8B5CF6',
      backgroundColor: 'rgba(139, 92, 246, 0.1)',
      tension: 0.4,
      fill: true,
    },
  ],
};

export const barChartData: ChartData = {
  labels: ['产品A', '产品B', '产品C', '产品D', '产品E'],
  datasets: [
    {
      label: '销量',
      data: [120, 190, 300, 250, 280],
      backgroundColor: [
        'rgba(20, 184, 166, 0.8)',
        'rgba(139, 92, 246, 0.8)',
        'rgba(245, 158, 11, 0.8)',
        'rgba(236, 72, 153, 0.8)',
        'rgba(59, 130, 246, 0.8)',
      ],
    },
  ],
};

export const pieChartData: ChartData = {
  labels: ['直接访问', '搜索引擎', '社交媒体', '邮件营销', '其他'],
  datasets: [
    {
      label: '访问来源',
      data: [300, 500, 100, 40, 60],
      backgroundColor: [
        '#14B8A6',
        '#8B5CF6',
        '#F59E0B',
        '#EC4899',
        '#3B82F6',
      ],
    },
  ],
};

export const radarChartData: ChartData = {
  labels: ['可用性', '性能', '设计', '功能', '支持', '价格'],
  datasets: [
    {
      label: '产品评分',
      data: [85, 90, 78, 88, 75, 82],
      borderColor: '#14B8A6',
      backgroundColor: 'rgba(20, 184, 166, 0.2)',
    },
  ],
};

export const generateRandomData = () => {
  return Math.floor(Math.random() * 10000);
};

