"use client";

import React from 'react';
import MainLayout from '@/components/layout/MainLayout';
import ComparisonSlider from '@/components/enhancer/ComparisonSlider';
import { Sparkles, Zap, Image as ImageIcon } from 'lucide-react';
import { motion } from 'framer-motion';

const examples = [
  {
    title: "Vintage Portrait Restoration",
    desc: "Restoring a 1940s family portrait by removing scratches and enhancing facial details.",
    before: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&h=600&fit=crop",
    after: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&h=600&fit=crop",
    tags: ["Face Restoration", "Denoise"]
  },
  {
    title: "Landscape Upscaling",
    desc: "Transforming a low-resolution landscape shot into a crisp 4K masterpiece.",
    before: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=800&h=600&fit=crop",
    after: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=800&h=600&fit=crop",
    tags: ["4K Upscale", "HDR"]
  }
];

const Showcase = () => {
  return (
    <MainLayout>
      <motion.div 
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        className="mb-12"
      >
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white">AI Showcase</h1>
        <p className="text-slate-500 dark:text-slate-400 mt-2">See the incredible results our neural engine can achieve.</p>
      </motion.div>

      <div className="space-y-20">
        {examples.map((example, i) => (
          <motion.div 
            key={i} 
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6 }}
            className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center"
          >
            <div className={i % 2 === 1 ? 'lg:order-2' : ''}>
              <ComparisonSlider before={example.before} after={example.after} />
            </div>
            
            <div className="space-y-6">
              <div className="flex gap-2">
                {example.tags.map((tag, j) => (
                  <span key={j} className="px-3 py-1 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 rounded-full text-[10px] font-black uppercase tracking-widest">
                    {tag}
                  </span>
                ))}
              </div>
              <h2 className="text-3xl font-bold text-slate-900 dark:text-white">{example.title}</h2>
              <p className="text-lg text-slate-500 dark:text-slate-400 leading-relaxed">{example.desc}</p>
              
              <div className="grid grid-cols-2 gap-4 pt-4">
                <motion.div 
                  whileHover={{ y: -5 }}
                  className="p-4 bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800"
                >
                  <Zap className="w-5 h-5 text-amber-500 mb-2" />
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Processing Time</p>
                  <p className="text-lg font-bold text-slate-900 dark:text-white">1.2 Seconds</p>
                </motion.div>
                <motion.div 
                  whileHover={{ y: -5 }}
                  className="p-4 bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800"
                >
                  <Sparkles className="w-5 h-5 text-indigo-600 mb-2" />
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">AI Model</p>
                  <p className="text-lg font-bold text-slate-900 dark:text-white">Lumina v4.0</p>
                </motion.div>
              </div>

              <motion.button 
                whileHover={{ x: 10 }}
                className="flex items-center gap-2 text-indigo-600 font-bold transition-all"
              >
                Try this style
                <ImageIcon className="w-5 h-5" />
              </motion.button>
            </div>
          </motion.div>
        ))}
      </div>
    </MainLayout>
  );
};

export default Showcase;