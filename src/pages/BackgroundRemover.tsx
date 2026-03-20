"use client";

import React, { useState } from 'react';
import MainLayout from '@/components/layout/MainLayout';
import ImageUploader from '@/components/enhancer/ImageUploader';
import ProcessingSteps from '@/components/enhancer/ProcessingSteps';
import ExportDialog from '@/components/enhancer/ExportDialog';
import { showSuccess } from '@/utils/toast';
import { Eraser, ArrowLeft, Sparkles, Layers } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const BackgroundRemover = () => {
  const [image, setImage] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isRemoved, setIsRemoved] = useState(false);

  const handleUpload = (file: File) => {
    const url = URL.createObjectURL(file);
    setImage(url);
    setIsRemoved(false);
  };

  const handleRemoveBackground = () => {
    setIsProcessing(true);
    setIsRemoved(false);
    setTimeout(() => {
      setIsProcessing(false);
      setIsRemoved(true);
      showSuccess("Background removed successfully!");
    }, 3500);
  };

  const reset = () => {
    setImage(null);
    setIsRemoved(false);
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
                <Eraser className="w-4 h-4" />
                <span>New: Precision Edge Detection v2.0</span>
              </motion.div>
              <h1 className="text-4xl md:text-6xl font-black text-slate-900 dark:text-white mb-6">
                Remove Backgrounds <br />
                <span className="text-emerald-500">Instantly.</span>
              </h1>
              <p className="text-lg text-slate-500 dark:text-slate-400 max-w-xl mx-auto">
                Our AI identifies subjects automatically and removes backgrounds with pixel-perfect accuracy.
              </p>
            </div>

            <ImageUploader onUpload={handleUpload} />

            <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                { icon: Sparkles, title: 'Auto-Detection', desc: 'Identifies people, pets, and objects.' },
                { icon: Eraser, title: 'Clean Edges', desc: 'Perfect hair and fur masking.' },
                { icon: Layers, title: 'Transparent PNG', desc: 'Export with alpha channel.' }
              ].map((feature, i) => (
                <div key={i} className="p-6 bg-white dark:bg-slate-900 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm">
                  <feature.icon className="w-8 h-8 text-emerald-500 mb-4" />
                  <h3 className="font-bold text-slate-900 dark:text-white mb-2">{feature.title}</h3>
                  <p className="text-sm text-slate-500">{feature.desc}</p>
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
              <button onClick={reset} className="flex items-center gap-2 text-sm font-medium text-slate-500 hover:text-emerald-600 transition-colors">
                <ArrowLeft className="w-4 h-4" />
                Upload another photo
              </button>
              
              <div className="relative aspect-[4/3] rounded-[40px] overflow-hidden shadow-2xl bg-slate-200 dark:bg-slate-800">
                {/* Checkerboard background for transparency preview */}
                <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'radial-gradient(#000 10%, transparent 10%), radial-gradient(#000 10%, transparent 10%)', backgroundPosition: '0 0, 10px 10px', backgroundSize: '20px 20px' }} />
                
                <img 
                  src={image} 
                  alt="Preview" 
                  className={`w-full h-full object-cover transition-all duration-700 ${isRemoved ? 'scale-90 drop-shadow-2xl' : ''}`} 
                  style={isRemoved ? { clipPath: 'circle(45% at 50% 50%)' } : {}}
                />

                <AnimatePresence>
                  {isProcessing && (
                    <motion.div 
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="absolute inset-0 bg-black/60 backdrop-blur-md flex flex-col items-center justify-center text-white p-8 z-20"
                    >
                      <div className="w-20 h-20 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin mb-8" />
                      <h3 className="text-2xl font-bold mb-6">Removing Background...</h3>
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
                    <div className="p-4 bg-emerald-50 dark:bg-emerald-900/20 rounded-2xl border border-emerald-100 dark:border-emerald-800">
                      <p className="text-xs font-bold text-emerald-700 dark:text-emerald-400 uppercase tracking-widest mb-1">AI Model</p>
                      <p className="text-sm font-medium text-emerald-900 dark:text-emerald-100">Subject Isolation v4.2</p>
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
                    disabled={isProcessing}
                    className="w-full py-4 bg-emerald-600 text-white rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-100 dark:shadow-none disabled:opacity-50"
                  >
                    {isProcessing ? 'Processing...' : isRemoved ? 'Refine Edges' : 'Remove Background'}
                  </button>
                  
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