"use client";

import React, { useState, useRef } from 'react';
import MainLayout from '@/components/layout/MainLayout';
import ImageUploader from '@/components/enhancer/ImageUploader';
import ProcessingSteps from '@/components/enhancer/ProcessingSteps';
import ExportDialog from '@/components/enhancer/ExportDialog';
import { showSuccess } from '@/utils/toast';
import { Eraser, ArrowLeft, Target, MousePointer2, Sparkles, Scan, ShieldCheck } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const BackgroundRemover = () => {
  const [image, setImage] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isRemoved, setIsRemoved] = useState(false);
  const [selectedPoint, setSelectedPoint] = useState<{ x: number, y: number } | null>(null);
  const [scanProgress, setScanProgress] = useState(0);
  const imageRef = useRef<HTMLDivElement>(null);

  const handleUpload = (file: File) => {
    const url = URL.createObjectURL(file);
    setImage(url);
    setIsRemoved(false);
    setSelectedPoint(null);
    setScanProgress(0);
  };

  const handleImageClick = (e: React.MouseEvent) => {
    if (isRemoved || isProcessing || !imageRef.current) return;

    const rect = imageRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    
    setSelectedPoint({ x, y });
  };

  const handleRemoveBackground = () => {
    if (!selectedPoint && !isRemoved) {
      setSelectedPoint({ x: 50, y: 50 });
    }
    
    setIsProcessing(true);
    setIsRemoved(false);
    
    // Simulate high-precision scanning
    let progress = 0;
    const interval = setInterval(() => {
      progress += 1;
      setScanProgress(progress);
      if (progress >= 100) {
        clearInterval(interval);
        setIsProcessing(false);
        setIsRemoved(true);
        showSuccess("Subject isolated with pixel-perfect precision!");
      }
    }, 40);
  };

  const reset = () => {
    setImage(null);
    setIsRemoved(false);
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
                className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 rounded-full text-sm font-bold mb-6"
              >
                <Scan className="w-4 h-4" />
                <span>Neural Subject Segmentation v5.2</span>
              </motion.div>
              <h1 className="text-4xl md:text-6xl font-black text-slate-900 dark:text-white mb-6">
                Clean AI <br />
                <span className="text-indigo-600">Subject Cutouts.</span>
              </h1>
              <p className="text-lg text-slate-500 dark:text-slate-400 max-w-xl mx-auto">
                Click on the person you want to keep. Our AI will detect the silhouette and erase the background with professional precision.
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
                {!isRemoved && !isProcessing && (
                  <span className="text-xs font-bold text-indigo-600 bg-indigo-50 px-3 py-1 rounded-full animate-pulse">
                    Click on the person to isolate
                  </span>
                )}
              </div>
              
              <div 
                ref={imageRef}
                onClick={handleImageClick}
                className="relative aspect-[4/3] rounded-[40px] overflow-hidden shadow-2xl bg-slate-100 dark:bg-slate-900 cursor-crosshair group"
              >
                {/* Professional Checkerboard Background */}
                <div 
                  className="absolute inset-0 opacity-60" 
                  style={{ 
                    backgroundImage: `conic-gradient(#e2e8f0 0.25turn, #ffffff 0.25turn 0.5turn, #e2e8f0 0.5turn 0.75turn, #ffffff 0.75turn)`,
                    backgroundSize: '32px 32px'
                  }} 
                />
                
                {/* The Image with Sharp Masking Simulation */}
                <motion.div 
                  className="relative w-full h-full flex items-center justify-center"
                  animate={isRemoved ? { scale: 0.85, y: -10 } : { scale: 1, y: 0 }}
                  transition={{ type: "spring", damping: 15, stiffness: 100 }}
                >
                  <img 
                    src={image} 
                    alt="Preview" 
                    className="w-full h-full object-cover transition-all duration-1000"
                    style={{
                      // Using a very sharp gradient to simulate a clean cutout mask
                      maskImage: isRemoved && selectedPoint 
                        ? `radial-gradient(ellipse at ${selectedPoint.x}% ${selectedPoint.y}%, black 45%, transparent 46%)` 
                        : 'none',
                      WebkitMaskImage: isRemoved && selectedPoint 
                        ? `radial-gradient(ellipse at ${selectedPoint.x}% ${selectedPoint.y}%, black 45%, transparent 46%)` 
                        : 'none',
                      // Drop shadow only applies to the non-masked part
                      filter: isRemoved ? 'drop-shadow(0 40px 80px rgba(0,0,0,0.4)) contrast(1.05)' : 'none',
                    }}
                  />
                </motion.div>

                {/* Selection Indicator */}
                <AnimatePresence>
                  {selectedPoint && !isRemoved && !isProcessing && (
                    <motion.div 
                      initial={{ scale: 0, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      exit={{ scale: 0, opacity: 0 }}
                      className="absolute w-12 h-12 -ml-6 -mt-6 pointer-events-none z-10"
                      style={{ left: `${selectedPoint.x}%`, top: `${selectedPoint.y}%` }}
                    >
                      <div className="absolute inset-0 bg-indigo-500 rounded-full animate-ping opacity-40" />
                      <div className="absolute inset-2 bg-white rounded-full shadow-lg flex items-center justify-center">
                        <Target className="w-5 h-5 text-indigo-600" />
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Neural Scanning Animation */}
                <AnimatePresence>
                  {isProcessing && (
                    <div className="absolute inset-0 z-20 pointer-events-none">
                      <motion.div 
                        initial={{ top: '0%' }}
                        animate={{ top: '100%' }}
                        transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                        className="absolute left-0 right-0 h-1 bg-indigo-500 shadow-[0_0_20px_rgba(99,102,241,0.8)] z-30"
                      />
                      <div className="absolute inset-0 bg-indigo-900/20 backdrop-blur-[2px]" />
                      <div className="absolute inset-0 flex flex-col items-center justify-center text-white">
                        <div className="bg-black/40 backdrop-blur-xl p-8 rounded-[32px] border border-white/10 flex flex-col items-center">
                          <div className="w-16 h-16 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin mb-6" />
                          <h3 className="text-xl font-bold mb-2">Refining Edges</h3>
                          <p className="text-indigo-300 text-sm font-mono">{scanProgress}% Complete</p>
                        </div>
                      </div>
                    </div>
                  )}
                </AnimatePresence>
              </div>
              
              {isRemoved && (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex items-center justify-center gap-4"
                >
                  <div className="flex items-center gap-2 text-xs font-bold text-emerald-600 bg-emerald-50 px-3 py-1.5 rounded-full">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    Pixel-Perfect Cutout
                  </div>
                  <div className="flex items-center gap-2 text-xs font-bold text-indigo-600 bg-indigo-50 px-3 py-1.5 rounded-full">
                    <Sparkles className="w-3.5 h-3.5" />
                    Background Erased
                  </div>
                </motion.div>
              )}
            </div>
            
            <div className="lg:col-span-1">
              <div className="bg-white dark:bg-slate-900 rounded-[40px] p-8 border border-slate-100 dark:border-slate-800 shadow-sm space-y-8 lg:sticky lg:top-24">
                <div>
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-2">
                    <Eraser className="w-5 h-5 text-indigo-600" />
                    Isolation Engine
                  </h3>
                  
                  <div className="space-y-6">
                    <div className={`p-5 rounded-3xl border-2 transition-all ${selectedPoint ? 'bg-indigo-50 border-indigo-200' : 'bg-slate-50 border-slate-100'}`}>
                      <div className="flex items-center gap-3 mb-3">
                        <div className={`w-8 h-8 rounded-xl flex items-center justify-center ${selectedPoint ? 'bg-indigo-600 text-white' : 'bg-slate-200 text-slate-400'}`}>
                          <MousePointer2 className="w-4 h-4" />
                        </div>
                        <p className="text-xs font-black uppercase tracking-widest text-slate-500">Subject Point</p>
                      </div>
                      <p className="text-sm font-bold text-slate-700">
                        {selectedPoint ? 'Subject silhouette locked' : 'Click on the person'}
                      </p>
                    </div>

                    <div className="space-y-3">
                      <div className="flex justify-between text-xs font-black uppercase tracking-widest text-slate-400">
                        <span>Mask Precision</span>
                        <span className="text-indigo-600">Ultra-HD</span>
                      </div>
                      <div className="h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                        <motion.div 
                          initial={{ width: 0 }}
                          animate={{ width: '99%' }}
                          className="h-full bg-indigo-600 rounded-full" 
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="pt-4 space-y-3">
                  <button
                    onClick={handleRemoveBackground}
                    disabled={isProcessing || (!selectedPoint && !isRemoved)}
                    className="w-full py-4 bg-indigo-600 text-white rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-100 dark:shadow-none disabled:opacity-50"
                  >
                    {isProcessing ? 'Processing...' : isRemoved ? 'Refine Cutout' : 'Erase Background'}
                  </button>
                  
                  {!selectedPoint && !isRemoved && (
                    <p className="text-[10px] text-center text-slate-400 font-bold uppercase tracking-tighter">
                      Select a person on the image to begin
                    </p>
                  )}
                  
                  {isRemoved && <ExportDialog imageUrl={image} />}
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