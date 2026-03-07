"use client";

import React, { useState, useEffect } from 'react';
import { Loader2, CheckCircle2, Download, AlertCircle } from 'lucide-react';

interface BatchProgressProps {
  files: File[];
  onComplete: () => void;
}

const BatchProgress = ({ files, onComplete }: BatchProgressProps) => {
  const [progress, setProgress] = useState<Record<number, number>>({});
  const [statuses, setStatuses] = useState<Record<number, 'pending' | 'processing' | 'completed'>>({});

  useEffect(() => {
    files.forEach((_, index) => {
      // Simulate staggered processing
      setTimeout(() => {
        setStatuses(prev => ({ ...prev, [index]: 'processing' }));
        
        let currentProgress = 0;
        const interval = setInterval(() => {
          currentProgress += Math.random() * 15;
          if (currentProgress >= 100) {
            currentProgress = 100;
            clearInterval(interval);
            setStatuses(prev => ({ ...prev, [index]: 'completed' }));
          }
          setProgress(prev => ({ ...prev, [index]: currentProgress }));
        }, 200);
      }, index * 800);
    });
  }, [files]);

  const allCompleted = Object.values(statuses).filter(s => s === 'completed').length === files.length;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-xl font-bold text-slate-900">Batch Processing</h3>
          <p className="text-slate-500 text-sm">Processing {files.length} images with AI</p>
        </div>
        {allCompleted && (
          <button 
            onClick={onComplete}
            className="px-4 py-2 bg-indigo-600 text-white rounded-xl text-sm font-bold hover:bg-indigo-700 transition-all flex items-center gap-2"
          >
            <Download className="w-4 h-4" />
            Download All (.zip)
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {files.map((file, i) => (
          <div key={i} className="bg-white p-4 rounded-2xl border border-slate-100 flex items-center gap-4">
            <div className="w-16 h-16 rounded-xl overflow-hidden bg-slate-100 flex-shrink-0">
              <img src={URL.createObjectURL(file)} className="w-full h-full object-cover" alt="Thumb" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex justify-between items-center mb-2">
                <p className="text-sm font-bold text-slate-900 truncate">{file.name}</p>
                <span className="text-[10px] font-bold text-indigo-600 uppercase tracking-wider">
                  {statuses[i] === 'completed' ? 'Done' : statuses[i] === 'processing' ? `${Math.round(progress[i] || 0)}%` : 'Waiting'}
                </span>
              </div>
              <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-indigo-600 transition-all duration-300" 
                  style={{ width: `${progress[i] || 0}%` }}
                />
              </div>
            </div>
            <div className="flex-shrink-0">
              {statuses[i] === 'completed' ? (
                <CheckCircle2 className="w-5 h-5 text-emerald-500" />
              ) : statuses[i] === 'processing' ? (
                <Loader2 className="w-5 h-5 text-indigo-600 animate-spin" />
              ) : (
                <AlertCircle className="w-5 h-5 text-slate-200" />
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default BatchProgress;