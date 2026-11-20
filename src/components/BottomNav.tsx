import React, { useState } from 'react';
import {
  Brain,
  HeartPulse,
  ClipboardCheck,
  Activity,
  ScanLine,
} from 'lucide-react';
import { Tab, Language } from '../types';

interface BottomNavProps {
  currentTab: Tab;
  setCurrentTab: (tab: Tab) => void;
  language?: Language;
}

export const BottomNav: React.FC<BottomNavProps> = ({
  currentTab,
  setCurrentTab,
  language = 'en',
}) => {
  const [imgError, setImgError] = useState(false);

  const getLabel = (id: Tab) => {
    if (language === 'ur') {
      switch (id) {
        case 'brain-check': return 'یادداشت';
        case 'risk-context': return 'صحت';
        case 'care-plan': return 'نگہداشت';
        case 'telemetry': return 'اسٹیٹس';
        default: return '';
      }
    }
    if (language === 'ar') {
      switch (id) {
        case 'brain-check': return 'الذاكرة';
        case 'risk-context': return 'الصحة';
        case 'care-plan': return 'الرعاية';
        case 'telemetry': return 'الحالة';
        default: return '';
      }
    }
    switch (id) {
      case 'brain-check': return 'MEMORY';
      case 'risk-context': return 'HEALTH';
      case 'care-plan': return 'CARE';
      case 'telemetry': return 'STATUS';
      default: return '';
    }
  };

  const navItems = [
    {
      id: 'brain-check' as Tab,
      label: getLabel('brain-check'),
      icon: Brain,
    },
    {
      id: 'risk-context' as Tab,
      label: getLabel('risk-context'),
      icon: HeartPulse,
    },
    {
      id: 'care-plan' as Tab,
      label: getLabel('care-plan'),
      icon: ClipboardCheck,
    },
    {
      id: 'telemetry' as Tab,
      label: getLabel('telemetry'),
      icon: Activity,
    },
  ];

  const isScanActive = currentTab === 'mri-lab';

  return (
    <div className="fixed bottom-5 left-1/2 -translate-x-1/2 z-50 flex items-center gap-2 sm:gap-3 pointer-events-none no-print select-none">
      {/* Part A — The 4-Tab Pill Dock */}
      <nav
        aria-label="Main Navigation"
        className="bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border border-slate-200/80 dark:border-slate-800 shadow-[0_10px_30px_rgba(0,0,0,0.08)] rounded-3xl px-2.5 py-2 flex items-center gap-1 sm:gap-2 pointer-events-auto"
      >
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setCurrentTab(item.id)}
              className={`flex flex-col items-center justify-center transition-all cursor-pointer ${
                isActive
                  ? 'bg-[#00A86B] text-white rounded-2xl px-3.5 py-2 shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 px-3 py-2 rounded-2xl hover:bg-slate-100/60 dark:hover:bg-slate-800/60'
              }`}
              title={item.label}
              aria-label={item.label}
              aria-current={isActive ? 'page' : undefined}
            >
              <Icon
                className={`w-4 h-4 sm:w-5 sm:h-5 transition-transform ${
                  isActive ? 'scale-105 stroke-[2.2]' : 'stroke-[1.8]'
                }`}
              />
              <span className="text-[10px] font-bold tracking-wider leading-none mt-1">
                {item.label}
              </span>
            </button>
          );
        })}
      </nav>

      {/* Part B — The Detached, Larger Circular MRI Scan Button on the Right */}
      <div className="relative pointer-events-auto -ml-2 shrink-0">
        <button
          onClick={() => setCurrentTab('mri-lab')}
          title="Open MRI Scan Lab"
          aria-label="MRI Scan Lab"
          aria-current={isScanActive ? 'page' : undefined}
          className={`w-16 h-16 rounded-full flex flex-col items-center justify-center transition-all hover:scale-105 active:scale-95 cursor-pointer relative group ${
            isScanActive
              ? 'bg-[#00A86B] border-[3px] border-white dark:border-slate-800 ring-4 ring-[#00A86B]/35 shadow-[0_8px_25px_rgba(0,168,107,0.45)]'
              : 'bg-white dark:bg-slate-900 border-[3px] border-[#00A86B] shadow-[0_8px_25px_rgba(0,168,107,0.32)] hover:border-[#008f5a]'
          }`}
        >
          {/* Subtle pulsing ping ring when active */}
          {isScanActive && (
            <span className="absolute inset-0 rounded-full bg-[#00A86B] animate-ping opacity-25 -z-10" />
          )}

          {/* Soft mint inner circle (inverted solid emerald when active) */}
          <div
            className={`w-12.5 h-12.5 sm:w-13 sm:h-13 rounded-full flex items-center justify-center transition-colors relative overflow-hidden ${
              isScanActive
                ? 'bg-[#008f5a] text-white'
                : 'bg-[#E6F8F1] dark:bg-emerald-950/80 text-[#00A86B]'
            }`}
          >
            {!imgError ? (
              <img
                src={
                  isScanActive
                    ? '/assets/aistudio/brain_white.png'
                    : '/assets/aistudio/ic_brain_e02131d1.png'
                }
                alt="MRI Brain Scan"
                onError={(e) => {
                  if (e.currentTarget.src.includes('ic_brain_e02131d1.png')) {
                    e.currentTarget.src = '/assets/aistudio/brain_transparent.png';
                  } else {
                    setImgError(true);
                  }
                }}
                className="w-full h-full object-contain p-1 scale-[1.2] transition-transform group-hover:scale-125"
              />
            ) : (
              <div className="flex flex-col items-center justify-center">
                <ScanLine className="w-6 h-6 stroke-[2.2]" />
              </div>
            )}
          </div>
        </button>
      </div>
    </div>
  );
};
