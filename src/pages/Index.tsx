"use client";

import React, { useState } from 'react';
import MainLayout from '@/components/layout/MainLayout';
import ImageUploader from '@/components/enhancer/ImageUploader';
import BatchUploader from '@/components/enhancer/BatchUploader';
import BatchProgress from '@/components/enhancer/BatchProgress';
import ComparisonSlider from '@/components/enhancer/ComparisonSlider';
import EnhancementControls from '@/components/enhancer/EnhancementControls';
import ProcessingSteps from '@/components/enhancer/ProcessingSteps';
import SampleGallery from '@/components/enhancer/SampleGallery';
import { showSuccess } from '@/utils/toast';
import { Sparkles, ArrowLeft, Layers, Image as ImageIcon } from 'lucide-react';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';

const Index = () => {
  const [mode, setMode] = useState<'single' | 'batch'>('single');
  const [image, setImage] = useState<string | null>(null);
  const [batchFiles, setBatchFiles] = useState<File[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isEnhanced, setIsEnhanced] = useState(false);

  const handleUpload = (file: File) => {
    const url = URL.createObjectURL(file);
    setImage(url);
    setIsEnhanced(false);
  };

  const handleBatchUpload = (files: File[]) => {
    setBatchFiles(files);
    setIsProcessing(true);
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
    setBatchFiles([]);
    setIsEnhanced(false);
    setIsProcessing(false);
  };

  return (
    <MainLayout>
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 flex items-center gap-3">
            AI Photo Enhancer
            <div className="px-2 py-1 bg-indigo-100 text-indigo-600 text-[10px] font-black uppercase tracking-widest rounded-md">
              Beta
            </div>
          </h1>
          <p className="text-slate-500 mt-2">Transform your low-quality photos into high-resolution masterpieces.</p>
        </div>

        {!image && batchFiles.length === 0 && (
          <Tabs value={mode} onValueChange={(v) => setMode(v as any)} className="w-auto">
            <TabsList className="bg-white border border-slate-100 p-1 rounded-xl h-12">
              <TabsTrigger value="single" className="rounded-lg px-4 data-[state=active]:bg-indigo-600 data-[state=active]:text-white">
                <ImageIcon className="w-4 h-4 mr-2" />
                Single
              </TabsTrigger>
              <TabsTrigger value="batch" className="rounded-lg px-4 data-[state=active]:bg-indigo-600 data-[state=active]:text-white">
                <Layers className="w-4 h-4 mr-2" />
                Batch
              </TabsTrigger>
            </TabsList>
          </Tabs>
        )}
      </div>

      {batchFiles.length > 0 ? (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
          <button 
            onClick={reset}
            className="flex items-center gap-2 text-sm font-medium text-slate-500 hover:text-indigo-600 transition-colors mb-6"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to uploader
          </button>
          <BatchProgress files={batchFiles} onComplete={() => showSuccess("Batch processing complete!")} />
        </div>
      ) : !image ? (
        <div className="max-w-3xl mx-auto mt-12">
          {mode === 'single' ? (
            <ImageUploader onUpload={handleUpload} />
          ) : (
            <BatchUploader onUpload={handleBatchUpload} />
          )}
          
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
              <ComparisonSlider 
                before={image} 
                after={image} 
              />
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