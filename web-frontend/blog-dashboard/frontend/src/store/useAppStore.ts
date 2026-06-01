import { create } from 'zustand';
import { Article, Statistics, TrendData, CategoryData } from '../types';

interface AppState {
  articles: Article[];
  statistics: Statistics;
  trendData: TrendData[];
  categoryData: CategoryData[];
  loading: boolean;
  fetchArticles: () => Promise<void>;
  fetchStatistics: () => Promise<void>;
  addArticle: (article: Omit<Article, 'id' | 'createdAt' | 'updatedAt'>) => Promise<void>;
  updateArticle: (id: number, article: Partial<Article>) => Promise<void>;
  deleteArticle: (id: number) => Promise<void>;
}

const API_BASE = 'http://localhost:5000/api';

export const useAppStore = create<AppState>((set, get) => ({
  articles: [],
  statistics: { totalArticles: 0, totalViews: 0, todayViews: 0, totalComments: 0 },
  trendData: [],
  categoryData: [],
  loading: false,

  fetchArticles: async () => {
    set({ loading: true });
    try {
      const response = await fetch(`${API_BASE}/articles`);
      const data = await response.json();
      set({ articles: data, loading: false });
    } catch (error) {
      console.error('Failed to fetch articles:', error);
      set({ loading: false });
    }
  },

  fetchStatistics: async () => {
    try {
      const [statsRes, trendRes, categoryRes] = await Promise.all([
        fetch(`${API_BASE}/statistics`),
        fetch(`${API_BASE}/trends`),
        fetch(`${API_BASE}/categories`)
      ]);
      const statistics = await statsRes.json();
      const trendData = await trendRes.json();
      const categoryData = await categoryRes.json();
      set({ statistics, trendData, categoryData });
    } catch (error) {
      console.error('Failed to fetch statistics:', error);
    }
  },

  addArticle: async (article) => {
    try {
      const response = await fetch(`${API_BASE}/articles`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(article),
      });
      const newArticle = await response.json();
      set(state => ({ articles: [...state.articles, newArticle] }));
    } catch (error) {
      console.error('Failed to add article:', error);
    }
  },

  updateArticle: async (id, article) => {
    try {
      const response = await fetch(`${API_BASE}/articles/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(article),
      });
      const updatedArticle = await response.json();
      set(state => ({
        articles: state.articles.map(a => a.id === id ? updatedArticle : a)
      }));
    } catch (error) {
      console.error('Failed to update article:', error);
    }
  },

  deleteArticle: async (id) => {
    try {
      await fetch(`${API_BASE}/articles/${id}`, { method: 'DELETE' });
      set(state => ({
        articles: state.articles.filter(a => a.id !== id)
      }));
    } catch (error) {
      console.error('Failed to delete article:', error);
    }
  },
}));
