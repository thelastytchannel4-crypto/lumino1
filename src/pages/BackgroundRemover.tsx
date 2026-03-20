"use client";

import React, { useState } from 'react';
import MainLayout from '@/components/layout/MainLayout';
import ImageUploader from '@/components/enhancer/ImageUploader';
import { removeBackground } from '@imgly/background-removal';
import { showSuccess, showError } from '@/utils/toast';
import { 
  Eraser, 
  ArrowLeft, 
  Sparkles, 
  ShieldCheck, 
  Scissors, 
  Download,
  Loader2,
  Zap,
  RefreshCw
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const BackgroundRemover = () => {
  const [originalImage, setOriginalImage] = useState<string | null>(null);
  const [processedImage, setProcessedImage] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleUpload = async (file: File) => {
    const url = URL.createObjectURL(file);
    setOriginalImage(url);
    setProcessedImage(null);
    
    await processImage(file);
  };

  const processImage = async (imageSource: File | string) => {
    setIsProcessing(true);
    try {
      const blob = await removeBackground(imageSource, {
        progress: (item, progress) => {
          // Optional: handle progress updates if needed
          console.log(`Processing ${item}: ${Math.round(progress * 100)}%`);
        }
      });
      
      const resultUrl = URL.createObjectURL(blob);
      setProcessedImage(resultUrl);
      showSuccess("Background removed successfully!");
    } catch (error) {
      console.error("Background removal failed:", error);
      showError("Failed to remove background. Please try another image.");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDownload = () => {
    if (!processedImage) return;
    const link = document.createElement('a');
    link.href = processedImage;
    link.download = `lumino1-cutout-${Date.now()}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showSuccess("Transparent PNG downloaded!");
  };

  const reset = () => {
    setOriginalImage(null);
    setProcessedImage(null);
    setIsProcessing(false);
  };

  return (
    <MainLayout>
      <AnimatePresence mode="wait">
        {!originalImage ? (
          <motion.div 
            key="upload-view"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="max-w-4xl mx-auto"
          >
            <div className="text-center mb-12">
              <motion.div 
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 rounded-full text-sm font-bold mb-6"
              >
                <Sparkles className="w-4 h-4" />
                <span>AI-Powered Neural Extraction</span>
              </motion.div>
              <h1 className="text-4xl md:text-6xl font-black text-slate-900 dark:text-white mb-6">
                Remove Backgrounds <br />
                <span className="text-indigo-600">Instantly.</span>
              </h1>
              <p className="text-lg text-slate-500 dark:text-slate-400 max-w-xl mx-auto">
                Professional-grade background removal powered by AI. Get high-quality transparent PNGs in seconds, right in your browser.
              </p>
            </div>

            <ImageUploader onUpload={handleUpload} />
          </motion.div>
        ) : (
          <motion.div 
            key="editor-view"
            initial={{ opacity: 0, scale: 1.05 }}
            animate={{ opacity: 1, scale: 1 }}
            className="grid grid-cols-1 lg:grid-cols-3 gap-8"
          >
            <div className="lg:col-span-2 space-y-4">
              <div className="flex items-center justify-between">
                <button onClick={reset} className="flex items-center gap-2 text-sm font-medium text-slate-500 hover:text-indigo-600 transition-colors">
                  <ArrowLeft className="w-4 h-4" />
                  Upload another photo
                </button>
                {isProcessing && (
                  <span className="text-xs font-bold text-indigo-600 bg-indigo-50 px-3 py-1 rounded-full flex items-center gap-2">
                    <Loader2 className="w-3 h-3 animate-spin" />
                    AI is analyzing your image...
                  </span>
                )}
              </div>
              
              <div 
                className="relative aspect-[4/3] rounded-[40px] overflow-hidden shadow-2xl bg-slate-100 dark:bg-slate-900 group"
              >
                {/* Photoshop-style Transparency Grid */}
                <div 
                  className="absolute inset-0" 
                  style={{ 
                    backgroundImage: `linear-gradient(45deg, #e2e8f0 25%, transparent 25%), linear-gradient(-45deg, #e2e8f0 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #e2e8f0 75%), linear-gradient(-45deg, transparent 75%, #e2e8f0 75%)`,
                    backgroundSize: '20px 20px',
                    backgroundPosition: '0 0, 0 10px, 10px -10px, -10px 0px',
                    backgroundColor: '#ffffff'
                  }} 
                />
                
                {/* The Image Display */}
                <div className="relative w-full h-full flex items-center justify-center p-4 md:p-8">
                  <AnimatePresence mode="wait">
                    {isProcessing ? (
                      <motion.div 
                        key="processing"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-white/40 backdrop-blur-sm"
                      >
                        <div className="bg-white dark:bg-slate-900 p-8 rounded-[40px] shadow-2xl border border-slate-100 dark:border-slate-800 flex flex-col items-center">
                          <div className="relative w-16 h-16 mb-6">
                            <motion.div 
                              className="absolute inset-0 border-4 border-indigo-600 border-t-transparent rounded-full"
                              animate={{ rotate: 360 }}
                              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                            />
                            <div className="absolute inset-0 flex items-center justify-center">
                              <Zap className="w-6 h-6 text-indigo-600 animate-pulse" />
                            </div>
                          </div>
                          <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">Processing Image</h3>
                          <p className="text-sm text-slate-500 text-center max-w-[200px]">Our AI is isolating the subject and removing pixels...</p>
                        </div>
                      </motion.div>
                    ) : processedImage ? (
                      <motion.img 
                        key="processed"
                        src={processedImage} 
                        alt="Cutout" 
                        className="max-w-full max-h-full object-contain drop-shadow-[0_20px_50px_rgba(0,0,0,0.2)]"
                        initial={{ scale: 0.9, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ type: "spring", damping: 20 }}
                      />
                    ) : (
                      <motion.img 
                        key="original"
                        src={originalImage || ''} 
                        alt="Original" 
                        className="max-w-full max-h-full object-contain opacity-50 grayscale"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                      />
                    )}
                  </AnimatePresence>
                </div>
              </div>
              
              {processedImage && !isProcessing && (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex items-center justify-center gap-6"
                >
                  <div className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-emerald-600 bg-emerald-50 px-5 py-2.5 rounded-full shadow-sm">
                    <ShieldCheck className="w-4 h-4" />
                    Subject Isolated
                  </div>
                  <div className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-indigo-600 bg-indigo-50 px-5 py-2.5 rounded-full shadow-sm">
                    <Scissors className="w-4 h-4" />
                    Background Removed
                  </div>
                </motion.div>
              )}
            </div>
            
            <div className="lg:col-span-1">
              <div className="bg-white dark:bg-slate-900 rounded-[40px] p-8 border border-slate-100 dark:border-slate-800 shadow-sm space-y-8 lg:sticky lg:top-24">
                <div>
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-2">
                    <Eraser className="w-5 h-5 text-indigo-600" />
                    Extraction Engine
                  </h3>
                  
                  <div className="space-y-6">
                    <div className="p-6 rounded-3xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800">
                      <p className="text-xs font-black uppercase tracking-widest text-slate-400 mb-2">Status</p>
                      <p className="text-sm font-bold text-slate-700 dark:text-slate-300">
                        {isProcessing ? 'AI is processing...' : processedImage ? 'Ready for download' : 'Waiting for upload'}
                      </p>
                    </div>

                    <div className="space-y-3">
                      <div className="flex justify-between text-xs font-black uppercase tracking-widest text-slate-400">
                        <span>Edge Precision</span>
                        <span className="text-indigo-600">Ultra Sharp</span>
                      </div>
                      <div className="h-2.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                        <motion.div 
                          initial={{ width: 0 }}
                          animate={{ width: '100%' }}
                          className="h-full bg-indigo-600 rounded-full" 
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="pt-4 space-y-3">
                  {processedImage ? (
                    <>
                      <button
                        onClick={handleDownload}
                        className="w-full py-4 bg-indigo-600 text-white rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-100 dark:shadow-none"
                      >
                        <Download className="w-5 h-5" />
                        Download PNG
                      </button>
                      <button
                        onClick={() => originalImage && processImage(originalImage)}
                        disabled={isProcessing}
                        className="w-full py-4 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-slate-200 dark:hover:bg-slate-700 transition-all"
                      >
                        <RefreshCw className={`w-5 h-5 ${isProcessing ? 'animate-spin' : ''}`} />
                        Reprocess
                      </button>
                    </>
                  ) : (
                    <div className="p-6 text-center border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-3xl">
                      <p className="text-sm text-slate-400 font-medium">Upload an image to start the AI extraction</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </MainLayout>
  );
};

export default BackgroundRemover;