"use client";

import React, { useState, useEffect, useCallback, useRef } from 'react';
import MainLayout from '@/components/layout/MainLayout';
import ImageUploader from '@/components/enhancer/ImageUploader';
import { removeBackground, Config } from '@imgly/background-removal';
import { showSuccess, showError } from '@/utils/toast';
import { 
  Eraser, 
  ArrowLeft, 
  Sparkles, 
  ShieldCheck, 
  Download,
  Loader2,
  Zap,
  RefreshCw,
  Info
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Progress } from '@/components/ui/progress';

const BackgroundRemover = () => {
  const [originalImage, setOriginalImage] = useState<string | null>(null);
  const [processedImage, setProcessedImage] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [visualProgress, setVisualProgress] = useState(0);
  const [currentMessage, setCurrentMessage] = useState("");
  const [isModelLoaded, setIsModelLoaded] = useState(false);
  
  const progressInterval = useRef<NodeJS.Timeout | null>(null);

  // Preload the model on mount
  useEffect(() => {
    const preload = async () => {
      try {
        const tinyPixel = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8/5+hHgAHggJ/PchI7wAAAABJRU5ErkJggg==";
        await removeBackground(tinyPixel, { 
          progress: () => {},
          model: 'medium'
        });
        setIsModelLoaded(true);
      } catch (e) {
        console.warn("Model preloading failed", e);
      }
    };
    preload();
  }, []);

  // Handle smooth, non-freezing progress simulation
  useEffect(() => {
    if (isProcessing) {
      setVisualProgress(0);
      setCurrentMessage("Uploading image...");
      
      progressInterval.current = setInterval(() => {
        setVisualProgress(prev => {
          if (prev < 30) {
            // Phase 1: Quick move to 30% (approx 2 seconds at 100ms intervals)
            const next = prev + 1.5;
            setCurrentMessage("Analyzing image structure...");
            return next;
          } else if (prev < 90) {
            // Phase 2: Slow crawl from 30% to 90%
            const next = prev + (Math.random() * 0.4);
            if (prev < 60) setCurrentMessage("Detecting subject edges...");
            else setCurrentMessage("Removing background...");
            return Math.min(90, next);
          } else {
            // Phase 3: Stay at 90% with "Almost done" message
            setCurrentMessage("Almost done...");
            return 90;
          }
        });
      }, 100);
    } else {
      if (progressInterval.current) clearInterval(progressInterval.current);
    }
    return () => {
      if (progressInterval.current) clearInterval(progressInterval.current);
    };
  }, [isProcessing]);

  const resizeImage = (file: File): Promise<Blob | File> => {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const img = new Image();
        img.onload = () => {
          const MAX_WIDTH = 1024;
          const MAX_HEIGHT = 1024;
          let width = img.width;
          let height = img.height;

          if (width <= MAX_WIDTH && height <= MAX_HEIGHT) {
            resolve(file);
            return;
          }

          if (width > height) {
            if (width > MAX_WIDTH) {
              height *= MAX_WIDTH / width;
              width = MAX_WIDTH;
            }
          } else {
            if (height > MAX_HEIGHT) {
              width *= MAX_HEIGHT / height;
              height = MAX_HEIGHT;
            }
          }

          const canvas = document.createElement('canvas');
          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          ctx?.drawImage(img, 0, 0, width, height);
          canvas.toBlob((blob) => {
            resolve(blob || file);
          }, 'image/png');
        };
        img.src = e.target?.result as string;
      };
      reader.readAsDataURL(file);
    });
  };

  const processImage = useCallback(async (imageSource: File | Blob | string) => {
    setIsProcessing(true);
    
    try {
      const config: Config = {
        model: 'medium',
        output: {
          type: 'image/png',
          quality: 0.8
        }
      };

      const blob = await removeBackground(imageSource, config);
      const resultUrl = URL.createObjectURL(blob);
      
      // Finalize: Jump to 100% and show success
      setVisualProgress(100);
      setCurrentMessage("Background removed successfully!");
      
      setTimeout(() => {
        setProcessedImage(resultUrl);
        setIsProcessing(false);
        showSuccess("Background removed successfully!");
      }, 600);
    } catch (error) {
      console.error("Background removal failed:", error);
      showError("Failed to remove background. Please try another image.");
      setIsProcessing(false);
    }
  }, []);

  const handleUpload = async (file: File) => {
    const url = URL.createObjectURL(file);
    setOriginalImage(url);
    setProcessedImage(null);
    
    const optimizedImage = await resizeImage(file);
    await processImage(optimizedImage);
  };

  const handleDownload = () => {
    if (!processedImage) return;
    const link = document.body.appendChild(document.createElement('a'));
    link.href = processedImage;
    link.download = `lumino1-cutout-${Date.now()}.png`;
    link.click();
    link.remove();
    showSuccess("Transparent PNG downloaded!");
  };

  const reset = () => {
    setOriginalImage(null);
    setProcessedImage(null);
    setIsProcessing(false);
    setVisualProgress(0);
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
                <span>{isModelLoaded ? 'AI Engine Ready' : 'Initializing AI Engine...'}</span>
              </motion.div>
              <h1 className="text-4xl md:text-6xl font-black text-slate-900 dark:text-white mb-6">
                Remove Backgrounds <br />
                <span className="text-indigo-600">Instantly.</span>
              </h1>
              <p className="text-lg text-slate-500 dark:text-slate-400 max-w-xl mx-auto">
                Professional-grade background removal optimized for speed. Get high-quality transparent PNGs in seconds.
              </p>
            </div>

            <ImageUploader onUpload={handleUpload} />
            
            <div className="mt-8 flex items-center justify-center gap-4 text-slate-400 text-sm">
              <div className="flex items-center gap-1.5">
                <Zap className="w-4 h-4 text-amber-500" />
                <span>GPU Accelerated</span>
              </div>
              <div className="w-1 h-1 bg-slate-300 rounded-full" />
              <div className="flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-500" />
                <span>Private & Secure</span>
              </div>
            </div>
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
                    {currentMessage}
                  </span>
                )}
              </div>
              
              <motion.div 
                animate={isProcessing ? { 
                  scale: [1, 1.005, 1], 
                  opacity: [1, 0.9, 1],
                  boxShadow: ["0 20px 50px rgba(0,0,0,0.1)", "0 20px 50px rgba(79,70,229,0.2)", "0 20px 50px rgba(0,0,0,0.1)"]
                } : {}}
                transition={isProcessing ? { duration: 2, repeat: Infinity, ease: "easeInOut" } : {}}
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
                
                <div className="relative w-full h-full flex items-center justify-center p-4 md:p-8">
                  <AnimatePresence mode="wait">
                    {isProcessing ? (
                      <motion.div 
                        key="processing"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-white/40 backdrop-blur-sm p-6"
                      >
                        <div className="bg-white dark:bg-slate-900 p-8 rounded-[40px] shadow-2xl border border-slate-100 dark:border-slate-800 flex flex-col items-center w-full max-w-sm">
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
                          <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-4">Removing Background</h3>
                          
                          <div className="w-full space-y-2">
                            <div className="flex justify-between text-xs font-bold text-slate-400">
                              <span className={visualProgress >= 90 ? "animate-bounce" : "animate-pulse"}>
                                {currentMessage}
                              </span>
                              <span>{Math.round(visualProgress)}%</span>
                            </div>
                            <Progress value={visualProgress} className="h-2" />
                          </div>
                          
                          <p className="text-xs text-slate-400 text-center mt-6 flex items-center gap-1.5">
                            <Info className="w-3 h-3" />
                            Optimizing for speed (Max 1024px)
                          </p>
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
              </motion.div>
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
                        {isProcessing ? currentMessage : processedImage ? 'Ready for download' : 'Waiting for upload'}
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