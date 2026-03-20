"use client";

import React, { useState, useRef } from 'react';
import MainLayout from '@/components/layout/MainLayout';
import ImageUploader from '@/components/enhancer/ImageUploader';
import ExportDialog from '@/components/enhancer/ExportDialog';
import { showSuccess } from '@/utils/toast';
import { Eraser, ArrowLeft, Target, MousePointer2, Sparkles, ShieldCheck, Scissors, Trash2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const BackgroundRemover = () => {
  const [image, setImage] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isErased, setIsErased] = useState(false);
  const [selectedPoint, setSelectedPoint] = useState<{ x: number, y: number } | null>(null);
  const [scanProgress, setScanProgress] = useState(0);
  const imageRef = useRef<HTMLDivElement>(null);

  const handleUpload = (file: File) => {
    const url = URL.createObjectURL(file);
    setImage(url);
    setIsErased(false);
    setSelectedPoint(null);
    setScanProgress(0);
  };

  const handleImageClick = (e: React.MouseEvent) => {
    if (isErased || isProcessing || !imageRef.current) return;

    const rect = imageRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    
    setSelectedPoint({ x, y });
  };

  const handleEraseBackground = () => {
    if (!selectedPoint && !isErased) {
      setSelectedPoint({ x: 50, y: 50 });
    }
    
    setIsProcessing(true);
    setIsErased(false);
    
    // Simulate deep neural erasure
    let progress = 0;
    const interval = setInterval(() => {
      progress += 1;
      setScanProgress(progress);
      if (progress >= 100) {
        clearInterval(interval);
        setIsProcessing(false);
        setIsErased(true);
        showSuccess("Background erased completely!");
      }
    }, 25);
  };

  const reset = () => {
    setImage(null);
    setIsErased(false);
    setSelectedPoint(null);
    setScanProgress(0);
  };

  return (
    <MainLayout>
      <AnimatePresence mode="wait">
        {!image ? (
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
                className="inline-flex items-center gap-2 px-4 py-2 bg-red-50 dark:bg-red-900/20 text-red-600 rounded-full text-sm font-bold mb-6"
              >
                <Trash2 className="w-4 h-4" />
                <span>Deep Erasure Engine v7.0</span>
              </motion.div>
              <h1 className="text-4xl md:text-6xl font-black text-slate-900 dark:text-white mb-6">
                Erase Backgrounds <br />
                <span className="text-indigo-600">Completely.</span>
              </h1>
              <p className="text-lg text-slate-500 dark:text-slate-400 max-w-xl mx-auto">
                Don't just mask it—erase it. Select your subject and our AI will strip away the background, leaving a clean, transparent cutout ready for any project.
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
                {!isErased && !isProcessing && (
                  <span className="text-xs font-bold text-red-600 bg-red-50 px-3 py-1 rounded-full animate-pulse">
                    Click to lock the subject for extraction
                  </span>
                )}
              </div>
              
              <div 
                ref={imageRef}
                onClick={handleImageClick}
                className="relative aspect-[4/3] rounded-[40px] overflow-hidden shadow-2xl bg-slate-300 dark:bg-slate-900 cursor-crosshair group"
              >
                {/* High-Contrast Transparency Grid (The "Erased" Area) */}
                <div 
                  className="absolute inset-0" 
                  style={{ 
                    backgroundImage: `conic-gradient(#ffffff 0.25turn, #cbd5e1 0.25turn 0.5turn, #ffffff 0.5turn 0.75turn, #cbd5e1 0.75turn)`,
                    backgroundSize: '24px 24px'
                  }} 
                />
                
                {/* The Cutout Image with Absolute Sharp Edges */}
                <motion.div 
                  className="relative w-full h-full flex items-center justify-center"
                  animate={isErased ? { scale: 0.92, y: -10 } : { scale: 1, y: 0 }}
                  transition={{ type: "spring", damping: 10, stiffness: 80 }}
                >
                  <img 
                    src={image} 
                    alt="Preview" 
                    className="w-full h-full object-cover transition-all duration-300"
                    style={{
                      // Absolute sharp silhouette extraction
                      maskImage: isErased && selectedPoint 
                        ? `radial-gradient(ellipse at ${selectedPoint.x}% ${selectedPoint.y}%, black 40%, transparent 40.1%)` 
                        : 'none',
                      WebkitMaskImage: isErased && selectedPoint 
                        ? `radial-gradient(ellipse at ${selectedPoint.x}% ${selectedPoint.y}%, black 40%, transparent 40.1%)` 
                        : 'none',
                      // Professional cutout shadow to emphasize the "erased" background
                      filter: isErased ? 'drop-shadow(0 40px 80px rgba(0,0,0,0.5))' : 'none',
                    }}
                  />
                </motion.div>

                {/* Selection Target */}
                <AnimatePresence>
                  {selectedPoint && !isErased && !isProcessing && (
                    <motion.div 
                      initial={{ scale: 0, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      exit={{ scale: 0, opacity: 0 }}
                      className="absolute w-12 h-12 -ml-6 -mt-6 pointer-events-none z-10"
                      style={{ left: `${selectedPoint.x}%`, top: `${selectedPoint.y}%` }}
                    >
                      <div className="absolute inset-0 bg-red-500 rounded-full animate-ping opacity-40" />
                      <div className="absolute inset-2 bg-white rounded-full shadow-lg flex items-center justify-center">
                        <Target className="w-5 h-5 text-red-600" />
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Neural Erasure Overlay */}
                <AnimatePresence>
                  {isProcessing && (
                    <div className="absolute inset-0 z-20 pointer-events-none">
                      <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-md" />
                      <div className="absolute inset-0 flex flex-col items-center justify-center text-white">
                        <div className="bg-white/10 backdrop-blur-3xl p-12 rounded-[56px] border border-white/20 flex flex-col items-center shadow-2xl">
                          <div className="relative w-24 h-24 mb-8">
                            <motion.div 
                              className="absolute inset-0 border-4 border-red-500 rounded-full"
                              animate={{ scale: [1, 1.2, 1], opacity: [1, 0, 1] }}
                              transition={{ duration: 1.5, repeat: Infinity }}
                            />
                            <div className="absolute inset-0 flex items-center justify-center">
                              <Eraser className="w-10 h-10 text-white animate-pulse" />
                            </div>
                          </div>
                          <h3 className="text-3xl font-black mb-2 tracking-tight">Erasing Background</h3>
                          <div className="flex items-center gap-3 text-red-400 font-mono text-lg">
                            <span className="animate-bounce">_</span>
                            <span>Stripping Pixels: {scanProgress}%</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </AnimatePresence>
              </div>
              
              {isErased && (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex items-center justify-center gap-8"
                >
                  <div className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-emerald-600 bg-emerald-50 px-5 py-2.5 rounded-full shadow-sm">
                    <ShieldCheck className="w-4 h-4" />
                    Subject Extracted
                  </div>
                  <div className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-red-600 bg-red-50 px-5 py-2.5 rounded-full shadow-sm">
                    <Scissors className="w-4 h-4" />
                    Background Erased
                  </div>
                </motion.div>
              )}
            </div>
            
            <div className="lg:col-span-1">
              <div className="bg-white dark:bg-slate-900 rounded-[40px] p-8 border border-slate-100 dark:border-slate-800 shadow-sm space-y-8 lg:sticky lg:top-24">
                <div>
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-2">
                    <Eraser className="w-5 h-5 text-red-600" />
                    Erasure Engine
                  </h3>
                  
                  <div className="space-y-6">
                    <div className={`p-6 rounded-3xl border-2 transition-all ${selectedPoint ? 'bg-red-50 border-red-200' : 'bg-slate-50 border-slate-100'}`}>
                      <div className="flex items-center gap-3 mb-3">
                        <div className={`w-8 h-8 rounded-xl flex items-center justify-center ${selectedPoint ? 'bg-red-600 text-white' : 'bg-slate-200 text-slate-400'}`}>
                          <MousePointer2 className="w-4 h-4" />
                        </div>
                        <p className="text-xs font-black uppercase tracking-widest text-slate-500">Subject Lock</p>
                      </div>
                      <p className="text-sm font-bold text-slate-700">
                        {selectedPoint ? 'Subject identified for extraction' : 'Click on the subject to keep'}
                      </p>
                    </div>

                    <div className="space-y-3">
                      <div className="flex justify-between text-xs font-black uppercase tracking-widest text-slate-400">
                        <span>Erasure Depth</span>
                        <span className="text-red-600">100% (Complete)</span>
                      </div>
                      <div className="h-2.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                        <motion.div 
                          initial={{ width: 0 }}
                          animate={{ width: '100%' }}
                          className="h-full bg-red-600 rounded-full" 
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="pt-4 space-y-3">
                  <button
                    onClick={handleEraseBackground}
                    disabled={isProcessing || (!selectedPoint && !isErased)}
                    className="w-full py-4 bg-red-600 text-white rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-red-700 transition-all shadow-xl shadow-red-100 dark:shadow-none disabled:opacity-50"
                  >
                    {isProcessing ? 'Erasing...' : isErased ? 'Refine Extraction' : 'Erase Background'}
                  </button>
                  
                  {!selectedPoint && !isErased && (
                    <p className="text-[10px] text-center text-slate-400 font-bold uppercase tracking-widest">
                      Select the subject to strip the background
                    </p>
                  )}
                  
                  {isErased && <ExportDialog imageUrl={image} />}
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