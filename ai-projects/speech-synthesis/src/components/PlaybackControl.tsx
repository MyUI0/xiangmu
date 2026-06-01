
import { Play, Square, Pause, RotateCcw } from 'lucide-react';
import { cn } from '@/lib/utils';

interface PlaybackControlProps {
  isPlaying: boolean;
  onPlay: () => void;
  onStop: () => void;
  onPause: () => void;
  onResume: () => void;
  onReplay: () => void;
  disabled?: boolean;
  className?: string;
}

export function PlaybackControl({
  isPlaying,
  onPlay,
  onStop,
  onPause,
  onResume,
  onReplay,
  disabled = false,
  className,
}: PlaybackControlProps) {
  return (
    <div className={cn('flex items-center gap-4', className)}>
      <button
        onClick={isPlaying ? onPause : onPlay}
        disabled={disabled}
        className={cn(
          'flex items-center justify-center w-16 h-16 rounded-full transition-all transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed',
          isPlaying
            ? 'bg-orange-500 hover:bg-orange-600 text-white shadow-lg shadow-orange-500/30'
            : 'bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-600/30'
        )}
      >
        {isPlaying ? <Pause className="w-8 h-8" /> : <Play className="w-8 h-8 ml-1" />}
      </button>
      
      {isPlaying && (
        <button
          onClick={onResume}
          className="flex items-center justify-center w-12 h-12 rounded-full bg-slate-200 hover:bg-slate-300 text-slate-700 transition-all"
        >
          <Play className="w-5 h-5" />
        </button>
      )}
      
      <button
        onClick={onStop}
        disabled={disabled || !isPlaying}
        className="flex items-center justify-center w-12 h-12 rounded-full bg-slate-200 hover:bg-slate-300 text-slate-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <Square className="w-5 h-5" />
      </button>
      
      <button
        onClick={onReplay}
        disabled={disabled}
        className="flex items-center justify-center w-12 h-12 rounded-full bg-slate-200 hover:bg-slate-300 text-slate-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <RotateCcw className="w-5 h-5" />
      </button>
    </div>
  );
}

