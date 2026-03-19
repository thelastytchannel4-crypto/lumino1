"use client";

import React, { useState } from 'react';
import { Upload, Image as ImageIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ImageUploaderProps {
  onUpload: (file: File) => void;
}

const ImageUploader = ({ onUpload }: ImageUploaderProps) => {
  const [isDragging, setIsDragging] = useState(false);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith('image/')) {
      onUpload(file);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      onUpload(file);
    }
  };

  return (
    <div
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      className={cn(
        "relative border-2 border-dashed rounded-2xl md:rounded-[40px] p-8 md:p-20 transition-all duration-300 flex flex-col items-center justify-center text-center group cursor-pointer",
        isDragging 
          ? "border-indigo-500 bg-indigo-50/50 scale-[0.99]" 
          : "border-slate-200 bg-white dark:bg-slate-900 hover:border-indigo-300 hover:bg-slate-50/50 dark:hover:bg-slate-800/50"
      )}
    >
      <input
        type="file"
        className="absolute inset-0 opacity-0 cursor-pointer"
        onChange={handleFileChange}
        accept="image/*"
      />
      
      <div className="w-12 h-12 md:w-20 md:h-20 bg-indigo-50 dark:bg-indigo-900/30 rounded-xl md:rounded-3xl flex items-center justify-center mb-4 md:mb-8 group-hover:scale-110 transition-transform duration-300">
        <Upload className="w-6 h-6 md:w-10 md:h-10 text-indigo-600" />
      </div>
      
      <h3 className="text-lg md:text-2xl font-bold text-slate-900 dark:text-white mb-2">Drop your photo here</h3>
      <p className="text-xs md:text-base text-slate-500 max-w-xs mx-auto mb-6 md:mb-10">
        Support JPG, PNG and WebP. Max file size 10MB.
      </p>
      
      <div className="flex items-center gap-2 text-xs md:text-sm font-bold text-indigo-600 bg-indigo-50 dark:bg-indigo-900/30 px-4 py-2 md:px-6 md:py-3 rounded-full">
        <ImageIcon className="w-3.5 h-3.5 md:w-4 h-4" />
        <span>Or browse files</span>
      </div>
    </div>
  );
};

export default ImageUploader;