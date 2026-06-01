
import { SpeechConfig } from '@/types';
import { cn } from '@/lib/utils';

interface VoiceSettingsProps {
  config: Omit<SpeechConfig, 'text'>;
  voices: SpeechSynthesisVoice[];
  onChange: (config: Omit<SpeechConfig, 'text'>) => void;
  className?: string;
}

export function VoiceSettings({ config, voices, onChange, className }: VoiceSettingsProps) {
  return (
    <div className={cn('space-y-6', className)}>
      <h3 className="text-lg font-semibold text-slate-800">语音设置</h3>
      
      {/* 音色选择 */}
      <div className="space-y-2">
        <label className="text-sm font-medium text-slate-700">选择音色</label>
        <select
          value={config.voiceIndex}
          onChange={(e) => onChange({ ...config, voiceIndex: Number(e.target.value) })}
          className="w-full px-4 py-2 border-2 border-slate-200 rounded-xl focus:border-blue-500 focus:ring-4 focus:ring-blue-500/20 outline-none transition-all"
        >
          {voices.length === 0 ? (
            <option value={0}>加载中...</option>
          ) : (
            voices.map((voice, index) => (
              <option key={index} value={index}>
                {voice.name} ({voice.lang})
              </option>
            ))
          )}
        </select>
      </div>

      {/* 语速 */}
      <div className="space-y-2">
        <div className="flex justify-between">
          <label className="text-sm font-medium text-slate-700">语速</label>
          <span className="text-sm text-slate-500">{config.rate.toFixed(1)}x</span>
        </div>
        <input
          type="range"
          min="0.1"
          max="2"
          step="0.1"
          value={config.rate}
          onChange={(e) => onChange({ ...config, rate: Number(e.target.value) })}
          className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
        />
      </div>

      {/* 音调 */}
      <div className="space-y-2">
        <div className="flex justify-between">
          <label className="text-sm font-medium text-slate-700">音调</label>
          <span className="text-sm text-slate-500">{config.pitch.toFixed(1)}</span>
        </div>
        <input
          type="range"
          min="0"
          max="2"
          step="0.1"
          value={config.pitch}
          onChange={(e) => onChange({ ...config, pitch: Number(e.target.value) })}
          className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-orange-500"
        />
      </div>

      {/* 音量 */}
      <div className="space-y-2">
        <div className="flex justify-between">
          <label className="text-sm font-medium text-slate-700">音量</label>
          <span className="text-sm text-slate-500">{Math.round(config.volume * 100)}%</span>
        </div>
        <input
          type="range"
          min="0"
          max="1"
          step="0.1"
          value={config.volume}
          onChange={(e) => onChange({ ...config, volume: Number(e.target.value) })}
          className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-purple-500"
        />
      </div>
    </div>
  );
}

