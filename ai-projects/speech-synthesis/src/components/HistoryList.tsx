
import { HistoryItem, SpeechConfig } from '@/types';
import { Play, Trash2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface HistoryListProps {
  history: HistoryItem[];
  onPlay: (item: HistoryItem) => void;
  onClear: () => void;
  className?: string;
}

export function HistoryList({ history, onPlay, onClear, className }: HistoryListProps) {
  const formatTime = (timestamp: number) => {
    const date = new Date(timestamp);
    return date.toLocaleString('zh-CN', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const truncateText = (text: string, maxLength: number = 50) => {
    if (text.length <= maxLength) return text;
    return text.slice(0, maxLength) + '...';
  };

  return (
    <div className={cn('space-y-4', className)}>
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-slate-800">历史记录</h3>
        {history.length > 0 && (
          <button
            onClick={onClear}
            className="text-sm text-red-500 hover:text-red-600 transition-colors flex items-center gap-1"
          >
            <Trash2 className="w-4 h-4" />
            清空
          </button>
        )}
      </div>
      
      {history.length === 0 ? (
        <div className="text-center py-12 text-slate-400">
          <p>暂无历史记录</p>
        </div>
      ) : (
        <div className="space-y-3 max-h-80 overflow-y-auto">
          {history.map((item) => (
            <div
              key={item.id}
              className="flex items-start gap-3 p-4 bg-slate-50 rounded-xl hover:bg-slate-100 transition-colors group"
            >
              <div className="flex-1 min-w-0">
                <p className="text-slate-700 line-clamp-2">
                  {truncateText(item.text)}
                </p>
                <p className="text-xs text-slate-400 mt-1">
                  {formatTime(item.timestamp)}
                </p>
              </div>
              <button
                onClick={() => onPlay(item)}
                className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center hover:bg-blue-200 transition-colors opacity-0 group-hover:opacity-100"
              >
                <Play className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

