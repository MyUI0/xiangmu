import React from "react";
import { RecognitionRecord } from "@/store/useImageStore";
import { History, Trash2 } from "lucide-react";

interface HistoryListProps {
  history: RecognitionRecord[];
  onSelectRecord: (record: RecognitionRecord) => void;
  onClearHistory: () => void;
}

export const HistoryList: React.FC<HistoryListProps> = ({
  history,
  onSelectRecord,
  onClearHistory,
}) => {
  if (history.length === 0) {
    return null;
  }

  const formatDate = (timestamp: number) => {
    const date = new Date(timestamp);
    return date.toLocaleDateString("zh-CN", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="mt-12">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <History className="h-6 w-6 text-deep-blue" />
          <h3 className="text-xl font-bold font-playfair text-deep-blue">
            历史记录
          </h3>
        </div>
        <button
          onClick={onClearHistory}
          className="flex items-center gap-2 px-4 py-2 text-sm text-red-500 hover:bg-red-50 rounded-lg transition-colors"
        >
          <Trash2 size={16} />
          清空历史
        </button>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {history.map((record) => (
          <div
            key={record.id}
            onClick={() => onSelectRecord(record)}
            className="group cursor-pointer"
          >
            <div className="relative aspect-square rounded-xl overflow-hidden shadow-md">
              <img
                src={record.imageData}
                alt="History"
                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
                <div className="absolute bottom-0 left-0 right-0 p-3">
                  <div className="flex flex-wrap gap-1">
                    {record.tags.slice(0, 2).map((tag, index) => (
                      <span
                        key={index}
                        className="px-2 py-0.5 bg-white/20 text-white text-xs rounded-full"
                      >
                        {tag.name}
                      </span>
                    ))}
                  </div>
                  <p className="text-white/80 text-xs mt-1">
                    {formatDate(record.timestamp)}
                  </p>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
