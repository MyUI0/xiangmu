import { ReactNode } from 'react';

interface StatCardProps {
  title: string;
  value: number;
  icon: ReactNode;
  color: string;
  trend?: string;
}

export default function StatCard({ title, value, icon, color, trend }: StatCardProps) {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-6 hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-slate-500 font-medium">{title}</p>
          <p className="text-3xl font-bold text-slate-900 mt-1">{value.toLocaleString()}</p>
          {trend && (
            <p className="text-sm text-green-600 mt-2">{trend}</p>
          )}
        </div>
        <div className={`p-4 rounded-xl ${color}`}>
          {icon}
        </div>
      </div>
    </div>
  );
}
