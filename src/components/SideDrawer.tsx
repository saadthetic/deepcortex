import React, { useState } from 'react';
import {
  X,
  History,
  Lock,
  Award,
  AlertOctagon,
  ChevronRight,
  ChevronDown,
  BarChart3,
  Moon,
  Sun,
  Cpu,
  Cloud,
  Brain,
  Microscope,
  Landmark,
  Globe2,
  Eye,
  Type,
  HelpCircle,
  UserCheck,
} from 'lucide-react';
import { Tab, Language, Region, PrivacyMode, LongitudinalPoint } from '../types';
import { BrainLogo } from './BrainLogo';

interface SideDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  setCurrentTab: (tab: Tab) => void;
  language: Language;
  setLanguage: (lang: Language) => void;
  region: Region;
  setRegion: (region: Region) => void;
  privacyMode?: PrivacyMode;
  setPrivacyMode?: (mode: PrivacyMode) => void;
  isDarkMode: boolean;
  setIsDarkMode: (val: boolean | ((prev: boolean) => boolean)) => void;
  isHighContrast: boolean;
  setIsHighContrast: (val: boolean | ((prev: boolean) => boolean)) => void;
  isLargeText: boolean;
  setIsLargeText: (val: boolean | ((prev: boolean) => boolean)) => void;
  longitudinalHistory: LongitudinalPoint[];
  openDoiModal: () => void;
  openConsentModal: () => void;
  openNpuModal?: () => void;
  openTicketModal: () => void;
}

export const SideDrawer: React.FC<SideDrawerProps> = ({
  isOpen,
  onClose,
  setCurrentTab,
  language,
  setLanguage,
  region,
  setRegion,
  privacyMode,
  setPrivacyMode,
  isDarkMode,
  setIsDarkMode,
  isHighContrast,
  setIsHighContrast,
  isLargeText,
  setIsLargeText,
  longitudinalHistory,
  openDoiModal,
  openConsentModal,
  openNpuModal,
  openTicketModal,
}) => {
  const [isSettingsOpen, setIsSettingsOpen] = useState(true);
  const [isCollectionsOpen, setIsCollectionsOpen] = useState(false);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-slate-900/50 backdrop-blur-xs transition-opacity"
        onClick={onClose}
      />

      <div className="absolute inset-y-0 left-0 max-w-full flex">
        <div className="w-[94vw] sm:w-[540px] md:w-[580px] max-w-2xl bg-white dark:bg-slate-900 shadow-2xl flex flex-col justify-between overflow-y-auto overflow-x-hidden">
          {/* Header matching AgriLens Eco Screenshot */}
          <div className="p-4 sm:p-5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
            <BrainLogo size="md" />
            <button
              onClick={onClose}
              className="p-1.5 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Body Links */}
          <div className="p-4 sm:p-5 space-y-2.5 flex-1">
            {/* 1. Clinical Memory Hub */}
            <div
              onClick={() => {
                onClose();
                setCurrentTab('brain-check');
              }}
              className="p-3 rounded-2xl border border-teal-100 dark:border-slate-700 hover:bg-teal-50/50 dark:hover:bg-slate-800 transition-all cursor-pointer flex items-center justify-between"
            >
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-[#00a86b]/10 text-[#00a86b] flex items-center justify-center shrink-0">
                  <Brain className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <h4 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white">
                      {language === 'ur'
                        ? 'یادداشت کلینیکل ہب'
                        : language === 'ar'
                        ? 'منصة فحص الذاكرة السريرية'
                        : 'Memory Clinical Hub'}
                    </h4>
                    <span className="px-1.5 py-0.2 rounded-md bg-rose-500 text-white text-[9px] font-black uppercase tracking-wider">
                      CLINICAL
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">
                    {language === 'ur'
                      ? '2 منٹ کا بنیادی معائنہ'
                      : language === 'ar'
                      ? 'تقييم مرجعي سريع في دقيقتين'
                      : '2-Min Culturally Calibrated Baseline'}
                  </p>
                </div>
              </div>
            </div>

            {/* 2. 4-Stage MRI Workstation */}
            <div
              onClick={() => {
                onClose();
                setCurrentTab('mri-lab');
              }}
              className="p-3 rounded-2xl border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 transition-all cursor-pointer flex items-center justify-between"
            >
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0">
                  <Microscope className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white">
                    {language === 'ur'
                      ? '4-مرحلہ ایم آر آئی لیب'
                      : language === 'ar'
                      ? 'محطة الرنين المغناطيسي رباعية المراحل'
                      : '4-Stage MRI Workstation'}
                  </h4>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">
                    {language === 'ur'
                      ? 'ڈیپ کورٹیکس ماڈل و حرارتی نقشے'
                      : language === 'ar'
                      ? 'نموذج Xception والخرائط الحرارية'
                      : 'Xception AI & Grad-CAM Heatmaps'}
                  </p>
                </div>
              </div>
            </div>

            {/* 3. Gov Health Schemes (Standalone Dedicated View) */}
            <div
              onClick={() => {
                onClose();
                setCurrentTab('schemes');
              }}
              className="p-3 rounded-2xl border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 transition-all cursor-pointer flex items-center justify-between"
            >
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 flex items-center justify-center shrink-0">
                  <Landmark className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white">
                    {language === 'ur'
                      ? 'سرکاری ہیلتھ اسکیمیں'
                      : language === 'ar'
                      ? 'البرامج والتغطية الصحية الحكومية'
                      : 'Gov Health Schemes'}
                  </h4>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">
                    {language === 'ur'
                      ? 'ابوظہبی افحص و قومی صحت کارڈ'
                      : language === 'ar'
                      ? 'برنامج افحص بأبوظبي وصحت سہولت'
                      : 'Abu Dhabi IFHAS & Sehat Sahulat'}
                  </p>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-slate-400" />
            </div>

            {/* 4. Analysis History (Standalone Dedicated Vault) */}
            <div
              onClick={() => {
                onClose();
                setCurrentTab('history');
              }}
              className="p-3 rounded-2xl border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 transition-all cursor-pointer flex items-center justify-between"
            >
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
                  <History className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white">
                    {language === 'ur'
                      ? 'معائنہ و اسکین تاریخ'
                      : language === 'ar'
                      ? 'أرشيف وتاريخ الفحوصات'
                      : 'Analysis History'}
                  </h4>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">
                    {language === 'ur'
                      ? 'محفوظ ایم آر آئی و یادداشت ریکارڈ'
                      : language === 'ar'
                      ? 'سجل صور الرنين ومتابعة الذاكرة'
                      : 'Patient Scan & Cognitive Vault'}
                  </p>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-slate-400" />
            </div>

            {/* 5. System Status */}
            <div
              onClick={() => {
                onClose();
                setCurrentTab('telemetry');
              }}
              className="p-3 rounded-2xl border border-emerald-200 dark:border-emerald-800 bg-emerald-50/50 dark:bg-emerald-950/30 hover:bg-emerald-100/60 transition-all cursor-pointer flex items-center justify-between"
            >
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-[#00a86b] text-white flex items-center justify-center shrink-0">
                  <BarChart3 className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white">
                      {language === 'ur' ? 'سسٹم کی کارکردگی' : language === 'ar' ? 'حالة النظام واستقراره' : 'System Status'}
                    </h4>
                    <span className="px-1.5 py-0.2 rounded-full bg-emerald-100 dark:bg-emerald-900 text-emerald-800 dark:text-emerald-300 text-[9px] font-bold">
                      ● 99.9%
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">
                    {language === 'ur'
                      ? 'آن ڈیوائس ماڈل و ٹیلی میٹری'
                      : language === 'ar'
                      ? 'أداء المعالج العصبي والمؤشرات'
                      : 'APIs, NPU & TFLite telemetry'}
                  </p>
                </div>
              </div>
            </div>

            {/* SETTINGS ACCORDION */}
            <div className="pt-2">
              <button
                onClick={() => setIsSettingsOpen(!isSettingsOpen)}
                className="w-full flex items-center justify-between py-2 text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 cursor-pointer"
              >
                <span>{language === 'ur' ? 'ترتیبات' : language === 'ar' ? 'الإعدادات' : 'SETTINGS'}</span>
                {isSettingsOpen ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
              </button>

              {isSettingsOpen && (
                <div className="space-y-3 pt-1 pb-2">
                  {/* Theme Mode Toggle (Light / Dark) */}
                  <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 flex items-center justify-between">
                    <div className="flex items-center gap-2 text-xs font-semibold text-slate-700 dark:text-slate-300">
                      {isDarkMode ? <Moon className="w-4 h-4 text-indigo-400" /> : <Sun className="w-4 h-4 text-amber-500" />}
                      <span>{language === 'ur' ? 'ظاہری وضع:' : language === 'ar' ? 'المظهر:' : 'Appearance Theme'}</span>
                    </div>
                    <div className="inline-flex rounded-lg bg-slate-200 dark:bg-slate-700 p-0.5 text-xs font-bold">
                      <button
                        onClick={() => setIsDarkMode(false)}
                        className={`px-2.5 py-1 rounded-md transition-all cursor-pointer ${
                          !isDarkMode ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-500 dark:text-slate-400'
                        }`}
                      >
                        {language === 'ur' ? 'روشن' : language === 'ar' ? 'فاتح' : 'Light'}
                      </button>
                      <button
                        onClick={() => setIsDarkMode(true)}
                        className={`px-2.5 py-1 rounded-md transition-all cursor-pointer ${
                          isDarkMode ? 'bg-slate-900 text-white shadow-xs' : 'text-slate-500 dark:text-slate-400'
                        }`}
                      >
                        {language === 'ur' ? 'ڈارک' : language === 'ar' ? 'داكن' : 'Dark'}
                      </button>
                    </div>
                  </div>

                  {/* Region Switcher */}
                  <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 text-xs font-semibold text-slate-700 dark:text-slate-300">
                        <Globe2 className="w-4 h-4 text-[#0d9488]" />
                        <span>{language === 'ur' ? 'طبی دائرہ اختیار:' : language === 'ar' ? 'النطاق الصحي:' : 'Health Jurisdiction'}</span>
                      </div>
                      <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded-full bg-teal-100 dark:bg-teal-950 text-teal-800 dark:text-teal-300 font-bold">
                        {region === 'abu-dhabi' ? 'UAE DoH' : 'PK NIH'}
                      </span>
                    </div>
                    <div className="grid grid-cols-2 gap-1.5 p-1 rounded-xl bg-slate-200 dark:bg-slate-700 text-xs font-bold">
                      <button
                        onClick={() => setRegion('abu-dhabi')}
                        className={`py-2 px-2 rounded-lg transition-all flex items-center justify-center gap-1.5 cursor-pointer text-center ${
                          region === 'abu-dhabi' ? 'bg-[#0d9488] text-white shadow-xs' : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                        }`}
                      >
                        <span className="font-mono text-[11px] font-black tracking-wide">AE</span>
                        <span className="truncate">Abu Dhabi</span>
                      </button>
                      <button
                        onClick={() => setRegion('pakistan')}
                        className={`py-2 px-2 rounded-lg transition-all flex items-center justify-center gap-1.5 cursor-pointer text-center ${
                          region === 'pakistan' ? 'bg-[#00a86b] text-white shadow-xs' : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                        }`}
                      >
                        <span className="font-mono text-[11px] font-black tracking-wide">PK</span>
                        <span className="truncate">Pakistan</span>
                      </button>
                    </div>
                  </div>

                  {/* Language Switcher */}
                  <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                        {language === 'ur' ? 'زبان منتخب کریں:' : language === 'ar' ? 'اختر اللغة:' : 'System Language'}
                      </span>
                      <span className="text-[10px] font-mono uppercase text-slate-500 dark:text-slate-400 font-bold">
                        {language.toUpperCase()}
                      </span>
                    </div>
                    <div className="grid grid-cols-3 gap-1.5 p-1 rounded-xl bg-slate-200 dark:bg-slate-700 text-xs font-bold">
                      <button
                        onClick={() => setLanguage('en')}
                        className={`py-2 rounded-lg transition-all cursor-pointer text-center ${
                          language === 'en' ? 'bg-white dark:bg-slate-800 text-teal-800 dark:text-teal-300 shadow-xs' : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                        }`}
                      >
                        English
                      </button>
                      <button
                        onClick={() => setLanguage('ur')}
                        className={`py-2 rounded-lg transition-all cursor-pointer text-center ${
                          language === 'ur' ? 'bg-white dark:bg-slate-800 text-teal-800 dark:text-teal-300 shadow-xs' : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                        }`}
                      >
                        اردو
                      </button>
                      <button
                        onClick={() => setLanguage('ar')}
                        className={`py-2 rounded-lg transition-all cursor-pointer text-center ${
                          language === 'ar' ? 'bg-white dark:bg-slate-800 text-teal-800 dark:text-teal-300 shadow-xs' : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                        }`}
                      >
                        عربي
                      </button>
                    </div>
                  </div>

                  {/* Accessibility Controls: High Contrast & Large Text */}
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      onClick={() => setIsHighContrast((prev) => !prev)}
                      className={`p-2 rounded-xl border text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                        isHighContrast
                          ? 'bg-amber-100 border-amber-300 text-amber-900 dark:bg-amber-950 dark:text-amber-200'
                          : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300'
                      }`}
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>
                        {isHighContrast
                          ? language === 'ur'
                            ? 'کنٹراسٹ فعال'
                            : language === 'ar'
                            ? 'التباين مفعّل'
                            : 'Contrast ON'
                          : language === 'ur'
                          ? 'کنٹراسٹ'
                          : language === 'ar'
                          ? 'تباين عالٍ'
                          : 'Contrast'}
                      </span>
                    </button>

                    <button
                      onClick={() => setIsLargeText((prev) => !prev)}
                      className={`p-2 rounded-xl border text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                        isLargeText
                          ? 'bg-teal-100 border-teal-300 text-teal-900 dark:bg-teal-950 dark:text-teal-200'
                          : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300'
                      }`}
                    >
                      <Type className="w-3.5 h-3.5" />
                      <span>
                        {isLargeText
                          ? language === 'ur'
                            ? 'بڑا خط فعال'
                            : language === 'ar'
                            ? 'الخط الكبير مفعّل'
                            : 'Large Text ON'
                          : language === 'ur'
                          ? 'بڑا خط'
                          : language === 'ar'
                          ? 'تكبير الخط'
                          : 'Large Text'}
                      </span>
                    </button>
                  </div>

                  {/* Inference Architecture Status */}
                  <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 flex items-center justify-between">
                    <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                      {language === 'ur' ? 'اے آئی انجن:' : language === 'ar' ? 'المعالج الذكي:' : 'Inference Engine'}
                    </span>
                    <span className="text-[11px] font-bold text-emerald-700 dark:text-emerald-300 flex items-center gap-1 font-mono">
                      <Cpu className="w-3.5 h-3.5 text-emerald-600" />
                      {language === 'ur' ? 'آن ڈیوائس Xception NPU' : language === 'ar' ? 'معالج عصبي مدمج (NPU)' : 'On-Device Xception NPU'}
                    </span>
                  </div>
                </div>
              )}
            </div>

            {/* COLLECTIONS / RESEARCH ACCORDION */}
            <div className="pt-1">
              <button
                onClick={() => setIsCollectionsOpen(!isCollectionsOpen)}
                className="w-full flex items-center justify-between py-2 text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 cursor-pointer"
              >
                <span>
                  {language === 'ur'
                    ? 'تحقیقات و حوالہ جات'
                    : language === 'ar'
                    ? 'الأبحاث والوثائق المعتمدة'
                    : 'COLLECTIONS & PAPERS'}
                </span>
                {isCollectionsOpen ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
              </button>

              {isCollectionsOpen && (
                <div className="space-y-2 pt-1 pb-2">
                  <button
                    onClick={() => {
                      onClose();
                      openDoiModal();
                    }}
                    className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-left text-xs font-semibold text-slate-800 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 flex items-center justify-between cursor-pointer"
                  >
                    <span>
                      {language === 'ur'
                        ? 'تحقیقی مقالہ (DOI: 10.5281/zenodo.17864829)'
                        : language === 'ar'
                        ? 'الورقة البحثية المنشورة (DOI: 10.5281/zenodo.17864829)'
                        : 'Research Paper (DOI: 10.5281/zenodo.17864829)'}
                    </span>
                    <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
                  </button>

                  <button
                    onClick={() => {
                      onClose();
                      openConsentModal();
                    }}
                    className="w-full p-2.5 rounded-xl border border-teal-200 dark:border-teal-800/80 bg-teal-50/40 dark:bg-teal-950/20 text-left text-xs font-semibold text-slate-800 dark:text-slate-200 hover:bg-teal-100/50 dark:hover:bg-teal-900/40 flex items-center justify-between cursor-pointer transition-colors"
                  >
                    <div className="flex items-center gap-2">
                      <UserCheck className="w-4 h-4 text-teal-600 dark:text-teal-400 shrink-0" />
                      <span>
                        {language === 'ur'
                          ? 'میری برین ہیلتھ پروفائل اور رضامندی والٹ'
                          : language === 'ar'
                          ? 'ملفي لصحة الدماغ وخزنة الموافقة'
                          : 'My Brain Health Profile & Consent Vault'}
                      </span>
                    </div>
                    <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
                  </button>
                </div>
              )}
            </div>

            {/* Bottom Help & Report Issue Card */}
            <div
              onClick={() => {
                onClose();
                openTicketModal();
              }}
              className="mt-2 p-3 rounded-2xl border border-teal-200 dark:border-slate-700 bg-teal-50/50 dark:bg-slate-800 hover:bg-teal-100/50 transition-all cursor-pointer flex items-center gap-3"
            >
              <div className="w-9 h-9 rounded-xl bg-[#00a86b] text-white flex items-center justify-center shrink-0">
                <AlertOctagon className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white">
                  {language === 'ur'
                    ? 'مدد اور رپورٹ / مسئلہ درج کریں'
                    : language === 'ar'
                    ? 'المساعدة والإبلاغ عن مشكلة'
                    : 'Help & Report Issue'}
                </h4>
                <p className="text-[11px] text-slate-500 dark:text-slate-400">
                  {language === 'ur'
                    ? 'کلینیکل سیفٹی و سپورٹ ٹکٹ'
                    : language === 'ar'
                    ? 'السلامة السريرية وتذاكر الدعم'
                    : 'Clinical Safety & AI Support Ticket'}
                </p>
              </div>
            </div>
          </div>

          {/* Footer matching AgriLens Eco Screenshot */}
          <div className="p-4 border-t border-slate-100 dark:border-slate-800 text-center">
            <div className="flex items-center justify-center gap-1.5 text-xs text-slate-700 dark:text-slate-300 font-bold">
              <span>© 2026</span>
              <span>Deep<span className="text-[#0d9488]">Cortex</span></span>
              <span className="px-1.5 py-0.2 rounded-md bg-[#00a86b] text-white text-[9px] font-black uppercase">
                AI
              </span>
            </div>
            <p className="text-[10px] text-slate-400 mt-0.5">
              • Sustainable Brain Health &amp; Cognitive Intelligence •
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
