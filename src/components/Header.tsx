import React from 'react';
import {
  Menu,
  Volume2,
  VolumeX,
} from 'lucide-react';
import { BrainLogo } from './BrainLogo';
import { Tab, Language } from '../types';
import { translations } from '../translations';

interface HeaderProps {
  currentTab: Tab;
  setCurrentTab: (tab: Tab) => void;
  language: Language;
  isSpeaking: boolean;
  toggleSpeaking: () => void;
  openDrawer: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  setCurrentTab,
  language,
  isSpeaking,
  toggleSpeaking,
  openDrawer,
}) => {
  const t = translations[language];

  return (
    <header className="sticky top-0 z-40 w-full max-w-full overflow-hidden bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-b border-slate-200/80 dark:border-slate-800 shadow-xs">
      <div className="w-full max-w-7xl mx-auto px-3 sm:px-6 py-2.5 flex items-center justify-between gap-3">
        {/* Left: Hamburger & AgriLens-styled Logo */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          <button
            onClick={openDrawer}
            className="p-2 rounded-xl text-slate-700 dark:text-slate-200 hover:text-[#0d9488] hover:bg-[#d2f9e8]/50 dark:hover:bg-slate-800 transition-colors cursor-pointer"
            aria-label="Open Navigation Drawer"
          >
            <Menu className="w-5 h-5" />
          </button>

          <button
            onClick={() => setCurrentTab('home')}
            className="text-left group transition-transform active:scale-98 cursor-pointer"
          >
            <BrainLogo size="md" />
          </button>
        </div>

        {/* Right: ONLY Status & Voice (as explicitly requested by user) */}
        <div className="flex items-center gap-2 shrink-0">
          {/* Live Telemetry Status Pill */}
          <button
            onClick={() => setCurrentTab('telemetry')}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-50 dark:bg-emerald-950/70 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300 text-xs font-bold hover:bg-emerald-100 dark:hover:bg-emerald-900/80 transition-all cursor-pointer shadow-xs"
            title="8/8 Clinical Subsystems Online • Click to View System Status"
          >
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <span className="text-[11px] sm:text-xs font-bold tracking-tight">8/8 Online</span>
          </button>

          {/* Voice Narration Button */}
          <button
            onClick={toggleSpeaking}
            className={`p-2 rounded-xl border transition-all cursor-pointer ${
              isSpeaking
                ? 'bg-[#00a86b] border-[#00a86b] text-white shadow-sm animate-pulse'
                : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
            title="Voice Read Aloud"
            aria-label="Voice Read Aloud"
          >
            {isSpeaking ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
          </button>
        </div>
      </div>
    </header>
  );
};
