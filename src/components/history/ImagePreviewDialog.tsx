"use client";

import React from 'react';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle 
} from '@/components/ui/dialog';
import { Download, X } from 'lucide-react';

interface ImagePreviewDialogProps {
  image: { name: string; thumb: string } | null;
  onClose: () => void;
}

const ImagePreviewDialog = ({ image, onClose }: ImagePreviewDialogProps) => {
  if (!image) return null;

  return (
    <Dialog open={!!image} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-4xl p-0 overflow-hidden bg-slate-900 border-none">
        <div className="relative aspect-[4/3]">
          <img 
            src={image.thumb} 
            alt={image.name} 
            className="w-full h-full object-contain"
          />
          
          <div className="absolute top-0 inset-x-0 p-6 bg-gradient-to-b from-black/60 to-transparent flex items-center justify-between">
            <h3 className="text-white font-bold">{image.name}</h3>
            <div className="flex gap-2">
              <button className="p-2 bg-white/10 hover:bg-white/20 backdrop-blur-md rounded-lg text-white transition-colors">
                <Download className="w-5 h-5" />
              </button>
              <button 
                onClick={onClose}
                className="p-2 bg-white/10 hover:bg-white/20 backdrop-blur-md rounded-lg text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ImagePreviewDialog;