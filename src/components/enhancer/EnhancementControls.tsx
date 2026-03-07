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
}

const EnhancementControls = ({ onEnhance, isProcessing, isEnhanced }: EnhancementControlsProps) => {
  return (
    <div className="bg-white rounded-3xl p-8 border border-slate-100 shadow-sm space-y-8 sticky top-24">
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

          <div className="pt-4 space-y-4 border-t border-slate-50">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-indigo-50 rounded-lg flex items-center justify-center">
                  <UserCheck className="w-4 h-4 text-indigo-600" />
                </div>
                <Label htmlFor="face-restoration" className="font-bold text-slate-700 cursor-pointer">Face Restoration</Label>
              </div>
              <Switch id="face-restoration" defaultChecked />
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-indigo-50 rounded-lg flex items-center justify-center">
                  <Paintbrush className="w-4 h-4 text-indigo-600" />
                </div>
                <Label htmlFor="colorize" className="font-bold text-slate-700 cursor-pointer">AI Colorize</Label>
              </div>
              <Switch id="colorize" />
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-amber-50 rounded-lg flex items-center justify-center">
                  <Zap className="w-4 h-4 text-amber-600" />
                </div>
                <Label htmlFor="hdr" className="font-bold text-slate-700 cursor-pointer">Smart HDR</Label>
              </div>
              <Switch id="hdr" defaultChecked />
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
              {isEnhanced ? 'Re-Enhance' : 'Enhance Photo'}
            </>
          )}
        </button>
        
        {isEnhanced && <ExportDialog />}
      </div>
    </div>
  );
};

export default EnhancementControls;