"use client";

import React, { useState, useCallback } from 'react';
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
  Cpu
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Progress } from '@/components/ui/progress';
import { removeBackground } from '@imgly/background-removal';

const BackgroundRemover = () => {
  const [originalImage, setOriginalImage] = useState<string | null>(null);
  const [processedImage, setProcessedImage] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [visualProgress, setVisualProgress] = useState(0);
  const [currentMessage, setCurrentMessage] = useState("");

  const processImage = useCallback(async (imageSource: string) => {
    setIsProcessing(true);
    setVisualProgress(0);
    setCurrentMessage("Initializing AI Engine...");
    
    try {
      // On-device processing using WASM
      const blob = await removeBackground(imageSource, {
        progress: (step, progress) => {
          const percentage = Math.round(progress * 100);
          setVisualProgress(percentage);
          if (step.includes('load')) {
            setCurrentMessage(`Downloading AI Model (${percentage}%)`);
          } else {
            setCurrentMessage(`Analyzing Image (${percentage}%)`);
          }
        },
        model: 'medium', // Balanced for speed and quality
        output: {
          format: 'image/png',
          quality: 0.8
        }
      });

      const resultUrl = URL.createObjectURL(blob);
      setProcessedImage(resultUrl);
      setIsProcessing(false);
      showSuccess("Background removed locally!");
    } catch (error) {
      console.error("On-device background removal failed:", error);
      showError("AI processing failed. Your browser might not support WebAssembly.");
      setIsProcessing(false);
    }
  }, []);

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
    link.download = `lumino1-on-device-${Date.now()}.png`;
    link.click();
    link.remove();
    showSuccess("Transparent PNG saved!");
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
                className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 rounded-full text-sm font-bold mb-6"
              >
                <Cpu className="w-4 h-4" />
                <span>100% On-Device AI (Private & Unlimited)</span>
              </motion.div>
              <h1 className="text-4xl md:text-6xl font-black text-slate-900 dark:text-white mb-6">
                Private Background <br />
                <span className="text-indigo-600">Removal.</span>
              </h1>
              <p className="text-lg text-slate-500 dark:text-slate-400 max-w-xl mx-auto">
                Your photos never leave your computer. Processed locally using advanced browser-based neural networks.
              </p>
            </div>

            <ImageUploader onUpload={handleUpload} />

            <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                { icon: ShieldCheck, title: "Private", desc: "No server uploads" },
                { icon: Zap, title: "Unlimited", desc: "No API limits or costs" },
                { icon: Sparkles, title: "Pro Quality", desc: "Clean edges & HD output" }
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
                              <Cpu className="w-6 h-6 text-indigo-600 animate-pulse" />
                            </div>
                          </div>
                          <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">On-Device AI</h3>
                          <p className="text-xs text-slate-400 mb-6 text-center">First run may take a moment to download the AI model (~20MB)</p>
                          
                          <div className="w-full space-y-2">
                            <div className="flex justify-between text-xs font-bold text-slate-400">
                              <span>{currentMessage}</span>
                              <span>{visualProgress}%</span>
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
                    Local AI Engine
                  </h3>
                  
                  <div className="space-y-6">
                    <div className="p-6 rounded-3xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800">
                      <p className="text-xs font-black uppercase tracking-widest text-slate-400 mb-2">Status</p>
                      <p className="text-sm font-bold text-slate-700 dark:text-slate-300">
                        {isProcessing ? currentMessage : processedImage ? 'Ready for download' : 'Waiting for upload'}
                      </p>
                    </div>

                    <div className="p-4 bg-emerald-50/50 dark:bg-emerald-900/10 rounded-2xl flex items-start gap-3">
                      <ShieldCheck className="w-4 h-4 text-emerald-600 mt-0.5" />
                      <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">
                        Privacy First: Your image is processed entirely on your device. No data is sent to any server.
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
                      <p className="text-sm text-slate-400 font-medium">Upload an image to start the local AI extraction</p>
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