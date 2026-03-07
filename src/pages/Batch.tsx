"use client";

import React, { useState } from 'react';
import MainLayout from '@/components/layout/MainLayout';
import { 
  Upload, 
  X, 
  Play, 
  CheckCircle2, 
  Loader2,
  Download
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Progress } from '@/components/ui/progress';
import { showSuccess } from '@/utils/toast';
import { motion, AnimatePresence } from 'framer-motion';

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

  const downloadFile = (url: string, filename: string) => {
    const link = document.createElement('a');
    link.href = url;
    link.download = `enhanced-${filename}`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const startBatch = async () => {
    setIsProcessing(true);
    
    for (let i = 0; i < files.length; i++) {
      const currentFile = files[i];
      const fileId = currentFile.id;
      
      setFiles(prev => prev.map(f => f.id === fileId ? { ...f, status: 'processing' } : f));
      
      // Simulate processing progress
      for (let p = 0; p <= 100; p += 20) {
        await new Promise(resolve => setTimeout(resolve, 150));
        setFiles(prev => prev.map(f => f.id === fileId ? { ...f, progress: p } : f));
      }
      
      setFiles(prev => prev.map(f => f.id === fileId ? { ...f, status: 'completed' } : f));
      
      // Auto-download the file once completed
      downloadFile(currentFile.preview, currentFile.file.name);
    }
    
    setIsProcessing(false);
    showSuccess(`Successfully processed and downloaded ${files.length} images!`);
  };

  return (
    <MainLayout>
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8 flex items-center justify-between"
      >
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Batch Processing</h1>
          <p className="text-slate-500 dark:text-slate-400 mt-2">Enhance multiple photos simultaneously with consistent settings.</p>
        </div>
        
        <AnimatePresence>
          {files.length > 0 && (
            <motion.button
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={startBatch}
              disabled={isProcessing}
              className="flex items-center gap-2 px-6 py-3 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-100 disabled:opacity-50"
            >
              {isProcessing ? <Loader2 className="w-5 h-5 animate-spin" /> : <Play className="w-5 h-5 fill-current" />}
              {isProcessing ? 'Processing Queue...' : 'Start Batch Process'}
            </motion.button>
          )}
        </AnimatePresence>
      </motion.div>

      <AnimatePresence mode="wait">
        {files.length === 0 ? (
          <motion.div 
            key="empty"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-[40px] p-20 flex flex-col items-center justify-center text-center bg-white dark:bg-slate-900"
          >
            <motion.div 
              animate={{ y: [0, -10, 0] }}
              transition={{ repeat: Infinity, duration: 3 }}
              className="w-20 h-20 bg-indigo-50 dark:bg-indigo-900/20 rounded-3xl flex items-center justify-center mb-6"
            >
              <Upload className="w-10 h-10 text-indigo-600" />
            </motion.div>
            <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">Upload multiple photos</h3>
            <p className="text-slate-500 dark:text-slate-400 max-w-sm mb-8">Select up to 50 images to process them all at once with your current AI settings.</p>
            <label className="px-8 py-4 bg-indigo-600 text-white rounded-2xl font-bold cursor-pointer hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-100">
              Select Files
              <input type="file" multiple className="hidden" onChange={handleFileChange} accept="image/*" />
            </label>
          </motion.div>
        ) : (
          <motion.div 
            key="grid"
            initial="hidden"
            animate="visible"
            variants={{
              visible: { transition: { staggerChildren: 0.05 } }
            }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {files.map((item) => (
              <motion.div 
                key={item.id}
                variants={{
                  hidden: { opacity: 0, y: 20 },
                  visible: { opacity: 1, y: 0 }
                }}
                layout
                className="bg-white dark:bg-slate-900 rounded-3xl p-4 border border-slate-100 dark:border-slate-800 shadow-sm group relative"
              >
                <button 
                  onClick={() => removeFile(item.id)}
                  className="absolute top-2 right-2 p-1.5 bg-white/80 dark:bg-slate-800/80 backdrop-blur-md text-slate-400 hover:text-red-500 rounded-full opacity-0 group-hover:opacity-100 transition-opacity z-10"
                >
                  <X className="w-4 h-4" />
                </button>
                
                <div className="aspect-video rounded-2xl overflow-hidden mb-4 bg-slate-100 dark:bg-slate-800 relative">
                  <img src={item.preview} alt="Preview" className="w-full h-full object-cover" />
                  <AnimatePresence>
                    {item.status === 'processing' && (
                      <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="absolute inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center"
                      >
                        <Loader2 className="w-8 h-8 text-white animate-spin" />
                      </motion.div>
                    )}
                    {item.status === 'completed' && (
                      <motion.div 
                        initial={{ opacity: 0, scale: 0.5 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="absolute inset-0 bg-emerald-500/20 backdrop-blur-[2px] flex items-center justify-center"
                      >
                        <div className="bg-white rounded-full p-2 shadow-lg">
                          <CheckCircle2 className="w-6 h-6 text-emerald-500" />
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
                
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-bold text-slate-900 dark:text-white truncate max-w-[150px]">{item.file.name}</p>
                    <div className="flex items-center gap-2">
                      {item.status === 'completed' && (
                        <motion.button
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: 1, scale: 1 }}
                          onClick={() => downloadFile(item.preview, item.file.name)}
                          className="p-1.5 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 rounded-lg hover:bg-indigo-100 transition-colors"
                          title="Download again"
                        >
                          <Download className="w-4 h-4" />
                        </motion.button>
                      )}
                      <span className={cn(
                        "text-[10px] font-black uppercase tracking-widest px-2 py-0.5 rounded-md",
                        item.status === 'pending' && "bg-slate-100 dark:bg-slate-800 text-slate-500",
                        item.status === 'processing' && "bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600",
                        item.status === 'completed' && "bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600",
                      )}>
                        {item.status}
                      </span>
                    </div>
                  </div>
                  
                  {item.status === 'processing' && (
                    <motion.div 
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      className="space-y-1.5"
                    >
                      <div className="flex justify-between text-[10px] font-bold text-slate-400">
                        <span>Progress</span>
                        <span>{item.progress}%</span>
                      </div>
                      <Progress value={item.progress} className="h-1.5" />
                    </motion.div>
                  )}
                </div>
              </motion.div>
            ))}
            
            {!isProcessing && (
              <motion.label 
                variants={{
                  hidden: { opacity: 0, y: 20 },
                  visible: { opacity: 1, y: 0 }
                }}
                className="border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-3xl p-4 flex flex-col items-center justify-center text-center bg-slate-50/50 dark:bg-slate-900/50 hover:bg-slate-50 dark:hover:bg-slate-800 hover:border-indigo-300 transition-all cursor-pointer group min-h-[200px]"
              >
                <div className="w-10 h-10 bg-white dark:bg-slate-800 rounded-xl flex items-center justify-center mb-3 shadow-sm group-hover:scale-110 transition-transform">
                  <Upload className="w-5 h-5 text-indigo-600" />
                </div>
                <span className="text-sm font-bold text-slate-500">Add more photos</span>
                <input type="file" multiple className="hidden" onChange={handleFileChange} accept="image/*" />
              </motion.label>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </MainLayout>
  );
};

export default Batch;