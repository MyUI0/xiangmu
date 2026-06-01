
import { HistoryItem } from '@/types';

const HISTORY_KEY = 'speech_history';
const MAX_HISTORY = 10;

export const storage = {
  getHistory(): HistoryItem[] {
    try {
      const data = localStorage.getItem(HISTORY_KEY);
      return data ? JSON.parse(data) : [];
    } catch (e) {
      return [];
    }
  },

  saveHistory(item: HistoryItem): void {
    const history = this.getHistory();
    const newHistory = [item, ...history.filter(h => h.id !== item.id)].slice(0, MAX_HISTORY);
    localStorage.setItem(HISTORY_KEY, JSON.stringify(newHistory));
  },

  clearHistory(): void {
    localStorage.removeItem(HISTORY_KEY);
  },
};

