import React from "react";
import { ImageUploader } from "@/components/ImageUploader";
import { ResultDisplay } from "@/components/ResultDisplay";
import { HistoryList } from "@/components/HistoryList";
import { useImageStore, RecognitionRecord } from "@/store/useImageStore";
import { mockImageRecognition } from "@/utils/imageRecognition";
import { Sparkles } from "lucide-react";

export default function Home() {
  const {
    currentImage,
    isRecognizing,
    recognitionResult,
    history,
    setCurrentImage,
    setIsRecognizing,
    setRecognitionResult,
    addToHistory,
    clearHistory,
  } = useImageStore();

  const handleImageSelect = async (imageData: string) => {
    setCurrentImage(imageData);
    setRecognitionResult([]);
    setIsRecognizing(true);

    try {
      const tags = await mockImageRecognition(imageData);
      setRecognitionResult(tags);
      
      const record: RecognitionRecord = {
        id: Date.now().toString(),
        imageData,
        tags,
        timestamp: Date.now(),
      };
      addToHistory(record);
    } catch (error) {
      console.error("识别失败:", error);
    } finally {
      setIsRecognizing(false);
    }
  };

  const handleClear = () => {
    setCurrentImage(null);
    setRecognitionResult([]);
  };

  const handleSelectRecord = (record: RecognitionRecord) => {
    setCurrentImage(record.imageData);
    setRecognitionResult(record.tags);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <div className="container mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Sparkles className="h-10 w-10 text-mint-green" />
            <h1 className="text-5xl font-bold font-playfair text-deep-blue">
              图像识别演示
            </h1>
          </div>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            上传任意图片，体验 AI 图像识别的魅力
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <ImageUploader
              onImageSelect={handleImageSelect}
              currentImage={currentImage}
              onClear={handleClear}
            />
          </div>

          {currentImage && (
            <div className="mb-8">
              {!isRecognizing && recognitionResult.length === 0 && (
                <button
                  onClick={() => handleImageSelect(currentImage)}
                  className="w-full py-4 bg-gradient-to-r from-mint-green to-emerald-500 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all"
                >
                  开始识别
                </button>
              )}
              <div className="mt-8">
                <ResultDisplay
                  tags={recognitionResult}
                  isLoading={isRecognizing}
                />
              </div>
            </div>
          )}

          <HistoryList
            history={history}
            onSelectRecord={handleSelectRecord}
            onClearHistory={clearHistory}
          />
        </div>
      </div>
    </div>
  );
}