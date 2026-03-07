"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Zap, ShieldCheck } from 'lucide-react';

const HeroSection = () => {
  return (
    <div className="text-center mb-16 mt-8">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-50 text-indigo-600 rounded-full text-sm font-bold mb-6">
          <Sparkles className="w-4 h-4" />
          <span>Powered by Lumina Neural Engine v4.0</span>
        </div>
        
        <h1 className="text-5xl md:text-6xl font-black text-slate-900 tracking-tight mb-6">
          Professional AI <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-violet-600">
            Photo Restoration
          </span>
        </h1>
        
        <p className="text-xl text-slate-500 max-w-2xl mx-auto mb-10 leading-relaxed">
          Upscale, denoise, and restore your photos in seconds. Used by over 50,000 photographers and designers worldwide.
        </p>

        <div className="flex items-center justify-center gap-8 text-slate-400">
          <div className="flex items-center gap-2">
            <Zap className="w-5 h-5 text-amber-500" />
            <span className="text-sm font-medium">Instant Processing</span>
          </div>
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-emerald-500" />
            <span className="text-sm font-medium">Privacy Guaranteed</span>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default HeroSection;