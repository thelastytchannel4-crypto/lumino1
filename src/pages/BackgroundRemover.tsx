"use client";

import React, { useState, useEffect, useCallback, useRef } from 'react';
import MainLayout from '@/components/layout/MainLayout';
import ImageUploader from '@/components/enhancer/ImageUploader';
import { pipeline, env, RawImage } from '@huggingface/transformers';
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
  AlertCircle
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Progress } from '@/components/ui/progress';

// Configure transformers.js to use local models if needed
env.allowLocalModels = false;

const BackgroundRemover = () => {
  const [originalImage, setOriginalImage] = useState<string | null>(null);
  const [processedImage, setProcessedImage] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [visualProgress, setVisualProgress] = useState(0);
  const [currentMessage, setCurrentMessage] = useState("");
  const [isModelLoaded, setIsModelLoaded] = useState(false);
  
  const segmenterRef = useRef<any>(null);
  const rafId = useRef<number | null>(null);
  const lastUpdate = useRef<number>(0);

  // Preload the model on mount
  useEffect(() => {
    const loadModel = async () => {
      try {
        setCurrentMessage("Loading AI model...");
        // Using briaai/RMBG-1.4 which is state-of-the-art for background removal
        segmenterRef.current = await pipeline('image-segmentation', 'briaai/RMBG-1.4', {
          device: 'webgpu', // Attempt to use WebGPU for speed
        });
        setIsModelLoaded(true);
        setCurrentMessage("AI Engine Ready");
      } catch (e) {
        console.warn("WebGPU not available, falling back to CPU", e);
        try {
          segmenterRef.current = await pipeline('image-segmentation', 'briaai/RMBG-1.4');
          setIsModelLoaded(true);
          setCurrentMessage("AI Engine Ready (CPU)");
        } catch (err) {
          console.error("Model loading failed", err);
          showError("Failed to load AI model. Please refresh.");
        }
      }
    };
    loadModel();
    return () => {
      if (rafId.current) cancelAnimationFrame(rafId.current);
    };
  }, []);

  const startFakeProgress = useCallback(() => {
    setVisualProgress(0);
    setCurrentMessage("Initializing AI engine...");
    lastUpdate.current = performance.now();

    const animate = (time: number) => {
      const deltaTime = time - lastUpdate.current;

      if (deltaTime >= 100) { // Every 100ms
        setVisualProgress(prev => {
          if (prev < 89) {
            const next = prev + 0.8;
            if (next < 20) setCurrentMessage("Uploading image...");
            else if (next < 45) setCurrentMessage("Analyzing structure...");
            else if (next < 70) setCurrentMessage("Detecting subject...");
            else setCurrentMessage("Extracting mask...");
            return next;
          } else {
            setCurrentMessage("Refining edges...");
            return 89;
          }
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

  const processImage = useCallback(async (imageSource: string) => {
    if (!segmenterRef.current) {
      showError("AI model is still loading. Please wait.");
      return;
    }

    setIsProcessing(true);
    startFakeProgress();
    
    try {
      // 1. Load original image into RawImage format
      const img = await RawImage.fromURL(imageSource);
      
      // 2. Run the segmentation pipeline to get the mask
      const output = await segmenterRef.current(img);
      const mask = output; // RMBG-1.4 returns the mask as a RawImage
      
      // 3. Create a canvas to combine original image and mask
      const canvas = document.createElement('canvas');
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext('2d', { willReadFrequently: true });
      
      if (!ctx) throw new Error("Could not get canvas context");

      // 4. Draw the original image onto the canvas
      const originalCanvas = img.toCanvas();
      ctx.drawImage(originalCanvas, 0, 0);
      
      // 5. Get the image data from the original image
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      
      // 6. Get the mask data
      const maskCanvas = mask.toCanvas();
      const maskCtx = maskCanvas.getContext('2d', { willReadFrequently: true });
      if (!maskCtx) throw new Error("Could not get mask canvas context");
      const maskData = maskCtx.getImageData(0, 0, canvas.width, canvas.height);
      
      // 7. Apply the mask to the alpha channel of the original image
      // The mask is grayscale (R=G=B), so we use the Red channel as the Alpha value
      for (let i = 0; i < imageData.data.length; i += 4) {
        imageData.data[i + 3] = maskData.data[i];
      }
      
      // 8. Put the modified image data back onto the canvas
      ctx.putImageData(imageData, 0, 0);
      
      const resultUrl = canvas.toDataURL('image/png');
      
      stopProgress(true);
      
      setTimeout(() => {
        setProcessedImage(resultUrl);
        setIsProcessing(false);
        showSuccess("Background removed successfully!");
      }, 500);
    } catch (error) {
      console.error("Background removal failed:", error);
      stopProgress(false);
      showError("Failed to remove background. Try a smaller image.");
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
    link.download = `lumino1-rmbg-${Date.now()}.png`;
    link.click();
    link.remove();
    showSuccess("High-quality PNG downloaded!");
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
                <Sparkles className="w-4 h-4" />
                <span>{isModelLoaded ? 'Hugging Face RMBG-1.4 Active' : 'Loading RMBG-1.4 Model...'}</span>
              </motion.div>
              <h1 className="text-4xl md:text-6xl font-black text-slate-900 dark:text-white mb-6">
                Pro Background <br />
                <span className="text-indigo-600">Extraction.</span>
              </h1>
              <p className="text-lg text-slate-500 dark:text-slate-400 max-w-xl mx-auto">
                Powered by Hugging Face RMBG-1.4. Superior edge detection for hair, fur, and complex objects.
              </p>
            </div>

            <ImageUploader onUpload={handleUpload} />

            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="mt-8 p-4 bg-indigo-50/50 dark:bg-indigo-900/10 border border-indigo-100/50 dark:border-indigo-800/30 rounded-3xl flex items-start gap-4 max-w-2xl mx-auto"
            >
              <div className="w-10 h-10 bg-white dark:bg-slate-900 rounded-2xl flex items-center justify-center flex-shrink-0 shadow-sm">
                <Zap className="w-5 h-5 text-indigo-600" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-slate-900 dark:text-white mb-1">Model Information</h4>
                <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                  The RMBG-1.4 model is downloaded once (~170MB) and cached in your browser. Subsequent removals will be near-instant.
                </p>
              </div>
            </motion.div>
            
            <div className="mt-8 flex items-center justify-center gap-4 text-slate-400 text-sm">
              <div className="flex items-center gap-1.5">
                <Zap className="w-4 h-4 text-amber-500" />
                <span>WebGPU Accelerated</span>
              </div>
              <div className="w-1 h-1 bg-slate-300 rounded-full" />
              <div className="flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-500" />
                <span>100% Private</span>
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
                          <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-4">RMBG-1.4 Processing</h3>
                          
                          <div className="w-full space-y-2">
                            <div className="flex justify-between text-xs font-bold text-slate-400">
                              <span className={visualProgress >= 89 ? "animate-bounce" : "animate-pulse"}>
                                {currentMessage}
                              </span>
                              <span>{Math.round(visualProgress)}%</span>
                            </div>
                            <Progress value={visualProgress} className="h-2" />
                          </div>

                          {visualProgress >= 89 && (
                            <motion.div 
                              initial={{ opacity: 0, y: 10 }}
                              animate={{ opacity: 1, y: 0 }}
                              className="mt-6 p-3 bg-amber-50 dark:bg-amber-900/20 border border-amber-100 dark:border-amber-800 rounded-2xl flex items-start gap-3"
                            >
                              <AlertCircle className="w-4 h-4 text-amber-600 mt-0.5 flex-shrink-0" />
                              <p className="text-[11px] font-medium text-amber-700 dark:text-amber-400 leading-tight">
                                It will complete in a few seconds, please wait...
                              </p>
                            </motion.div>
                          )}
                          
                          <p className="text-xs text-slate-400 text-center mt-6 flex items-center gap-1.5">
                            <Info className="w-3 h-3" />
                            Running locally on your device
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
                    RMBG-1.4 Engine
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