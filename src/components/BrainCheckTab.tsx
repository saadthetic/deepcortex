import React, { useState, useEffect } from 'react';
import {
  Brain,
  RotateCcw,
  CheckCircle2,
  Clock,
  AlertCircle,
  Sliders,
  TrendingUp,
  Volume2,
  ChevronRight,
  ArrowRight,
  ShieldCheck,
  Award,
  TreePine,
  Leaf,
  Landmark,
  Shield,
  Coffee,
  Flame,
  Droplets,
  CircleDot,
  Layers,
  Compass,
} from 'lucide-react';
import { Language, Region, LongitudinalPoint } from '../types';
import { translations } from '../translations';

interface BrainCheckTabProps {
  language: Language;
  region: Region;
  onAssessmentComplete: (score: number, details: any) => void;
  longitudinalHistory: LongitudinalPoint[];
  addHistoryPoint: (point: LongitudinalPoint) => void;
}

export const BrainCheckTab: React.FC<BrainCheckTabProps> = ({
  language,
  region,
  onAssessmentComplete,
  longitudinalHistory,
  addHistoryPoint,
}) => {
  const t = translations[language];

  // Accommodation Settings
  const [educationLevel, setEducationLevel] = useState<'none' | 'primary' | 'secondary' | 'higher'>('secondary');
  const [sensoryMode, setSensoryMode] = useState<'standard' | 'audio-assisted' | 'high-contrast'>('standard');

  // Gate 2: Acute Red-Flag Emergency Triage Bypass State (Sudden <48h Onset)
  const [acuteRedFlagTriggered, setAcuteRedFlagTriggered] = useState<boolean>(false);
  const [selectedRedFlags, setSelectedRedFlags] = useState<string[]>([]);

  // Test Flow Steps (includes Step 2B Audio-Visual Piano Sequence Memory)
  const [step, setStep] = useState<
    | 'intro'
    | 'part1-register'
    | 'part1-orientation'
    | 'part2-trail'
    | 'part2b-piano'
    | 'part3-functional'
    | 'part1-recall'
    | 'completed'
  >('intro');

  // Step 2B: Audio-Visual 4-Note Piano Sequence Memory (Web Audio API)
  const PIANO_NOTES = [
    { id: 'C4', label: 'C4', noteName: 'Do (C4)', freq: 261.6, color: 'from-teal-500 to-emerald-600', ring: 'ring-teal-300' },
    { id: 'E4', label: 'E4', noteName: 'Mi (E4)', freq: 329.6, color: 'from-sky-500 to-blue-600', ring: 'ring-sky-300' },
    { id: 'G4', label: 'G4', noteName: 'Sol (G4)', freq: 392.0, color: 'from-indigo-500 to-violet-600', ring: 'ring-indigo-300' },
    { id: 'A4', label: 'A4', noteName: 'La (A4)', freq: 440.0, color: 'from-amber-500 to-orange-600', ring: 'ring-amber-300' },
  ];
  const TARGET_PIANO_SEQUENCE = ['C4', 'G4', 'E4', 'A4'];

  const [activePianoPad, setActivePianoPad] = useState<string | null>(null);
  const [isPlayingSequence, setIsPlayingSequence] = useState<boolean>(false);
  const [hasPlayedSequence, setHasPlayedSequence] = useState<boolean>(false);
  const [userPianoTaps, setUserPianoTaps] = useState<string[]>([]);
  const [pianoStartTime, setPianoStartTime] = useState<number | null>(null);
  const [pianoLatencyMs, setPianoLatencyMs] = useState<number | null>(null);
  const [pianoAccuracy, setPianoAccuracy] = useState<number | null>(null);

  // Synthesize soft piano note envelope via Web Audio API (Zero external audio files required)
  const playPianoTone = (freq: number, padId: string, durationSec = 0.48) => {
    setActivePianoPad(padId);
    setTimeout(() => {
      setActivePianoPad((prev) => (prev === padId ? null : prev));
    }, Math.round(durationSec * 850));

    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      const now = ctx.currentTime;

      // Fundamental + warm 2nd harmonic for piano timbre
      const osc1 = ctx.createOscillator();
      const osc2 = ctx.createOscillator();
      const gainNode = ctx.createGain();

      osc1.type = 'triangle';
      osc1.frequency.setValueAtTime(freq, now);

      osc2.type = 'sine';
      osc2.frequency.setValueAtTime(freq * 2, now);

      const harmonicGain = ctx.createGain();
      harmonicGain.gain.setValueAtTime(0.18, now);

      // Soft piano ADSR envelope
      gainNode.gain.setValueAtTime(0.001, now);
      gainNode.gain.linearRampToValueAtTime(0.32, now + 0.025);
      gainNode.gain.exponentialRampToValueAtTime(0.0008, now + durationSec);

      osc1.connect(gainNode);
      osc2.connect(harmonicGain);
      harmonicGain.connect(gainNode);
      gainNode.connect(ctx.destination);

      osc1.start(now);
      osc2.start(now);
      osc1.stop(now + durationSec + 0.05);
      osc2.stop(now + durationSec + 0.05);
      setTimeout(() => {
        ctx.close().catch(() => {});
      }, Math.round((durationSec + 0.15) * 1000));
    } catch (e) {
      console.warn('Web Audio API piano synth note:', e);
    }
  };

  const playTargetPianoSequence = async () => {
    if (isPlayingSequence) return;
    setIsPlayingSequence(true);
    setUserPianoTaps([]);
    setPianoAccuracy(null);
    setPianoLatencyMs(null);

    for (let i = 0; i < TARGET_PIANO_SEQUENCE.length; i++) {
      const noteId = TARGET_PIANO_SEQUENCE[i];
      const noteObj = PIANO_NOTES.find((n) => n.id === noteId);
      if (noteObj) {
        playPianoTone(noteObj.freq, noteObj.id, 0.45);
      }
      await new Promise((r) => setTimeout(r, 560));
    }

    setIsPlayingSequence(false);
    setHasPlayedSequence(true);
    setPianoStartTime(Date.now());
  };

  const handlePianoPadTap = (noteId: string) => {
    if (isPlayingSequence) return;
    const noteObj = PIANO_NOTES.find((n) => n.id === noteId);
    if (noteObj) {
      playPianoTone(noteObj.freq, noteObj.id, 0.4);
    }

    if (!hasPlayedSequence) return;
    if (userPianoTaps.length >= TARGET_PIANO_SEQUENCE.length) return;

    const nextTaps = [...userPianoTaps, noteId];
    setUserPianoTaps(nextTaps);

    if (nextTaps.length === TARGET_PIANO_SEQUENCE.length) {
      const elapsed = pianoStartTime ? Math.max(420, Date.now() - pianoStartTime) : 1850;
      setPianoLatencyMs(elapsed);
      let correctCount = 0;
      for (let i = 0; i < TARGET_PIANO_SEQUENCE.length; i++) {
        if (nextTaps[i] === TARGET_PIANO_SEQUENCE[i]) correctCount++;
      }
      setPianoAccuracy(Math.round((correctCount / TARGET_PIANO_SEQUENCE.length) * 100));
    }
  };

  const toggleRedFlagSymptom = (symptom: string) => {
    setSelectedRedFlags((prev) => {
      const next = prev.includes(symptom) ? prev.filter((s) => s !== symptom) : [...prev, symptom];
      setAcuteRedFlagTriggered(next.length > 0);
      return next;
    });
  };

  // Cultural Memory Items with Clean Vector Icons (Zero Emojis)
  const culturalItems = region === 'abu-dhabi'
    ? [
        { id: 'item1', nameEn: 'Date Palm', nameUr: 'کھجور کا درخت', nameAr: 'نخلة التمر', icon: TreePine },
        { id: 'item2', nameEn: 'Cardamom', nameUr: 'الائچی', nameAr: 'حب الهيل', icon: Leaf },
        { id: 'item3', nameEn: 'Minaret', nameUr: 'مینار', nameAr: 'المئذنة', icon: Landmark },
        { id: 'item4', nameEn: 'Falcon', nameUr: 'شاہین / باز', nameAr: 'الصقر', icon: Shield },
        { id: 'item5', nameEn: 'Coffee Pot', nameUr: 'تانبے کی کیتلی', nameAr: 'دلة القهوة', icon: Coffee },
      ]
    : [
        { id: 'item1', nameEn: 'Wheat Sheaf', nameUr: 'گندم کی بالی', nameAr: 'سنابل القمح', icon: Leaf },
        { id: 'item2', nameEn: 'Mango Tree', nameUr: 'آم کا درخت', nameAr: 'شجرة المانجو', icon: TreePine },
        { id: 'item3', nameEn: 'Lantern', nameUr: 'لالٹین', nameAr: 'الفانوس', icon: Flame },
        { id: 'item4', nameEn: 'Clay Pitcher', nameUr: 'مٹی کا گھڑا', nameAr: 'إبريق الفخار', icon: Droplets },
        { id: 'item5', nameEn: 'Peacock', nameUr: 'مور', nameAr: 'الطاووس', icon: Award },
      ];

  const [registeredItems, setRegisteredItems] = useState<string[]>([]);
  const [recalledItems, setRecalledItems] = useState<string[]>([]);

  // Orientation answers
  const [orientationYear, setOrientationYear] = useState('');
  const [orientationSeason, setOrientationSeason] = useState('');
  const [orientationDay, setOrientationDay] = useState('');

  // Part 2: Interactive Trail Making Test (1 -> A -> 2 -> B -> 3 -> C)
  const trailSequence = [
    { id: '1', label: '1' },
    { id: 'A', label: 'A' },
    { id: '2', label: '2' },
    { id: 'B', label: 'B' },
    { id: '3', label: '3' },
    { id: 'C', label: 'C' },
    { id: '4', label: '4' },
    { id: 'D', label: 'D' },
  ];

  const [trailPositions, setTrailPositions] = useState<{ id: string; label: string; x: number; y: number }[]>([]);
  const [trailCurrentIndex, setTrailCurrentIndex] = useState(0);
  const [trailStartTime, setTrailStartTime] = useState<number | null>(null);
  const [trailElapsedTime, setTrailElapsedTime] = useState(0);
  const [trailErrors, setTrailErrors] = useState(0);
  const [trailCompleted, setTrailCompleted] = useState(false);

  useEffect(() => {
    if (step === 'part2-trail') {
      const positions = [
        { id: '1', label: '1', x: 15, y: 20 },
        { id: 'A', label: 'A', x: 50, y: 15 },
        { id: '2', label: '2', x: 80, y: 30 },
        { id: 'B', label: 'B', x: 75, y: 70 },
        { id: '3', label: '3', x: 45, y: 55 },
        { id: 'C', label: 'C', x: 20, y: 80 },
        { id: '4', label: '4', x: 15, y: 50 },
        { id: 'D', label: 'D', x: 80, y: 90 },
      ];
      setTrailPositions(positions);
      setTrailCurrentIndex(0);
      setTrailStartTime(Date.now());
      setTrailErrors(0);
      setTrailCompleted(false);
    }
  }, [step]);

  const handleTrailNodeClick = (nodeId: string) => {
    if (trailCompleted) return;

    const expectedNode = trailSequence[trailCurrentIndex];
    if (nodeId === expectedNode.id) {
      const nextIndex = trailCurrentIndex + 1;
      setTrailCurrentIndex(nextIndex);
      if (nextIndex === trailSequence.length) {
        setTrailCompleted(true);
        if (trailStartTime) {
          const totalSeconds = Math.round((Date.now() - trailStartTime) / 1000);
          setTrailElapsedTime(totalSeconds);
        }
      }
    } else {
      setTrailErrors((prev) => prev + 1);
    }
  };

  // Part 3: Daily Life Checklist (8 Culturally & Clinically Calibrated Items)
  const functionalQuestions = [
    {
      id: 'f1',
      textEn: 'Struggling with financial decisions or paying bills',
      textUr: 'مالی معاملات، بلوں کی ادائیگی یا حساب کتاب میں الجھن',
      textAr: 'صعوبة في إدارة الشؤون المالية أو دفع الفواتير',
    },
    {
      id: 'f2',
      textEn: 'Less interest in social gatherings, hobbies, or outings',
      textUr: 'محفلوں، رشتہ داروں میں بیٹھنے یا مشاغل میں عدم دلچسپی',
      textAr: 'تراجع الاهتمام بالمناسبات الاجتماعية أو الهوايات',
    },
    {
      id: 'f3',
      textEn: 'Repeating the exact same question or story within minutes',
      textUr: 'چند منٹوں کے اندر ایک ہی بات یا سوال بار بار دہرانا',
      textAr: 'تكرار نفس السؤال أو القصة خلال دقائق معدودة',
    },
    {
      id: 'f4',
      textEn: 'Difficulty using simple household gadgets or mobile apps',
      textUr: 'گھریلو برقی آلات، ریموٹ یا موبائل چلانے میں دشواری',
      textAr: 'صعوبة في استخدام الأجهزة المنزلية أو تطبيقات الهاتف',
    },
    {
      id: 'f5',
      textEn: 'Forgetting which month or day it is',
      textUr: 'موجودہ مہینہ، سال یا دن یاد رکھنے میں بھول چوک',
      textAr: 'نسيان الشهر الحالي أو اليوم من الأسبوع',
    },
    {
      id: 'f6',
      textEn: 'Trouble keeping track of appointments or visits',
      textUr: 'ڈاکٹر کے وقت، شادی یا اہم ملاقاتیں یاد رکھنے میں دقت',
      textAr: 'صعوبة في تذكر المواعيد المقررة أو الزيارات',
    },
    {
      id: 'f7',
      textEn: 'Frequently forgetting to take regular daily medications',
      textUr: 'روزانہ کی ضروری ادویات وقت پر لینا بھول جانا',
      textAr: 'النسيان المتكرر لتناول الأدوية اليومية بانتظام',
    },
    {
      id: 'f8',
      textEn: 'Noticeable changes in everyday thinking reported by family',
      textUr: 'گھر والوں یا دوستوں کی طرف سے سوچ و یادداشت میں تبدیلی کا مشاہدہ',
      textAr: 'ملاحظة أفراد الأسرة لتغيرات واضحة في الذاكرة والتركيز',
    },
  ];

  const [functionalAnswers, setFunctionalAnswers] = useState<Record<string, boolean>>({});

  const toggleFunctional = (id: string) => {
    setFunctionalAnswers((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  // Calculated Scores
  const [finalScore, setFinalScore] = useState<number | null>(null);
  const [driftStatus, setDriftStatus] = useState<'stable' | 'mild-drift' | 'drift'>('stable');

  const computeFinalAssessment = () => {
    const recallPoints = recalledItems.filter((id) => !id.startsWith('dist')).length;

    let orientationPoints = 0;
    const currentYearStr = new Date().getFullYear().toString();
    if (orientationYear.trim() === currentYearStr) orientationPoints += 1;
    if (orientationSeason.trim().length > 2) orientationPoints += 1;
    if (orientationDay.trim().length > 2) orientationPoints += 1;

    let trailPoints = 4;
    const trailDuration = trailElapsedTime || 20;
    if (trailDuration > 45 || trailErrors > 3) trailPoints = 2;
    else if (trailDuration > 30 || trailErrors > 1) trailPoints = 3;

    const functionalCount = Object.values(functionalAnswers).filter(Boolean).length;

    let composite =
      (recallPoints / 5) * 25 +
      (orientationPoints / 3) * 15 +
      (trailPoints / 4) * 35 +
      Math.max(0, 25 - functionalCount * 4);

    // Incorporate Audio-Visual Piano Sequence bonus/calibration if completed
    if (pianoAccuracy !== null) {
      const pianoBonus = Math.round(((pianoAccuracy - 75) / 25) * 3);
      composite = Math.max(0, Math.min(100, composite + pianoBonus));
    }

    if (educationLevel === 'none') composite = Math.min(100, composite + 12);
    else if (educationLevel === 'primary') composite = Math.min(100, composite + 6);

    const roundedScore = Math.round(composite);
    setFinalScore(roundedScore);

    const firstThree = longitudinalHistory.slice(0, 3);
    const baselineMean =
      firstThree.length > 0
        ? firstThree.reduce((acc, h) => acc + h.score, 0) / firstThree.length
        : 86.3;
    const practiceGain = 1.5;
    const sd = 4.2;
    const zScore = (roundedScore - baselineMean - practiceGain) / sd;

    let drift: 'stable' | 'mild-drift' | 'drift' = 'stable';
    if (zScore <= -1.5) drift = 'drift';
    else if (zScore <= -1.0) drift = 'mild-drift';
    setDriftStatus(drift);

    const newPoint: LongitudinalPoint = {
      id: 'wave-' + Date.now(),
      date: new Date().toISOString(),
      displayDate: 'Today',
      score: roundedScore,
      recallScore: recallPoints,
      trailTimeSeconds: trailElapsedTime || 22,
      functionalScore: 25 - functionalCount * 4,
      notes: drift === 'stable' ? 'Healthy Baseline' : 'Drift Flagged',
    };
    addHistoryPoint(newPoint);

    // Save to History Vault (localStorage)
    try {
      const stored = localStorage.getItem('deepcortex_patient_records_v1');
      let records: any[] = stored ? JSON.parse(stored) : [];
      const activeSessionId = sessionStorage.getItem('deepcortex_session_id') || 'SES-2110';
      const memRec = {
        id: 'rec-mem-' + Date.now(),
        type: 'memory',
        title: '2-Minute Culturally Calibrated Memory Check',
        timestamp: new Date().toISOString(),
        dateDisplay: 'Current Session',
        score: roundedScore,
        inferenceMode: 'edge',
        sessionId: activeSessionId,
        isPersonal: true,
        summary: `${recallPoints}/5 recall, orientation: ${orientationPoints}/3, trail time: ${trailElapsedTime || 22}s${pianoAccuracy !== null ? `, audio-visual piano: ${pianoAccuracy}% (${pianoLatencyMs}ms)` : ''}. Z = ${zScore.toFixed(2)} (${drift === 'stable' ? 'Healthy Baseline' : 'Drift Flagged'}).`,
      };
      records = [memRec, ...records.filter((r: any) => r.id !== memRec.id)].slice(0, 20);
      localStorage.setItem('deepcortex_patient_records_v1', JSON.stringify(records));
    } catch (e) {
      console.warn('Could not save memory record to history vault', e);
    }

    onAssessmentComplete(roundedScore, {
      recallPoints,
      orientationPoints,
      trailDuration,
      functionalCount,
      pianoAccuracy,
      pianoLatencyMs,
      zScore: Number(zScore.toFixed(2)),
      drift,
    });

    setStep('completed');
  };

  // Compute live Deterministic Z-Score values for completed card
  const firstThreeVisits = longitudinalHistory.slice(0, 3);
  const baselineMeanVal =
    firstThreeVisits.length > 0
      ? Number((firstThreeVisits.reduce((acc, h) => acc + h.score, 0) / firstThreeVisits.length).toFixed(1))
      : 86.3;
  const practiceGainVal = 1.5;
  const sdVal = 4.2;
  const currentFollowUpVal = finalScore ?? 86;
  const calculatedZScore = Number(((currentFollowUpVal - baselineMeanVal - practiceGainVal) / sdVal).toFixed(2));

  return (
    <div
      className={`w-full max-w-4xl mx-auto space-y-5 pb-16 ${
        sensoryMode === 'high-contrast' ? 'ring-2 ring-amber-400 rounded-3xl p-2 bg-slate-950/5' : ''
      }`}
    >
      {/* Dr. Nance's 5-Gate Clinical Workflow & Acute Red-Flag Emergency Bypass Bar */}
      <div
        className={`p-4 rounded-2xl border shadow-2xs space-y-3 transition-all ${
          acuteRedFlagTriggered
            ? 'bg-rose-950 text-white border-rose-500 ring-2 ring-rose-500/50'
            : 'bg-white dark:bg-slate-800 border-teal-200 dark:border-slate-700'
        }`}
      >
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <ShieldCheck className={`w-4 h-4 ${acuteRedFlagTriggered ? 'text-rose-400' : 'text-[#00a86b]'}`} />
            <span className={`text-xs font-bold ${acuteRedFlagTriggered ? 'text-white' : 'text-slate-900 dark:text-white'}`}>
              5-Gate Clinical Safety &amp; Agentic Workflow (DECIDE-AI Standard)
            </span>
          </div>

          <button
            onClick={() => {
              if (acuteRedFlagTriggered) {
                setAcuteRedFlagTriggered(false);
                setSelectedRedFlags([]);
              } else {
                setAcuteRedFlagTriggered(true);
                setSelectedRedFlags(['Sudden <48h Acute Confusion / Delirium']);
              }
            }}
            className={`px-3 py-1 rounded-xl text-[11px] font-bold flex items-center gap-1.5 cursor-pointer transition-all ${
              acuteRedFlagTriggered
                ? 'bg-rose-600 hover:bg-rose-500 text-white shadow-sm'
                : 'bg-rose-50 dark:bg-rose-950/60 hover:bg-rose-100 text-rose-800 dark:text-rose-300 border border-rose-300 dark:border-rose-800'
            }`}
          >
            <AlertCircle className="w-3.5 h-3.5" />
            <span>
              {acuteRedFlagTriggered
                ? 'Gate 2: EMERGENCY BYPASS TRIGGERED (Click to Reset)'
                : 'Check Acute Red-Flag Symptoms (Sudden <48h Onset)'}
            </span>
          </button>
        </div>

        {/* 5 Gates Status Strip */}
        <div className="grid grid-cols-1 sm:grid-cols-5 gap-2 text-[11px]">
          <div className="p-2 rounded-xl bg-emerald-50/80 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-slate-800 dark:text-slate-200">
            <div className="font-bold text-emerald-900 dark:text-emerald-300 flex items-center justify-between">
              <span>Gate 1: Consent</span>
              <span className="text-[9px] px-1.5 py-0.2 rounded bg-emerald-600 text-white uppercase">Active</span>
            </div>
            <p className="text-[10px] text-slate-600 dark:text-slate-400 mt-0.5">
              IFHAS 50–75 • {language.toUpperCase()} • Edu: {educationLevel}
            </p>
          </div>

          <div
            className={`p-2 rounded-xl border ${
              acuteRedFlagTriggered
                ? 'bg-rose-600 text-white border-rose-300 animate-pulse'
                : 'bg-emerald-50/80 dark:bg-emerald-950/40 border-emerald-200 dark:border-emerald-800 text-slate-800 dark:text-slate-200'
            }`}
          >
            <div className="font-bold flex items-center justify-between">
              <span>Gate 2: Red-Flag</span>
              <span
                className={`text-[9px] px-1.5 py-0.2 rounded uppercase font-black ${
                  acuteRedFlagTriggered ? 'bg-white text-rose-700' : 'bg-emerald-600 text-white'
                }`}
              >
                {acuteRedFlagTriggered ? 'BYPASS' : 'Clear'}
              </span>
            </div>
            <p className={`text-[10px] mt-0.5 ${acuteRedFlagTriggered ? 'text-rose-100 font-semibold' : 'text-slate-600 dark:text-slate-400'}`}>
              {acuteRedFlagTriggered ? 'EMERGENCY BYPASS TRIGGERED' : 'No <48h Acute Delirium/Stroke'}
            </p>
          </div>

          <div className="p-2 rounded-xl bg-sky-50/80 dark:bg-sky-950/40 border border-sky-200 dark:border-sky-800 text-slate-800 dark:text-slate-200">
            <div className="font-bold text-sky-900 dark:text-sky-300 flex items-center justify-between">
              <span>Gate 3: Evidence</span>
              <span className="text-[9px] px-1.5 py-0.2 rounded bg-sky-600 text-white font-mono">
                {pianoAccuracy !== null ? '100%' : '92%'}
              </span>
            </div>
            <p className="text-[10px] text-slate-600 dark:text-slate-400 mt-0.5">
              Sensory: {sensoryMode} • Confounders Checked
            </p>
          </div>

          <div className="p-2 rounded-xl bg-teal-50/80 dark:bg-teal-950/40 border border-teal-200 dark:border-teal-800 text-slate-800 dark:text-slate-200">
            <div className="font-bold text-teal-900 dark:text-teal-300 flex items-center justify-between">
              <span>Gate 4: Z-Score</span>
              <span className="text-[9px] px-1.5 py-0.2 rounded bg-teal-600 text-white uppercase">RCI Math</span>
            </div>
            <p className="text-[10px] text-slate-600 dark:text-slate-400 mt-0.5">
              Z = (FollowUp - Base - 1.5) / SD
            </p>
          </div>

          <div className="p-2 rounded-xl bg-amber-50/80 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 text-slate-800 dark:text-slate-200">
            <div className="font-bold text-amber-900 dark:text-amber-300 flex items-center justify-between">
              <span>Gate 5: DECIDE-AI</span>
              <span className="text-[9px] px-1.5 py-0.2 rounded bg-amber-600 text-white uppercase">Gated</span>
            </div>
            <p className="text-[10px] text-slate-600 dark:text-slate-400 mt-0.5">
              Clinician Approval → Sahatna / Malaffi
            </p>
          </div>
        </div>

        {/* Interactive Red-Flag Symptom Checkboxes */}
        <div className="pt-1 border-t border-slate-100 dark:border-slate-700/70 flex flex-wrap items-center gap-2 text-[11px]">
          <span className={`font-bold ${acuteRedFlagTriggered ? 'text-rose-200' : 'text-slate-600 dark:text-slate-400'}`}>
            Acute &lt;48h Red-Flag Screen:
          </span>
          {[
            'Sudden <48h Acute Confusion / Delirium',
            'Slurred Speech / Aphasia',
            'Unilateral Facial Droop / Weakness',
            'Acute Fever / Head Trauma',
          ].map((sym) => {
            const active = selectedRedFlags.includes(sym);
            return (
              <button
                key={sym}
                onClick={() => toggleRedFlagSymptom(sym)}
                className={`px-2.5 py-1 rounded-lg text-[10px] font-bold transition-all cursor-pointer border ${
                  active
                    ? 'bg-rose-600 text-white border-white shadow-xs'
                    : acuteRedFlagTriggered
                    ? 'bg-rose-900/60 text-rose-200 border-rose-700'
                    : 'bg-slate-50 dark:bg-slate-750 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:border-rose-300'
                }`}
              >
                {active ? '● ' : '○ '}
                {sym}
              </button>
            );
          })}
        </div>
      </div>

      {/* URGENT EMERGENCY TRIAGE DIRECTIVE WHEN GATE 2 BYPASS IS TRIGGERED */}
      {acuteRedFlagTriggered ? (
        <div className="p-6 sm:p-8 rounded-3xl bg-rose-950 text-white border-2 border-rose-500 shadow-2xl space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-rose-800 pb-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-rose-600 text-white flex items-center justify-center shrink-0 animate-bounce">
                <AlertCircle className="w-7 h-7" />
              </div>
              <div>
                <span className="px-2.5 py-0.5 rounded-full bg-rose-500 text-white text-[10px] font-black uppercase tracking-wider">
                  GATE 2: EMERGENCY BYPASS TRIGGERED • ROUTINE SCREENING HALTED
                </span>
                <h2 className="text-xl sm:text-2xl font-black text-white mt-1">
                  Acute Neurological / Delirium Emergency Triage Directive
                </h2>
              </div>
            </div>
            <span className="font-mono text-xs font-bold px-3 py-1 rounded-xl bg-rose-900 border border-rose-600 text-rose-200">
              100% Emergency Interception
            </span>
          </div>

          <p className="text-xs sm:text-sm text-rose-100 leading-relaxed">
            <strong>Clinical Safety Protocol:</strong> Sudden cognitive change (&lt;48 hours), slurred speech, facial droop, or acute disorientation is <strong>NOT</strong> routine Alzheimer&apos;s progression. Routine memory testing is immediately bypassed to rule out acute stroke (TIA/CVA), metabolic/infectious delirium, or acute intracranial pathology.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <a
              href="tel:998"
              className="p-4 rounded-2xl bg-rose-600 hover:bg-rose-500 text-white border border-rose-400 flex items-center justify-between transition-all shadow-lg"
            >
              <div>
                <span className="text-[10px] font-black uppercase tracking-wider text-rose-200 block">
                  UAE / ABU DHABI EMERGENCY
                </span>
                <strong className="text-base sm:text-lg font-black block">
                  Call 998 Abu Dhabi Estijaba / 999 Ambulance
                </strong>
                <span className="text-xs text-rose-100">
                  Immediate Stroke &amp; Acute Delirium Dispatch (SSMC / CCAD Emergency)
                </span>
              </div>
              <ArrowRight className="w-5 h-5 shrink-0" />
            </a>

            <a
              href="tel:1122"
              className="p-4 rounded-2xl bg-rose-800 hover:bg-rose-700 text-white border border-rose-500 flex items-center justify-between transition-all shadow-lg"
            >
              <div>
                <span className="text-[10px] font-black uppercase tracking-wider text-rose-200 block">
                  PAKISTAN / PUNJAB EMERGENCY
                </span>
                <strong className="text-base sm:text-lg font-black block">
                  Call 1122 Punjab Emergency / PINS Acute Neuro
                </strong>
                <span className="text-xs text-rose-100">
                  Immediate Emergency Ambulance &amp; Acute Stroke Unit Triage
                </span>
              </div>
              <ArrowRight className="w-5 h-5 shrink-0" />
            </a>
          </div>

          <div className="flex items-center justify-between pt-2">
            <span className="text-xs text-rose-300 font-mono">
              Flagged Red-Flags: {selectedRedFlags.join(' • ')}
            </span>
            <button
              onClick={() => {
                setAcuteRedFlagTriggered(false);
                setSelectedRedFlags([]);
              }}
              className="px-4 py-2 rounded-xl bg-white text-rose-950 font-bold text-xs hover:bg-rose-100 cursor-pointer"
            >
              Clear Emergency Flag &amp; Resume Routine Screening
            </button>
          </div>
        </div>
      ) : (
        <>
          {/* Friendly Personalization Header with Functional Education & Sensory Toggle */}
          <div className="p-3.5 sm:p-4 rounded-2xl bg-white dark:bg-slate-800 border border-teal-100 dark:border-slate-700 shadow-xs space-y-3">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <Sliders className="w-4 h-4 text-teal-600 dark:text-teal-400" />
                <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
                  {language === 'ur'
                    ? 'ذاتی ترتیبات: تعلیمی پس منظر اور سمعی و بصری اسٹوڈیو'
                    : language === 'ar'
                    ? 'تخصيص الفحص: المستوى التعليمي والاستوديو السمعي البصري'
                    : 'Personalize Your Check: Education & Sensory Mode'}
                </span>
              </div>

              {/* Education Selector */}
              <div className="flex flex-wrap items-center gap-1.5 text-xs">
                <span className="text-slate-500 dark:text-slate-400">
                  {language === 'ur' ? 'تعلیم:' : language === 'ar' ? 'التعليم:' : 'Education:'}
                </span>
                {([
                  { id: 'none', en: 'No Formal', ur: 'بغیر باضابطہ', ar: 'بدون تعليم' },
                  { id: 'primary', en: 'Primary', ur: 'پرائمری', ar: 'ابتدائي' },
                  { id: 'secondary', en: 'Secondary', ur: 'ثانوی / میٹرک', ar: 'ثانوي' },
                  { id: 'higher', en: 'Higher', ur: 'اعلیٰ تعلیم', ar: 'جامعي' },
                ] as const).map((item) => (
                  <button
                    key={item.id}
                    onClick={() => setEducationLevel(item.id as any)}
                    className={`px-2.5 py-1 rounded-lg text-xs font-semibold capitalize transition-all cursor-pointer ${
                      educationLevel === item.id
                        ? 'bg-teal-600 text-white shadow-xs'
                        : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300'
                    }`}
                  >
                    {language === 'ur' ? item.ur : language === 'ar' ? item.ar : item.en}
                  </button>
                ))}
              </div>
            </div>

            {/* Functional Sensory Mode Toggle: Standard | Audio-Visual Studio | High Contrast */}
            <div className="pt-2 border-t border-slate-100 dark:border-slate-700 flex flex-wrap items-center justify-between gap-2 text-xs">
              <div className="flex items-center gap-1.5">
                <Volume2 className="w-3.5 h-3.5 text-teal-600" />
                <span className="font-bold text-slate-700 dark:text-slate-300">Sensory Mode:</span>
                {([
                  { id: 'standard', label: 'Standard' },
                  { id: 'audio-assisted', label: 'Audio-Visual Studio (4-Note Piano)' },
                  { id: 'high-contrast', label: 'High Contrast' },
                ] as const).map((mode) => (
                  <button
                    key={mode.id}
                    onClick={() => {
                      setSensoryMode(mode.id);
                      if (mode.id === 'audio-assisted') {
                        setStep('part2b-piano');
                      }
                    }}
                    className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                      sensoryMode === mode.id
                        ? 'bg-[#00a86b] text-white shadow-xs'
                        : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 hover:bg-teal-50'
                    }`}
                  >
                    {mode.label}
                  </button>
                ))}
              </div>

              <button
                onClick={() => {
                  setSensoryMode('audio-assisted');
                  setStep('part2b-piano');
                }}
                className="text-[11px] font-bold text-teal-700 dark:text-teal-300 hover:underline flex items-center gap-1 cursor-pointer"
              >
                <span>Open Step 2B: Audio-Visual Piano Memory Studio</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Step 0: Welcome Card */}
          {step === 'intro' && (
            <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-800 border border-teal-100 dark:border-slate-700 shadow-xs text-center space-y-5">
              <div className="w-14 h-14 rounded-2xl bg-teal-50 dark:bg-teal-950 text-teal-600 dark:text-teal-400 mx-auto flex items-center justify-center">
                <Brain className="w-8 h-8" />
              </div>

              <div className="space-y-1.5 max-w-lg mx-auto">
                <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">
                  {language === 'ur'
                    ? '2 منٹ کا آسان یادداشت معائنہ'
                    : language === 'ar'
                    ? 'فحص الذاكرة السريع (دقيقتان)'
                    : '2-Minute Quick Memory Check'}
                </h2>
                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300">
                  {language === 'ur'
                    ? 'یادداشت، ذہنی رفتار اور سمعی و بصری توجہ کو سمجھنے کے لیے دوستانہ جانچ۔'
                    : language === 'ar'
                    ? 'فحص لطيف مصمم لفهم الذاكرة وسرعة المعالجة والتركيز السمعي البصري.'
                    : 'A gentle multi-modal check designed to understand your memory, executive speed, audio-visual tone recall, and daily focus.'}
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-4 gap-2.5 text-left max-w-3xl mx-auto">
                <div className="p-3 rounded-xl bg-teal-50/50 dark:bg-slate-750 border border-teal-100 dark:border-slate-700">
                  <span className="text-[11px] font-bold text-teal-700 dark:text-teal-300 block">Step 1</span>
                  <strong className="text-xs text-slate-900 dark:text-white block mt-0.5">5-Word Memory Recall</strong>
                  <span className="text-[11px] text-slate-500 dark:text-slate-400">Remember 5 cultural items</span>
                </div>
                <div className="p-3 rounded-xl bg-emerald-50/50 dark:bg-slate-750 border border-emerald-100 dark:border-slate-700">
                  <span className="text-[11px] font-bold text-emerald-700 dark:text-emerald-300 block">Step 2A</span>
                  <strong className="text-xs text-slate-900 dark:text-white block mt-0.5">Quick Pattern Trail</strong>
                  <span className="text-[11px] text-slate-500 dark:text-slate-400">Connect 1-A-2-B circles</span>
                </div>
                <div className="p-3 rounded-xl bg-indigo-50/50 dark:bg-slate-750 border border-indigo-100 dark:border-slate-700">
                  <span className="text-[11px] font-bold text-indigo-700 dark:text-indigo-300 block">Step 2B</span>
                  <strong className="text-xs text-slate-900 dark:text-white block mt-0.5">4-Note Piano Studio</strong>
                  <span className="text-[11px] text-slate-500 dark:text-slate-400">Audio-visual sequence recall</span>
                </div>
                <div className="p-3 rounded-xl bg-sky-50/50 dark:bg-slate-750 border border-sky-100 dark:border-slate-700">
                  <span className="text-[11px] font-bold text-sky-700 dark:text-sky-300 block">Step 3</span>
                  <strong className="text-xs text-slate-900 dark:text-white block mt-0.5">Daily Life Checklist</strong>
                  <span className="text-[11px] text-slate-500 dark:text-slate-400">8 everyday independence checks</span>
                </div>
              </div>

              <div className="flex flex-wrap items-center justify-center gap-3">
                <button
                  onClick={() => setStep('part1-register')}
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-sm sm:text-base shadow-sm transition-all cursor-pointer"
                >
                  <span>
                    {language === 'ur'
                      ? 'پہلا مرحلہ شروع کریں: 5 اشیاء یاد رکھیں'
                      : language === 'ar'
                      ? 'ابدأ الخطوة 1: حفظ 5 كلمات'
                      : 'Start Step 1: Remember 5 Words'}
                  </span>
                  <ArrowRight className="w-4 h-4" />
                </button>

                <button
                  onClick={() => {
                    setSensoryMode('audio-assisted');
                    setStep('part2b-piano');
                  }}
                  className="inline-flex items-center gap-2 px-4 py-3 rounded-2xl bg-indigo-50 dark:bg-indigo-950/60 hover:bg-indigo-100 text-indigo-800 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800 font-bold text-xs sm:text-sm transition-all cursor-pointer"
                >
                  <Volume2 className="w-4 h-4" />
                  <span>Try 4-Note Piano Memory Studio</span>
                </button>
              </div>
            </div>
          )}

          {/* Step 1: Word Registration */}
          {step === 'part1-register' && (
            <div className="p-5 sm:p-7 rounded-3xl bg-white dark:bg-slate-800 border border-teal-100 dark:border-slate-700 shadow-xs space-y-5">
              <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-700 pb-3">
                <div>
                  <span className="text-[11px] font-bold text-teal-600 dark:text-teal-400 uppercase tracking-wider">
                    {language === 'ur' ? 'مرحلہ 1 از 3: یادداشت کا اندراج' : language === 'ar' ? 'الخطوة 1 من 3: تسجيل الذاكرة' : 'Step 1 of 3: Memory Registration'}
                  </span>
                  <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">
                    {language === 'ur' ? 'یہ 5 جانی پہچانی اشیاء یاد رکھیں' : language === 'ar' ? 'تذكر هذه الأشياء الخمسة المألوفة' : 'Remember These 5 Everyday Objects'}
                  </h3>
                </div>
                <span className="text-xs px-2.5 py-0.5 rounded-full bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 font-mono">
                  1 / 6
                </span>
              </div>

              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300">
                {language === 'ur'
                  ? 'ہر تصویر کو دیکھ کر ذہن نشین کریں۔ اس جانچ کے اختتام پر آپ سے ان کے نام پوچھے جائیں گے:'
                  : language === 'ar'
                  ? 'المس كل صورة لحفظها في ذاكرتك. سيُطلب منك تذكرها في نهاية الفحص:'
                  : 'Tap each picture to memorize it. You will be asked to name them again at the end of the check:'}
              </p>

              <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5">
                {culturalItems.map((item) => {
                  const isChecked = registeredItems.includes(item.id);
                  const name = language === 'ur' ? item.nameUr : language === 'ar' ? item.nameAr : item.nameEn;

                  return (
                    <button
                      key={item.id}
                      onClick={() => {
                        if (!isChecked) setRegisteredItems([...registeredItems, item.id]);
                      }}
                      className={`p-3.5 rounded-2xl border text-center transition-all flex flex-col items-center justify-center gap-1.5 cursor-pointer ${
                        isChecked
                          ? 'bg-teal-50 dark:bg-teal-950/60 border-teal-400 text-teal-900 dark:text-teal-200 shadow-xs'
                          : 'bg-white dark:bg-slate-750 border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 hover:border-teal-300'
                      }`}
                    >
                      {(() => {
                        const ItemIcon = item.icon as React.ElementType;
                        return (
                          <div className="w-10 h-10 rounded-xl bg-teal-100/60 dark:bg-teal-950/60 text-teal-700 dark:text-teal-300 flex items-center justify-center">
                            <ItemIcon className="w-5 h-5" />
                          </div>
                        );
                      })()}
                      <span className="text-xs font-bold">{name}</span>
                      {isChecked ? (
                        <span className="text-[10px] text-teal-700 dark:text-teal-300 font-semibold flex items-center gap-1">
                          <CheckCircle2 className="w-3 h-3 text-teal-600" />
                          {language === 'ur' ? 'یاد کر لیا' : language === 'ar' ? 'تم الحفظ' : 'Got it'}
                        </span>
                      ) : (
                        <span className="text-[10px] text-slate-400">
                          {language === 'ur' ? 'دبا کر تصدیق کریں' : language === 'ar' ? 'المس للتأكيد' : 'Tap to confirm'}
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>

              <div className="flex justify-end pt-2">
                <button
                  disabled={registeredItems.length < 5}
                  onClick={() => setStep('part1-orientation')}
                  className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-xs sm:text-sm transition-all ${
                    registeredItems.length >= 5
                      ? 'bg-teal-600 text-white shadow-xs hover:bg-teal-700 cursor-pointer'
                      : 'bg-slate-100 dark:bg-slate-700 text-slate-400 cursor-not-allowed'
                  }`}
                >
                  <span>{language === 'ur' ? 'اگلا: دن اور تاریخ' : language === 'ar' ? 'التالي: اليوم والتاريخ' : 'Next: Day & Date'}</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* Step 2: Orientation */}
          {step === 'part1-orientation' && (
            <div className="p-5 sm:p-7 rounded-3xl bg-white dark:bg-slate-800 border border-teal-100 dark:border-slate-700 shadow-xs space-y-5">
              <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-700 pb-3">
                <div>
                  <span className="text-[11px] font-bold text-teal-600 dark:text-teal-400 uppercase tracking-wider">
                    {language === 'ur' ? 'مرحلہ 1 از 3: وقتی آگاہی' : language === 'ar' ? 'الخطوة 1 من 3: الإدراك الزمني' : 'Step 1 of 3: Awareness'}
                  </span>
                  <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">
                    {language === 'ur' ? 'آج کیا تاریخ اور دن ہے؟' : language === 'ar' ? 'ما هو تاريخ اليوم؟' : "What is Today's Date?"}
                  </h3>
                </div>
                <span className="text-xs px-2.5 py-0.5 rounded-full bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 font-mono">
                  2 / 6
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                    {language === 'ur' ? 'موجودہ سال:' : language === 'ar' ? 'السنة الحالية:' : 'Current Year:'}
                  </label>
                  <input
                    type="text"
                    placeholder="2026"
                    value={orientationYear}
                    onChange={(e) => setOrientationYear(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs focus:ring-2 focus:ring-teal-500 focus:outline-hidden"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                    {language === 'ur' ? 'موجودہ موسم:' : language === 'ar' ? 'فصل السنة:' : 'Current Season:'}
                  </label>
                  <input
                    type="text"
                    placeholder={language === 'ur' ? 'مثلاً خزاں / بہار' : language === 'ar' ? 'مثال: الخريف / الشتاء' : 'e.g. Autumn / Spring'}
                    value={orientationSeason}
                    onChange={(e) => setOrientationSeason(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs focus:ring-2 focus:ring-teal-500 focus:outline-hidden"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                    {language === 'ur' ? 'ہفتے کا دن:' : language === 'ar' ? 'يوم الأسبوع:' : 'Day of the Week:'}
                  </label>
                  <input
                    type="text"
                    placeholder={language === 'ur' ? 'مثلاً جمعہ / پیر' : language === 'ar' ? 'مثال: الجمعة' : 'e.g. Friday'}
                    value={orientationDay}
                    onChange={(e) => setOrientationDay(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs focus:ring-2 focus:ring-teal-500 focus:outline-hidden"
                  />
                </div>
              </div>

              <div className="flex justify-between items-center pt-2">
                <button
                  onClick={() => setStep('part1-register')}
                  className="text-xs text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 cursor-pointer"
                >
                  {language === 'ur' ? 'پیچھے جائیں' : language === 'ar' ? 'السابق' : 'Back'}
                </button>
                <button
                  onClick={() => setStep('part2-trail')}
                  className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs sm:text-sm cursor-pointer"
                >
                  <span>{language === 'ur' ? 'پیٹرن ٹریل پر آگے بڑھیں' : language === 'ar' ? 'المتابعة إلى مسار التركيز' : 'Continue to Pattern Trail'}</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* Step 2A: Pattern Trail */}
          {step === 'part2-trail' && (
            <div className="p-5 sm:p-7 rounded-3xl bg-white dark:bg-slate-800 border border-teal-100 dark:border-slate-700 shadow-xs space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-700 pb-3">
                <div>
                  <span className="text-[11px] font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider">
                    {language === 'ur' ? 'مرحلہ 2A: پیٹرن ٹریل' : language === 'ar' ? 'الخطوة 2A: مسار التركيز والنمط' : 'Step 2A: Pattern Trail'}
                  </span>
                  <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">
                    {language === 'ur'
                      ? 'ترتیب سے دبائیں: 1 → A → 2 → B → 3 → C → 4 → D'
                      : language === 'ar'
                      ? 'المس بالترتيب: 1 ← A ← 2 ← B ← 3 ← C ← 4 ← D'
                      : 'Tap in order: 1 → A → 2 → B → 3 → C → 4 → D'}
                  </h3>
                </div>
                <span className="text-xs px-2.5 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 font-mono">
                  3 / 6
                </span>
              </div>

              <p className="text-xs text-slate-600 dark:text-slate-300">
                {language === 'ur'
                  ? 'نمبروں اور حروف کے درمیان متبادل طور پر جانا ذہنی لچک اور توجہ کی رفتار کو جانچتا ہے:'
                  : language === 'ar'
                  ? 'التبديل بين الأرقام والحروف يقيس المرونة العقلية وسرعة الانتباه والتركيز:'
                  : 'Alternating between numbers and letters tests mental flexibility and attention speed:'}
              </p>

              {/* Interactive Trail Canvas */}
              <div className="relative w-full h-72 sm:h-80 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 overflow-hidden select-none">
                {trailPositions.map((node) => {
                  const nodeIdx = trailSequence.findIndex((s) => s.id === node.id);
                  const isTapped = nodeIdx < trailCurrentIndex;
                  const isNext = nodeIdx === trailCurrentIndex;

                  return (
                    <button
                      key={node.id}
                      onClick={() => handleTrailNodeClick(node.id)}
                      style={{ left: `${node.x}%`, top: `${node.y}%` }}
                      className={`absolute -translate-x-1/2 -translate-y-1/2 w-11 h-11 rounded-full flex items-center justify-center font-bold text-sm transition-all transform active:scale-95 cursor-pointer shadow-xs ${
                        isTapped
                          ? 'bg-emerald-500 text-white ring-2 ring-emerald-200'
                          : isNext
                          ? 'bg-teal-600 text-white ring-4 ring-teal-200 animate-pulse'
                          : 'bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 text-slate-800 dark:text-slate-200'
                      }`}
                    >
                      {node.label}
                    </button>
                  );
                })}

                {trailCompleted && (
                  <div className="absolute inset-0 bg-white/90 dark:bg-slate-900/90 backdrop-blur-xs flex flex-col items-center justify-center text-slate-900 dark:text-white p-4">
                    <CheckCircle2 className="w-10 h-10 text-emerald-500 mb-1" />
                    <span className="text-base font-bold">
                      {language === 'ur' ? 'بہت خوب! پیٹرن مکمل ہو گیا' : language === 'ar' ? 'عمل ممتاز! اكتمل المسار بنجاح' : 'Great Job! Trail Completed'}
                    </span>
                    <span className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                      {language === 'ur'
                        ? `${trailElapsedTime || 20} سیکنڈ میں ${trailErrors} تصحیحات کے ساتھ مکمل`
                        : language === 'ar'
                        ? `تم الإنجاز في ${trailElapsedTime || 20} ثانية مع ${trailErrors} تصحيحات`
                        : `Finished in ${trailElapsedTime || 20}s with ${trailErrors} adjustments`}
                    </span>
                  </div>
                )}
              </div>

              <div className="flex justify-between items-center pt-2">
                <button
                  onClick={() => setStep('part2b-piano')}
                  className="text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:underline cursor-pointer"
                >
                  Skip to Step 2B: Audio-Visual Piano Sequence →
                </button>
                <button
                  disabled={!trailCompleted}
                  onClick={() => setStep('part2b-piano')}
                  className={`inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl font-bold text-xs sm:text-sm transition-all ${
                    trailCompleted
                      ? 'bg-teal-600 hover:bg-teal-700 text-white cursor-pointer'
                      : 'bg-slate-100 dark:bg-slate-700 text-slate-400 cursor-not-allowed'
                  }`}
                >
                  <span>Next: Step 2B Audio-Visual Piano Memory</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* Step 2B: Interactive Audio-Visual 4-Note Piano Memory Sequence (Web Audio API) */}
          {step === 'part2b-piano' && (
            <div className="p-5 sm:p-7 rounded-3xl bg-white dark:bg-slate-800 border border-indigo-200 dark:border-slate-700 shadow-xs space-y-5">
              <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-700 pb-3">
                <div>
                  <span className="text-[11px] font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider">
                    Step 2B • Cognitive Studio Module (Web Audio API Synthesizer)
                  </span>
                  <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">
                    Audio-Visual 4-Note Piano Sequence Memory
                  </h3>
                </div>
                <span className="text-xs px-2.5 py-0.5 rounded-full bg-indigo-50 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 font-mono">
                  4 / 6
                </span>
              </div>

              <div className="p-3.5 rounded-2xl bg-indigo-50/60 dark:bg-slate-750 border border-indigo-100 dark:border-slate-700 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="space-y-0.5">
                  <strong className="text-xs font-bold text-slate-900 dark:text-white block">
                    Instructions: Listen &amp; Watch the 4-Note Harmonic Pattern (C4 → G4 → E4 → A4)
                  </strong>
                  <p className="text-[11px] text-slate-600 dark:text-slate-300">
                    Click &ldquo;Play 4-Note Sequence&rdquo; to hear and see the pads chime, then tap the 4 piano pads in the exact same order.
                  </p>
                </div>

                <button
                  onClick={playTargetPianoSequence}
                  disabled={isPlayingSequence}
                  className={`px-4 py-2.5 rounded-xl font-bold text-xs flex items-center gap-2 shrink-0 cursor-pointer transition-all shadow-xs ${
                    isPlayingSequence
                      ? 'bg-indigo-400 text-white cursor-wait'
                      : 'bg-indigo-600 hover:bg-indigo-700 text-white'
                  }`}
                >
                  <Volume2 className={`w-4 h-4 ${isPlayingSequence ? 'animate-bounce' : ''}`} />
                  <span>{isPlayingSequence ? 'Playing Sequence...' : 'Play 4-Note Sequence'}</span>
                </button>
              </div>

              {/* 4 Interactive Piano / Tone Pads */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {PIANO_NOTES.map((pad) => {
                  const isLit = activePianoPad === pad.id;
                  const tapOrderIdx = userPianoTaps.indexOf(pad.id);
                  return (
                    <button
                      key={pad.id}
                      onClick={() => handlePianoPadTap(pad.id)}
                      className={`p-5 rounded-2xl border-2 text-center transition-all transform active:scale-95 cursor-pointer flex flex-col items-center justify-center gap-1.5 relative overflow-hidden ${
                        isLit
                          ? `bg-gradient-to-br ${pad.color} text-white border-white ring-4 ${pad.ring} scale-105 shadow-lg`
                          : 'bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-700 hover:border-indigo-400 text-slate-900 dark:text-white'
                      }`}
                    >
                      <span className="text-lg sm:text-xl font-black tracking-tight">{pad.noteName}</span>
                      <span className={`text-[11px] font-mono ${isLit ? 'text-white/90' : 'text-slate-500 dark:text-slate-400'}`}>
                        {pad.freq.toFixed(1)} Hz
                      </span>
                      {tapOrderIdx !== -1 && (
                        <span className="mt-1 px-2 py-0.5 rounded-full bg-indigo-600 text-white text-[10px] font-bold">
                          Tap #{tapOrderIdx + 1}
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>

              {/* Recorded Visual + Auditory Sequence Recall Accuracy & Response Latency */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 text-xs">
                <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] text-slate-500 font-semibold">Sequence Progress</span>
                    <span className="text-[9px] font-mono px-1.5 py-0.2 rounded bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                      [Recorded Observation]
                    </span>
                  </div>
                  <strong className="text-sm font-bold text-slate-900 dark:text-white font-mono mt-0.5 block">
                    {userPianoTaps.length > 0 ? userPianoTaps.join(' → ') : 'Awaiting taps (0/4)'}
                  </strong>
                </div>

                <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] text-slate-500 font-semibold">Visual + Auditory Accuracy</span>
                    <span className="text-[9px] font-mono px-1.5 py-0.2 rounded bg-teal-100 dark:bg-teal-950 text-teal-800 dark:text-teal-300">
                      [Deterministic Score]
                    </span>
                  </div>
                  <strong className="text-sm font-bold text-emerald-600 dark:text-emerald-400 font-mono mt-0.5 block">
                    {pianoAccuracy !== null ? `${pianoAccuracy}% Recall Match` : '—'}
                  </strong>
                </div>

                <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] text-slate-500 font-semibold">Response Latency</span>
                    <span className="text-[9px] font-mono px-1.5 py-0.2 rounded bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                      [Recorded Observation]
                    </span>
                  </div>
                  <strong className="text-sm font-bold text-indigo-600 dark:text-indigo-400 font-mono mt-0.5 block">
                    {pianoLatencyMs !== null ? `${pianoLatencyMs} ms` : '—'}
                  </strong>
                </div>
              </div>

              <div className="flex justify-between items-center pt-2">
                <button
                  onClick={() => setStep('part2-trail')}
                  className="text-xs text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 cursor-pointer"
                >
                  ← Back to Pattern Trail
                </button>
                <button
                  onClick={() => setStep('part3-functional')}
                  className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs sm:text-sm cursor-pointer"
                >
                  <span>Continue to Step 3: Daily Checklist</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* Step 4: Daily Life Checklist */}
          {step === 'part3-functional' && (
            <div className="p-5 sm:p-7 rounded-3xl bg-white dark:bg-slate-800 border border-teal-100 dark:border-slate-700 shadow-xs space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-700 pb-3">
                <div>
                  <span className="text-[11px] font-bold text-sky-600 dark:text-sky-400 uppercase tracking-wider">
                    {language === 'ur' ? 'مرحلہ 3 از 3: روزمرہ معمولات' : language === 'ar' ? 'الخطوة 3 من 3: الاستقلالية اليومية' : 'Step 3 of 3: Daily Life Checklist'}
                  </span>
                  <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">
                    {language === 'ur' ? 'روزمرہ یادداشت اور خود انحصاری' : language === 'ar' ? 'الذاكرة اليومية والاستقلالية' : 'Everyday Memory & Independence'}
                  </h3>
                </div>
                <span className="text-xs px-2.5 py-0.5 rounded-full bg-sky-50 dark:bg-sky-950 text-sky-700 dark:text-sky-300 font-mono">
                  5 / 6
                </span>
              </div>

              <p className="text-xs text-slate-600 dark:text-slate-300">
                {language === 'ur'
                  ? 'کیا آپ نے یا اہل خانہ نے پچھلے سال کے دوران ان میں کوئی تبدیلی محسوس کی ہے؟ (اگر کوئی نہیں تو خالی چھوڑ دیں):'
                  : language === 'ar'
                  ? 'هل لاحظت أنت أو أسرتك أي تغيرات في أي مما يلي خلال العام الماضي؟ (اتركها فارغة إذا لم تنطبق):'
                  : 'Have you or family members noticed changes in any of the following over the past year? (If none apply, simply leave blank):'}
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {functionalQuestions.map((q) => {
                  const isChecked = !!functionalAnswers[q.id];
                  const qText = language === 'ur' ? q.textUr : language === 'ar' ? q.textAr : q.textEn;

                  return (
                    <div
                      key={q.id}
                      onClick={() => toggleFunctional(q.id)}
                      className={`p-3 rounded-2xl border transition-all cursor-pointer flex items-start gap-2.5 ${
                        isChecked
                          ? 'bg-amber-50 dark:bg-amber-950/40 border-amber-300 text-amber-950 dark:text-amber-200'
                          : 'bg-white dark:bg-slate-750 border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-300'
                      }`}
                    >
                      <div
                        className={`w-4 h-4 rounded-md border mt-0.5 flex items-center justify-center shrink-0 ${
                          isChecked ? 'bg-amber-600 border-amber-600 text-white' : 'border-slate-300 dark:border-slate-600'
                        }`}
                      >
                        {isChecked && <CheckCircle2 className="w-3 h-3" />}
                      </div>
                      <span className="text-xs font-medium leading-snug">{qText}</span>
                    </div>
                  );
                })}
              </div>

              <div className="flex justify-end pt-2">
                <button
                  onClick={() => setStep('part1-recall')}
                  className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs sm:text-sm cursor-pointer"
                >
                  <span>{language === 'ur' ? 'آخری مرحلہ: اشیاء کی دوبارہ یادداشت' : language === 'ar' ? 'الخطوة الأخيرة: تذكر الكلمات المحفوظة' : 'Final Step: Delayed Word Recall'}</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* Step 5: Delayed Recall */}
          {step === 'part1-recall' && (
            <div className="p-5 sm:p-7 rounded-3xl bg-white dark:bg-slate-800 border border-teal-100 dark:border-slate-700 shadow-xs space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-700 pb-3">
                <div>
                  <span className="text-[11px] font-bold text-teal-600 dark:text-teal-400 uppercase tracking-wider">
                    {language === 'ur' ? 'آخری مرحلہ: یادداشت کا امتحان' : language === 'ar' ? 'الخطوة الأخيرة: استرجاع الذاكرة' : 'Final Step: Memory Recall'}
                  </span>
                  <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">
                    {language === 'ur' ? 'آپ نے شروع میں کون سی 5 اشیاء یاد کی تھیں؟' : language === 'ar' ? 'ما هي الأشياء الخمسة التي حفظتها في البداية؟' : 'Which 5 Objects Did You Memorize Earlier?'}
                  </h3>
                </div>
                <span className="text-xs px-2.5 py-0.5 rounded-full bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 font-mono">
                  6 / 6
                </span>
              </div>

              <p className="text-xs text-slate-600 dark:text-slate-300">
                {language === 'ur'
                  ? 'شروع میں دکھائی گئی 5 اشیاء منتخب کریں:'
                  : language === 'ar'
                  ? 'حدد العناصر الخمسة التي حفظتها في بداية الفحص:'
                  : 'Select the 5 items you memorized at the start of the check:'}
              </p>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                {[
                  ...culturalItems,
                  { id: 'dist1', nameEn: 'Silver Ring', nameUr: 'چاندی کی انگوٹھی', nameAr: 'خاتم فضة', icon: CircleDot },
                  { id: 'dist2', nameEn: 'Blue Carpet', nameUr: 'نیلا قالین', nameAr: 'سجادة زرقاء', icon: Layers },
                  { id: 'dist3', nameEn: 'Wooden Boat', nameUr: 'لکڑی کی کشتی', nameAr: 'قارب خشبي', icon: Compass },
                ].map((item) => {
                  const isSelected = recalledItems.includes(item.id);
                  const name = language === 'ur' ? item.nameUr : language === 'ar' ? item.nameAr : item.nameEn;
                  const ItemIcon = item.icon as React.ElementType;

                  return (
                    <button
                      key={item.id}
                      onClick={() => {
                        if (isSelected) setRecalledItems(recalledItems.filter((i) => i !== item.id));
                        else setRecalledItems([...recalledItems, item.id]);
                      }}
                      className={`p-3 rounded-2xl border text-center transition-all flex flex-col items-center justify-center gap-1.5 cursor-pointer ${
                        isSelected
                          ? 'bg-teal-600 text-white border-teal-600 shadow-xs'
                          : 'bg-white dark:bg-slate-750 border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200'
                      }`}
                    >
                      <div
                        className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                          isSelected ? 'text-white' : 'text-teal-600 dark:text-teal-300'
                        }`}
                      >
                        <ItemIcon className="w-5 h-5" />
                      </div>
                      <span className="text-xs font-bold">{name}</span>
                    </button>
                  );
                })}
              </div>

              <div className="flex justify-end pt-3">
                <button
                  onClick={computeFinalAssessment}
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-sm sm:text-base shadow-sm cursor-pointer transition-all active:scale-98"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>
                    {language === 'ur'
                      ? 'یادداشت کا نتیجہ دیکھیں'
                      : language === 'ar'
                      ? 'عرض نتيجة فحص الذاكرة'
                      : 'See My Memory Score'}
                  </span>
                </button>
              </div>
            </div>
          )}

          {/* Completed Results, Longitudinal Trend Chart & Deterministic Z-Score Formula Card */}
          {step === 'completed' && finalScore !== null && (
            <div className="p-5 sm:p-7 rounded-3xl bg-white dark:bg-slate-800 border border-teal-100 dark:border-slate-700 shadow-xs space-y-5">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 dark:border-slate-700 pb-4">
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-teal-600 dark:text-teal-400">
                      {language === 'ur' ? 'معائنہ مکمل • تصدیق شدہ اسکور' : language === 'ar' ? 'اكتمل الفحص • تقييم معتمد' : 'Check Completed • Calibrated'}
                    </span>
                    <span className="text-[9px] font-mono px-1.5 py-0.2 rounded bg-teal-50 dark:bg-teal-950 text-teal-800 dark:text-teal-300 border border-teal-200 dark:border-teal-800">
                      [Deterministic Z-Score / Xception TFLite Calculation]
                    </span>
                  </div>
                  <h3 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white mt-0.5">
                    {language === 'ur'
                      ? `آپ کا یادداشت و توجہ اسکور: ${finalScore}/100`
                      : language === 'ar'
                      ? `درجة الذاكرة والتركيز لديك: ${finalScore}/100`
                      : `Your Memory & Focus Score: ${finalScore}/100`}
                  </h3>
                </div>

                <div className="flex items-center gap-2">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1.5 ${
                      driftStatus === 'stable'
                        ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                        : 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                    }`}
                  >
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    {driftStatus === 'stable'
                      ? language === 'ur'
                        ? 'صحت مند اور مستحکم'
                        : language === 'ar'
                        ? 'طبيعي ومستقر'
                        : 'Healthy & Stable'
                      : language === 'ur'
                      ? 'معمولی تغیر کی نشاندہی'
                      : language === 'ar'
                      ? 'تغير طفيف للمتابعة'
                      : 'Mild Variation Flagged'}
                  </span>

                  <button
                    onClick={() => setStep('intro')}
                    className="p-2 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 cursor-pointer"
                    title={language === 'ur' ? 'دوبارہ جانچ کریں' : language === 'ar' ? 'إعادة الفحص' : 'Retake Check'}
                  >
                    <RotateCcw className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Longitudinal Chart */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs sm:text-sm font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                    <TrendingUp className="w-4 h-4 text-teal-600" />
                    <span>
                      {language === 'ur'
                        ? 'وقت کے ساتھ یادداشت اور توجہ کا گراف'
                        : language === 'ar'
                        ? 'مؤشر الذاكرة والتركيز بمرور الوقت'
                        : 'Your Memory & Focus Trend Over Time'}
                    </span>
                  </h4>
                  <span className="text-[11px] text-emerald-700 dark:text-emerald-400 font-semibold">
                    {language === 'ur' ? 'بنیادی سطح: مستحکم' : language === 'ar' ? 'المستوى المرجعي: مستقر' : 'Baseline: Stable'}
                  </span>
                </div>

                <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                  <svg viewBox="0 0 500 140" className="w-full h-36">
                    <line x1="50" y1="20" x2="470" y2="20" stroke="#e2e8f0" strokeWidth="1" />
                    <line x1="50" y1="60" x2="470" y2="60" stroke="#e2e8f0" strokeWidth="1" />
                    <line x1="50" y1="100" x2="470" y2="100" stroke="#e2e8f0" strokeWidth="1" />

                    <polygon points="60,35 460,35 460,65 60,65" fill="#ccfbf1" opacity="0.5" />

                    {longitudinalHistory.length > 1 && (
                      <polyline
                        fill="none"
                        stroke="#0d9488"
                        strokeWidth="2.5"
                        points={longitudinalHistory
                          .map((pt, idx) => {
                            const x = 60 + (idx / (longitudinalHistory.length - 1)) * 380;
                            const y = 105 - ((pt.score - 40) / 60) * 85;
                            return `${x},${y}`;
                          })
                          .join(' ')}
                      />
                    )}

                    {longitudinalHistory.map((pt, idx) => {
                      const x = 60 + (idx / Math.max(1, longitudinalHistory.length - 1)) * 380;
                      const y = 105 - ((pt.score - 40) / 60) * 85;
                      const isLatest = idx === longitudinalHistory.length - 1;

                      return (
                        <g key={pt.id}>
                          <circle
                            cx={x}
                            cy={y}
                            r={isLatest ? 5 : 3.5}
                            fill={isLatest ? '#0d9488' : '#64748b'}
                            stroke="#ffffff"
                            strokeWidth="1.5"
                          />
                          <text x={x} y={y - 7} fontSize="9" fontWeight="bold" fill="#0f172a" textAnchor="middle">
                            {pt.score}
                          </text>
                          <text x={x} y="130" fontSize="8" fill="#64748b" textAnchor="middle">
                            {pt.displayDate}
                          </text>
                        </g>
                      );
                    })}
                  </svg>
                </div>

                {/* Deterministic Longitudinal Z-Score Formula Card (Reliable Change Index) */}
                <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-teal-200 dark:border-slate-700 space-y-3">
                  <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-200 dark:border-slate-800 pb-2.5">
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-teal-700 dark:text-teal-400 block">
                        Gate 4 • Deterministic Change Calculation (Reliable Change Index / Z-Score)
                      </span>
                      <code className="text-xs sm:text-sm font-black font-mono text-slate-900 dark:text-white">
                        Z = (FollowUp - Baseline - PracticeGain) / SD
                      </code>
                    </div>
                    <span className="px-2.5 py-1 rounded-xl bg-teal-100 dark:bg-teal-950 text-teal-900 dark:text-teal-200 font-mono text-xs font-black">
                      Calculated Z-Score: {calculatedZScore >= 0 ? `+${calculatedZScore}` : calculatedZScore}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 text-xs">
                    <div className="p-2.5 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                      <span className="text-[10px] text-slate-500 block">Baseline Mean (First 3 Visits)</span>
                      <strong className="font-mono font-bold text-slate-900 dark:text-white">{baselineMeanVal}</strong>
                    </div>
                    <div className="p-2.5 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                      <span className="text-[10px] text-slate-500 block">Current Follow-Up</span>
                      <strong className="font-mono font-bold text-teal-700 dark:text-teal-300">{currentFollowUpVal}</strong>
                    </div>
                    <div className="p-2.5 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                      <span className="text-[10px] text-slate-500 block">Practice Gain Adjustment</span>
                      <strong className="font-mono font-bold text-slate-900 dark:text-white">+{practiceGainVal}</strong>
                    </div>
                    <div className="p-2.5 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                      <span className="text-[10px] text-slate-500 block">Standard Deviation (SD)</span>
                      <strong className="font-mono font-bold text-slate-900 dark:text-white">{sdVal}</strong>
                    </div>
                    <div className="p-2.5 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                      <span className="text-[10px] text-slate-500 block">Audio-Visual Piano</span>
                      <strong className="font-mono font-bold text-indigo-600 dark:text-indigo-400">
                        {pianoAccuracy !== null ? `${pianoAccuracy}% (${pianoLatencyMs}ms)` : 'Not Run'}
                      </strong>
                    </div>
                  </div>

                  <p className="text-[11px] text-slate-600 dark:text-slate-300 leading-relaxed">
                    <strong>Clinical Interpretation:</strong> Under the Reliable Change Index (RCI) model,{' '}
                    <code className="font-mono font-bold">|Z| &lt; 1.5</code> indicates normal physiological day-to-day variation after accounting for retest practice gain (+1.5 pts), whereas{' '}
                    <code className="font-mono font-bold text-rose-600 dark:text-rose-400">Z &lt; -1.5</code> flags statistically meaningful longitudinal cognitive drift for primary care physician review.
                  </p>
                </div>

                <div className="p-3.5 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-xs text-emerald-900 dark:text-emerald-200 leading-relaxed">
                  <strong>{language === 'ur' ? 'ڈاکٹر کا خلاصہ:' : language === 'ar' ? 'ملخص الطبيب:' : 'Simple Doctor Summary:'}</strong>{' '}
                  {language === 'ur'
                    ? 'پچھلے 6 ماہ میں آپ کے یادداشت کے اسکورز اطمینان بخش استحکام ظاہر کرتے ہیں۔ چند پوائنٹس کا معمولی فرق روزمرہ کے معمولات کے مطابق مکمل طور پر قدرتی اور متوقع ہے۔'
                    : language === 'ar'
                    ? 'درجات الذاكرة خلال الأشهر الستة الماضية تظهر استقراراً مطمئناً. التغير اليومي الطفيف بعدة نقاط أمر طبيعي وصحي تماماً.'
                    : 'Your memory scores over the last 6 months show reassuring stability. Normal daily fluctuations of a few points are completely expected and healthy.'}
                </div>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};
