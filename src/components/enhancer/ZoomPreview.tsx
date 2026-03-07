"use client";

import React, { useState } from 'react';

interface ZoomPreviewProps {
  image: string;
}

const ZoomPreview = ({ image }: ZoomPreviewProps) => {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [showZoom, setShowZoom] = useState(false);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const { left, top, width, height } = e.currentTarget.getBoundingClientRect();
    const x = ((e.pageX - left - window.scrollX) / width) * 100;
    const y = ((e.pageY - top - window.scrollY) / height) * 100;
    setPosition({ x, y });
  };

  return (
    <div className="mt-8 bg-white rounded-3xl p-6 border border-slate-100 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-bold text-slate-900">Detail Inspection</h3>
        <span className="text-xs text-slate-400 font-medium">Hover to zoom 400%</span>
      </div>
      
      <div 
        className="relative aspect-video rounded-2xl overflow-hidden cursor-crosshair bg-slate-100"
        onMouseMove={handleMouseMove}
        onMouseEnter={() => setShowZoom(true)}
        onMouseLeave={() => setShowZoom(false)}
      >
        <img src={image} alt="Preview" className="w-full h-full object-cover" />
        
        {showZoom && (
          <div 
            className="absolute inset-0 pointer-events-none"
            style={{
              backgroundImage: `url(${image})`,
              backgroundPosition: `${position.x}% ${position.y}%`,
              backgroundSize: '400%',
              filter: 'contrast(1.1) brightness(1.05) saturate(1.2) sharp(10px)'
            }}
          />
        )}
      </div>
    </div>
  );
};

export default ZoomPreview;