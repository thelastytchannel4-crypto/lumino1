"use client";

import React from 'react';
import MainLayout from '@/components/layout/MainLayout';
import { 
  Bell, 
  Lock, 
  User, 
  Globe, 
  Moon, 
  CreditCard,
  ShieldCheck
} from 'lucide-react';

const Settings = () => {
  return (
    <MainLayout>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900">Settings</h1>
        <p className="text-slate-500 mt-2">Manage your account preferences and application behavior.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-1 space-y-2">
          {[
            { icon: User, label: 'General', active: true },
            { icon: Bell, label: 'Notifications', active: false },
            { icon: ShieldCheck, label: 'Privacy & Security', active: false },
            { icon: CreditCard, label: 'Billing', active: false },
          ].map((item, i) => (
            <button 
              key={i}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all ${
                item.active ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-100' : 'text-slate-500 hover:bg-white hover:text-slate-900'
              }`}
            >
              <item.icon className="w-5 h-5" />
              {item.label}
            </button>
          ))}
        </div>

        <div className="md:col-span-2 space-y-6">
          <div className="bg-white rounded-3xl p-8 border border-slate-100 shadow-sm">
            <h3 className="text-lg font-bold text-slate-900 mb-6">Application Preferences</h3>
            
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-bold text-slate-900">Auto-download results</p>
                  <p className="text-sm text-slate-500">Automatically save enhanced photos to your device.</p>
                </div>
                <div className="w-12 h-6 bg-indigo-600 rounded-full relative cursor-pointer">
                  <div className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full shadow-sm" />
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <p className="font-bold text-slate-900">Dark Mode</p>
                  <p className="text-sm text-slate-500">Switch between light and dark interface themes.</p>
                </div>
                <div className="w-12 h-6 bg-slate-200 rounded-full relative cursor-pointer">
                  <div className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full shadow-sm" />
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <p className="font-bold text-slate-900">High-Fidelity Preview</p>
                  <p className="text-sm text-slate-500">Use more resources for better real-time previews.</p>
                </div>
                <div className="w-12 h-6 bg-indigo-600 rounded-full relative cursor-pointer">
                  <div className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full shadow-sm" />
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-3xl p-8 border border-slate-100 shadow-sm">
            <h3 className="text-lg font-bold text-slate-900 mb-6">Export Settings</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 border-2 border-indigo-600 bg-indigo-50 rounded-2xl">
                <p className="font-bold text-indigo-600">PNG (Lossless)</p>
                <p className="text-xs text-indigo-400">Best for professional printing</p>
              </div>
              <div className="p-4 border-2 border-slate-100 hover:border-indigo-200 rounded-2xl cursor-pointer transition-colors">
                <p className="font-bold text-slate-900">JPG (Optimized)</p>
                <p className="text-xs text-slate-500">Best for web and social media</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default Settings;