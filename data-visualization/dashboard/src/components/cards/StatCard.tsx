
import { Users, DollarSign, ShoppingCart, TrendingUp } from 'lucide-react';
import { StatData } from '@/types';

interface StatCardProps {
  data: StatData;
}

const iconMap = {
  users: Users,
  dollar: DollarSign,
  cart: ShoppingCart,
  trending: TrendingUp,
};

const colorMap = {
  blue: 'bg-blue-500',
  green: 'bg-green-500',
  orange: 'bg-orange-500',
  purple: 'bg-purple-500',
};

export function StatCard({ data }: StatCardProps) {
  const Icon = iconMap[data.icon as keyof typeof iconMap];
  
  return (
    <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20 shadow-xl hover:shadow-2xl transition-all">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-slate-300 text-sm">{data.label}</p>
          <h3 className="text-3xl font-bold text-white mt-2">
            {data.value.toLocaleString()}
          </h3>
        </div>
        <div className={`${colorMap[data.color as keyof typeof colorMap]} p-3 rounded-xl`}>
          <Icon className="w-6 h-6 text-white" />
        </div>
      </div>
      <div className="mt-4 flex items-center gap-2">
        <span className={`text-sm font-medium ${data.change >= 0 ? 'text-green-400' : 'text-red-400'}`}>
          {data.change >= 0 ? '↑' : '↓'} {Math.abs(data.change)}%
        </span>
        <span className="text-slate-400 text-sm">vs 上月</span>
      </div>
    </div>
  );
}

