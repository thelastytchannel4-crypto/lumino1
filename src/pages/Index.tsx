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
    // Simulate AI processing
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
      {!image ? (
        <div className="max-w-4xl mx-auto">
          <HeroSection />
          <ImageUploader onUpload={handleUpload} />
          
          <div className="mt-12 grid grid-cols-3 gap-6">
            {[
              { title: 'Upscale', desc: 'Up to 4K resolution' },
              { title: 'Denoise', desc: 'Remove grain & noise' },
              { title: 'Restore', desc: 'Fix old blurry photos' }
            ].map((feature, i) => (
              <div key={i} className="p-6 bg-white rounded-2xl border border-slate-100 text-center">
                <div className="w-10 h-10 bg-indigo-50 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <Sparkles className="w-5 h-5 text-indigo-600" />
                </div>
                <h4 className="font-bold text-slate-900">{feature.title}</h4>
                <p className="text-xs text-slate-500 mt-1">{feature.desc}</p>
              </div>
            ))}
          </div>

          <SampleGallery onSelect={handleSelectSample} />
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div className="lg:col-span-2 space-y-4">
            <button 
              onClick={reset}
              className="flex items-center gap-2 text-sm font-medium text-slate-500 hover:text-indigo-600 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Upload another photo
            </button>
            
            {isEnhanced ? (
              <>
                <ComparisonSlider 
                  before={image} 
                  after={image} 
                />
                <ZoomPreview image={image} />
              </>
            ) : (
              <div className="relative aspect-[4/3] rounded-3xl overflow-hidden shadow-2xl bg-slate-200">
                <img src={image} alt="Original" className="w-full h-full object-cover" />
                {isProcessing && (
                  <div className="absolute inset-0 bg-black/60 backdrop-blur-md flex flex-col items-center justify-center text-white p-8">
                    <div className="w-20 h-20 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin mb-8" />
                    <h3 className="text-2xl font-bold mb-6">Enhancing your photo...</h3>
                    <ProcessingSteps />
                  </div>
                )}
              </div>
            )}
          </div>
          
          <div className="lg:col-span-1">
            <EnhancementControls 
              onEnhance={handleEnhance} 
              isProcessing={isProcessing} 
              isEnhanced={isEnhanced}
            />
          </div>
        </div>
      )}
    </MainLayout>
  );
};

export default Index;