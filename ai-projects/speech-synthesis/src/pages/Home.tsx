
import { useState, useEffect } from 'react';
import { useSpeechSynthesis } from '@/hooks/useSpeechSynthesis';
import { storage } from '@/utils/storage';
import { SpeechConfig, HistoryItem } from '@/types';
import { TextInput } from '@/components/TextInput';
import { VoiceSettings } from '@/components/VoiceSettings';
import { PlaybackControl } from '@/components/PlaybackControl';
import { HistoryList } from '@/components/HistoryList';
import { WaveVisualizer } from '@/components/WaveVisualizer';

export function Home() {
  const { isSupported, isSpeaking, voices, speak, cancel, pause, resume } = useSpeechSynthesis();
  
  const [text, setText] = useState('你好，欢迎使用语音合成！');
  const [config, setConfig] = useState<Omit<SpeechConfig, 'text'>>({
    rate: 1,
    pitch: 1,
    volume: 1,
    voiceIndex: 0,
  });
  const [history, setHistory] = useState<HistoryItem[]>([]);

  // 加载历史记录
  useEffect(() => {
    setHistory(storage.getHistory());
  }, []);

  const handleSpeak = () => {
    if (!text.trim()) return;
    
    const fullConfig: SpeechConfig = {
      text,
      ...config,
    };
    
    speak(fullConfig);
    
    // 保存到历史
    const item: HistoryItem = {
      id: Date.now().toString(),
      text,
      timestamp: Date.now(),
      config: fullConfig,
    };
    storage.saveHistory(item);
    setHistory(storage.getHistory());
  };

  const handleReplay = () => {
    if (!text.trim()) return;
    speak({ text, ...config });
  };

  const handleHistoryPlay = (item: HistoryItem) => {
    setText(item.text);
    setConfig({
      rate: item.config.rate,
      pitch: item.config.pitch,
      volume: item.config.volume,
      voiceIndex: item.config.voiceIndex,
    });
    speak(item.config);
  };

  const handleClearHistory = () => {
    storage.clearHistory();
    setHistory([]);
  };

  if (!isSupported) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-slate-800 mb-4">
            浏览器不支持
          </h1>
          <p className="text-slate-500">
            您的浏览器不支持 Web Speech API
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-slate-800 mb-2">
            语音合成
          </h1>
          <p className="text-slate-500">
            将文本转换为自然的语音
          </p>
        </div>

        <div className="grid gap-6">
          {/* 文本输入区域 */}
          <div className="bg-white rounded-2xl shadow-xl p-6">
            <TextInput value={text} onChange={setText} />
          </div>

          {/* 波形可视化 */}
          <div className="bg-white rounded-2xl shadow-xl p-6">
            <WaveVisualizer isPlaying={isSpeaking} />
          </div>

          {/* 播放控制 */}
          <div className="bg-white rounded-2xl shadow-xl p-6 flex justify-center">
            <PlaybackControl
              isPlaying={isSpeaking}
              onPlay={handleSpeak}
              onStop={cancel}
              onPause={pause}
              onResume={resume}
              onReplay={handleReplay}
              disabled={!text.trim()}
            />
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {/* 语音设置 */}
            <div className="bg-white rounded-2xl shadow-xl p-6">
              <VoiceSettings
                config={config}
                voices={voices}
                onChange={setConfig}
              />
            </div>

            {/* 历史记录 */}
            <div className="bg-white rounded-2xl shadow-xl p-6">
              <HistoryList
                history={history}
                onPlay={handleHistoryPlay}
                onClear={handleClearHistory}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

