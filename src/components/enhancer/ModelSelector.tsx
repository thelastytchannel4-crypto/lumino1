"use client";

import React from 'react';
import { User, Mountain, Zap, Ghost, Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';

const models = [
  { id: 'portrait', name: 'Portrait AI', icon: User, desc: 'Skin smoothing & eye enhancement' },
  { id: 'landscape', name: 'Nature HD', icon: Mountain, desc: 'Detail recovery & color boost' },
  { id: 'lowlight', name: 'Night Sight', icon: Ghost, desc: 'Denoise & exposure correction' },
  { id: 'anime', name: 'Artistic', icon: Sparkles, desc: 'Upscale for illustrations' },
];

interface ModelSelectorProps {
  selectedModel: string;
  onSelect: (id: string) => void;
}

const ModelSelector = ({ selectedModel, onSelect }: ModelSelectorProps) => {
  return (
    <div className="grid grid-cols-2 gap-3">
      {models.map((model) => {
        const isActive = selectedModel === model.id;
        return (
          <button
            key={model.id}
            onClick={() => onSelect(model.id)}
            className={cn(
              "p-4 rounded-2xl border text-left transition-all duration-200 group",
              isActive 
                ? "border-indigo-600 bg-indigo-50/50 ring-1 ring-indigo-600" 
                : "border-slate-100 bg-white hover:border-indigo-200 hover:bg-slate-50/50"
            )}
          >
            <div className={cn(
              "w-10 h-10 rounded-xl flex items-center justify-center mb-3 transition-colors",
              isActive ? "bg-indigo-600 text-white" : "bg-slate-50 text-slate-400 group-hover:text-indigo-600"
            )}>
              <model.icon className="w-5 h-5" />
            </div>
            <p className={cn("font-bold text-sm", isActive ? "text-indigo-900" : "text-slate-900")}>
              {model.name}
            </p>
            <p className="text-[10px] text-slate-500 mt-1 leading-tight">
              {model.desc}
            </p>
          </button>
        );
      })}
    </div>
  );
};

export default ModelSelector;