"use client";

import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Sidebar from './Sidebar';
import MobileNav from './MobileNav';
import ThemeToggle from './ThemeToggle';
import { LogIn } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const MainLayout = ({ children }: { children: React.ReactNode }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  return (
    <div className="flex min-h-screen bg-slate-50/50 dark:bg-slate-950">
      <Sidebar />
      <main className="flex-1 flex flex-col min-w-0">
        <header className="h-16 border-b border-slate-100 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md flex items-center justify-between px-4 md:px-8 sticky top-0 z-30">
          <div className="flex items-center gap-2 md:gap-4">
            <MobileNav />
            {!isLoggedIn && (
              <motion.span 
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-[10px] md:text-xs font-bold text-amber-600 bg-amber-50 dark:bg-amber-900/20 px-2 py-1 rounded-md uppercase tracking-wider whitespace-nowrap"
              >
                Guest Mode
              </motion.span>
            )}
          </div>
          
          <div className="flex items-center gap-3 md:gap-6">
            <ThemeToggle />
            
            <AnimatePresence mode="wait">
              {isLoggedIn ? (
                <motion.div
                  key="profile"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                >
                  <Link to="/profile" className="flex items-center gap-2 md:gap-4 hover:opacity-80 transition-opacity group">
                    <div className="text-right hidden sm:block">
                      <p className="text-sm font-semibold text-slate-900 dark:text-white group-hover:text-indigo-600 transition-colors">Alex Rivera</p>
                      <p className="text-xs text-slate-500">Professional Account</p>
                    </div>
                    <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-slate-200 dark:bg-slate-800 border-2 border-white dark:border-slate-700 shadow-sm overflow-hidden">
                      <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Alex" alt="Avatar" />
                    </div>
                  </Link>
                </motion.div>
              ) : (
                <motion.button 
                  key="signin"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  onClick={() => setIsLoggedIn(true)}
                  className="flex items-center gap-2 px-3 py-1.5 md:px-4 md:py-2 bg-indigo-600 text-white rounded-xl text-xs md:text-sm font-bold hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-100 dark:shadow-none"
                >
                  <LogIn className="w-3.5 h-3.5 md:w-4 h-4" />
                  Sign In
                </motion.button>
              )}
            </AnimatePresence>
          </div>
        </header>
        
        <div className="flex-1 overflow-x-hidden">
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
            className="p-4 md:p-8 max-w-6xl mx-auto w-full"
          >
            {children}
          </motion.div>
        </div>
      </main>
    </div>
  );
};

export default MainLayout;