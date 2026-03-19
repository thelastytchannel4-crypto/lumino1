"use client";

import React, { useState } from 'react';
import MainLayout from '@/components/layout/MainLayout';
import ImageUploader from '@/components/enhancer/ImageUploader';
import ComparisonSlider from '@/components/enhancer/ComparisonSlider';
import EnhancementControls from '@/components/enhancer/EnhancementControls';
import ProcessingSteps from '@/components/enhancer/ProcessingSteps';
import SampleGallery from '@/components/enhancer/SampleGallery';
import HeroSection from '@/components/enhancer/HeroSection';
import ZoomPreview from '@/components/enhancer/ZoomPreview';
import { showSuccess } from '@/utils/toast';
import { Sparkles, ArrowLeft } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const Index = () => {
  const [image, setImage] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isEnhanced, setIsEnhanced] = useState(false);

  const handleUpload = (file: File) => {
    const url = URL.createObjectURL(file);
    setImage(url);
    setIsEnhanced(false);
  };

  const handleSelectSample = (url: string) => {
    setImage(url);
    setIsEnhanced(false);
  };

  const handleEnhance = () => {
    setIsProcessing(true);
    setIsEnhanced(false);
    setTimeout(() => {
      setIsProcessing(false);
      setIsEnhanced(true);
      showSuccess("Photo enhanced successfully!");
    }, 3000);
  };

  const reset = () => {
    setImage(null);
    setIsEnhanced(false);
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
            <HeroSection />
            <ImageUploader onUpload={handleUpload} />
            
            <motion.div 
              initial="hidden"
              animate="visible"
              variants={{
                visible: { transition: { staggerChildren: 0.1 } }
              }}
              className="mt-8 md:mt-12 grid grid-cols-1 sm:grid-cols-3 gap-4 md:gap-6"
            >
              {[
                { title: 'Upscale', desc: 'Up to 4K resolution' },
                { title: 'Denoise', desc: 'Remove grain & noise' },
                { title: 'Restore', desc: 'Fix old blurry photos' }
              ].map((feature, i) => (
                <motion.div 
                  key={i}
                  variants={{
                    hidden: { opacity: 0, y: 20 },
                    visible: { opacity: 1, y: 0 }
                  }}
                  className="p-4 md:p-6 bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 text-center shadow-sm"
                >
                  <div className="w-8 h-8 md:w-10 md:h-10 bg-indigo-50 dark:bg-indigo-900/30 rounded-xl flex items-center justify-center mx-auto mb-3 md:mb-4">
                    <Sparkles className="w-4 h-4 md:w-5 h-5 text-indigo-600" />
                  </div>
                  <h4 className="font-bold text-sm md:text-base text-slate-900 dark:text-white">{feature.title}</h4>
                  <p className="text-[10px] md:text-xs text-slate-500 mt-1">{feature.desc}</p>
                </motion.div>
              ))}
            </motion.div>

            <SampleGallery onSelect={handleSelectSample} />
          </motion.div>
        ) : (
          <motion.div 
            key="editor-view"
            initial={{ opacity: 0, scale: 1.05 }}
            animate={{ opacity: 1, scale: 1 }}
            className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8"
          >
            <div className="lg:col-span-2 space-y-4">
              <motion.button 
                whileHover={{ x: -4 }}
                onClick={reset}
                className="flex items-center gap-2 text-xs md:text-sm font-medium text-slate-500 hover:text-indigo-600 transition-colors"
              >
                <ArrowLeft className="w-3.5 h-3.5 md:w-4 h-4" />
                Upload another photo
              </motion.button>
              
              <div className="relative">
                {isEnhanced ? (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.5 }}
                  >
                    <ComparisonSlider 
                      before={image} 
                      after={image} 
                    />
                    <ZoomPreview image={image} />
                  </motion.div>
                ) : (
                  <div className="relative aspect-[4/3] rounded-2xl md:rounded-3xl overflow-hidden shadow-2xl bg-slate-200">
                    <img src={image} alt="Original" className="w-full h-full object-cover" />
                    <AnimatePresence>
                      {isProcessing && (
                        <motion.div 
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          className="absolute inset-0 bg-black/60 backdrop-blur-md flex flex-col items-center justify-center text-white p-4 md:p-8 z-20"
                        >
                          <motion.div 
                            animate={{ rotate: 360 }}
                            transition={{ repeat: Infinity, duration: 1.5, ease: "linear" }}
                            className="w-12 h-12 md:w-20 md:h-20 border-3 md:border-4 border-indigo-500 border-t-transparent rounded-full mb-6 md:mb-8" 
                          />
                          <motion.h3 
                            initial={{ y: 10, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            className="text-lg md:text-2xl font-bold mb-4 md:mb-6 text-center"
                          >
                            Enhancing your photo...
                          </motion.h3>
                          <ProcessingSteps />
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                )}
              </div>
            </div>
            
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="lg:col-span-1"
            >
              <EnhancementControls 
                onEnhance={handleEnhance} 
                isProcessing={isProcessing} 
                isEnhanced={isEnhanced}
                imageUrl={image}
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </MainLayout>
  );
};

export default Index;