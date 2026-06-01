
import { cn } from '@/lib/utils';

interface TextInputProps {
  value: string;
  onChange: (value: string) => void;
  className?: string;
}

export function TextInput({ value, onChange, className }: TextInputProps) {
  const handlePaste = async () => {
    try {
      const text = await navigator.clipboard.readText();
      onChange(text);
    } catch (e) {
      console.error('粘贴失败:', e);
    }
  };

  const handleClear = () => {
    onChange('');
  };

  const maxLength = 500;

  return (
    <div className={cn('space-y-3', className)}>
      <div className="flex items-center justify-between">
        <label className="text-sm font-medium text-slate-700">输入文本</label>
        <div className="flex items-center gap-2">
          <button
            onClick={handlePaste}
            className="text-sm text-blue-600 hover:text-blue-700 transition-colors"
          >
            粘贴
          </button>
          <button
            onClick={handleClear}
            className="text-sm text-red-500 hover:text-red-600 transition-colors"
          >
            清空
          </button>
        </div>
      </div>
      <div className="relative">
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          maxLength={maxLength}
          placeholder="请输入要合成的文本..."
          className="w-full h-48 px-4 py-3 border-2 border-slate-200 rounded-xl resize-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/20 outline-none transition-all"
        />
        <div className="absolute bottom-3 right-3 text-xs text-slate-400">
          {value.length}/{maxLength}
        </div>
      </div>
    </div>
  );
}

