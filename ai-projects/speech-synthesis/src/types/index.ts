
// 语音合成参数
export interface SpeechConfig {
  text: string;
  rate: number;    // 语速 0.1-2
  pitch: number;   // 音调 0-2
  volume: number;  // 音量 0-1
  voiceIndex: number; // 音色索引
}

// 历史记录项
export interface HistoryItem {
  id: string;
  text: string;
  timestamp: number;
  config: SpeechConfig;
}

