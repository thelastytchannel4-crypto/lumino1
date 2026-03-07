"use client";

import React from 'react';
import MainLayout from '@/components/layout/MainLayout';
import ComparisonSlider from '@/components/enhancer/ComparisonSlider';
import { Sparkles, Zap, Image as ImageIcon } from 'lucide-react';

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
      <div className="mb-12">
        <h1 className="text-3xl font-bold text-slate-900">AI Showcase</h1>
        <p className="text-slate-500 mt-2">See the incredible results our neural engine can achieve.</p>
      </div>

      <div className="space-y-20">
        {examples.map((example, i) => (
          <div key={i} className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className={i % 2 === 1 ? 'lg:order-2' : ''}>
              <ComparisonSlider before={example.before} after={example.after} />
            </div>
            
            <div className="space-y-6">
              <div className="flex gap-2">
                {example.tags.map((tag, j) => (
                  <span key={j} className="px-3 py-1 bg-indigo-50 text-indigo-600 rounded-full text-[10px] font-black uppercase tracking-widest">
                    {tag}
                  </span>
                ))}
              </div>
              <h2 className="text-3xl font-bold text-slate-900">{example.title}</h2>
              <p className="text-lg text-slate-500 leading-relaxed">{example.desc}</p>
              
              <div className="grid grid-cols-2 gap-4 pt-4">
                <div className="p-4 bg-white rounded-2xl border border-slate-100">
                  <Zap className="w-5 h-5 text-amber-500 mb-2" />
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Processing Time</p>
                  <p className="text-lg font-bold text-slate-900">1.2 Seconds</p>
                </div>
                <div className="p-4 bg-white rounded-2xl border border-slate-100">
                  <Sparkles className="w-5 h-5 text-indigo-600 mb-2" />
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">AI Model</p>
                  <p className="text-lg font-bold text-slate-900">Lumina v4.0</p>
                </div>
              </div>

              <button className="flex items-center gap-2 text-indigo-600 font-bold hover:gap-3 transition-all">
                Try this style
                <ImageIcon className="w-5 h-5" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </MainLayout>
  );
};

export default Showcase;