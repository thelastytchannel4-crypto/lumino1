"use client";

import React from 'react';
import MainLayout from '@/components/layout/MainLayout';
import { Download, Eye, Trash2, Calendar, HardDrive } from 'lucide-react';

const mockHistory = [
  { id: 1, name: 'portrait_01.jpg', date: '2 hours ago', size: '4.2 MB', thumb: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop' },
  { id: 2, name: 'landscape_vacation.png', date: 'Yesterday', size: '8.1 MB', thumb: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=400&h=400&fit=crop' },
  { id: 3, name: 'family_photo.webp', date: '3 days ago', size: '2.5 MB', thumb: 'https://images.unsplash.com/photo-1511895426328-dc8714191300?w=400&h=400&fit=crop' },
  { id: 4, name: 'nature_macro.jpg', date: '1 week ago', size: '5.7 MB', thumb: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=400&h=400&fit=crop' },
];

const History = () => {
  return (
    <MainLayout>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900">Enhancement History</h1>
        <p className="text-slate-500 mt-2">Access and download your previously processed images.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {mockHistory.map((item) => (
          <div key={item.id} className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden group hover:shadow-md transition-all">
            <div className="aspect-square relative overflow-hidden">
              <img src={item.thumb} alt={item.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
                <button className="p-3 bg-white text-slate-900 rounded-2xl hover:bg-indigo-600 hover:text-white transition-colors shadow-lg">
                  <Eye className="w-5 h-5" />
                </button>
                <button className="p-3 bg-white text-slate-900 rounded-2xl hover:bg-indigo-600 hover:text-white transition-colors shadow-lg">
                  <Download className="w-5 h-5" />
                </button>
              </div>
            </div>
            
            <div className="p-5">
              <h3 className="font-bold text-slate-900 truncate mb-3">{item.name}</h3>
              <div className="flex items-center justify-between text-xs text-slate-400 font-medium">
                <div className="flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5" />
                  {item.date}
                </div>
                <div className="flex items-center gap-1.5">
                  <HardDrive className="w-3.5 h-3.5" />
                  {item.size}
                </div>
              </div>
              
              <div className="mt-4 pt-4 border-t border-slate-50 flex justify-between items-center">
                <span className="text-[10px] font-black uppercase tracking-widest text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded">4K Enhanced</span>
                <button className="text-slate-300 hover:text-red-500 transition-colors">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </MainLayout>
  );
};

export default History;