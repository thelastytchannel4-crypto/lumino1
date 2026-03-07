"use client";

import React from 'react';
import MainLayout from '@/components/layout/MainLayout';
import { Check, Star } from 'lucide-react';
import { motion } from 'framer-motion';

const plans = [
  {
    name: 'Starter',
    price: '0',
    desc: 'Perfect for casual users',
    features: ['5 enhancements / month', 'Standard upscaling (2x)', 'Basic noise reduction', 'Community support'],
    button: 'Current Plan',
    current: true
  },
  {
    name: 'Pro',
    price: '19',
    desc: 'For professional photographers',
    features: ['Unlimited enhancements', 'Ultra HD upscaling (4x)', 'Batch processing (up to 50)', 'Face restoration AI', 'Priority processing'],
    button: 'Upgrade to Pro',
    popular: true
  },
  {
    name: 'Studio',
    price: '49',
    desc: 'For agencies and teams',
    features: ['Everything in Pro', 'API Access', 'Custom AI models', 'Dedicated account manager', 'Commercial license'],
    button: 'Contact Sales'
  }
];

const Pricing = () => {
  return (
    <MainLayout>
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-16"
      >
        <h1 className="text-4xl font-black text-slate-900 dark:text-white mb-4">Simple, Transparent Pricing</h1>
        <p className="text-slate-500 dark:text-slate-400 max-w-xl mx-auto">Choose the plan that fits your workflow. Upgrade or downgrade at any time.</p>
      </motion.div>

      <motion.div 
        initial="hidden"
        animate="visible"
        variants={{
          visible: { transition: { staggerChildren: 0.1 } }
        }}
        className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto"
      >
        {plans.map((plan, i) => (
          <motion.div 
            key={i} 
            variants={{
              hidden: { opacity: 0, y: 30 },
              visible: { opacity: 1, y: 0 }
            }}
            whileHover={{ y: -10 }}
            className={`relative bg-white dark:bg-slate-900 rounded-[40px] p-8 border-2 transition-all duration-300 ${
              plan.popular ? 'border-indigo-600 scale-105 z-10 shadow-xl shadow-indigo-100 dark:shadow-none' : 'border-slate-100 dark:border-slate-800'
            }`}
          >
            {plan.popular && (
              <motion.div 
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="absolute -top-4 left-1/2 -translate-x-1/2 bg-indigo-600 text-white px-4 py-1 rounded-full text-xs font-black uppercase tracking-widest"
              >
                Most Popular
              </motion.div>
            )}
            
            <div className="mb-8">
              <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">{plan.name}</h3>
              <div className="flex items-baseline gap-1">
                <span className="text-4xl font-black text-slate-900 dark:text-white">${plan.price}</span>
                <span className="text-slate-400 font-medium">/month</span>
              </div>
              <p className="text-sm text-slate-500 mt-2">{plan.desc}</p>
            </div>

            <div className="space-y-4 mb-10">
              {plan.features.map((feature, j) => (
                <div key={j} className="flex items-start gap-3 text-sm">
                  <div className={`mt-0.5 w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 ${
                    plan.popular ? 'bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600' : 'bg-slate-100 dark:bg-slate-800 text-slate-400'
                  }`}>
                    <Check className="w-3 h-3" />
                  </div>
                  <span className="text-slate-600 dark:text-slate-400">{feature}</span>
                </div>
              ))}
            </div>

            <button className={`w-full py-4 rounded-2xl font-bold transition-all ${
              plan.current 
                ? 'bg-slate-100 dark:bg-slate-800 text-slate-400 cursor-default' 
                : plan.popular 
                  ? 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-lg shadow-indigo-100' 
                  : 'bg-slate-900 dark:bg-white dark:text-slate-900 text-white hover:bg-slate-800'
            }`}>
              {plan.button}
            </button>
          </motion.div>
        ))}
      </motion.div>

      <motion.div 
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="mt-20 bg-slate-900 dark:bg-indigo-950 rounded-[40px] p-12 text-white flex flex-col md:flex-row items-center justify-between gap-8"
      >
        <div className="max-w-md">
          <div className="flex items-center gap-2 text-indigo-400 mb-4">
            <Star className="w-5 h-5 fill-current" />
            <span className="font-bold uppercase tracking-widest text-xs">Enterprise</span>
          </div>
          <h2 className="text-3xl font-bold mb-4">Need a custom solution?</h2>
          <p className="text-slate-400">We offer tailored plans for large organizations with specific security and volume requirements.</p>
        </div>
        <motion.button 
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="px-8 py-4 bg-white text-slate-900 rounded-2xl font-bold hover:bg-indigo-50 transition-colors whitespace-nowrap"
        >
          Talk to our Team
        </motion.button>
      </motion.div>
    </MainLayout>
  );
};

export default Pricing;