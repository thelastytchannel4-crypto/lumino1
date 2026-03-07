"use client";

import React, { useState, useCallback } from 'react';
import { Upload, Image as ImageIcon, X } from 'lucide-react';
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
        "relative border-2 border-dashed rounded-3xl p-12 transition-all duration-300 flex flex-col items-center justify-center text-center group cursor-pointer",
        isDragging 
          ? "border-indigo-500 bg-indigo-50/50 scale-[0.99]" 
          : "border-slate-200 bg-white hover:border-indigo-300 hover:bg-slate-50/50"
      )}
    >
      <input
        type="file"
        className="absolute inset-0 opacity-0 cursor-pointer"
        onChange={handleFileChange}
        accept="image/*"
      />
      
      <div className="w-20 h-20 bg-indigo-50 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
        <Upload className="w-10 h-10 text-indigo-600" />
      </div>
      
      <h3 className="text-xl font-bold text-slate-900 mb-2">Drop your photo here</h3>
      <p className="text-slate-500 max-w-xs mx-auto">
        Support JPG, PNG and WebP. Max file size 10MB.
      </p>
      
      <div className="mt-8 flex items-center gap-2 text-sm font-medium text-indigo-600 bg-indigo-50 px-4 py-2 rounded-full">
        <ImageIcon className="w-4 h-4" />
        <span>Or browse files</span>
      </div>
    </div>
  );
};

export default ImageUploader;