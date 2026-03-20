"use client";

import React, { useState, useCallback, useRef } from 'react';
import MainLayout from '@/components/layout/MainLayout';
import ImageUploader from '@/components/enhancer/ImageUploader';
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
  Info,
  Cloud
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Progress } from '@/components/ui/progress';

const BackgroundRemover = () => {
  const [originalImage, setOriginalImage] = useState<string | null>(null);
  const [processedImage, setProcessedImage] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [visualProgress, setVisualProgress] = useState(0);
  const [currentMessage, setCurrentMessage] = useState("");
  
  const rafId = useRef<number | null>(null);
  const lastUpdate = useRef<number>(0);

  const startFakeProgress = useCallback(() => {
    setVisualProgress(0);
    setCurrentMessage("Connecting to AI Cloud...");
    lastUpdate.current = performance.now();

    const animate = (time: number) => {
      const deltaTime = time - lastUpdate.current;

      if (deltaTime >= 100) {
        setVisualProgress(prev => {
          if (prev < 95) {
            const next = prev + (95 - prev) * 0.1;
            if (next < 30) setCurrentMessage("Uploading image...");
            else if (next < 60) setCurrentMessage("AI Analysis...");
            else if (next < 85) setCurrentMessage("Extracting subject...");
            else setCurrentMessage("Finalizing transparency...");
            return next;
          }
          return 95;
        });
        lastUpdate.current = time;
      }
      rafId.current = requestAnimationFrame(animate);
    };

    rafId.current = requestAnimationFrame(animate);
  }, []);

  const stopProgress = useCallback((success: boolean) => {
    if (rafId.current) {
      cancelAnimationFrame(rafId.current);
      rafId.current = null;
    }
    if (success) {
      setVisualProgress(100);
      setCurrentMessage("Background removed!");
    }
  }, []);

  const toBase64 = (url: string): Promise<string> => {
    return new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      xhr.onload = function() {
        const reader = new FileReader();
        reader.onloadend = function() {
          resolve(reader.result as string);
        };
        reader.readAsDataURL(xhr.response);
      };
      xhr.onerror = reject;
      xhr.open('GET', url);
      xhr.responseType = 'blob';
      xhr.send();
    });
  };

  const processImage = useCallback(async (imageSource: string) => {
    setIsProcessing(true);
    startFakeProgress();
    
    try {
      const base64 = await toBase64(imageSource);
      
      const response = await fetch('https://bg.adityachoudhary.xyz/remove', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          image_base64: base64
        })
      });

      if (!response.ok) throw new Error("API request failed");

      const blob = await response.blob();
      const resultUrl = URL.createObjectURL(blob);
      
      stopProgress(true);
      
      setTimeout(() => {
        setProcessedImage(resultUrl);
        setIsProcessing(false);
        showSuccess("Background removed successfully!");
      }, 500);
    } catch (error) {
      console.error("Background removal failed:", error);
      stopProgress(false);
      showError("Cloud processing failed. Please try again.");
      setIsProcessing(false);
    }
  }, [startFakeProgress, stopProgress]);

  const handleUpload = async (file: File) => {
    const url = URL.createObjectURL(file);
    setOriginalImage(url);
    setProcessedImage(null);
    await processImage(url);
  };

  const handleDownload = () => {
    if (!processedImage) return;
    const link = document.body.appendChild(document.createElement('a'));
    link.href = processedImage;
    link.download = `lumino1-transparent-${Date.now()}.png`;
    link.click();
    link.remove();
    showSuccess("Transparent PNG downloaded!");
  };

  const reset = () => {
    if (rafId.current) cancelAnimationFrame(rafId.current);
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
                <Cloud className="w-4 h-4" />
                <span>Unlimited Cloud AI Engine</span>
              </motion.div>
              <h1 className="text-4xl md:text-6xl font-black text-slate-900 dark:text-white mb-6">
                Instant Background <br />
                <span className="text-indigo-600">Removal.</span>
              </h1>
              <p className="text-lg text-slate-500 dark:text-slate-400 max-w-xl mx-auto">
                Remove backgrounds from any image in seconds with professional-grade precision.
              </p>
            </div>

            <ImageUploader onUpload={handleUpload} />

            <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                { icon: Zap, title: "Fast", desc: "Processed in seconds" },
                { icon: ShieldCheck, title: "Secure", desc: "Encrypted transfers" },
                { icon: Sparkles, title: "HD", desc: "Full resolution output" }
              ].map((item, i) => (
                <div key={i} className="p-6 bg-white dark:bg-slate-900 rounded-3xl border border-slate-100 dark:border-slate-800 text-center">
                  <div className="w-10 h-10 bg-indigo-50 dark:bg-indigo-900/30 rounded-xl flex items-center justify-center mx-auto mb-4">
                    <item.icon className="w-5 h-5 text-indigo-600" />
                  </div>
                  <h4 className="font-bold text-slate-900 dark:text-white">{item.title}</h4>
                  <p className="text-xs text-slate-500 mt-1">{item.desc}</p>
                </div>
              ))}
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
                className="relative aspect-[4/3] rounded-[40px] overflow-hidden shadow-2xl bg-slate-100 dark:bg-slate-900 group"
              >
                {/* Checkered Pattern Background */}
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
                              <Cloud className="w-6 h-6 text-indigo-600 animate-pulse" />
                            </div>
                          </div>
                          <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-4">Cloud Processing</h3>
                          
                          <div className="w-full space-y-2">
                            <div className="flex justify-between text-xs font-bold text-slate-400">
                              <span>{currentMessage}</span>
                              <span>{Math.round(visualProgress)}%</span>
                            </div>
                            <Progress value={visualProgress} className="h-2" />
                          </div>
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

                    <div className="p-4 bg-indigo-50/50 dark:bg-indigo-900/10 rounded-2xl flex items-start gap-3">
                      <Info className="w-4 h-4 text-indigo-600 mt-0.5" />
                      <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">
                        Your image is processed securely in the cloud and deleted immediately after extraction.
                      </p>
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