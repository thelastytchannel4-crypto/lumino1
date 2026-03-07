"use client";

import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  History, 
  Settings, 
  Sparkles, 
  Layers,
  Zap,
  Eye
} from 'lucide-react';
import { cn } from '@/lib/utils';

const navItems = [
  { icon: LayoutDashboard, label: 'Enhancer', path: '/' },
  { icon: Layers, label: 'Batch Process', path: '/batch' },
  { icon: Eye, label: 'Showcase', path: '/showcase' },
  { icon: History, label: 'History', path: '/history' },
  { icon: Settings, label: 'Settings', path: '/settings' },
];

const Sidebar = () => {
  const location = useLocation();

  return (
    <aside className="w-64 bg-white dark:bg-slate-900 border-r border-slate-100 dark:border-slate-800 flex flex-col h-screen sticky top-0">
      <div className="p-6 flex items-center gap-3">
        <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-200">
          <Sparkles className="text-white w-6 h-6" />
        </div>
        <span className="font-bold text-xl tracking-tight text-slate-900 dark:text-white">Lumina AI</span>
      </div>

      <nav className="flex-1 px-4 py-4 space-y-2">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <Link
              key={item.path}
              to={item.path}
              className={cn(
                "flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group",
                isActive 
                  ? "bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 shadow-sm" 
                  : "text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white"
              )}
            >
              <item.icon className={cn(
                "w-5 h-5 transition-colors",
                isActive ? "text-indigo-600" : "text-slate-400 group-hover:text-slate-600 dark:group-hover:text-slate-300"
              )} />
              <span className="font-medium">{item.label}</span>
            </Link>
          );
        })}
      </nav>

      <div className="p-4 mt-auto">
        <div className="bg-gradient-to-br from-indigo-600 to-violet-600 rounded-2xl p-5 text-white shadow-xl shadow-indigo-100">
          <div className="flex items-center gap-2 mb-2">
            <Zap className="w-4 h-4 fill-current" />
            <span className="text-xs font-bold uppercase tracking-wider">Pro Plan</span>
          </div>
          <p className="text-sm text-indigo-100 mb-4">Unlock 4K upscaling and batch processing.</p>
          <Link 
            to="/pricing"
            className="block w-full py-2 bg-white text-indigo-600 rounded-lg text-sm font-bold hover:bg-indigo-50 transition-colors text-center"
          >
            Upgrade Now
          </Link>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;