
import { RefreshCw, Download, Settings } from 'lucide-react';

interface ControlPanelProps {
  onRefresh: () => void;
}

export function ControlPanel({ onRefresh }: ControlPanelProps) {
  return (
    <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 bg-white/10 backdrop-blur-lg rounded-2xl px-6 py-4 border border-white/20 shadow-2xl">
      <div className="flex items-center gap-4">
        <button
          onClick={onRefresh}
          className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-teal-500 to-cyan-500 text-white rounded-xl hover:from-teal-600 hover:to-cyan-600 transition-all hover:scale-105"
        >
          <RefreshCw className="w-4 h-4" />
          <span>刷新数据</span>
        </button>
        <button className="flex items-center gap-2 px-4 py-2 bg-white/20 text-white rounded-xl hover:bg-white/30 transition-all">
          <Download className="w-4 h-4" />
          <span>导出</span>
        </button>
        <button className="flex items-center gap-2 px-4 py-2 bg-white/20 text-white rounded-xl hover:bg-white/30 transition-all">
          <Settings className="w-4 h-4" />
          <span>设置</span>
        </button>
      </div>
    </div>
  );
}

