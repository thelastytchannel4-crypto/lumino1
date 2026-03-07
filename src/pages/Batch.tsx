"use client";

import React, { useState } from 'react';
import MainLayout from '@/components/layout/MainLayout';
import { 
  Upload, 
  Image as ImageIcon, 
  X, 
  Play, 
  CheckCircle2, 
  Loader2,
  AlertCircle
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Progress } from '@/components/ui/progress';
import { showSuccess } from '@/utils/toast';

interface BatchFile {
  id: string;
  file: File;
  status: 'pending' | 'processing' | 'completed' | 'error';
  progress: number;
  preview: string;
}

const Batch = () => {
  const [files, setFiles] = useState<BatchFile[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(e.target.files || []);
    const newFiles: BatchFile[] = selectedFiles.map(file => ({
      id: Math.random().toString(36).substr(2, 9),
      file,
      status: 'pending',
      progress: 0,
      preview: URL.createObjectURL(file)
    }));
    setFiles(prev => [...prev, ...newFiles]);
  };

  const removeFile = (id: string) => {
    setFiles(prev => prev.filter(f => f.id !== id));
  };

  const startBatch = async () => {
    setIsProcessing(true);
    
    for (let i = 0; i < files.length; i++) {
      const fileId = files[i].id;
      
      // Update status to processing
      setFiles(prev => prev.map(f => f.id === fileId ? { ...f, status: 'processing' } : f));
      
      // Simulate progress
      for (let p = 0; p <= 100; p += 10) {
        await new Promise(resolve => setTimeout(resolve, 100));
        setFiles(prev => prev.map(f => f.id === fileId ? { ...f, progress: p } : f));
      }
      
      // Update status to completed
      setFiles(prev => prev.map(f => f.id === fileId ? { ...f, status: 'completed' } : f));
    }
    
    setIsProcessing(false);
    showSuccess(`Successfully processed ${files.length} images!`);
  };

  return (
    <MainLayout>
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Batch Processing</h1>
          <p className="text-slate-500 mt-2">Enhance multiple photos simultaneously with consistent settings.</p>
        </div>
        
        {files.length > 0 && (
          <button
            onClick={startBatch}
            disabled={isProcessing}
            className="flex items-center gap-2 px-6 py-3 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-100 disabled:opacity-50"
          >
            {isProcessing ? <Loader2 className="w-5 h-5 animate-spin" /> : <Play className="w-5 h-5 fill-current" />}
            {isProcessing ? 'Processing Queue...' : 'Start Batch Process'}
          </button>
        )}
      </div>

      {files.length === 0 ? (
        <div className="border-2 border-dashed border-slate-200 rounded-[40px] p-20 flex flex-col items-center justify-center text-center bg-white">
          <div className="w-20 h-20 bg-indigo-50 rounded-3xl flex items-center justify-center mb-6">
            <Upload className="w-10 h-10 text-indigo-600" />
          </div>
          <h3 className="text-2xl font-bold text-slate-900 mb-2">Upload multiple photos</h3>
          <p className="text-slate-500 max-w-sm mb-8">Select up to 50 images to process them all at once with your current AI settings.</p>
          <label className="px-8 py-4 bg-indigo-600 text-white rounded-2xl font-bold cursor-pointer hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-100">
            Select Files
            <input type="file" multiple className="hidden" onChange={handleFileChange} accept="image/*" />
          </label>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {files.map((item) => (
            <div key={item.id} className="bg-white rounded-3xl p-4 border border-slate-100 shadow-sm group relative">
              <button 
                onClick={() => removeFile(item.id)}
                className="absolute top-2 right-2 p-1.5 bg-white/80 backdrop-blur-md text-slate-400 hover:text-red-500 rounded-full opacity-0 group-hover:opacity-100 transition-opacity z-10"
              >
                <X className="w-4 h-4" />
              </button>
              
              <div className="aspect-video rounded-2xl overflow-hidden mb-4 bg-slate-100 relative">
                <img src={item.preview} alt="Preview" className="w-full h-full object-cover" />
                {item.status === 'processing' && (
                  <div className="absolute inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center">
                    <Loader2 className="w-8 h-8 text-white animate-spin" />
                  </div>
                )}
                {item.status === 'completed' && (
                  <div className="absolute inset-0 bg-emerald-500/20 backdrop-blur-[2px] flex items-center justify-center">
                    <div className="bg-white rounded-full p-2 shadow-lg">
                      <CheckCircle2 className="w-6 h-6 text-emerald-500" />
                    </div>
                  </div>
                )}
              </div>
              
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-bold text-slate-900 truncate max-w-[150px]">{item.file.name}</p>
                  <span className={cn(
                    "text-[10px] font-black uppercase tracking-widest px-2 py-0.5 rounded-md",
                    item.status === 'pending' && "bg-slate-100 text-slate-500",
                    item.status === 'processing' && "bg-indigo-100 text-indigo-600",
                    item.status === 'completed' && "bg-emerald-100 text-emerald-600",
                  )}>
                    {item.status}
                  </span>
                </div>
                
                {item.status === 'processing' && (
                  <div className="space-y-1.5">
                    <div className="flex justify-between text-[10px] font-bold text-slate-400">
                      <span>Progress</span>
                      <span>{item.progress}%</span>
                    </div>
                    <Progress value={item.progress} className="h-1.5" />
                  </div>
                )}
              </div>
            </div>
          ))}
          
          <label className="border-2 border-dashed border-slate-200 rounded-3xl p-4 flex flex-col items-center justify-center text-center bg-slate-50/50 hover:bg-slate-50 hover:border-indigo-300 transition-all cursor-pointer group min-h-[200px]">
            <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center mb-3 shadow-sm group-hover:scale-110 transition-transform">
              <Upload className="w-5 h-5 text-indigo-600" />
            </div>
            <span className="text-sm font-bold text-slate-500">Add more photos</span>
            <input type="file" multiple className="hidden" onChange={handleFileChange} accept="image/*" />
          </label>
        </div>
      )}
    </MainLayout>
  );
};

export default Batch;