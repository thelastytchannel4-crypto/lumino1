"use client";

import React, { useState } from 'react';
import { Upload, Files, X, CheckCircle2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface BatchUploaderProps {
  onUpload: (files: File[]) => void;
}

const BatchUploader = ({ onUpload }: BatchUploaderProps) => {
  const [isDragging, setIsDragging] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    const validFiles = files.filter(file => file.type.startsWith('image/'));
    setSelectedFiles(prev => [...prev, ...validFiles]);
  };

  const removeFile = (index: number) => {
    setSelectedFiles(prev => prev.filter((_, i) => i !== index));
  };

  const handleStart = () => {
    if (selectedFiles.length > 0) {
      onUpload(selectedFiles);
    }
  };

  return (
    <div className="space-y-6">
      <div
        onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={(e) => {
          e.preventDefault();
          setIsDragging(false);
          const files = Array.from(e.dataTransfer.files);
          const validFiles = files.filter(file => file.type.startsWith('image/'));
          setSelectedFiles(prev => [...prev, ...validFiles]);
        }}
        className={cn(
          "relative border-2 border-dashed rounded-3xl p-10 transition-all duration-300 flex flex-col items-center justify-center text-center group cursor-pointer",
          isDragging 
            ? "border-indigo-500 bg-indigo-50/50" 
            : "border-slate-200 bg-white hover:border-indigo-300"
        )}
      >
        <input
          type="file"
          multiple
          className="absolute inset-0 opacity-0 cursor-pointer"
          onChange={handleFileChange}
          accept="image/*"
        />
        
        <div className="w-16 h-16 bg-indigo-50 rounded-2xl flex items-center justify-center mb-4">
          <Files className="w-8 h-8 text-indigo-600" />
        </div>
        
        <h3 className="text-lg font-bold text-slate-900">Upload multiple photos</h3>
        <p className="text-slate-500 text-sm">Drag and drop up to 20 images at once</p>
      </div>

      {selectedFiles.length > 0 && (
        <div className="bg-white rounded-3xl border border-slate-100 p-6 animate-in fade-in slide-in-from-top-4">
          <div className="flex items-center justify-between mb-4">
            <h4 className="font-bold text-slate-900">{selectedFiles.length} files selected</h4>
            <button 
              onClick={() => setSelectedFiles([])}
              className="text-xs font-bold text-red-500 hover:text-red-600"
            >
              Clear all
            </button>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 max-h-60 overflow-y-auto pr-2 custom-scrollbar">
            {selectedFiles.map((file, i) => (
              <div key={i} className="relative group aspect-square rounded-xl overflow-hidden border border-slate-100 bg-slate-50">
                <img 
                  src={URL.createObjectURL(file)} 
                  className="w-full h-full object-cover opacity-60" 
                  alt="Preview" 
                />
                <button 
                  onClick={() => removeFile(i)}
                  className="absolute top-1 right-1 p-1 bg-white/80 backdrop-blur-md rounded-lg text-slate-600 opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <X className="w-3 h-3" />
                </button>
                <div className="absolute bottom-0 inset-x-0 p-2 bg-gradient-to-t from-black/40 to-transparent">
                  <p className="text-[10px] text-white truncate font-medium">{file.name}</p>
                </div>
              </div>
            ))}
          </div>

          <button
            onClick={handleStart}
            className="w-full mt-6 py-3 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-100"
          >
            Start Batch Processing
          </button>
        </div>
      )}
    </div>
  );
};

export default BatchUploader;