"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Zap, ShieldCheck } from 'lucide-react';

const HeroSection = () => {
  return (
    <div className="text-center mb-8 md:mb-16 mt-4 md:mt-8 perspective-1000">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <motion.div 
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
          className="inline-flex items-center gap-2 px-3 py-1.5 md:px-4 md:py-2 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 rounded-full text-[10px] md:text-sm font-bold mb-4 md:mb-6 shadow-sm"
        >
          <Sparkles className="w-3 h-3 md:w-4 h-4" />
          <span>Powered by Lumino1 Neural Engine v4.0</span>
        </motion.div>
        
        <div className="relative">
          <motion.h1 
            initial={{ opacity: 0, rotateX: -45, y: 40, z: -100 }}
            animate={{ opacity: 1, rotateX: 0, y: 0, z: 0 }}
            transition={{ 
              duration: 1, 
              ease: [0.16, 1, 0.3, 1],
              delay: 0.3
            }}
            style={{ transformStyle: "preserve-3d" }}
            className="text-3xl sm:text-5xl md:text-7xl font-black text-slate-900 dark:text-white tracking-tight mb-4 md:mb-6 leading-[1.1]"
          >
            Professional AI <br />
            <motion.span 
              animate={{ 
                backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
              }}
              transition={{ 
                duration: 5, 
                repeat: Infinity, 
                ease: "linear" 
              }}
              style={{ backgroundSize: "200% auto" }}
              className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 via-violet-500 to-indigo-600 inline-block"
            >
              Photo Restoration
            </motion.span>
          </motion.h1>

          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.1 }}
            transition={{ delay: 1, duration: 2 }}
            className="absolute -bottom-4 left-1/2 -translate-x-1/2 w-3/4 h-8 bg-indigo-600 blur-3xl rounded-full pointer-events-none hidden md:block"
          />
        </div>
        
        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.8 }}
          className="text-base md:text-xl text-slate-500 dark:text-slate-400 max-w-2xl mx-auto mb-8 md:mb-10 leading-relaxed px-4"
        >
          Upscale, denoise, and restore your photos in seconds. Used by over 50,000 photographers worldwide.
        </motion.p>

        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8, duration: 1 }}
          className="flex flex-wrap items-center justify-center gap-4 md:gap-8 text-slate-400 dark:text-slate-500"
        >
          <div className="flex items-center gap-2">
            <Zap className="w-4 h-4 md:w-5 h-5 text-amber-500" />
            <span className="text-xs md:text-sm font-medium">Instant Processing</span>
          </div>
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 md:w-5 h-5 text-emerald-500" />
            <span className="text-xs md:text-sm font-medium">Privacy Guaranteed</span>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default HeroSection;