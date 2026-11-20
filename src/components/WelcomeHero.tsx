import React from 'react';
import {
  Brain,
  HeartPulse,
  ScanLine,
  ClipboardCheck,
  Activity,
  Award,
  ArrowRight,
  ShieldCheck,
  Cpu,
  Layers,
  CheckCircle,
} from 'lucide-react';
import { Tab, Language, Region } from '../types';
import { translations } from '../translations';

interface WelcomeHeroProps {
  setCurrentTab: (tab: Tab) => void;
  language: Language;
  region: Region;
  openDoiModal: () => void;
  openConsentModal: () => void;
}

export const WelcomeHero: React.FC<WelcomeHeroProps> = ({
  setCurrentTab,
  language,
  region,
  openDoiModal,
  openConsentModal,
}) => {
  const t = translations[language];

  return (
    <div className="w-full max-w-6xl mx-auto space-y-10 sm:space-y-12 py-4 sm:py-8">
      {/* 1. TOP HERO SECTION (Centered, High-Elegance matching AgriLens Eco) */}
      <div className="text-center space-y-5 sm:space-y-6 max-w-3xl mx-auto px-2">
        {/* Soft Mint Squircle Emblem with Fitted Brain Icon */}
        <div className="relative w-28 h-28 sm:w-32 sm:h-32 mx-auto rounded-3xl bg-[#d2f9e8] dark:bg-emerald-950/70 border-2 border-[#a7f3d0] dark:border-emerald-700 shadow-sm flex items-center justify-center p-1 sm:p-1.5 overflow-hidden group hover:scale-105 transition-transform duration-300">
          <img
            src="/assets/aistudio/ic_brain_e02131d1.png"
            alt="DeepCortex AI Brain Emblem"
            className="w-full h-full object-contain scale-[1.18] filter contrast-125"
            onError={(e) => {
              if (!e.currentTarget.src.includes('brain_transparent.png')) {
                e.currentTarget.src = '/assets/aistudio/brain_transparent.png';
              }
            }}
          />
          {/* Subtle glow highlight */}
          <div className="absolute inset-0 bg-radial from-white/20 to-transparent pointer-events-none" />
        </div>

        {/* Environmental & Health Challenge Pill Badge (Zero Emojis) */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#ecfdf5] dark:bg-emerald-950/60 border border-[#a7f3d0] dark:border-emerald-700 text-[#00a86b] dark:text-emerald-300 text-xs sm:text-sm font-bold tracking-wide uppercase shadow-2xs">
          <ShieldCheck className="w-4 h-4 text-[#00a86b]" />
          <span>PROTECTING BRAIN HEALTH EARLIER • ABU DHABI DOH &amp; PAKISTAN HEALTH</span>
        </div>

        {/* Giant Title: DeepCortex with Raised AI Badge */}
        <div className="flex items-center justify-center gap-2 sm:gap-3 flex-wrap">
          <h1 className="text-4xl sm:text-6xl font-black tracking-tight text-slate-900 dark:text-white leading-none">
            Deep<span className="text-[#0d9488]">Cortex</span>
          </h1>
          <span className="rounded-xl bg-[#00a86b] text-white font-black tracking-wider uppercase shadow-md px-3 sm:px-4 py-1 text-base sm:text-xl inline-block -mt-1 sm:-mt-2">
            AI
          </span>
        </div>

        {/* Clinical Psychology Soothing Subtitle (Blue & Green Harmony) */}
        <h2 className="text-lg sm:text-2xl font-bold text-[#0369a1] dark:text-sky-300 tracking-tight leading-snug">
          Explainable Edge Neuro-AI &amp; Longitudinal Cognitive Intelligence
        </h2>

        {/* Descriptive Briefing */}
        <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed max-w-2xl mx-auto">
          Clinically grounded neuro-screening engineered for the{' '}
          <strong className="text-slate-800 dark:text-slate-100 font-semibold">
            Abu Dhabi Department of Health / GITEX 2026 Innovation Challenge
          </strong>
          . Combining instant on-device MRI neural vision with multi-domain memory checks and
          preventative lifestyle interventions.
        </p>

        {/* Prominent Launch CTA Button */}
        <div className="pt-2 flex justify-center">
          <button
            onClick={() => setCurrentTab('brain-check')}
            className="group inline-flex items-center justify-center gap-3 px-8 sm:px-10 py-3.5 sm:py-4 rounded-2xl bg-[#00a86b] hover:bg-[#00925d] text-white font-black text-base sm:text-lg shadow-xl shadow-emerald-600/25 active:scale-95 transition-all cursor-pointer"
          >
            <span>LAUNCH DEEPCORTEX</span>
            <span className="px-2 py-0.5 rounded-md bg-white/20 text-xs font-black tracking-wider">
              AI
            </span>
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>

        {/* Quick Jump Bar with Pills */}
        <div className="pt-2 flex flex-wrap items-center justify-center gap-2 text-xs">
          <span className="text-slate-500 dark:text-slate-400 font-medium">Quick Jump:</span>

          <button
            onClick={() => setCurrentTab('brain-check')}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white dark:bg-slate-850 border border-slate-200 dark:border-slate-700 hover:border-[#00a86b] dark:hover:border-emerald-500 text-slate-700 dark:text-slate-200 font-semibold shadow-2xs hover:shadow-xs transition-all cursor-pointer"
          >
            <Brain className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400" />
            <span>Memory Check</span>
          </button>

          <button
            onClick={() => setCurrentTab('risk-context')}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white dark:bg-slate-850 border border-slate-200 dark:border-slate-700 hover:border-[#00a86b] dark:hover:border-emerald-500 text-slate-700 dark:text-slate-200 font-semibold shadow-2xs hover:shadow-xs transition-all cursor-pointer"
          >
            <HeartPulse className="w-3.5 h-3.5 text-rose-500" />
            <span>Daily Health</span>
          </button>

          <button
            onClick={() => setCurrentTab('mri-lab')}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white dark:bg-slate-850 border border-slate-200 dark:border-slate-700 hover:border-[#00a86b] dark:hover:border-emerald-500 text-slate-700 dark:text-slate-200 font-semibold shadow-2xs hover:shadow-xs transition-all cursor-pointer"
          >
            <ScanLine className="w-3.5 h-3.5 text-[#00a86b]" />
            <span>MRI Scan Lab</span>
          </button>

          <button
            onClick={() => setCurrentTab('care-plan')}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white dark:bg-slate-850 border border-slate-200 dark:border-slate-700 hover:border-[#00a86b] dark:hover:border-emerald-500 text-slate-700 dark:text-slate-200 font-semibold shadow-2xs hover:shadow-xs transition-all cursor-pointer"
          >
            <ClipboardCheck className="w-3.5 h-3.5 text-sky-600 dark:text-sky-400" />
            <span>Care Plan</span>
          </button>

          <button
            onClick={() => setCurrentTab('telemetry')}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white dark:bg-slate-850 border border-slate-200 dark:border-slate-700 hover:border-[#00a86b] dark:hover:border-emerald-500 text-slate-700 dark:text-slate-200 font-semibold shadow-2xs hover:shadow-xs transition-all cursor-pointer"
          >
            <Activity className="w-3.5 h-3.5 text-indigo-500" />
            <span>System Telemetry</span>
          </button>
        </div>
      </div>

      {/* 2. FOUR KEY CLINICAL KPI BENCHMARK CARDS */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 max-w-5xl mx-auto">
        {/* KPI 1 */}
        <div className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-slate-850 border border-slate-200/90 dark:border-slate-750 shadow-xs text-center space-y-1 hover:border-emerald-300 dark:hover:border-emerald-600 transition-all">
          <div className="text-2xl sm:text-3xl font-black text-[#00a86b] dark:text-emerald-400">
            89.59%
          </div>
          <div className="text-xs sm:text-sm font-bold text-slate-800 dark:text-slate-200">
            Model Accuracy
          </div>
          <div className="text-[11px] text-slate-500 dark:text-slate-400">
            Tested on 37,386 Multi-Class Scans
          </div>
        </div>

        {/* KPI 2 */}
        <div className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-slate-850 border border-slate-200/90 dark:border-slate-750 shadow-xs text-center space-y-1 hover:border-teal-300 dark:hover:border-teal-600 transition-all">
          <div className="text-2xl sm:text-3xl font-black text-[#0d9488] dark:text-teal-400">
            0 KB Data
          </div>
          <div className="text-xs sm:text-sm font-bold text-slate-800 dark:text-slate-200">
            On-Device TFLite Edge
          </div>
          <div className="text-[11px] text-slate-500 dark:text-slate-400">
            100% Offline &amp; Private NPU
          </div>
        </div>

        {/* KPI 3 */}
        <div className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-slate-850 border border-slate-200/90 dark:border-slate-750 shadow-xs text-center space-y-1 hover:border-sky-300 dark:hover:border-sky-600 transition-all">
          <div className="text-2xl sm:text-3xl font-black text-[#0284c7] dark:text-sky-400">
            0.955 AUC
          </div>
          <div className="text-xs sm:text-sm font-bold text-slate-800 dark:text-slate-200">
            Clinical Sensitivity
          </div>
          <div className="text-[11px] text-slate-500 dark:text-slate-400">
            Early Hippocampal Drift Detection
          </div>
        </div>

        {/* KPI 4 */}
        <div className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-slate-850 border border-slate-200/90 dark:border-slate-750 shadow-xs text-center space-y-1 hover:border-indigo-300 dark:hover:border-indigo-600 transition-all">
          <div className="text-2xl sm:text-3xl font-black text-indigo-600 dark:text-indigo-400">
            4-Stage
          </div>
          <div className="text-xs sm:text-sm font-bold text-slate-800 dark:text-slate-200">
            WHO &amp; NIA-AA Criteria
          </div>
          <div className="text-[11px] text-slate-500 dark:text-slate-400">
            CN • Very Mild • Mild • Moderate
          </div>
        </div>
      </div>

      {/* 3. THREE LARGE FEATURE CARDS (Exact match to AgriLens Eco structure) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 max-w-5xl mx-auto">
        {/* Card 1: Longitudinal Cognitive Intelligence */}
        <div className="rounded-3xl bg-white dark:bg-slate-850 border border-slate-200/90 dark:border-slate-750 p-6 shadow-xs flex flex-col justify-between space-y-4 hover:shadow-md transition-shadow">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="w-10 h-10 rounded-2xl bg-[#d2f9e8] dark:bg-emerald-950/60 border border-[#a7f3d0] dark:border-emerald-800 flex items-center justify-center text-[#00a86b]">
                <Brain className="w-5 h-5" />
              </div>
              <span className="px-2.5 py-0.5 rounded-md bg-[#e6fbf3] dark:bg-emerald-950/80 text-[#00a86b] dark:text-emerald-300 text-[10px] font-black uppercase tracking-wider">
                ON-DEVICE &amp; CLOUD
              </span>
            </div>

            <div>
              <h3 className="text-lg font-extrabold text-slate-900 dark:text-white leading-tight">
                Longitudinal Cognitive Intelligence
              </h3>
              <p className="text-xs text-teal-700 dark:text-teal-400 font-semibold mt-0.5">
                Multi-Domain Memory Baseline &amp; Risk Screening
              </p>
            </div>

            <div className="space-y-2.5 text-xs text-slate-600 dark:text-slate-300">
              <div className="flex items-start gap-2">
                <span className="text-[#00a86b] font-bold mt-0.5">→</span>
                <p>
                  <strong className="text-slate-800 dark:text-slate-100 font-semibold">
                    3-Minute Baseline Check:
                  </strong>{' '}
                  5-word delayed recall, clock memory, and daily independence focus tracking.
                </p>
              </div>

              <div className="flex items-start gap-2">
                <span className="text-[#00a86b] font-bold mt-0.5">→</span>
                <p>
                  <strong className="text-slate-800 dark:text-slate-100 font-semibold">
                    Explainable Drift Detection:
                  </strong>{' '}
                  Alerts if scores shift beyond expected age-adjusted baseline norms.
                </p>
              </div>

              <div className="flex items-start gap-2">
                <span className="text-[#00a86b] font-bold mt-0.5">→</span>
                <p>
                  <strong className="text-slate-800 dark:text-slate-100 font-semibold">
                    Multilingual Voice TTS:
                  </strong>{' '}
                  Clear spoken audio guidance in English, Urdu (اردو), and Arabic (عربي).
                </p>
              </div>
            </div>
          </div>

          <button
            onClick={() => setCurrentTab('brain-check')}
            className="w-full py-2.5 rounded-xl bg-teal-50 dark:bg-teal-950/50 hover:bg-teal-100 text-[#0d9488] dark:text-teal-300 text-xs font-bold transition-colors cursor-pointer"
          >
            Start Memory Check →
          </button>
        </div>

        {/* Card 2: Modifiable Daily Health Habits */}
        <div className="rounded-3xl bg-white dark:bg-slate-850 border border-slate-200/90 dark:border-slate-750 p-6 shadow-xs flex flex-col justify-between space-y-4 hover:shadow-md transition-shadow">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="w-10 h-10 rounded-2xl bg-cyan-50 dark:bg-cyan-950/60 border border-cyan-200 dark:border-cyan-800 flex items-center justify-center text-cyan-700">
                <HeartPulse className="w-5 h-5 text-cyan-600" />
              </div>
              <span className="px-2.5 py-0.5 rounded-md bg-cyan-50 dark:bg-cyan-950/80 text-cyan-700 dark:text-cyan-300 text-[10px] font-black uppercase tracking-wider">
                REAL-TIME DATA
              </span>
            </div>

            <div>
              <h3 className="text-lg font-extrabold text-slate-900 dark:text-white leading-tight">
                Modifiable Risk &amp; Daily Habits
              </h3>
              <p className="text-xs text-cyan-700 dark:text-cyan-400 font-semibold mt-0.5">
                Lancet Commission 45% Preventative Risk Factors
              </p>
            </div>

            <div className="space-y-2.5 text-xs text-slate-600 dark:text-slate-300">
              <div className="flex items-start gap-2">
                <span className="text-[#00a86b] font-bold mt-0.5">→</span>
                <p>
                  <strong className="text-slate-800 dark:text-slate-100 font-semibold">
                    Cardiovascular &amp; Sleep Tracking:
                  </strong>{' '}
                  Monitors blood pressure, HbA1c, sleep quality, and hearing health.
                </p>
              </div>

              <div className="flex items-start gap-2">
                <span className="text-[#00a86b] font-bold mt-0.5">→</span>
                <p>
                  <strong className="text-slate-800 dark:text-slate-100 font-semibold">
                    Actionable Lifestyle Goals:
                  </strong>{' '}
                  Personalized micro-goals for Mediterranean-DASH neuro-protective nutrition.
                </p>
              </div>

              <div className="flex items-start gap-2">
                <span className="text-[#00a86b] font-bold mt-0.5">→</span>
                <p>
                  <strong className="text-slate-800 dark:text-slate-100 font-semibold">
                    Protection Score:
                  </strong>{' '}
                  Quantifies reversible risk reduction achieved through daily routine changes.
                </p>
              </div>
            </div>
          </div>

          <button
            onClick={() => setCurrentTab('risk-context')}
            className="w-full py-2.5 rounded-xl bg-cyan-50 dark:bg-cyan-950/50 hover:bg-cyan-100 text-cyan-800 dark:text-cyan-300 text-xs font-bold transition-colors cursor-pointer"
          >
            Review Daily Habits →
          </button>
        </div>

        {/* Card 3: Explainable MRI Scan & Doctor Care Plan */}
        <div className="rounded-3xl bg-white dark:bg-slate-850 border border-slate-200/90 dark:border-slate-750 p-6 shadow-xs flex flex-col justify-between space-y-4 hover:shadow-md transition-shadow">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="w-10 h-10 rounded-2xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 flex items-center justify-center text-emerald-700">
                <ScanLine className="w-5 h-5 text-emerald-600" />
              </div>
              <span className="px-2.5 py-0.5 rounded-md bg-emerald-50 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-300 text-[10px] font-black uppercase tracking-wider">
                DOH &amp; PUNJAB HEALTH
              </span>
            </div>

            <div>
              <h3 className="text-lg font-extrabold text-slate-900 dark:text-white leading-tight">
                Explainable MRI Scan &amp; Care Plan
              </h3>
              <p className="text-xs text-emerald-700 dark:text-emerald-400 font-semibold mt-0.5">
                Gradient Attention Heatmaps &amp; Doctor Handover
              </p>
            </div>

            <div className="space-y-2.5 text-xs text-slate-600 dark:text-slate-300">
              <div className="flex items-start gap-2">
                <span className="text-[#00a86b] font-bold mt-0.5">→</span>
                <p>
                  <strong className="text-slate-800 dark:text-slate-100 font-semibold">
                    Edge Deep Learning:
                  </strong>{' '}
                  71-Layer Xception CNN architecture running directly offline on edge devices.
                </p>
              </div>

              <div className="flex items-start gap-2">
                <span className="text-[#00a86b] font-bold mt-0.5">→</span>
                <p>
                  <strong className="text-slate-800 dark:text-slate-100 font-semibold">
                    Grad-CAM Localization:
                  </strong>{' '}
                  Visual heatmap highlights the exact hippocampal regions informing the model.
                </p>
              </div>

              <div className="flex items-start gap-2">
                <span className="text-[#00a86b] font-bold mt-0.5">→</span>
                <p>
                  <strong className="text-slate-800 dark:text-slate-100 font-semibold">
                    Clinical Referral Export:
                  </strong>{' '}
                  1-click summary ready for Abu Dhabi Malaffi and local hospital clinics.
                </p>
              </div>
            </div>
          </div>

          <button
            onClick={() => setCurrentTab('mri-lab')}
            className="w-full py-2.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/50 hover:bg-emerald-100 text-emerald-800 dark:text-emerald-300 text-xs font-bold transition-colors cursor-pointer"
          >
            Launch MRI Scan Lab →
          </button>
        </div>
      </div>

      {/* 4. CLINICAL VALIDATION & DOI FOOTER BANNER */}
      <div className="p-4 rounded-2xl bg-slate-100/70 dark:bg-slate-850/70 border border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-600 dark:text-slate-400">
        <div className="flex items-center gap-2">
          <Award className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
          <span>
            Peer-Reviewed Research: <em className="font-medium text-slate-800 dark:text-slate-200">Spectrum of Engineering Sciences (2025)</em>
          </span>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={openDoiModal}
            className="px-2.5 py-1 rounded-lg bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-teal-800 dark:text-teal-300 font-mono text-[11px] hover:bg-teal-50 dark:hover:bg-slate-700 transition-colors cursor-pointer"
          >
            DOI: 10.5281/zenodo.17864829
          </button>
          <button
            onClick={openConsentModal}
            className="text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 underline cursor-pointer"
          >
            Ethics &amp; Consent
          </button>
        </div>
      </div>
    </div>
  );
};
