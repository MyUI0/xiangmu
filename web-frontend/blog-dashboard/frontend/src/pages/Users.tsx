import { Users as UsersIcon } from 'lucide-react';

export default function Users() {
  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold text-slate-900 mb-8">用户管理</h1>
      <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-12 text-center">
        <UsersIcon className="w-16 h-16 text-slate-300 mx-auto mb-4" />
        <h2 className="text-xl font-semibold text-slate-700 mb-2">功能开发中</h2>
        <p className="text-slate-500">用户管理功能即将上线，敬请期待！</p>
      </div>
    </div>
  );
}
