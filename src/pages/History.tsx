"use client";

import React, { useState } from 'react';
import MainLayout from '@/components/layout/MainLayout';
import { Download, Eye, Trash2, Calendar, HardDrive, Lock, LogIn } from 'lucide-react';
import { showSuccess } from '@/utils/toast';
import { motion, AnimatePresence } from 'framer-motion';

const mockHistory = [
  { id: 1, name: 'portrait_01.jpg', date: '2 hours ago', size: '4.2 MB', thumb: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop' },
  { id: 2, name: 'landscape_vacation.png', date: 'Yesterday', size: '8.1 MB', thumb: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=400&h=400&fit=crop' },
  { id: 3, name: 'family_photo.webp', date: '3 days ago', size: '2.5 MB', thumb: 'https://images.unsplash.com/photo-1511895426328-dc8714191300?w=400&h=400&fit=crop' },
  { id: 4, name: 'nature_macro.jpg', date: '1 week ago', size: '5.7 MB', thumb: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=400&h=400&fit=crop' },
];

const History = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const handleDownload = (url: string, filename: string) => {
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showSuccess(`Downloading ${filename}...`);
  };

  return (
    <MainLayout>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Enhancement History</h1>
        <p className="text-slate-500 dark:text-slate-400 mt-2">Access and download your previously processed images.</p>
      </div>

      <AnimatePresence mode="wait">
        {!isLoggedIn ? (
          <motion.div 
            key="guest-prompt"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="bg-white dark:bg-slate-900 rounded-[40px] p-16 border border-slate-100 dark:border-slate-800 shadow-sm text-center max-w-2xl mx-auto"
          >
            <motion.div 
              animate={{ y: [0, -10, 0] }}
              transition={{ repeat: Infinity, duration: 3 }}
              className="w-20 h-20 bg-indigo-50 dark:bg-indigo-900/20 rounded-3xl flex items-center justify-center mx-auto mb-6"
            >
              <Lock className="w-10 h-10 text-indigo-600" />
            </motion.div>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">Sign in to save your history</h2>
            <p className="text-slate-500 dark:text-slate-400 mb-8 leading-relaxed">
              You're currently in Guest Mode. Your enhanced photos are only stored temporarily. Sign in to sync your history across all your devices.
            </p>
            <motion.button 
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setIsLoggedIn(true)}
              className="inline-flex items-center gap-2 px-8 py-4 bg-indigo-600 text-white rounded-2xl font-bold hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-100"
            >
              <LogIn className="w-5 h-5" />
              Sign In Now
            </motion.button>
          </motion.div>
        ) : (
          <motion.div 
            key="history-grid"
            initial="hidden"
            animate="visible"
            variants={{
              visible: { transition: { staggerChildren: 0.1 } }
            }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
          >
            {mockHistory.map((item) => (
              <motion.div 
                key={item.id}
                variants={{
                  hidden: { opacity: 0, y: 20 },
                  visible: { opacity: 1, y: 0 }
                }}
                className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm overflow-hidden group hover:shadow-md transition-all"
              >
                <div className="aspect-square relative overflow-hidden">
                  <img src={item.thumb} alt={item.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
                    <motion.button 
                      whileHover={{ scale: 1.1 }}
                      className="p-3 bg-white text-slate-900 rounded-2xl hover:bg-indigo-600 hover:text-white transition-colors shadow-lg"
                    >
                      <Eye className="w-5 h-5" />
                    </motion.button>
                    <motion.button 
                      whileHover={{ scale: 1.1 }}
                      onClick={() => handleDownload(item.thumb, item.name)}
                      className="p-3 bg-white text-slate-900 rounded-2xl hover:bg-indigo-600 hover:text-white transition-colors shadow-lg"
                    >
                      <Download className="w-5 h-5" />
                    </motion.button>
                  </div>
                </div>
                
                <div className="p-5">
                  <h3 className="font-bold text-slate-900 dark:text-white truncate mb-3">{item.name}</h3>
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
                  
                  <div className="mt-4 pt-4 border-t border-slate-50 dark:border-slate-800 flex justify-between items-center">
                    <span className="text-[10px] font-black uppercase tracking-widest text-indigo-600 bg-indigo-50 dark:bg-indigo-900/30 px-2 py-0.5 rounded">4K Enhanced</span>
                    <button className="text-slate-300 hover:text-red-500 transition-colors">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </MainLayout>
  );
};

export default History;