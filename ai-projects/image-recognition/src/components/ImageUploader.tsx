import React, { useCallback, useState } from "react";
import { Upload, X } from "lucide-react";

interface ImageUploaderProps {
  onImageSelect: (imageData: string) => void;
  currentImage: string | null;
  onClear: () => void;
}

export const ImageUploader: React.FC<ImageUploaderProps> = ({
  onImageSelect,
  currentImage,
  onClear,
}) => {
  const [isDragging, setIsDragging] = useState(false);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const processFile = useCallback((file: File) => {
    if (!file.type.startsWith("image/")) {
      alert("请选择图片文件！");
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result as string;
      onImageSelect(result);
    };
    reader.readAsDataURL(file);
  }, [onImageSelect]);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);
      if (e.dataTransfer.files?.[0]) {
        processFile(e.dataTransfer.files[0]);
      }
    },
    [processFile]
  );

  const handleFileChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.files?.[0]) {
        processFile(e.target.files[0]);
      }
    },
    [processFile]
  );

  if (currentImage) {
    return (
      <div className="relative group">
        <img
          src={currentImage}
          alt="Preview"
          className="max-h-[400px] w-full object-contain rounded-xl shadow-lg"
        />
        <button
          onClick={onClear}
          className="absolute top-4 right-4 p-2 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600"
        >
          <X size={20} />
        </button>
      </div>
    );
  }

  return (
    <div
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      className={`border-2 border-dashed rounded-2xl p-12 text-center transition-all duration-300 cursor-pointer ${
        isDragging
          ? "border-mint-green bg-mint-green/10"
          : "border-gray-300 hover:border-mint-green hover:bg-gray-50"
      }`}
    >
      <input
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        className="hidden"
        id="image-upload"
      />
      <label htmlFor="image-upload" className="cursor-pointer">
        <div className="flex flex-col items-center gap-4">
          <div className={`p-4 rounded-full transition-colors ${
            isDragging ? "bg-mint-green text-white" : "bg-gray-100 text-gray-400"
          }`}>
            <Upload size={48} />
          </div>
          <div>
            <p className="text-xl font-semibold text-gray-800">
              拖拽图片到这里
            </p>
            <p className="text-gray-500 mt-2">
              或者点击选择文件
            </p>
          </div>
          <p className="text-sm text-gray-400">
            支持 JPG、PNG、GIF 等格式
          </p>
        </div>
      </label>
    </div>
  );
};
