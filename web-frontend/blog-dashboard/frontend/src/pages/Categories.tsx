import { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Tag } from 'lucide-react';

interface Category {
  id: number;
  name: string;
  description: string;
  articleCount: number;
  createdAt: string;
}

const mockCategories: Category[] = [
  { id: 1, name: '技术', description: '技术相关文章', articleCount: 15, createdAt: '2024-01-01' },
  { id: 2, name: '生活', description: '生活分享', articleCount: 8, createdAt: '2024-01-02' },
  { id: 3, name: '设计', description: '设计灵感', articleCount: 5, createdAt: '2024-01-03' },
  { id: 4, name: '其他', description: '其他内容', articleCount: 3, createdAt: '2024-01-04' },
];

export default function Categories() {
  const [categories, setCategories] = useState<Category[]>(mockCategories);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [formData, setFormData] = useState({ name: '', description: '' });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingCategory) {
      setCategories(categories.map(c =>
        c.id === editingCategory.id ? { ...c, ...formData } : c
      ));
    } else {
      const newCategory: Category = {
        id: Date.now(),
        name: formData.name,
        description: formData.description,
        articleCount: 0,
        createdAt: new Date().toISOString().split('T')[0],
      };
      setCategories([...categories, newCategory]);
    }
    setIsModalOpen(false);
    setEditingCategory(null);
    setFormData({ name: '', description: '' });
  };

  const handleDelete = (id: number) => {
    setCategories(categories.filter(c => c.id !== id));
  };

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold text-slate-900">分类管理</h1>
        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus className="w-5 h-5" />
          新建分类
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {categories.map((category) => (
          <div key={category.id} className="bg-white rounded-xl shadow-sm border border-slate-100 p-6 hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between mb-4">
              <div className="p-3 bg-blue-100 rounded-lg">
                <Tag className="w-6 h-6 text-blue-600" />
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => {
                    setEditingCategory(category);
                    setFormData({ name: category.name, description: category.description });
                    setIsModalOpen(true);
                  }}
                  className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg"
                >
                  <Edit className="w-4 h-4" />
                </button>
                {category.articleCount === 0 && (
                  <button
                    onClick={() => handleDelete(category.id)}
                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>
            <h3 className="text-lg font-semibold text-slate-900 mb-2">{category.name}</h3>
            <p className="text-sm text-slate-500 mb-4">{category.description}</p>
            <div className="flex items-center justify-between text-sm">
              <span className="text-slate-500">文章数: {category.articleCount}</span>
              <span className="text-slate-400">{category.createdAt}</span>
            </div>
          </div>
        ))}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl w-full max-w-md">
            <div className="p-6 border-b border-slate-200">
              <h2 className="text-xl font-bold text-slate-900">
                {editingCategory ? '编辑分类' : '新建分类'}
              </h2>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">分类名称</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">描述</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  rows={3}
                />
              </div>
              <div className="flex items-center justify-end gap-4 pt-4">
                <button
                  type="button"
                  onClick={() => {
                    setIsModalOpen(false);
                    setEditingCategory(null);
                  }}
                  className="px-4 py-2 border border-slate-200 rounded-lg hover:bg-slate-50"
                >
                  取消
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  保存
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
