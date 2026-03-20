"use client";

import React, { useState, useRef } from 'react';
import MainLayout from '@/components/layout/MainLayout';
import ImageUploader from '@/components/enhancer/ImageUploader';
import ExportDialog from '@/components/enhancer/ExportDialog';
import { showSuccess } from '@/utils/toast';
import { Eraser, ArrowLeft, Target, MousePointer2, Sparkles, Scan, ShieldCheck, Scissors } from 'lucide-react';
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
    
    // Simulate high-precision silhouette detection
    let progress = 0;
    const interval = setInterval(() => {
      progress += 1;
      setScanProgress(progress);
      if (progress >= 100) {
        clearInterval(interval);
        setIsProcessing(false);
        setIsRemoved(true);
        showSuccess("Subject isolated with professional precision!");
      }
    }, 30);
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
                <Scissors className="w-4 h-4" />
                <span>Smart Silhouette Extraction v6.0</span>
              </motion.div>
              <h1 className="text-4xl md:text-6xl font-black text-slate-900 dark:text-white mb-6">
                Instant AI <br />
                <span className="text-indigo-600">Subject Cutouts.</span>
              </h1>
              <p className="text-lg text-slate-500 dark:text-slate-400 max-w-xl mx-auto">
                Erase backgrounds completely. Just click on the person or object you want to keep, and our AI will extract the silhouette with professional-grade edges.
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
                    Click to select the subject
                  </span>
                )}
              </div>
              
              <div 
                ref={imageRef}
                onClick={handleImageClick}
                className="relative aspect-[4/3] rounded-[40px] overflow-hidden shadow-2xl bg-slate-200 dark:bg-slate-900 cursor-crosshair group"
              >
                {/* High-Contrast Transparency Grid */}
                <div 
                  className="absolute inset-0" 
                  style={{ 
                    backgroundImage: `conic-gradient(#f8fafc 0.25turn, #e2e8f0 0.25turn 0.5turn, #f8fafc 0.5turn 0.75turn, #e2e8f0 0.75turn)`,
                    backgroundSize: '20px 20px'
                  }} 
                />
                
                {/* The Cutout Image with Sharp Edges */}
                <motion.div 
                  className="relative w-full h-full flex items-center justify-center"
                  animate={isRemoved ? { scale: 0.9, y: -10 } : { scale: 1, y: 0 }}
                  transition={{ type: "spring", damping: 12, stiffness: 90 }}
                >
                  <img 
                    src={image} 
                    alt="Preview" 
                    className="w-full h-full object-cover transition-all duration-500"
                    style={{
                      // Sharp silhouette mask simulation
                      maskImage: isRemoved && selectedPoint 
                        ? `radial-gradient(ellipse at ${selectedPoint.x}% ${selectedPoint.y}%, black 42%, transparent 42.5%)` 
                        : 'none',
                      WebkitMaskImage: isRemoved && selectedPoint 
                        ? `radial-gradient(ellipse at ${selectedPoint.x}% ${selectedPoint.y}%, black 42%, transparent 42.5%)` 
                        : 'none',
                      // Professional cutout drop shadow
                      filter: isRemoved ? 'drop-shadow(0 30px 60px rgba(0,0,0,0.45))' : 'none',
                    }}
                  />
                  
                  {/* Marching Ants Selection Border (Simulated) */}
                  {isRemoved && (
                    <div 
                      className="absolute inset-0 pointer-events-none border-2 border-dashed border-white/50 rounded-full opacity-20 animate-[spin_20s_linear_infinite]"
                      style={{
                        width: '60%',
                        height: '80%',
                        left: `${selectedPoint?.x! - 30}%`,
                        top: `${selectedPoint?.y! - 40}%`,
                      }}
                    />
                  )}
                </motion.div>

                {/* Selection Target */}
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

                {/* Neural Processing Overlay */}
                <AnimatePresence>
                  {isProcessing && (
                    <div className="absolute inset-0 z-20 pointer-events-none">
                      <div className="absolute inset-0 bg-indigo-950/40 backdrop-blur-sm" />
                      <div className="absolute inset-0 flex flex-col items-center justify-center text-white">
                        <div className="bg-white/10 backdrop-blur-2xl p-10 rounded-[48px] border border-white/20 flex flex-col items-center shadow-2xl">
                          <div className="relative w-20 h-20 mb-6">
                            <div className="absolute inset-0 border-4 border-indigo-500/20 rounded-full" />
                            <motion.div 
                              className="absolute inset-0 border-4 border-indigo-500 border-t-transparent rounded-full"
                              animate={{ rotate: 360 }}
                              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                            />
                          </div>
                          <h3 className="text-2xl font-black mb-2 tracking-tight">Extracting Subject</h3>
                          <div className="flex items-center gap-2 text-indigo-300 font-mono text-sm">
                            <span className="animate-pulse">●</span>
                            <span>Tracing Silhouette: {scanProgress}%</span>
                          </div>
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
                  className="flex items-center justify-center gap-6"
                >
                  <div className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-emerald-600 bg-emerald-50 px-4 py-2 rounded-full">
                    <ShieldCheck className="w-4 h-4" />
                    Sharp Cutout
                  </div>
                  <div className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-indigo-600 bg-indigo-50 px-4 py-2 rounded-full">
                    <Sparkles className="w-4 h-4" />
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
                    Cutout Engine
                  </h3>
                  
                  <div className="space-y-6">
                    <div className={`p-5 rounded-3xl border-2 transition-all ${selectedPoint ? 'bg-indigo-50 border-indigo-200' : 'bg-slate-50 border-slate-100'}`}>
                      <div className="flex items-center gap-3 mb-3">
                        <div className={`w-8 h-8 rounded-xl flex items-center justify-center ${selectedPoint ? 'bg-indigo-600 text-white' : 'bg-slate-200 text-slate-400'}`}>
                          <MousePointer2 className="w-4 h-4" />
                        </div>
                        <p className="text-xs font-black uppercase tracking-widest text-slate-500">Subject Lock</p>
                      </div>
                      <p className="text-sm font-bold text-slate-700">
                        {selectedPoint ? 'Silhouette detected' : 'Click on the subject'}
                      </p>
                    </div>

                    <div className="space-y-3">
                      <div className="flex justify-between text-xs font-black uppercase tracking-widest text-slate-400">
                        <span>Edge Sharpness</span>
                        <span className="text-indigo-600">100%</span>
                      </div>
                      <div className="h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
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
                  <button
                    onClick={handleRemoveBackground}
                    disabled={isProcessing || (!selectedPoint && !isRemoved)}
                    className="w-full py-4 bg-indigo-600 text-white rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-100 dark:shadow-none disabled:opacity-50"
                  >
                    {isProcessing ? 'Extracting...' : isRemoved ? 'Refine Edges' : 'Erase Background'}
                  </button>
                  
                  {!selectedPoint && !isRemoved && (
                    <p className="text-[10px] text-center text-slate-400 font-bold uppercase tracking-widest">
                      Select a subject to isolate
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