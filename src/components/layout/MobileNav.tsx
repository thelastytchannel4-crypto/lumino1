"use client";

import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  History, 
  Settings, 
  Sparkles, 
  Layers,
  Eye,
  Menu,
  X
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from '@/components/ui/sheet';

const navItems = [
  { icon: LayoutDashboard, label: 'Enhancer', path: '/' },
  { icon: Layers, label: 'Batch Process', path: '/batch' },
  { icon: Eye, label: 'Showcase', path: '/showcase' },
  { icon: History, label: 'History', path: '/history' },
  { icon: Settings, label: 'Settings', path: '/settings' },
];

const MobileNav = () => {
  const location = useLocation();
  const [open, setOpen] = React.useState(false);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <button className="lg:hidden p-2 text-slate-600 hover:bg-slate-100 rounded-xl transition-colors">
          <Menu className="w-6 h-6" />
        </button>
      </SheetTrigger>
      <SheetContent side="left" className="w-72 p-0 border-r-0">
        <div className="flex flex-col h-full bg-white dark:bg-slate-900">
          <div className="p-6 flex items-center gap-3 border-b border-slate-50 dark:border-slate-800">
            <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-200">
              <Sparkles className="text-white w-6 h-6" />
            </div>
            <SheetTitle className="font-bold text-xl tracking-tight text-slate-900 dark:text-white">Lumino1</SheetTitle>
          </div>

          <nav className="flex-1 px-4 py-6 space-y-2">
            {navItems.map((item) => {
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setOpen(false)}
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

          <div className="p-6 border-t border-slate-100 dark:border-slate-800">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center">
                <Sparkles className="w-4 h-4 text-indigo-600" />
              </div>
              <div className="text-xs">
                <p className="font-bold text-slate-900 dark:text-white">Unlimited Access</p>
                <p className="text-slate-500">All features unlocked</p>
              </div>
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default MobileNav;