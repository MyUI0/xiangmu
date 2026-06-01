import { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Search, Filter } from 'lucide-react';
import { useAppStore } from '../store/useAppStore';
import { Article } from '../types';

export default function Articles() {
  const { articles, fetchArticles, deleteArticle, addArticle, updateArticle } = useAppStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingArticle, setEditingArticle] = useState<Article | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    category: '技术',
    status: 'draft' as const,
    views: 0,
    comments: 0
  });

  useEffect(() => {
    fetchArticles();
  }, [fetchArticles]);

  const filteredArticles = articles.filter(article =>
    article.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingArticle) {
      updateArticle(editingArticle.id, formData);
    } else {
      addArticle(formData);
    }
    setIsModalOpen(false);
    setEditingArticle(null);
    setFormData({
      title: '',
      content: '',
      category: '技术',
      status: 'draft',
      views: 0,
      comments: 0
    });
  };

  const handleEdit = (article: Article) => {
    setEditingArticle(article);
    setFormData(article);
    setIsModalOpen(true);
  };

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold text-slate-900">文章管理</h1>
        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus className="w-5 h-5" />
          新建文章
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-4 mb-6 flex items-center gap-4">
        <div className="relative flex-1">
          <Search className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="搜索文章..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <button className="flex items-center gap-2 px-4 py-2 border border-slate-200 rounded-lg hover:bg-slate-50">
          <Filter className="w-5 h-5" />
          筛选
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
        <table className="w-full">
          <thead className="bg-slate-50">
            <tr>
              <th className="text-left px-6 py-4 text-sm font-semibold text-slate-600">标题</th>
              <th className="text-left px-6 py-4 text-sm font-semibold text-slate-600">分类</th>
              <th className="text-left px-6 py-4 text-sm font-semibold text-slate-600">状态</th>
              <th className="text-left px-6 py-4 text-sm font-semibold text-slate-600">浏览量</th>
              <th className="text-left px-6 py-4 text-sm font-semibold text-slate-600">评论数</th>
              <th className="text-left px-6 py-4 text-sm font-semibold text-slate-600">更新时间</th>
              <th className="text-right px-6 py-4 text-sm font-semibold text-slate-600">操作</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {filteredArticles.map((article) => (
              <tr key={article.id} className="hover:bg-slate-50">
                <td className="px-6 py-4">
                  <div className="font-medium text-slate-900">{article.title}</div>
                </td>
                <td className="px-6 py-4 text-slate-600">{article.category}</td>
                <td className="px-6 py-4">
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                    article.status === 'published' ? 'bg-green-100 text-green-700' :
                    article.status === 'draft' ? 'bg-amber-100 text-amber-700' :
                    'bg-slate-100 text-slate-700'
                  }`}>
                    {article.status === 'published' ? '已发布' :
                     article.status === 'draft' ? '草稿' : '归档'}
                  </span>
                </td>
                <td className="px-6 py-4 text-slate-600">{article.views.toLocaleString()}</td>
                <td className="px-6 py-4 text-slate-600">{article.comments}</td>
                <td className="px-6 py-4 text-slate-600">
                  {new Date(article.updatedAt).toLocaleDateString('zh-CN')}
                </td>
                <td className="px-6 py-4 text-right">
                  <div className="flex items-center justify-end gap-2">
                    <button
                      onClick={() => handleEdit(article)}
                      className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => deleteArticle(article.id)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-slate-200">
              <h2 className="text-xl font-bold text-slate-900">
                {editingArticle ? '编辑文章' : '新建文章'}
              </h2>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">标题</label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">内容</label>
                <textarea
                  value={formData.content}
                  onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                  className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  rows={8}
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">分类</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="技术">技术</option>
                    <option value="生活">生活</option>
                    <option value="设计">设计</option>
                    <option value="其他">其他</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">状态</label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
                    className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="draft">草稿</option>
                    <option value="published">已发布</option>
                    <option value="archived">归档</option>
                  </select>
                </div>
              </div>
              <div className="flex items-center justify-end gap-4 pt-4">
                <button
                  type="button"
                  onClick={() => {
                    setIsModalOpen(false);
                    setEditingArticle(null);
                  }}
                  className="px-4 py-2 border border-slate-200 rounded-lg hover:bg-slate-50"
                >
                  取消
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  {editingArticle ? '保存' : '发布'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
