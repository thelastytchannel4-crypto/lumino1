"use client";

import React from 'react';
import { 
  Maximize2, 
  Palette,
  RefreshCw,
  UserCheck,
  Paintbrush,
  Zap
} from 'lucide-react';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import ExportDialog from './ExportDialog';

interface EnhancementControlsProps {
  onEnhance: () => void;
  isProcessing: boolean;
  isEnhanced: boolean;
  imageUrl: string | null;
}

const EnhancementControls = ({ onEnhance, isProcessing, isEnhanced, imageUrl }: EnhancementControlsProps) => {
  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl md:rounded-3xl p-6 md:p-8 border border-slate-100 dark:border-slate-800 shadow-sm space-y-6 md:space-y-8 lg:sticky lg:top-24">
      <div>
        <h3 className="text-base md:text-lg font-bold text-slate-900 dark:text-white mb-4 md:mb-6 flex items-center gap-2">
          <Palette className="w-4 h-4 md:w-5 h-5 text-indigo-600" />
          Enhancement Settings
        </h3>
        
        <div className="space-y-5 md:space-y-6">
          <div className="space-y-2 md:space-y-3">
            <div className="flex justify-between text-xs md:text-sm font-medium">
              <span className="text-slate-600 dark:text-slate-400">Upscale Resolution</span>
              <span className="text-indigo-600">4x (Ultra HD)</span>
            </div>
            <div className="h-1.5 md:h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
              <div className="h-full w-3/4 bg-indigo-600 rounded-full" />
            </div>
          </div>

          <div className="space-y-2 md:space-y-3">
            <div className="flex justify-between text-xs md:text-sm font-medium">
              <span className="text-slate-600 dark:text-slate-400">Denoise Strength</span>
              <span className="text-indigo-600">85%</span>
            </div>
            <div className="h-1.5 md:h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
              <div className="h-full w-[85%] bg-indigo-600 rounded-full" />
            </div>
          </div>

          <div className="pt-4 space-y-4 border-t border-slate-50 dark:border-slate-800">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-7 h-7 md:w-8 md:h-8 bg-indigo-50 dark:bg-indigo-900/30 rounded-lg flex items-center justify-center">
                  <UserCheck className="w-3.5 h-3.5 md:w-4 h-4 text-indigo-600" />
                </div>
                <Label htmlFor="face-restoration" className="text-xs md:text-sm font-bold text-slate-700 dark:text-slate-300 cursor-pointer">Face Restoration</Label>
              </div>
              <Switch id="face-restoration" defaultChecked />
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-7 h-7 md:w-8 md:h-8 bg-indigo-50 dark:bg-indigo-900/30 rounded-lg flex items-center justify-center">
                  <Paintbrush className="w-3.5 h-3.5 md:w-4 h-4 text-indigo-600" />
                </div>
                <Label htmlFor="colorize" className="text-xs md:text-sm font-bold text-slate-700 dark:text-slate-300 cursor-pointer">AI Colorize</Label>
              </div>
              <Switch id="colorize" />
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-7 h-7 md:w-8 md:h-8 bg-amber-50 dark:bg-amber-900/20 rounded-lg flex items-center justify-center">
                  <Zap className="w-3.5 h-3.5 md:w-4 h-4 text-amber-600" />
                </div>
                <Label htmlFor="hdr" className="text-xs md:text-sm font-bold text-slate-700 dark:text-slate-300 cursor-pointer">Smart HDR</Label>
              </div>
              <Switch id="hdr" defaultChecked />
            </div>
          </div>
        </div>
      </div>

      <div className="pt-2 space-y-3">
        <button
          onClick={onEnhance}
          disabled={isProcessing}
          className="w-full py-3.5 md:py-4 bg-indigo-600 text-white rounded-xl md:rounded-2xl text-sm md:text-base font-bold flex items-center justify-center gap-2 hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-100 dark:shadow-none disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isProcessing ? (
            <>
              <RefreshCw className="w-4 h-4 md:w-5 h-5 animate-spin" />
              Processing...
            </>
          ) : (
            <>
              <Maximize2 className="w-4 h-4 md:w-5 h-5" />
              {isEnhanced ? 'Re-Enhance' : 'Enhance Photo'}
            </>
          )}
        </button>
        
        {isEnhanced && imageUrl && <ExportDialog imageUrl={imageUrl} />}
      </div>
    </div>
  );
};

export default EnhancementControls;