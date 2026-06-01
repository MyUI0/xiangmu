import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface RecognitionTag {
  name: string;
  confidence: number;
}

export interface RecognitionRecord {
  id: string;
  imageData: string;
  tags: RecognitionTag[];
  timestamp: number;
}

interface ImageStore {
  currentImage: string | null;
  isRecognizing: boolean;
  recognitionResult: RecognitionTag[];
  history: RecognitionRecord[];
  setCurrentImage: (image: string | null) => void;
  setIsRecognizing: (isRecognizing: boolean) => void;
  setRecognitionResult: (tags: RecognitionTag[]) => void;
  addToHistory: (record: RecognitionRecord) => void;
  clearHistory: () => void;
}

export const useImageStore = create<ImageStore>()(
  persist(
    (set) => ({
      currentImage: null,
      isRecognizing: false,
      recognitionResult: [],
      history: [],
      setCurrentImage: (image) => set({ currentImage: image }),
      setIsRecognizing: (isRecognizing) => set({ isRecognizing }),
      setRecognitionResult: (tags) => set({ recognitionResult: tags }),
      addToHistory: (record) =>
        set((state) => ({
          history: [record, ...state.history].slice(0, 10) })),
      clearHistory: () => set({ history: [] }),
    }),
    {
      name: 'image-recognition-storage',
    }
  )
);
