"use client";

import React, { useState } from 'react';
import MainLayout from '@/components/layout/MainLayout';
import { 
  Bell, 
  User, 
  CreditCard,
  ShieldCheck,
  Check,
  Lock,
  Code
} from 'lucide-react';
import { useTheme } from 'next-themes';
import { showSuccess } from '@/utils/toast';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';
import CodeExporter from '@/components/settings/CodeExporter';

const Settings = () => {
  const { theme, setTheme } = useTheme();
  const [activeTab, setActiveTab] = useState('General');
  
  const [autoDownload, setAutoDownload] = useState(true);
  const [highFidelity, setHighFidelity] = useState(true);
  const [exportFormat, setExportFormat] = useState('png');
  const [emailNotifications, setEmailNotifications] = useState(true);

  const tabs = [
    { icon: User, label: 'General' },
    { icon: Bell, label: 'Notifications' },
    { icon: ShieldCheck, label: 'Privacy & Security' },
    { icon: CreditCard, label: 'Billing' },
    { icon: Code, label: 'Code' },
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
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Settings</h1>
        <p className="text-slate-500 dark:text-slate-400 mt-2">Manage your account preferences and application behavior.</p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="md:col-span-1 space-y-2"
        >
          {tabs.map((item) => (
            <button 
              key={item.label}
              onClick={() => setActiveTab(item.label)}
              className={cn(
                "w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all relative",
                activeTab === item.label 
                  ? "text-white" 
                  : "text-slate-500 dark:text-slate-400 hover:bg-white dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white"
              )}
            >
              {activeTab === item.label && (
                <motion.div 
                  layoutId="activeTab"
                  className="absolute inset-0 bg-indigo-600 rounded-xl shadow-lg shadow-indigo-100 dark:shadow-none"
                  transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                />
              )}
              <item.icon className="w-5 h-5 relative z-10" />
              <span className="relative z-10">{item.label}</span>
            </button>
          ))}
        </motion.div>

        <div className="md:col-span-2">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.2 }}
              className="space-y-6"
            >
              {activeTab === 'General' && (
                <>
                  <div className="bg-white dark:bg-slate-900 rounded-3xl p-8 border border-slate-100 dark:border-slate-800 shadow-sm">
                    <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-6">Application Preferences</h3>
                    <div className="space-y-6">
                      {[
                        { label: 'Auto-download results', desc: 'Automatically save enhanced photos to your device.', value: autoDownload, setter: setAutoDownload, name: 'Auto-download' },
                        { label: 'Dark Mode', desc: 'Switch between light and dark interface themes.', value: theme === 'dark', setter: () => setTheme(theme === 'dark' ? 'light' : 'dark'), name: 'Dark Mode' },
                        { label: 'High-Fidelity Preview', desc: 'Use more resources for better real-time previews.', value: highFidelity, setter: setHighFidelity, name: 'High-Fidelity Preview' }
                      ].map((setting, i) => (
                        <div key={i} className="flex items-center justify-between">
                          <div>
                            <p className="font-bold text-slate-900 dark:text-white">{setting.label}</p>
                            <p className="text-sm text-slate-500 dark:text-slate-400">{setting.desc}</p>
                          </div>
                          <button 
                            onClick={() => setting.name === 'Dark Mode' ? setting.setter() : handleToggle(setting.name, setting.value as boolean, setting.setter as any)}
                            className={cn(
                              "w-12 h-6 rounded-full relative transition-colors duration-200",
                              setting.value ? "bg-indigo-600" : "bg-slate-200 dark:bg-slate-700"
                            )}
                          >
                            <motion.div 
                              animate={{ x: setting.value ? 24 : 4 }}
                              className="absolute top-1 w-4 h-4 bg-white rounded-full shadow-sm"
                            />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="bg-white dark:bg-slate-900 rounded-3xl p-8 border border-slate-100 dark:border-slate-800 shadow-sm">
                    <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-6">Export Settings</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {['png', 'jpg'].map((format) => (
                        <motion.button 
                          key={format}
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={() => handleFormatChange(format)}
                          className={cn(
                            "p-4 border-2 rounded-2xl text-left transition-all",
                            exportFormat === format 
                              ? "border-indigo-600 bg-indigo-50 dark:bg-indigo-900/20" 
                              : "border-slate-100 dark:border-slate-800 hover:border-indigo-200"
                          )}
                        >
                          <div className="flex justify-between items-start">
                            <div>
                              <p className={cn("font-bold", exportFormat === format ? "text-indigo-600" : "text-slate-900 dark:text-white")}>
                                {format.toUpperCase()} ({format === 'png' ? 'Lossless' : 'Optimized'})
                              </p>
                              <p className={cn("text-xs", exportFormat === format ? "text-indigo-400" : "text-slate-500")}>
                                {format === 'png' ? 'Best for professional printing' : 'Best for web and social media'}
                              </p>
                            </div>
                            {exportFormat === format && <Check className="w-4 h-4 text-indigo-600" />}
                          </div>
                        </motion.button>
                      ))}
                    </div>
                  </div>
                </>
              )}

              {activeTab === 'Notifications' && (
                <div className="bg-white dark:bg-slate-900 rounded-3xl p-8 border border-slate-100 dark:border-slate-800 shadow-sm">
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-6">Notification Settings</h3>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-bold text-slate-900 dark:text-white">Email Notifications</p>
                      <p className="text-sm text-slate-500 dark:text-slate-400">Receive updates about your processed images via email.</p>
                    </div>
                    <button 
                      onClick={() => handleToggle('Email Notifications', emailNotifications, setEmailNotifications)}
                      className={cn(
                        "w-12 h-6 rounded-full relative transition-colors duration-200",
                        emailNotifications ? "bg-indigo-600" : "bg-slate-200 dark:bg-slate-700"
                      )}
                    >
                      <motion.div 
                        animate={{ x: emailNotifications ? 24 : 4 }}
                        className="absolute top-1 w-4 h-4 bg-white rounded-full shadow-sm"
                      />
                    </button>
                  </div>
                </div>
              )}

              {activeTab === 'Code' && <CodeExporter />}

              {(activeTab === 'Privacy & Security' || activeTab === 'Billing') && (
                <div className="bg-white dark:bg-slate-900 rounded-3xl p-12 border border-slate-100 dark:border-slate-800 shadow-sm text-center">
                  <motion.div 
                    animate={{ rotate: [0, 10, -10, 0] }}
                    transition={{ repeat: Infinity, duration: 2 }}
                    className="w-16 h-16 bg-slate-50 dark:bg-slate-800 rounded-2xl flex items-center justify-center mx-auto mb-4"
                  >
                    <Lock className="w-8 h-8 text-slate-300" />
                  </motion.div>
                  <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">{activeTab}</h3>
                  <p className="text-slate-500 dark:text-slate-400 max-w-xs mx-auto">
                    This section is currently being updated. All your data is secure and your access is unlimited.
                  </p>
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </MainLayout>
  );
};

export default Settings;