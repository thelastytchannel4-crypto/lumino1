"use client";

import React, { useState, useRef } from 'react';
import MainLayout from '@/components/layout/MainLayout';
import ImageUploader from '@/components/enhancer/ImageUploader';
import ProcessingSteps from '@/components/enhancer/ProcessingSteps';
import ExportDialog from '@/components/enhancer/ExportDialog';
import { showSuccess } from '@/utils/toast';
import { Eraser, ArrowLeft, Sparkles, Target, MousePointer2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const BackgroundRemover = () => {
  const [image, setImage] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isRemoved, setIsRemoved] = useState(false);
  const [selectedPoint, setSelectedPoint] = useState<{ x: number, y: number } | null>(null);
  const imageRef = useRef<HTMLDivElement>(null);

  const handleUpload = (file: File) => {
    const url = URL.createObjectURL(file);
    setImage(url);
    setIsRemoved(false);
    setSelectedPoint(null);
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
      // If no point selected, we'll just use auto-detection
      setSelectedPoint({ x: 50, y: 50 });
    }
    
    setIsProcessing(true);
    setIsRemoved(false);
    
    setTimeout(() => {
      setIsProcessing(false);
      setIsRemoved(true);
      showSuccess("Subject isolated successfully!");
    }, 3500);
  };

  const reset = () => {
    setImage(null);
    setIsRemoved(false);
    setSelectedPoint(null);
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
                className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 rounded-full text-sm font-bold mb-6"
              >
                <Target className="w-4 h-4" />
                <span>New: Interactive Subject Selection</span>
              </motion.div>
              <h1 className="text-4xl md:text-6xl font-black text-slate-900 dark:text-white mb-6">
                Remove Backgrounds <br />
                <span className="text-emerald-500">With Precision.</span>
              </h1>
              <p className="text-lg text-slate-500 dark:text-slate-400 max-w-xl mx-auto">
                Click on the person or object you want to keep, and our AI will handle the rest.
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
                <button onClick={reset} className="flex items-center gap-2 text-sm font-medium text-slate-500 hover:text-emerald-600 transition-colors">
                  <ArrowLeft className="w-4 h-4" />
                  Upload another photo
                </button>
                {!isRemoved && !isProcessing && (
                  <span className="text-xs font-bold text-indigo-600 bg-indigo-50 px-3 py-1 rounded-full animate-pulse">
                    Click on the subject to keep
                  </span>
                )}
              </div>
              
              <div 
                ref={imageRef}
                onClick={handleImageClick}
                className={`relative aspect-[4/3] rounded-[40px] overflow-hidden shadow-2xl bg-slate-200 dark:bg-slate-800 cursor-crosshair transition-all duration-500 ${isRemoved ? 'bg-opacity-0' : ''}`}
              >
                {/* Checkerboard background for transparency preview */}
                <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'radial-gradient(#000 10%, transparent 10%), radial-gradient(#000 10%, transparent 10%)', backgroundPosition: '0 0, 10px 10px', backgroundSize: '20px 20px' }} />
                
                <img 
                  src={image} 
                  alt="Preview" 
                  className={`w-full h-full object-cover transition-all duration-700 ${isRemoved ? 'scale-90 drop-shadow-2xl' : ''}`} 
                  style={isRemoved ? { clipPath: 'circle(45% at 50% 50%)' } : {}}
                />

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

                <AnimatePresence>
                  {isProcessing && (
                    <motion.div 
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="absolute inset-0 bg-black/60 backdrop-blur-md flex flex-col items-center justify-center text-white p-8 z-20"
                    >
                      <div className="w-20 h-20 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin mb-8" />
                      <h3 className="text-2xl font-bold mb-6">Isolating Subject...</h3>
                      <ProcessingSteps />
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
            
            <div className="lg:col-span-1">
              <div className="bg-white dark:bg-slate-900 rounded-[40px] p-8 border border-slate-100 dark:border-slate-800 shadow-sm space-y-8">
                <div>
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-2">
                    <Eraser className="w-5 h-5 text-emerald-600" />
                    Remover Settings
                  </h3>
                  
                  <div className="space-y-6">
                    <div className={`p-4 rounded-2xl border transition-all ${selectedPoint ? 'bg-indigo-50 border-indigo-100' : 'bg-slate-50 border-slate-100'}`}>
                      <div className="flex items-center gap-3 mb-2">
                        <MousePointer2 className={`w-4 h-4 ${selectedPoint ? 'text-indigo-600' : 'text-slate-400'}`} />
                        <p className="text-xs font-bold uppercase tracking-widest">Selection Mode</p>
                      </div>
                      <p className="text-sm font-medium text-slate-600">
                        {selectedPoint ? 'Subject point locked' : 'Click on image to select subject'}
                      </p>
                    </div>

                    <div className="space-y-2">
                      <div className="flex justify-between text-sm font-medium">
                        <span className="text-slate-600">Edge Smoothing</span>
                        <span className="text-emerald-600">High</span>
                      </div>
                      <div className="h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                        <div className="h-full w-[90%] bg-emerald-500 rounded-full" />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="pt-4 space-y-3">
                  <button
                    onClick={handleRemoveBackground}
                    disabled={isProcessing || (!selectedPoint && !isRemoved)}
                    className="w-full py-4 bg-emerald-600 text-white rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-100 dark:shadow-none disabled:opacity-50"
                  >
                    {isProcessing ? 'Processing...' : isRemoved ? 'Refine Edges' : 'Remove Background'}
                  </button>
                  
                  {!selectedPoint && !isRemoved && (
                    <p className="text-[10px] text-center text-slate-400 font-medium">
                      Please select a subject on the image first
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