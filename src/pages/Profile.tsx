"use client";

import React from 'react';
import MainLayout from '@/components/layout/MainLayout';
import { Camera, Mail, MapPin, Calendar, Edit3 } from 'lucide-react';

const Profile = () => {
  return (
    <MainLayout>
      <div className="max-w-4xl mx-auto">
        <div className="relative h-48 bg-gradient-to-r from-indigo-600 to-violet-600 rounded-t-[40px]">
          <div className="absolute -bottom-16 left-12 flex items-end gap-6">
            <div className="relative">
              <div className="w-32 h-32 rounded-3xl border-4 border-white bg-slate-200 overflow-hidden shadow-xl">
                <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Alex" alt="Profile" className="w-full h-full object-cover" />
              </div>
              <button className="absolute -bottom-2 -right-2 p-2 bg-white rounded-xl shadow-lg text-indigo-600 hover:scale-110 transition-transform">
                <Camera className="w-4 h-4" />
              </button>
            </div>
            <div className="mb-4">
              <h1 className="text-3xl font-bold text-slate-900">Alex Rivera</h1>
              <p className="text-slate-500 font-medium">Professional Photographer</p>
            </div>
          </div>
        </div>

        <div className="mt-24 grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="md:col-span-1 space-y-6">
            <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm">
              <h3 className="font-bold text-slate-900 mb-4">About</h3>
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

            <div className="bg-indigo-600 rounded-3xl p-6 text-white shadow-xl shadow-indigo-100">
              <h3 className="font-bold mb-2">Usage Stats</h3>
              <div className="space-y-4 mt-4">
                <div>
                  <div className="flex justify-between text-xs mb-1">
                    <span>Monthly Credits</span>
                    <span>850 / 1000</span>
                  </div>
                  <div className="h-1.5 bg-white/20 rounded-full overflow-hidden">
                    <div className="h-full w-[85%] bg-white rounded-full" />
                  </div>
                </div>
                <p className="text-[10px] text-indigo-100">Resets in 12 days</p>
              </div>
            </div>
          </div>

          <div className="md:col-span-2 space-y-6">
            <div className="bg-white rounded-3xl p-8 border border-slate-100 shadow-sm">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-bold text-slate-900">Personal Information</h3>
                <button className="flex items-center gap-2 text-sm font-bold text-indigo-600">
                  <Edit3 className="w-4 h-4" />
                  Edit
                </button>
              </div>
              
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">First Name</label>
                  <p className="mt-1 font-medium text-slate-900">Alex</p>
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Last Name</label>
                  <p className="mt-1 font-medium text-slate-900">Rivera</p>
                </div>
                <div className="col-span-2">
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Bio</label>
                  <p className="mt-1 text-slate-600 leading-relaxed">
                    Capturing moments and enhancing them with the power of AI. I specialize in landscape and portrait photography.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default Profile;