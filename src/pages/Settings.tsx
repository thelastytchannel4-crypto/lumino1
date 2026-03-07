"use client";

import React, { useState } from 'react';
import MainLayout from '@/components/layout/MainLayout';
import { 
  Bell, 
  Lock, 
  User, 
  Globe, 
  Moon, 
  CreditCard,
  ShieldCheck,
  Check
} from 'lucide-react';
import { useTheme } from 'next-themes';
import { showSuccess } from '@/utils/toast';
import { cn } from '@/lib/utils';

const Settings = () => {
  const { theme, setTheme } = useTheme();
  const [activeTab, setActiveTab] = useState('General');
  
  // Settings States
  const [autoDownload, setAutoDownload] = useState(true);
  const [highFidelity, setHighFidelity] = useState(true);
  const [exportFormat, setExportFormat] = useState('png');

  const tabs = [
    { icon: User, label: 'General' },
    { icon: Bell, label: 'Notifications' },
    { icon: ShieldCheck, label: 'Privacy & Security' },
    { icon: CreditCard, label: 'Billing' },
  ];

  const handleToggle = (setting: string, value: boolean, setter: (v: boolean) => void) => {
    setter(!value);
    showSuccess(`${setting} ${!value ? 'enabled' : 'disabled'}`);
  };

  const handleFormatChange = (format: string) => {
    setExportFormat(format);
    showSuccess(`Export format set to ${format.toUpperCase()}`);
  };

  return (
    <MainLayout>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Settings</h1>
        <p className="text-slate-500 dark:text-slate-400 mt-2">Manage your account preferences and application behavior.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Sidebar Tabs */}
        <div className="md:col-span-1 space-y-2">
          {tabs.map((item) => (
            <button 
              key={item.label}
              onClick={() => setActiveTab(item.label)}
              className={cn(
                "w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all",
                activeTab === item.label 
                  ? "bg-indigo-600 text-white shadow-lg shadow-indigo-100 dark:shadow-none" 
                  : "text-slate-500 dark:text-slate-400 hover:bg-white dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white"
              )}
            >
              <item.icon className="w-5 h-5" />
              {item.label}
            </button>
          ))}
        </div>

        {/* Content Area */}
        <div className="md:col-span-2 space-y-6">
          {activeTab === 'General' ? (
            <>
              <div className="bg-white dark:bg-slate-900 rounded-3xl p-8 border border-slate-100 dark:border-slate-800 shadow-sm">
                <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-6">Application Preferences</h3>
                
                <div className="space-y-6">
                  {/* Auto Download Toggle */}
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-bold text-slate-900 dark:text-white">Auto-download results</p>
                      <p className="text-sm text-slate-500 dark:text-slate-400">Automatically save enhanced photos to your device.</p>
                    </div>
                    <button 
                      onClick={() => handleToggle('Auto-download', autoDownload, setAutoDownload)}
                      className={cn(
                        "w-12 h-6 rounded-full relative transition-colors duration-200",
                        autoDownload ? "bg-indigo-600" : "bg-slate-200 dark:bg-slate-700"
                      )}
                    >
                      <div className={cn(
                        "absolute top-1 w-4 h-4 bg-white rounded-full shadow-sm transition-all duration-200",
                        autoDownload ? "right-1" : "left-1"
                      )} />
                    </button>
                  </div>

                  {/* Dark Mode Toggle */}
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-bold text-slate-900 dark:text-white">Dark Mode</p>
                      <p className="text-sm text-slate-500 dark:text-slate-400">Switch between light and dark interface themes.</p>
                    </div>
                    <button 
                      onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                      className={cn(
                        "w-12 h-6 rounded-full relative transition-colors duration-200",
                        theme === 'dark' ? "bg-indigo-600" : "bg-slate-200 dark:bg-slate-700"
                      )}
                    >
                      <div className={cn(
                        "absolute top-1 w-4 h-4 bg-white rounded-full shadow-sm transition-all duration-200",
                        theme === 'dark' ? "right-1" : "left-1"
                      )} />
                    </button>
                  </div>

                  {/* High Fidelity Toggle */}
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-bold text-slate-900 dark:text-white">High-Fidelity Preview</p>
                      <p className="text-sm text-slate-500 dark:text-slate-400">Use more resources for better real-time previews.</p>
                    </div>
                    <button 
                      onClick={() => handleToggle('High-Fidelity Preview', highFidelity, setHighFidelity)}
                      className={cn(
                        "w-12 h-6 rounded-full relative transition-colors duration-200",
                        highFidelity ? "bg-indigo-600" : "bg-slate-200 dark:bg-slate-700"
                      )}
                    >
                      <div className={cn(
                        "absolute top-1 w-4 h-4 bg-white rounded-full shadow-sm transition-all duration-200",
                        highFidelity ? "right-1" : "left-1"
                      )} />
                    </button>
                  </div>
                </div>
              </div>

              <div className="bg-white dark:bg-slate-900 rounded-3xl p-8 border border-slate-100 dark:border-slate-800 shadow-sm">
                <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-6">Export Settings</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <button 
                    onClick={() => handleFormatChange('png')}
                    className={cn(
                      "p-4 border-2 rounded-2xl text-left transition-all",
                      exportFormat === 'png' 
                        ? "border-indigo-600 bg-indigo-50 dark:bg-indigo-900/20" 
                        : "border-slate-100 dark:border-slate-800 hover:border-indigo-200"
                    )}
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <p className={cn("font-bold", exportFormat === 'png' ? "text-indigo-600" : "text-slate-900 dark:text-white")}>PNG (Lossless)</p>
                        <p className={cn("text-xs", exportFormat === 'png' ? "text-indigo-400" : "text-slate-500")}>Best for professional printing</p>
                      </div>
                      {exportFormat === 'png' && <Check className="w-4 h-4 text-indigo-600" />}
                    </div>
                  </button>
                  
                  <button 
                    onClick={() => handleFormatChange('jpg')}
                    className={cn(
                      "p-4 border-2 rounded-2xl text-left transition-all",
                      exportFormat === 'jpg' 
                        ? "border-indigo-600 bg-indigo-50 dark:bg-indigo-900/20" 
                        : "border-slate-100 dark:border-slate-800 hover:border-indigo-200"
                    )}
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <p className={cn("font-bold", exportFormat === 'jpg' ? "text-indigo-600" : "text-slate-900 dark:text-white")}>JPG (Optimized)</p>
                        <p className={cn("text-xs", exportFormat === 'jpg' ? "text-indigo-400" : "text-slate-500")}>Best for web and social media</p>
                      </div>
                      {exportFormat === 'jpg' && <Check className="w-4 h-4 text-indigo-600" />}
                    </div>
                  </button>
                </div>
              </div>
            </>
          ) : (
            <div className="bg-white dark:bg-slate-900 rounded-3xl p-12 border border-slate-100 dark:border-slate-800 shadow-sm text-center">
              <div className="w-16 h-16 bg-slate-50 dark:bg-slate-800 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Lock className="w-8 h-8 text-slate-300" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">{activeTab} Settings</h3>
              <p className="text-slate-500 dark:text-slate-400 max-w-xs mx-auto">
                These settings are currently locked for your account type. Upgrade to Pro to unlock advanced configuration.
              </p>
            </div>
          )}
        </div>
      </div>
    </MainLayout>
  );
};

export default Settings;