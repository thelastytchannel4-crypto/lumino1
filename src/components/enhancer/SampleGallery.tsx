"use client";

import React from 'react';

const samples = [
  { id: 1, url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop', label: 'Portrait' },
  { id: 2, url: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=400&h=400&fit=crop', label: 'Landscape' },
  { id: 3, url: 'https://images.unsplash.com/photo-1511895426328-dc8714191300?w=400&h=400&fit=crop', label: 'Family' },
  { id: 4, url: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=400&h=400&fit=crop', label: 'Nature' },
];

interface SampleGalleryProps {
  onSelect: (url: string) => void;
}

const SampleGallery = ({ onSelect }: SampleGalleryProps) => {
  return (
    <div className="mt-16">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-bold text-slate-900">Try with a sample</h3>
        <span className="text-sm text-slate-400 font-medium">No photo? No problem.</span>
      </div>
      
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {samples.map((sample) => (
          <button
            key={sample.id}
            onClick={() => onSelect(sample.url)}
            className="group relative aspect-square rounded-2xl overflow-hidden border-2 border-transparent hover:border-indigo-600 transition-all"
          >
            <img 
              src={sample.url} 
              alt={sample.label} 
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" 
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-3">
              <span className="text-white text-xs font-bold">{sample.label}</span>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};

export default SampleGallery;