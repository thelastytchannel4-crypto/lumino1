"use client";

import React, { useState, useEffect } from 'react';
import { CheckCircle2, Circle, Loader2 } from 'lucide-react';

const steps = [
  "Analyzing image structure",
  "Removing noise and artifacts",
  "Upscaling to 4K resolution",
  "Restoring facial details",
  "Applying color correction"
];

const ProcessingSteps = () => {
  const [currentStep, setCurrentStep] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentStep((prev) => (prev < steps.length ? prev + 1 : prev));
    }, 500);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="space-y-4 w-full max-w-xs">
      {steps.map((step, index) => (
        <div key={index} className="flex items-center gap-3">
          {index < currentStep ? (
            <CheckCircle2 className="w-5 h-5 text-emerald-500" />
          ) : index === currentStep ? (
            <Loader2 className="w-5 h-5 text-indigo-600 animate-spin" />
          ) : (
            <Circle className="w-5 h-5 text-slate-200" />
          )}
          <span className={`text-sm font-medium ${index === currentStep ? 'text-indigo-600' : index < currentStep ? 'text-slate-400' : 'text-slate-300'}`}>
            {step}
          </span>
        </div>
      ))}
    </div>
  );
};

export default ProcessingSteps;