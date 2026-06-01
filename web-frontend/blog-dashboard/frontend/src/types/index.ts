export type ArticleStatus = 'published' | 'draft' | 'archived';

export interface Article {
  id: number;
  title: string;
  content: string;
  category: string;
  status: ArticleStatus;
  views: number;
  comments: number;
  createdAt: string;
  updatedAt: string;
}

export interface Statistics {
  totalArticles: number;
  totalViews: number;
  todayViews: number;
  totalComments: number;
}

export interface TrendData {
  date: string;
  views: number;
}

export interface CategoryData {
  name: string;
  value: number;
}
