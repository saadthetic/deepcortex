import React, { useState, useEffect, useRef } from 'react';
import { Header } from './components/Header';
import { BottomNav } from './components/BottomNav';
import { WelcomeHero } from './components/WelcomeHero';
import { BrainCheckTab } from './components/BrainCheckTab';
import { RiskContextTab } from './components/RiskContextTab';
import { MriScanLab } from './components/MriScanLab';
import { CarePlanTab } from './components/CarePlanTab';
import { SafetyStatusTab } from './components/SafetyStatusTab';
import { GovSchemesTab } from './components/GovSchemesTab';
import { HistoryVaultTab } from './components/HistoryVaultTab';
import { SideDrawer } from './components/SideDrawer';
import { DraggableEdgePeekTab } from './components/DraggableEdgePeekTab';
import { PostScanSavePrompt } from './components/PostScanSavePrompt';
import { PatientProfileModal } from './components/PatientProfileModal';
import {
  DoiModal,
  ConsentModal,
  NpuModal,
  TicketModal,
} from './components/Modals';
import {
  Region,
  Language,
  Tab,
  PrivacyMode,
  LongitudinalPoint,
  MriAnalysisResult,
  DoctorSignOff,
  UserProfile,
  PatientHistoryRecord,
} from './types';
import { loadStoredProfile, saveStoredProfile, onAuthChange } from './services/firebaseAuthService';
import { translations } from './translations';

export default function App() {
  // Navigation & Ecosystem
  const [currentTab, setCurrentTab] = useState<Tab>('home');
  const [region, setRegion] = useState<Region>('abu-dhabi');
  const [language, setLanguage] = useState<Language>('en');
  const [privacyMode, setPrivacyMode] = useState<PrivacyMode>('edge');

  // Stable Session ID for Linking Memory, Health, and MRI into One Unified Encounter
  const [sessionId] = useState<string>(() => {
    try {
      const existing = sessionStorage.getItem('deepcortex_session_id');
      if (existing) return existing;
      const newId = 'SES-' + Math.floor(1000 + Math.random() * 9000);
      sessionStorage.setItem('deepcortex_session_id', newId);
      return newId;
    } catch {
      return 'SES-4426';
    }
  });

  // Live Patient Profile & Consent Vault State (Progressive Guest -> Account Sync)
  const [userProfile, setUserProfile] = useState<UserProfile>(() => loadStoredProfile());
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [showPostScanPrompt, setShowPostScanPrompt] = useState(false);

  // Accessibility & Visual Themes (with Dark Mode, Contrast, and Large Text)
  const [isDarkMode, setIsDarkMode] = useState<boolean>(() => {
    return localStorage.getItem('deepcortex_theme') === 'dark';
  });
  const [isHighContrast, setIsHighContrast] = useState<boolean>(false);
  const [isLargeText, setIsLargeText] = useState<boolean>(false);
  const [isSpeaking, setIsSpeaking] = useState<boolean>(false);

  // Modals & Navigation Drawer
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isDoiOpen, setIsDoiOpen] = useState(false);
  const [isConsentOpen, setIsConsentOpen] = useState(false);
  const [isNpuOpen, setIsNpuOpen] = useState(false);
  const [isTicketOpen, setIsTicketOpen] = useState(false);

  // Longitudinal Cognitive History (4 baseline check-ins over 6 months)
  const [longitudinalHistory, setLongitudinalHistory] = useState<LongitudinalPoint[]>([
    {
      id: 'wave-1',
      date: '2026-04-12T00:00:00Z',
      displayDate: '6 Mo Ago',
      score: 88,
      recallScore: 5,
      trailTimeSeconds: 20,
      functionalScore: 25,
      notes: 'Initial Baseline Established',
    },
    {
      id: 'wave-2',
      date: '2026-06-18T00:00:00Z',
      displayDate: '4 Mo Ago',
      score: 87,
      recallScore: 5,
      trailTimeSeconds: 21,
      functionalScore: 25,
      notes: 'Routine Check-In',
    },
    {
      id: 'wave-3',
      date: '2026-08-22T00:00:00Z',
      displayDate: '2 Mo Ago',
      score: 85,
      recallScore: 4,
      trailTimeSeconds: 23,
      functionalScore: 25,
      notes: 'Stable Baseline',
    },
    {
      id: 'wave-4',
      date: '2026-09-29T00:00:00Z',
      displayDate: 'Last Mo',
      score: 86,
      recallScore: 4,
      trailTimeSeconds: 22,
      functionalScore: 25,
      notes: 'Normal Day-to-Day Variation',
    },
  ]);

  // Modifiable Daily Health State
  const [riskState, setRiskState] = useState({
    bloodPressureSystolic: 124,
    bloodPressureDiastolic: 80,
    hba1c: 5.5,
    cholesterol: 180,
    bmi: 24.2,
    hearingLoss: false,
    sleepHours: 7.5,
    sleepQuality: 'restorative',
    phqScore: 1,
    gadScore: 1,
    physicalActivityMinutes: 150,
    mindDietScore: 8,
    smokingStatus: 'never',
    familyHistory: false,
    apoe4: 'unknown',
  });

  const [latestCognitiveScore, setLatestCognitiveScore] = useState<number>(86);
  const [latestMriResult, setLatestMriResult] = useState<MriAnalysisResult | null>(null);

  const [doctorSignOff, setDoctorSignOff] = useState<DoctorSignOff | null>(() => {
    try {
      const saved = localStorage.getItem('deepcortex_doctor_signoff');
      if (saved) return JSON.parse(saved);
    } catch {}
    return null;
  });

  const handleDoctorSignOffChange = (signOff: DoctorSignOff | null) => {
    setDoctorSignOff(signOff);
    if (signOff) {
      localStorage.setItem('deepcortex_doctor_signoff', JSON.stringify(signOff));
    } else {
      localStorage.removeItem('deepcortex_doctor_signoff');
    }
  };

  // Sync language attribute on document while maintaining stable layout architecture
  useEffect(() => {
    document.documentElement.dir = 'ltr';
    document.documentElement.lang = language;
  }, [language]);

  // Synchronize Firebase Auth user state with profile vault
  useEffect(() => {
    const unsubscribe = onAuthChange((firebaseUser) => {
      if (firebaseUser) {
        setUserProfile((prev) => {
          if (prev.id === firebaseUser.uid && !prev.isGuest) return prev;
          const updated: UserProfile = {
            ...prev,
            id: firebaseUser.uid,
            isGuest: false,
            name: firebaseUser.displayName || prev.name || firebaseUser.email?.split('@')[0] || 'User',
            email: firebaseUser.email || prev.email,
            avatar: firebaseUser.photoURL || prev.avatar,
            isCloudSynced: true,
          };
          saveStoredProfile(updated);
          return updated;
        });
      }
    });
    return () => unsubscribe();
  }, []);

  // Sync Dark Mode class and persistence
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('deepcortex_theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('deepcortex_theme', 'light');
    }
  }, [isDarkMode]);

  // Sync High Contrast class
  useEffect(() => {
    if (isHighContrast) {
      document.documentElement.classList.add('high-contrast');
    } else {
      document.documentElement.classList.remove('high-contrast');
    }
  }, [isHighContrast]);

  // Sync Large Text class
  useEffect(() => {
    if (isLargeText) {
      document.documentElement.classList.add('large-text');
    } else {
      document.documentElement.classList.remove('large-text');
    }
  }, [isLargeText]);

  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Audio Speech Synthesis / TTS (Trilingual: English, Urdu, Arabic via Gemini 3.8 Flash Lite TTS + Web Speech)
  const toggleSpeaking = async () => {
    if (isSpeaking) {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
      setIsSpeaking(false);
      return;
    }

    const t = translations[language];
    let narrationText = '';

    if (language === 'ur') {
      narrationText = `${t.appName}۔ ${t.tagline}۔ `;
      if (currentTab === 'home') {
        narrationText += t.homeSubtitle;
      } else if (currentTab === 'brain-check') {
        narrationText += 'یادداشت کا 2 منٹ کا کلینیکل چیک۔ یادداشت، روزمرہ توجہ اور علمی صلاحیت کا آسان جائزہ۔';
      } else if (currentTab === 'risk-context') {
        narrationText += 'روزمرہ صحت کی عادات۔ بلڈ پریشر کا کنٹرول، گہری نیند اور باقاعدہ چہل قدمی یادداشت کی حفاظت کرتی ہے۔';
      } else if (currentTab === 'mri-lab') {
        narrationText += 'برین ایم آر آئی اسکین لیب۔ گریڈ-کیم نیورل توجہ اور دماغ کے 4 بنیادی حصوں کی حالت۔';
      } else if (currentTab === 'care-plan') {
        narrationText += 'جامع نگہداشت کا منصوبہ، ڈاکٹر کا چیک لسٹ، اور اسپتال ریفرل گائیڈ۔';
      } else if (currentTab === 'schemes') {
        narrationText += 'سرکاری صحت اسکیمیں، ابوظہبی افحص پروگرام اور قومی صحت کارڈ کے تحت مفت علاج کی تفصیلات۔';
      } else if (currentTab === 'history') {
        narrationText += 'طبی تاریخ کا محفوظ والٹ اور پرانے معائنوں کا مکمل ریکارڈ۔';
      } else if (currentTab === 'telemetry') {
        narrationText += 'سسٹم اسٹیٹس اور سائنسی مقالے کی توثیق۔';
      }
    } else if (language === 'ar') {
      narrationText = `${t.appName}. ${t.tagline}. `;
      if (currentTab === 'home') {
        narrationText += t.homeSubtitle;
      } else if (currentTab === 'brain-check') {
        narrationText += 'فحص الذاكرة السريع. تقييم سريري مبسط من ثلاث خطوات للتحقق من سلامة الذاكرة والتركيز اليومي.';
      } else if (currentTab === 'risk-context') {
        narrationText += 'عادات الصحة اليومية. النوم الصحي، وضبط ضغط الدم، وممارسة المشي المنتظم تحمي صحة الدماغ والذاكرة.';
      } else if (currentTab === 'mri-lab') {
        narrationText += 'منصة تحليل صور الرنين المغناطيسي للدماغ مع خرائط التدرج الحراري التفسيرية غ راد كام.';
      } else if (currentTab === 'care-plan') {
        narrationText += 'خطة الرعاية الشخصية، وقائمة التحقق الطبية المعتمدة، ودليل المراكز التخصصية.';
      } else if (currentTab === 'schemes') {
        narrationText += 'المبادرات والبرامج الصحية الحكومية، برنامج افحص في أبوظبي وبطاقة صحت سہولت للتغطية التشخيصية المجانية.';
      } else if (currentTab === 'history') {
        narrationText += 'أرشيف المريض وسجل الفحصوصات الطبية لمتابعة التغيرات الإدراكية عبر الزمن.';
      } else if (currentTab === 'telemetry') {
        narrationText += 'حالة النظام ومؤشرات التحقق السريري للبحث العلمي المنشور.';
      }
    } else {
      narrationText = `${t.appName}. ${t.tagline}. `;
      if (currentTab === 'home') {
        narrationText += t.homeSubtitle;
      } else if (currentTab === 'brain-check') {
        narrationText += 'Memory check. A gentle 3-step check to understand your memory and daily focus.';
      } else if (currentTab === 'risk-context') {
        narrationText += 'Daily health habits. Good sleep, healthy blood pressure, and walking can protect memory.';
      } else if (currentTab === 'mri-lab') {
        narrationText += 'Brain MRI scan and explainable workstation with attention heatmaps.';
      } else if (currentTab === 'care-plan') {
        narrationText += 'Personal care plan, verified doctor checklist, and clinic referral directory.';
      } else if (currentTab === 'schemes') {
        narrationText += 'Government brain health schemes, Abu Dhabi IFHAS, and Sehat Sahulat programs.';
      } else if (currentTab === 'history') {
        narrationText += 'Patient history vault and longitudinal scan archive.';
      } else if (currentTab === 'telemetry') {
        narrationText += 'System status and published research validation benchmarks.';
      }
    }

    setIsSpeaking(true);

    // 1. Try High-Fidelity Multilingual Server-side TTS (Gemini 3.8 Flash Lite TTS)
    try {
      const resp = await fetch('/api/neuro/tts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: narrationText, language }),
      });
      const data = await resp.json();
      if (data.success && data.audioBase64) {
        if (audioRef.current) {
          audioRef.current.pause();
          audioRef.current = null;
        }
        const audio = new Audio(`data:${data.mimeType || 'audio/wav'};base64,${data.audioBase64}`);
        audioRef.current = audio;
        audio.onended = () => {
          setIsSpeaking(false);
          audioRef.current = null;
        };
        audio.onerror = () => {
          setIsSpeaking(false);
          audioRef.current = null;
        };
        await audio.play();
        return;
      }
    } catch (err) {
      console.warn('Backend audio synthesis note, trying Web Speech:', err);
    }

    // 2. Client-side Web Speech fallback with language voice matching
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(narrationText);
      utterance.lang = language === 'ar' ? 'ar-SA' : language === 'ur' ? 'ur-PK' : 'en-US';
      const voices = window.speechSynthesis.getVoices();
      if (language === 'ur') {
        const urVoice = voices.find((v) => v.lang.startsWith('ur') || v.name.toLowerCase().includes('urdu'));
        if (urVoice) utterance.voice = urVoice;
      } else if (language === 'ar') {
        const arVoice = voices.find((v) => v.lang.startsWith('ar') || v.name.toLowerCase().includes('arabic'));
        if (arVoice) utterance.voice = arVoice;
      }
      utterance.rate = 0.95;
      utterance.onend = () => setIsSpeaking(false);
      utterance.onerror = () => setIsSpeaking(false);
      window.speechSynthesis.speak(utterance);
    } else {
      setIsSpeaking(false);
    }
  };

  const addHistoryPoint = (point: LongitudinalPoint) => {
    setLongitudinalHistory((prev) => [...prev, point]);
    setLatestCognitiveScore(point.score);
  };

  // Listen for storage or profile events across components
  useEffect(() => {
    const handleStorageChange = () => {
      setUserProfile(loadStoredProfile());
    };
    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('deepcortex_profile_updated', handleStorageChange);
    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('deepcortex_profile_updated', handleStorageChange);
    };
  }, []);

  // Helper to persist/upsert unified multi-modal encounter in History Vault
  const syncSessionEncounterToHistory = (
    score: number,
    health: typeof riskState,
    mri?: MriAnalysisResult | null
  ) => {
    try {
      const STORAGE_KEY = 'deepcortex_patient_records_v1';
      const raw = localStorage.getItem(STORAGE_KEY);
      let records: PatientHistoryRecord[] = [];
      if (raw) {
        records = JSON.parse(raw);
      }

      const encounterId = `rec-encounter-${sessionId}`;
      const systolic = health.bloodPressureSystolic;
      const diastolic = health.bloodPressureDiastolic;
      const sleep = health.sleepHours;
      const activity = health.physicalActivityMinutes;

      const summaryText = mri
        ? `Session ${sessionId}: Cognitive Score ${score}/100 • Lifestyle (BP ${systolic}/${diastolic} mmHg, Sleep ${sleep}h, Exercise ${activity}m/wk) • Brain MRI: ${mri.classification} (${(mri.confidence * 100).toFixed(1)}%).`
        : `Session ${sessionId}: Cognitive Score ${score}/100 • Lifestyle Risk Index (BP ${systolic}/${diastolic} mmHg, Sleep ${sleep}h, Exercise ${activity}m/wk).`;

      const encounterRecord: PatientHistoryRecord = {
        id: encounterId,
        type: mri ? 'multimodal' : 'composite',
        title: mri
          ? `Clinical Encounter: Cognitive & MRI (${mri.classification})`
          : `Clinical Baseline: Cognitive & Lifestyle Profile`,
        timestamp: new Date().toISOString(),
        dateDisplay: 'Current Session',
        score: score,
        sessionId: sessionId,
        classification: mri?.classification,
        confidence: mri?.confidence,
        inferenceMode: mri?.inferenceMode || 'edge',
        thumbnailUrl: mri?.scanImageUrl || '/assets/aistudio/non_17_c01f5258.jpg',
        summary: summaryText,
        details: {
          cognitiveScore: score,
          lifestyle: health,
          mriClassification: mri?.classification,
        },
        mriDetails: mri || undefined,
        isPersonal: true,
      };

      records = [encounterRecord, ...records.filter((r) => r.id !== encounterId)].slice(0, 25);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(records));
    } catch (err) {
      console.warn('Could not sync session encounter to history:', err);
    }
  };

  const handleTabChange = (newTab: Tab) => {
    // When switching away from brain-check or risk-context, auto-save clinical encounter
    if (currentTab === 'brain-check' || currentTab === 'risk-context') {
      syncSessionEncounterToHistory(latestCognitiveScore, riskState, latestMriResult);
    }
    setCurrentTab(newTab);
  };

  return (
    <div
      className={`min-h-screen w-full max-w-full overflow-x-hidden box-border bg-[#F4FBF9] dark:bg-[#0B1320] text-slate-900 dark:text-slate-100 flex flex-col justify-between ${
        language === 'ur' ? 'lang-ur' : ''
      }`}
    >
      {/* Clean Top Header (Only Status and Voice on the Right) */}
      <Header
        currentTab={currentTab}
        setCurrentTab={handleTabChange}
        language={language}
        isSpeaking={isSpeaking}
        toggleSpeaking={toggleSpeaking}
        openDrawer={() => setIsDrawerOpen(true)}
      />

      {/* Main Body View */}
      <main
        className={`flex-1 w-full max-w-full overflow-x-hidden box-border px-3 sm:px-6 pt-4 ${
          currentTab === 'home' ? 'pb-10' : 'pb-28'
        }`}
      >
        {currentTab === 'home' && (
          <WelcomeHero
            setCurrentTab={handleTabChange}
            language={language}
            region={region}
            openDoiModal={() => setIsDoiOpen(true)}
            openConsentModal={() => setIsProfileOpen(true)}
          />
        )}

        {currentTab === 'brain-check' && (
          <BrainCheckTab
            language={language}
            region={region}
            longitudinalHistory={longitudinalHistory}
            addHistoryPoint={addHistoryPoint}
            onAssessmentComplete={(score) => {
              setLatestCognitiveScore(score);
              setUserProfile((prev) => {
                const updated = {
                  ...prev,
                  latestMemoryScore: score,
                  lastUpdated: new Date().toISOString(),
                };
                saveStoredProfile(updated);
                return updated;
              });
              // Auto-save unified clinical encounter immediately without opening sync prompt
              syncSessionEncounterToHistory(score, riskState, latestMriResult);
            }}
          />
        )}

        {currentTab === 'risk-context' && (
          <RiskContextTab
            language={language}
            region={region}
            riskState={riskState}
            setRiskState={(newRisk) => {
              setRiskState(newRisk);
              // Auto-sync updated risk context with cognitive score
              if (typeof newRisk === 'function') {
                setRiskState((prev) => {
                  const updated = (newRisk as any)(prev);
                  syncSessionEncounterToHistory(latestCognitiveScore, updated, latestMriResult);
                  return updated;
                });
              } else {
                syncSessionEncounterToHistory(latestCognitiveScore, newRisk, latestMriResult);
              }
            }}
          />
        )}

        {currentTab === 'mri-lab' && (
          <MriScanLab
            language={language}
            region={region}
            privacyMode={privacyMode}
            setPrivacyMode={setPrivacyMode}
            cognitiveScore={latestCognitiveScore}
            riskState={riskState}
            sessionId={sessionId}
            onAnalysisDone={(res) => {
              setLatestMriResult(res);
              setUserProfile((prev) => {
                const updated = {
                  ...prev,
                  personalScansCount: prev.personalScansCount + 1,
                  savedReportsCount: prev.savedReportsCount + 1,
                  lastUpdated: new Date().toISOString(),
                };
                saveStoredProfile(updated);
                return updated;
              });
              syncSessionEncounterToHistory(latestCognitiveScore, riskState, res);
            }}
            onScanCompleteNotification={(_result, isCustom) => {
              // ONLY show 5-second save sync prompt for personal uploaded scans, NEVER for reference cases!
              if (userProfile.isGuest && isCustom) {
                setTimeout(() => setShowPostScanPrompt(true), 600);
              }
            }}
            doctorSignOff={doctorSignOff}
          />
        )}

        {currentTab === 'care-plan' && (
          <CarePlanTab
            language={language}
            region={region}
            cognitiveScore={latestCognitiveScore}
            riskState={riskState}
            mriResult={latestMriResult}
            doctorSignOff={doctorSignOff}
            onDoctorSignOffChange={handleDoctorSignOffChange}
          />
        )}

        {currentTab === 'telemetry' && (
          <SafetyStatusTab
            language={language}
            region={region}
          />
        )}

        {currentTab === 'schemes' && (
          <GovSchemesTab
            language={language}
            region={region}
            setRegion={setRegion}
          />
        )}

        {currentTab === 'history' && (
          <HistoryVaultTab
            language={language}
            region={region}
            setCurrentTab={handleTabChange}
          />
        )}
      </main>

      {/* Floating Bottom Nav (AgriLens Eco Style: Only visible in active functional tabs, hidden on Welcome Screen) */}
      {currentTab !== 'home' && (
        <BottomNav
          currentTab={currentTab}
          setCurrentTab={handleTabChange}
          language={language}
        />
      )}

      {/* Draggable Edge Peek Tab (Profile & Sync Status) */}
      <DraggableEdgePeekTab
        userProfile={userProfile}
        onOpenProfileModal={() => setIsProfileOpen(true)}
        language={language}
      />

      {/* Post-Scan Save Floating Prompt (Guest Users) */}
      <PostScanSavePrompt
        isOpen={showPostScanPrompt}
        onClose={() => setShowPostScanPrompt(false)}
        onSaveProfile={() => setIsProfileOpen(true)}
        userProfile={userProfile}
        language={language}
      />

      {/* Side Menu Drawer with Settings (Theme, Region, Language, Accessibility, Data Mode) */}
      <SideDrawer
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        setCurrentTab={handleTabChange}
        language={language}
        setLanguage={setLanguage}
        region={region}
        setRegion={setRegion}
        privacyMode={privacyMode}
        setPrivacyMode={setPrivacyMode}
        isDarkMode={isDarkMode}
        setIsDarkMode={setIsDarkMode}
        isHighContrast={isHighContrast}
        setIsHighContrast={setIsHighContrast}
        isLargeText={isLargeText}
        setIsLargeText={setIsLargeText}
        longitudinalHistory={longitudinalHistory}
        openDoiModal={() => setIsDoiOpen(true)}
        openConsentModal={() => setIsProfileOpen(true)}
        openNpuModal={() => setIsNpuOpen(true)}
        openTicketModal={() => setIsTicketOpen(true)}
      />

      {/* Full Patient Profile, Consent & Dual-Delete Vault Modal */}
      <PatientProfileModal
        isOpen={isProfileOpen}
        onClose={() => setIsProfileOpen(false)}
        userProfile={userProfile}
        setUserProfile={setUserProfile}
        language={language}
        region={region}
        setRegion={setRegion}
        onProfileUpdated={(updated) => setUserProfile(updated)}
      />

      {/* Modals */}
      <DoiModal isOpen={isDoiOpen} onClose={() => setIsDoiOpen(false)} />
      <ConsentModal isOpen={isConsentOpen} onClose={() => setIsConsentOpen(false)} />
      <NpuModal isOpen={isNpuOpen} onClose={() => setIsNpuOpen(false)} />
      <TicketModal isOpen={isTicketOpen} onClose={() => setIsTicketOpen(false)} />
    </div>
  );
}
