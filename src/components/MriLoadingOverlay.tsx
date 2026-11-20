import React, { useState, useEffect } from 'react';
import { ShieldCheck, Cpu } from 'lucide-react';

interface MriLoadingOverlayProps {
  onCancel?: () => void;
  message?: string;
  subMessage?: string;
}

export const MriLoadingOverlay: React.FC<MriLoadingOverlayProps> = ({
  onCancel,
  message,
  subMessage,
}) => {
  const [stageIndex, setStageIndex] = useState(0);
  const [progress, setProgress] = useState(12);

  const stages = [
    {
      title: 'Scanning brain structure & volumetric features...',
      desc: 'Examining hippocampal volume, ventricular dilation & neural pathways...',
    },
    {
      title: 'Extracting axial T1 slice tensor (224×224×3)...',
      desc: 'Normalizing pixel intensities to [0, 1] (pixel / 255.0) for 71-layer Xception CNN feature extraction...',
    },
    {
      title: 'Computing Grad-CAM gradient activations on block14_sepconv2_act...',
      desc: 'Backpropagating through layer block14_sepconv2_act to isolate hippocampal and ventricular attention...',
    },
    {
      title: 'Synthesizing clinical report & doctor care plan...',
      desc: 'Grounding biomarkers against WHO/NIA-AA criteria with bilingual translation...',
    },
  ];

  useEffect(() => {
    const stageTimer = setInterval(() => {
      setStageIndex((prev) => (prev < stages.length - 1 ? prev + 1 : prev));
    }, 1100);

    const progressTimer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 96) return 96;
        return prev + Math.floor(Math.random() * 8) + 4;
      });
    }, 280);

    return () => {
      clearInterval(stageTimer);
      clearInterval(progressTimer);
    };
  }, []);

  const activeStage = stages[stageIndex];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 dark:bg-black/80 backdrop-blur-md animate-in fade-in duration-300">
      <div className="w-full max-w-md bg-white dark:bg-slate-900 border border-teal-200/80 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl text-center space-y-6 relative overflow-hidden">
        {/* Soft Background Radial Glow */}
        <div className="absolute -top-24 -left-24 w-64 h-64 bg-teal-400/10 dark:bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -right-24 w-64 h-64 bg-emerald-400/10 dark:bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

        {/* Central Circular Scanner Ring matching the Video Clip */}
        <div className="relative w-36 h-36 mx-auto flex items-center justify-center">
          {/* Concentric radar wave */}
          <div className="absolute inset-0 rounded-full bg-emerald-400/10 dark:bg-emerald-500/15 animate-radar-wave pointer-events-none" />
          <div className="absolute -inset-2 rounded-full border border-teal-300/40 dark:border-teal-500/30 animate-pulse pointer-events-none" />

          {/* Rotating Progress Spinner Ring */}
          <svg
            className="absolute inset-0 w-full h-full animate-spin-slow pointer-events-none"
            viewBox="0 0 100 100"
          >
            <circle
              cx="50"
              cy="50"
              r="44"
              fill="none"
              stroke="#e2e8f0"
              strokeWidth="4"
              className="dark:stroke-slate-800"
            />
            <circle
              cx="50"
              cy="50"
              r="44"
              fill="none"
              stroke="url(#scannerGradient)"
              strokeWidth="5"
              strokeLinecap="round"
              strokeDasharray="180 100"
            />
            <defs>
              <linearGradient id="scannerGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#0d9488" />
                <stop offset="50%" stopColor="#00a86b" />
                <stop offset="100%" stopColor="#38bdf8" />
              </linearGradient>
            </defs>
          </svg>

          {/* Central Logo Box */}
          <div className="relative w-24 h-24 rounded-2xl bg-[#d2f9e8] dark:bg-emerald-950/70 border-2 border-[#a7f3d0] dark:border-emerald-700 shadow-md flex items-center justify-center p-1 overflow-hidden">
            {/* Whole Brain Logo Image Fitted to Container */}
            <img
              src="/assets/aistudio/ic_brain_e02131d1.png"
              alt="DeepCortex Brain Scanning"
              className="w-full h-full object-contain scale-[1.2] filter contrast-125"
              onError={(e) => {
                if (!e.currentTarget.src.includes('brain_transparent.png')) {
                  e.currentTarget.src = '/assets/aistudio/brain_transparent.png';
                }
              }}
            />

            {/* Glowing Laser Scan Sweep Line (animates up and down across the brain) */}
            <div className="absolute left-0 right-0 h-1 bg-gradient-to-r from-transparent via-[#00a86b] to-transparent shadow-[0_0_10px_#00a86b] animate-scan-line z-20 pointer-events-none" />
          </div>
        </div>

        {/* Dynamic Status Text */}
        <div className="space-y-2">
          <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white transition-all">
            {message || activeStage.title}
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed max-w-xs mx-auto">
            {subMessage || activeStage.desc}
          </p>
        </div>

        {/* Progress Bar & Percentage */}
        <div className="space-y-1.5 max-w-xs mx-auto">
          <div className="flex items-center justify-between text-xs font-semibold text-slate-600 dark:text-slate-300">
            <span className="flex items-center gap-1.5 text-teal-700 dark:text-teal-400">
              <Cpu className="w-3.5 h-3.5 animate-pulse" />
              <span>Edge NPU Acceleration</span>
            </span>
            <span className="font-mono text-emerald-700 dark:text-emerald-400">{progress}%</span>
          </div>
          <div className="w-full h-2 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden border border-slate-200 dark:border-slate-700">
            <div
              className="h-full bg-gradient-to-r from-teal-500 via-[#00a86b] to-emerald-400 rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* Privacy & Speed Badges */}
        <div className="flex items-center justify-center gap-3 pt-1 text-[11px] text-slate-500 dark:text-slate-400">
          <span className="inline-flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
            <span>0 KB Cloud Data</span>
          </span>
          <span>•</span>
          <span>Latency &lt; 65ms</span>
        </div>

        {/* Optional Cancel Button */}
        {onCancel && (
          <button
            onClick={onCancel}
            className="text-xs text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors cursor-pointer"
          >
            Cancel Analysis
          </button>
        )}
      </div>
    </div>
  );
};
