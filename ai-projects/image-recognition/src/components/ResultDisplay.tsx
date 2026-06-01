import React from "react";
import { RecognitionTag } from "@/store/useImageStore";
import { Loader2, CheckCircle } from "lucide-react";

interface ResultDisplayProps {
  tags: RecognitionTag[];
  isLoading: boolean;
}

export const ResultDisplay: React.FC<ResultDisplayProps> = ({ tags, isLoading }) => {
  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center p-12">
        <Loader2 className="h-12 w-12 animate-spin text-mint-green" />
        <p className="mt-4 text-lg text-gray-600">正在分析图片...</p>
      </div>
    );
  }

  if (tags.length === 0) {
    return null;
  }

  return (
    <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100">
      <div className="flex items-center gap-3 mb-6">
        <CheckCircle className="h-8 w-8 text-mint-green" />
        <h3 className="text-2xl font-bold font-playfair text-deep-blue">
          识别结果
        </h3>
      </div>
      <div className="space-y-4">
        {tags.map((tag, index) => (
          <div key={index} className="group">
            <div className="flex justify-between items-center mb-2">
              <span className="text-lg font-semibold text-gray-800">
                {tag.name}
              </span>
              <span className="text-mint-green font-bold">
                {Math.round(tag.confidence * 100)}%
              </span>
            </div>
            <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-mint-green to-emerald-400 rounded-full transition-all duration-1000 ease-out"
                style={{ width: `${tag.confidence * 100}%` }}
              />
            </div>
          </div>
        ))}
      </div>
      <div className="mt-8 pt-6 border-t border-gray-100">
        <div className="flex flex-wrap gap-2">
          {tags.map((tag, index) => (
            <span
              key={index}
              className="px-4 py-2 bg-gradient-to-r from-mint-green/10 to-emerald-100 text-mint-green rounded-full text-sm font-medium"
            >
              {tag.name}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};
