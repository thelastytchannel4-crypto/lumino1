"use client";

import React from 'react';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger,
  DialogFooter
} from '@/components/ui/dialog';
import { Download, FileImage, FileType, Check } from 'lucide-react';

const formats = [
  { id: 'png', label: 'PNG', desc: 'Lossless, best quality', size: '12.4 MB' },
  { id: 'jpg', label: 'JPG', desc: 'Optimized for web', size: '2.1 MB' },
  { id: 'webp', label: 'WebP', desc: 'Modern, small size', size: '1.8 MB' },
];

const ExportDialog = () => {
  const [selected, setSelected] = React.useState('png');

  return (
    <Dialog>
      <DialogTrigger asChild>
        <button className="w-full py-4 bg-slate-900 text-white rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-slate-800 transition-all">
          <Download className="w-5 h-5" />
          Download 4K Result
        </button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px] rounded-[32px] p-8">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-slate-900">Export Image</DialogTitle>
        </DialogHeader>
        
        <div className="py-6 space-y-4">
          {formats.map((format) => (
            <button
              key={format.id}
              onClick={() => setSelected(format.id)}
              className={`w-full flex items-center justify-between p-4 rounded-2xl border-2 transition-all ${
                selected === format.id 
                  ? 'border-indigo-600 bg-indigo-50' 
                  : 'border-slate-100 hover:border-slate-200'
              }`}
            >
              <div className="flex items-center gap-4">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                  selected === format.id ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-400'
                }`}>
                  <FileType className="w-5 h-5" />
                </div>
                <div className="text-left">
                  <p className="font-bold text-slate-900">{format.label}</p>
                  <p className="text-xs text-slate-500">{format.desc}</p>
                </div>
              </div>
              {selected === format.id && <Check className="w-5 h-5 text-indigo-600" />}
            </button>
          ))}
        </div>

        <DialogFooter>
          <button className="w-full py-4 bg-indigo-600 text-white rounded-2xl font-bold hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-100">
            Confirm & Download
          </button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ExportDialog;