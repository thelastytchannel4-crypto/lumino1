"use client";

import React from 'react';
import { Slider } from '@/components/ui/button'; // Using standard UI components
import { 
  Maximize2, 
  Sun, 
  Wind, 
  Palette,
  Download,
  RefreshCw
} from 'lucide-react';

interface EnhancementControlsProps {
  onEnhance: () => void;
  isProcessing: boolean;
}

const EnhancementControls = ({ onEnhance, isProcessing }: EnhancementControlsProps) => {
  return (
    <div className="bg-white rounded-3xl p-8 border border-slate-100 shadow-sm space-y-8">
      <div>
        <h3 className="text-lg font-bold text-slate-900 mb-6 flex items-center gap-2">
          <Palette className="w-5 h-5 text-indigo-600" />
          Enhancement Settings
        </h3>
        
        <div className="space-y-6">
          <div className="space-y-3">
            <div className="flex justify-between text-sm font-medium">
              <span className="text-slate-600">Upscale Resolution</span>
              <span className="text-indigo-600">4x (Ultra HD)</span>
            </div>
            <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
              <div className="h-full w-3/4 bg-indigo-600 rounded-full" />
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex justify-between text-sm font-medium">
              <span className="text-slate-600">Denoise Strength</span>
              <span className="text-indigo-600">85%</span>
            </div>
            <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
              <div className="h-full w-[85%] bg-indigo-600 rounded-full" />
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex justify-between text-sm font-medium">
              <span className="text-slate-600">Color Correction</span>
              <span className="text-indigo-600">Auto</span>
            </div>
            <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
              <div className="h-full w-1/2 bg-indigo-600 rounded-full" />
            </div>
          </div>
        </div>
      </div>

      <div className="pt-4 space-y-3">
        <button
          onClick={onEnhance}
          disabled={isProcessing}
          className="w-full py-4 bg-indigo-600 text-white rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-100 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isProcessing ? (
            <>
              <RefreshCw className="w-5 h-5 animate-spin" />
              Processing...
            </>
          ) : (
            <>
              <Maximize2 className="w-5 h-5" />
              Enhance Photo
            </>
          )}
        </button>
        
        <button className="w-full py-4 bg-slate-50 text-slate-600 rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-slate-100 transition-all">
          <Download className="w-5 h-5" />
          Download Result
        </button>
      </div>
    </div>
  );
};

export default EnhancementControls;