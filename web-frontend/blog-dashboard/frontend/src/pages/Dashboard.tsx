import { useEffect } from 'react';
import { FileText, Eye, MessageSquare, TrendingUp } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import StatCard from '../components/StatCard';
import { useAppStore } from '../store/useAppStore';

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'];

export default function Dashboard() {
  const { statistics, trendData, categoryData, fetchStatistics, articles, fetchArticles } = useAppStore();

  useEffect(() => {
    fetchStatistics();
    fetchArticles();
  }, [fetchStatistics, fetchArticles]);

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold text-slate-900 mb-8">仪表盘</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard
          title="总文章数"
          value={statistics.totalArticles}
          icon={<FileText className="w-6 h-6 text-white" />}
          color="bg-blue-500"
          trend="+12% 较上月"
        />
        <StatCard
          title="总访问量"
          value={statistics.totalViews}
          icon={<Eye className="w-6 h-6 text-white" />}
          color="bg-green-500"
          trend="+8% 较上月"
        />
        <StatCard
          title="今日访问"
          value={statistics.todayViews}
          icon={<TrendingUp className="w-6 h-6 text-white" />}
          color="bg-amber-500"
        />
        <StatCard
          title="总评论数"
          value={statistics.totalComments}
          icon={<MessageSquare className="w-6 h-6 text-white" />}
          color="bg-purple-500"
          trend="+15% 较上月"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-6">
          <h2 className="text-lg font-semibold text-slate-900 mb-4">访问趋势</h2>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={trendData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="date" stroke="#94a3b8" />
                <YAxis stroke="#94a3b8" />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#fff', border: '1px solid #e2e8f0', borderRadius: '8px' }}
                />
                <Line type="monotone" dataKey="views" stroke="#3b82f6" strokeWidth={2} fill="#dbeafe" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-6">
          <h2 className="text-lg font-semibold text-slate-900 mb-4">文章分类</h2>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={categoryData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {categoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-6">
        <h2 className="text-lg font-semibold text-slate-900 mb-4">最近文章</h2>
        <div className="space-y-4">
          {articles.slice(0, 5).map((article) => (
            <div key={article.id} className="flex items-center justify-between py-3 border-b border-slate-100 last:border-0">
              <div>
                <h3 className="font-medium text-slate-900">{article.title}</h3>
                <p className="text-sm text-slate-500">
                  {article.category} · {new Date(article.createdAt).toLocaleDateString('zh-CN')}
                </p>
              </div>
              <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                article.status === 'published' ? 'bg-green-100 text-green-700' :
                article.status === 'draft' ? 'bg-amber-100 text-amber-700' :
                'bg-slate-100 text-slate-700'
              }`}>
                {article.status === 'published' ? '已发布' :
                 article.status === 'draft' ? '草稿' : '归档'}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
