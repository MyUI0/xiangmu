
import { useState, useEffect, useRef, useCallback } from 'react';
import { SpeechConfig } from '@/types';

interface UseSpeechSynthesisReturn {
  isSupported: boolean;
  isSpeaking: boolean;
  voices: SpeechSynthesisVoice[];
  speak: (config: SpeechConfig) => void;
  cancel: () => void;
  pause: () => void;
  resume: () => void;
}

export function useSpeechSynthesis(): UseSpeechSynthesisReturn {
  const [isSupported, setIsSupported] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
  const synthesisRef = useRef<SpeechSynthesis | null>(null);

  useEffect(() => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      setIsSupported(true);
      synthesisRef.current = window.speechSynthesis;
      
      const loadVoices = () => {
        setVoices(synthesisRef.current?.getVoices() || []);
      };
      
      loadVoices();
      
      synthesisRef.current?.addEventListener('voiceschanged', loadVoices);
      
      return () => {
        synthesisRef.current?.removeEventListener('voiceschanged', loadVoices);
      };
    }
  }, []);

  const speak = useCallback((config: SpeechConfig) => {
    if (!synthesisRef.current) return;
    
    synthesisRef.current.cancel();
    
    const utterance = new SpeechSynthesisUtterance(config.text);
    
    if (voices[config.voiceIndex]) {
      utterance.voice = voices[config.voiceIndex];
    }
    utterance.rate = config.rate;
    utterance.pitch = config.pitch;
    utterance.volume = config.volume;
    
    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);
    
    synthesisRef.current.speak(utterance);
  }, [voices]);

  const cancel = useCallback(() => {
    synthesisRef.current?.cancel();
    setIsSpeaking(false);
  }, []);

  const pause = useCallback(() => {
    synthesisRef.current?.pause();
  }, []);

  const resume = useCallback(() => {
    synthesisRef.current?.resume();
  }, []);

  return {
    isSupported,
    isSpeaking,
    voices,
    speak,
    cancel,
    pause,
    resume,
  };
}

