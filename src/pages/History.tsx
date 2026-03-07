"use client";

import React from 'react';
import MainLayout from '@/components/layout/MainLayout';
import { Download, Eye, Trash2 } from 'lucide-react';

const mockHistory = [
  { id: 1, name: 'portrait_01.jpg', date: '2 hours ago', size: '4.2 MB', thumb: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop' },
  { id: 2, name: 'landscape_vacation.png', date: 'Yesterday', size: '8.1 MB', thumb: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=400&h=400&fit=crop' },
  { id: 3, name: 'family_photo.webp', date: '3 days ago', size: '2.5 MB', thumb: 'https://images.unsplash.com/photo-1511895426328-dc8714191300?w=400&h=400&fit=crop' },
];

const History = () => {
  return (
    <MainLayout>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900">Enhancement History</h1>
        <p className="text-slate-500 mt-2">Access and download your previously processed images.</p>
      </div>

      <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
        <table className="w-full text-left">
          <thead>
            <tr className="border-b border-slate-50 bg-slate-50/50">
              <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Image</th>
              <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Name</th>
              <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Date</th>
              <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Size</th>
              <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {mockHistory.map((item) => (
              <tr key={item.id} className="hover:bg-slate-50/50 transition-colors group">
                <td className="px-6 py-4">
                  <div className="w-12 h-12 rounded-lg overflow-hidden border border-slate-100">
                    <img src={item.thumb} alt={item.name} className="w-full h-full object-cover" />
                  </div>
                </td>
                <td className="px-6 py-4 font-medium text-slate-900">{item.name}</td>
                <td className="px-6 py-4 text-slate-500 text-sm">{item.date}</td>
                <td className="px-6 py-4 text-slate-500 text-sm">{item.size}</td>
                <td className="px-6 py-4 text-right">
                  <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors">
                      <Eye className="w-4 h-4" />
                    </button>
                    <button className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors">
                      <Download className="w-4 h-4" />
                    </button>
                    <button className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </MainLayout>
  );
};

export default History;