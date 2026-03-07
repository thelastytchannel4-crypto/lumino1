"use client";

import React from 'react';
import MainLayout from '@/components/layout/MainLayout';
import { Camera, Mail, MapPin, Calendar, Edit3, Shield } from 'lucide-react';
import { motion } from 'framer-motion';

const Profile = () => {
  return (
    <MainLayout>
      <div className="max-w-4xl mx-auto">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="relative h-48 bg-gradient-to-r from-indigo-600 to-violet-600 rounded-t-[40px]"
        >
          <div className="absolute -bottom-16 left-12 flex items-end gap-6">
            <motion.div 
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="relative"
            >
              <div className="w-32 h-32 rounded-3xl border-4 border-white dark:border-slate-900 bg-slate-200 overflow-hidden shadow-xl">
                <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Alex" alt="Profile" className="w-full h-full object-cover" />
              </div>
              <button className="absolute -bottom-2 -right-2 p-2 bg-white dark:bg-slate-800 rounded-xl shadow-lg text-indigo-600 hover:scale-110 transition-transform">
                <Camera className="w-4 h-4" />
              </button>
            </motion.div>
            <motion.div 
              initial={{ x: 20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="mb-4"
            >
              <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Alex Rivera</h1>
              <p className="text-slate-500 font-medium">Professional Photographer</p>
            </motion.div>
          </div>
        </motion.div>

        <div className="mt-24 grid grid-cols-1 md:grid-cols-3 gap-8">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
            className="md:col-span-1 space-y-6"
          >
            <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-100 dark:border-slate-800 shadow-sm">
              <h3 className="font-bold text-slate-900 dark:text-white mb-4">About</h3>
              <div className="space-y-4">
                <div className="flex items-center gap-3 text-slate-500 text-sm">
                  <Mail className="w-4 h-4" />
                  alex.rivera@example.com
                </div>
                <div className="flex items-center gap-3 text-slate-500 text-sm">
                  <MapPin className="w-4 h-4" />
                  San Francisco, CA
                </div>
                <div className="flex items-center gap-3 text-slate-500 text-sm">
                  <Calendar className="w-4 h-4" />
                  Joined March 2024
                </div>
              </div>
            </div>

            <motion.div 
              whileHover={{ scale: 1.02 }}
              className="bg-indigo-600 rounded-3xl p-6 text-white shadow-xl shadow-indigo-100 dark:shadow-none"
            >
              <div className="flex items-center gap-2 mb-2">
                <Shield className="w-5 h-5" />
                <h3 className="font-bold">Verified Account</h3>
              </div>
              <p className="text-xs text-indigo-100 leading-relaxed">
                Your account is in good standing. You have full access to all Lumina AI features.
              </p>
            </motion.div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5 }}
            className="md:col-span-2 space-y-6"
          >
            <div className="bg-white dark:bg-slate-900 rounded-3xl p-8 border border-slate-100 dark:border-slate-800 shadow-sm">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">Personal Information</h3>
                <button className="flex items-center gap-2 text-sm font-bold text-indigo-600">
                  <Edit3 className="w-4 h-4" />
                  Edit
                </button>
              </div>
              
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">First Name</label>
                  <p className="mt-1 font-medium text-slate-900 dark:text-white">Alex</p>
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Last Name</label>
                  <p className="mt-1 font-medium text-slate-900 dark:text-white">Rivera</p>
                </div>
                <div className="col-span-2">
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Bio</label>
                  <p className="mt-1 text-slate-600 dark:text-slate-400 leading-relaxed">
                    Capturing moments and enhancing them with the power of AI. I specialize in landscape and portrait photography.
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </MainLayout>
  );
};

export default Profile;