import React, { useState, useEffect } from 'react';
import {
  History,
  Brain,
  Microscope,
  HeartPulse,
  Trash2,
  ExternalLink,
  Eye,
  Download,
  Calendar,
  Clock,
  Cpu,
  Cloud,
  CheckCircle2,
  AlertTriangle,
  X,
  FileText,
  SlidersHorizontal,
  ChevronDown,
  ChevronUp,
  Layers,
} from 'lucide-react';
import { Language, PatientHistoryRecord, MriAnalysisResult, Tab, Region } from '../types';
import { ClinicalReportDossier } from './ClinicalReportDossier';

interface HistoryVaultTabProps {
  language: Language;
  region?: Region;
  onOpenMriLabWithCase?: (caseId: string) => void;
  setCurrentTab: (tab: Tab) => void;
}

const STORAGE_KEY = 'deepcortex_patient_records_v1';

const INITIAL_RECORDS: PatientHistoryRecord[] = [
  {
    id: 'rec-mri-101',
    type: 'mri',
    title: 'Hospital PACS Axial T1 Scan (Sample 1)',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3).toISOString(), // 3 days ago
    dateDisplay: '3 Days Ago',
    classification: 'Non-Demented',
    scanType: 'Axial T1-Weighted Brain MRI (128×128 -> 224×224×3 Tensor)',
    confidence: 0.9975,
    inferenceMode: 'edge',
    thumbnailUrl: '/assets/aistudio/non_17_c01f5258.jpg',
    summary: 'Preserved butterfly lateral ventricles (VBR: 6.8%), dense cortical ribbon, preserved hippocampal volume (99.75% Non-Demented).',
    isPersonal: false,
  },
  {
    id: 'rec-mem-01',
    type: 'memory',
    title: '2-Minute Culturally Calibrated Memory Check',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24 * 14).toISOString(), // 2 weeks ago
    dateDisplay: '2 Weeks Ago',
    score: 88,
    inferenceMode: 'edge',
    summary: '5/5 immediate recall, 4/5 delayed recall, trail-making response: 20s. Cognitive index within normal aging variance.',
    isPersonal: false,
  },
  {
    id: 'rec-mri-204',
    type: 'mri',
    title: 'Axial T1 Neuroimaging Workup (Sample 2)',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24 * 30).toISOString(), // 1 month ago
    dateDisplay: '1 Month Ago',
    classification: 'Very Mild Demented',
    scanType: 'Axial T1-Weighted Brain MRI (128×128 -> 224×224×3 Tensor)',
    confidence: 0.9747,
    inferenceMode: 'cloud',
    thumbnailUrl: '/assets/aistudio/verymild_25_9c41a366.jpg',
    summary: 'Subtle early widening of ventricular horns and mild medial temporal thinning (97.47% Very Mild Demented). Grad-CAM confirms focal right medial temporal gradients.',
    isPersonal: false,
  },
  {
    id: 'rec-risk-01',
    type: 'health',
    title: 'Lancet 14-Factor Modifiable Risk Snapshot',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24 * 60).toISOString(), // 2 months ago
    dateDisplay: '2 Months Ago',
    score: 84,
    inferenceMode: 'edge',
    summary: 'Blood pressure 124/80 mmHg, HbA1c 5.4%, 7.5 hrs sleep/night, 160 mins aerobic exercise. Modifiable protection index: 84/100.',
    isPersonal: false,
  },
];

export const HistoryVaultTab: React.FC<HistoryVaultTabProps> = ({
  language,
  region = 'abu-dhabi',
  setCurrentTab,
}) => {
  const isUrdu = language === 'ur';
  const isArabic = language === 'ar';

  const [records, setRecords] = useState<PatientHistoryRecord[]>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (e) {
      console.warn('Failed to parse history from localStorage', e);
    }
    return INITIAL_RECORDS;
  });

  const [categoryFilter, setCategoryFilter] = useState<'all' | 'personal' | 'reference'>('all');
  const [activeFilter, setActiveFilter] = useState<'all' | 'mri' | 'memory' | 'health'>('all');
  const [selectedRecordForModal, setSelectedRecordForModal] = useState<PatientHistoryRecord | null>(null);
  const [dossierRecord, setDossierRecord] = useState<PatientHistoryRecord | null>(null);
  const [isDossierOpen, setIsDossierOpen] = useState(false);

  // Sync state to localStorage on updates
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(records));
    } catch (e) {
      console.error('LocalStorage write error', e);
    }
  }, [records]);

  const handleDeleteRecord = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (window.confirm(isUrdu ? 'کیا آپ واقعی اس ریکارڈ کو حذف کرنا چاہتے ہیں؟' : isArabic ? 'هل أنت متأكد من حذف هذا السجل؟' : 'Delete this clinical record from local archive?')) {
      setRecords((prev) => prev.filter((r) => r.id !== id));
      if (selectedRecordForModal?.id === id) {
        setSelectedRecordForModal(null);
      }
    }
  };

  // Grouping logic: unite individual sub-assessments under their clinical encounter session
  const encounterRecords = records.filter(
    (r) =>
      r.id.startsWith('rec-encounter-') ||
      r.type === 'multimodal' ||
      r.type === 'composite' ||
      r.title.startsWith('Clinical Encounter') ||
      r.title.startsWith('Clinical Baseline')
  );

  const encounterSubRecordsMap = new Map<string, PatientHistoryRecord[]>();
  const claimedSubRecordIds = new Set<string>();

  encounterRecords.forEach((enc) => {
    const encSessionId = enc.sessionId || (enc.id.startsWith('rec-encounter-') ? enc.id.replace('rec-encounter-', '') : '');
    const encTime = new Date(enc.timestamp).getTime();

    const subs = records.filter((r) => {
      if (r.id === enc.id) return false;
      // Match by explicit sessionId
      if (encSessionId && r.sessionId && r.sessionId === encSessionId) return true;
      // Match by personal records created in the same current session or close in time (within 2 hours)
      if (r.isPersonal) {
        if (enc.dateDisplay === 'Current Session' && (r.dateDisplay === 'Just Now' || r.dateDisplay === 'Current Session')) {
          return true;
        }
        const diff = Math.abs(new Date(r.timestamp).getTime() - encTime);
        if (diff < 1000 * 60 * 120) return true;
      }
      return false;
    });

    encounterSubRecordsMap.set(enc.id, subs);
    subs.forEach((s) => claimedSubRecordIds.add(s.id));
  });

  // Track expanded/collapsed state for each encounter group
  const [expandedGroups, setExpandedGroups] = useState<Record<string, boolean>>(() => {
    const initial: Record<string, boolean> = {};
    encounterRecords.forEach((enc) => {
      initial[enc.id] = true; // Open by default for immediate visibility
    });
    return initial;
  });

  const toggleGroup = (groupId: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setExpandedGroups((prev) => ({
      ...prev,
      [groupId]: !prev[groupId],
    }));
  };

  const personalRecordsCount = records.filter((r) => r.isPersonal).length;
  const referenceRecordsCount = records.filter((r) => !r.isPersonal).length;

  const filteredRecords = records.filter((r) => {
    // When viewing All Modalities, nest sub-assessments under their parent session encounter
    if (activeFilter === 'all' && claimedSubRecordIds.has(r.id)) {
      return false;
    }
    // 1. Filter by category
    if (categoryFilter === 'personal' && !r.isPersonal) return false;
    if (categoryFilter === 'reference' && r.isPersonal) return false;
    // 2. Filter by type
    if (activeFilter === 'all') return true;
    return r.type === activeFilter;
  });

  const getStageBadgeColor = (stage?: string) => {
    switch (stage) {
      case 'Non-Demented':
        return 'bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 border-emerald-300';
      case 'Very Mild Demented':
        return 'bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300 border-amber-300';
      case 'Mild Demented':
        return 'bg-orange-100 dark:bg-orange-950 text-orange-800 dark:text-orange-300 border-orange-300';
      case 'Moderate Demented':
        return 'bg-rose-100 dark:bg-rose-950 text-rose-800 dark:text-rose-300 border-rose-300';
      default:
        return 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-300';
    }
  };

  return (
    <div className="w-full max-w-5xl mx-auto space-y-6 pb-28 pt-2">
      {/* Header Banner */}
      <div className="p-6 sm:p-7 rounded-3xl bg-gradient-to-br from-slate-900 via-slate-850 to-teal-950 text-white shadow-xl relative overflow-hidden border border-slate-800">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 relative z-10">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-500/20 text-teal-300 text-xs font-bold border border-teal-500/30">
              <History className="w-3.5 h-3.5" />
              <span>
                {isUrdu
                  ? 'طبی تاریخ و لانگیٹیوڈنل ریکارڈ والٹ'
                  : isArabic
                  ? 'سجل المريض والتاريخ الإدراكي الشامل'
                  : 'Patient History & Longitudinal Vault'}
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              {isUrdu
                ? 'محفوظ طبی معائنوں کی تاریخ'
                : isArabic
                ? 'أرشيف فحوصات الرنين ومتابعة الذاكرة'
                : 'Analysis History & Scan Archive'}
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 font-medium">
              {isUrdu
                ? 'فون کے لوکل اسٹوریج میں محفوظ تمام برین ایم آر آئی اسکینز، یادداشت ٹیسٹ اور روزمرہ صحت کے اسنیپ شاٹس۔'
                : isArabic
                ? 'سجلاتك المحفوظة محلياً على جهازك لصور الرنين المغناطيسي، وفحوصات الذاكرة، والمؤشرات الحيوية.'
                : 'Zero-cloud persistent local archive of axial MRI scans, 2-minute memory checks, and modifiable lifestyle snapshots.'}
            </p>
          </div>
        </div>
      </div>

      {/* Category Segmented Tabs (All / Personal Scans / Reference Demo Cases) */}
      <div className="p-1 rounded-2xl bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 grid grid-cols-1 sm:grid-cols-3 gap-1">
        <button
          onClick={() => setCategoryFilter('all')}
          className={`py-2 px-3 rounded-xl text-xs font-bold transition-all text-center cursor-pointer ${
            categoryFilter === 'all'
              ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs border border-slate-200/80 dark:border-slate-700'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
          }`}
        >
          {isUrdu ? 'تمام ریکارڈز' : isArabic ? 'جميع السجلات' : 'All Clinical Vault'} ({records.length})
        </button>

        <button
          onClick={() => setCategoryFilter('personal')}
          className={`py-2 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
            categoryFilter === 'personal'
              ? 'bg-teal-700 text-white shadow-xs font-extrabold'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
          }`}
        >
          <span className="w-2 h-2 rounded-full bg-teal-400 animate-pulse" />
          <span>
            {isUrdu ? 'میرے ذاتی معائنے' : isArabic ? 'فحوصاتي الشخصية' : 'My Personal Scans & Checks'}
          </span>
          <span className="px-1.5 py-0.2 rounded-full bg-teal-800/50 text-[10px] ml-1">
            {personalRecordsCount}
          </span>
        </button>

        <button
          onClick={() => setCategoryFilter('reference')}
          className={`py-2 px-3 rounded-xl text-xs font-bold transition-all text-center cursor-pointer ${
            categoryFilter === 'reference'
              ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs border border-slate-200/80 dark:border-slate-700'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
          }`}
        >
          {isUrdu ? 'اسپتال ریفرنس ڈیمو کیسز' : isArabic ? 'نماذج المشافي المرجعية' : 'Hospital Reference Cases'} ({referenceRecordsCount})
        </button>
      </div>

      {/* Type Sub-Filter Tabs Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="p-1.5 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200/90 dark:border-slate-700 shadow-xs flex items-center gap-1">
          <button
            onClick={() => setActiveFilter('all')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeFilter === 'all'
                ? 'bg-[#00a86b] text-white shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
            }`}
          >
            {isUrdu ? 'تمام اقسام' : isArabic ? 'جميع الفئات' : 'All Modalities'}
          </button>
          <button
            onClick={() => setActiveFilter('mri')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
              activeFilter === 'mri'
                ? 'bg-[#00a86b] text-white shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
            }`}
          >
            <Microscope className="w-3.5 h-3.5" />
            <span>{isUrdu ? 'ایم آر آئی اسکینز' : isArabic ? 'صور الرنين (MRI)' : 'MRI Scans'}</span>
          </button>
          <button
            onClick={() => setActiveFilter('memory')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
              activeFilter === 'memory'
                ? 'bg-[#00a86b] text-white shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
            }`}
          >
            <Brain className="w-3.5 h-3.5" />
            <span>{isUrdu ? 'یادداشت ٹیسٹ' : isArabic ? 'فحوصات الذاكرة' : 'Memory Checks'}</span>
          </button>
          <button
            onClick={() => setActiveFilter('health')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
              activeFilter === 'health'
                ? 'bg-[#00a86b] text-white shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
            }`}
          >
            <HeartPulse className="w-3.5 h-3.5" />
            <span>{isUrdu ? 'صحت کے اسنیپ شاٹس' : isArabic ? 'المؤشرات الحيوية' : 'Health Snapshots'}</span>
          </button>
        </div>

        <div className="text-xs text-slate-500 font-semibold flex items-center gap-1.5">
          <Calendar className="w-4 h-4 text-[#00a86b]" />
          <span>{filteredRecords.length} {isUrdu ? 'ریکارڈز دکھائے جا رہے ہیں' : isArabic ? 'سجلات مطابقة' : 'Shown Entries'}</span>
        </div>
      </div>

      {/* Record Cards List */}
      <div className="space-y-3.5">
        {filteredRecords.length === 0 ? (
          <div className="p-12 text-center rounded-3xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 space-y-3">
            <History className="w-10 h-10 text-slate-400 mx-auto" />
            <h3 className="text-sm font-bold text-slate-700 dark:text-slate-300">
              {categoryFilter === 'personal'
                ? isUrdu
                  ? 'ابھی تک کوئی ذاتی اسکین محفوظ نہیں ہے'
                  : isArabic
                  ? 'لا توجد فحوصات شخصية محفوظة بعد'
                  : 'No Personal Scans or Assessments Yet'
                : isUrdu
                ? 'کوئی ریکارڈ نہیں ملا'
                : isArabic
                ? 'لا توجد سجلات في هذا التصنيف'
                : 'No Records Found in this Category'}
            </h3>
            <p className="text-xs text-slate-500 max-w-md mx-auto">
              {categoryFilter === 'personal'
                ? isUrdu
                  ? '4-مرحلہ ایم آر آئی لیب میں اپنا برین اسکین اپلوڈ کریں یا 2 منٹ کا یادداشت ٹیسٹ کریں، آپ کا ریکارڈ فوراً یہاں محفوظ ہو جائے گا۔'
                  : isArabic
                  ? 'قم برفع صورة رنين مغناطيسي أو إتمام فحص الذاكرة لحفظ سجلك السريري الحقيقي هنا تلقائياً.'
                  : 'Upload an axial MRI scan in the 4-Stage Workstation or complete the 2-Minute Memory Check. Your scans and results will be preserved here permanently.'
                : isUrdu
                ? 'نیا ٹیسٹ کریں یا تمام ریکارڈز منتخب کریں۔'
                : isArabic
                ? 'قم بإجراء فحص جديد لإضافته إلى الأرشيف.'
                : 'Complete a new MRI scan or Memory check to save an entry.'}
            </p>
            {categoryFilter === 'personal' && (
              <button
                onClick={() => setCurrentTab('mri-lab')}
                className="mt-2 inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-teal-700 text-white hover:bg-teal-800 transition-colors cursor-pointer"
              >
                <Microscope className="w-3.5 h-3.5" />
                <span>{isUrdu ? 'ایم آر آئی لیب کھولیں' : isArabic ? 'فتح مختبر الرنين' : 'Launch MRI Workstation'}</span>
              </button>
            )}
          </div>
        ) : (
          filteredRecords.map((rec) => {
            const subAssessments = encounterSubRecordsMap.get(rec.id) || [];
            const hasSubs = subAssessments.length > 0;
            const isExpanded = Boolean(expandedGroups[rec.id]);

            return (
              <div
                key={rec.id}
                className={`rounded-2xl bg-white dark:bg-slate-800 border shadow-xs transition-all overflow-hidden ${
                  rec.isPersonal
                    ? 'border-teal-300 dark:border-teal-700/80 bg-teal-50/20 dark:bg-teal-950/10'
                    : 'border-slate-200/90 dark:border-slate-700'
                }`}
              >
                {/* Primary Card Header & Details */}
                <div className="p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  {/* Left Side: Thumbnail & Core Details */}
                  <div className="flex items-start sm:items-center gap-3.5 flex-1 min-w-0">
                    {/* Thumbnail / Icon */}
                    {rec.thumbnailUrl ? (
                      <img
                        src={rec.thumbnailUrl}
                        alt={rec.title}
                        className="w-14 h-14 rounded-xl object-cover border-2 border-slate-300 dark:border-slate-700 bg-slate-950 shrink-0"
                      />
                    ) : (
                      <div className="w-14 h-14 rounded-xl bg-teal-50 dark:bg-teal-950 text-[#00a86b] flex items-center justify-center shrink-0 border border-teal-200 dark:border-teal-800">
                        {rec.type === 'memory' ? (
                          <Brain className="w-7 h-7" />
                        ) : (
                          <HeartPulse className="w-7 h-7" />
                        )}
                      </div>
                    )}

                    {/* Text & Meta */}
                    <div className="space-y-1 min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <h3 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white truncate">
                          {rec.title}
                        </h3>
                        {rec.isPersonal ? (
                          <span className="px-2 py-0.5 rounded-md text-[10px] font-extrabold bg-teal-100 dark:bg-teal-950 text-teal-800 dark:text-teal-300 border border-teal-300 flex items-center gap-1">
                            <span className="w-1.5 h-1.5 rounded-full bg-teal-500 animate-pulse" />
                            {isUrdu ? 'ذاتی معائنہ' : isArabic ? 'فحص شخصي' : 'Personal Scan'}
                          </span>
                        ) : (
                          <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-slate-100 dark:bg-slate-750 text-slate-600 dark:text-slate-300 border border-slate-300 dark:border-slate-600">
                            {isUrdu ? 'اسپتال ریفرنس' : isArabic ? 'مرجعي معتمد' : 'Hospital Reference'}
                          </span>
                        )}
                        {rec.classification && (
                          <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold border ${getStageBadgeColor(rec.classification)}`}>
                            {rec.classification}
                          </span>
                        )}
                        {rec.score !== undefined && (
                          <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-teal-100 dark:bg-teal-950 text-teal-800 dark:text-teal-300 border border-teal-300">
                            {rec.score}/100
                          </span>
                        )}
                      </div>

                      <p className="text-xs text-slate-600 dark:text-slate-300 line-clamp-2 leading-relaxed">
                        {rec.summary}
                      </p>

                      <div className="flex flex-wrap items-center gap-3 text-[11px] text-slate-400 font-medium pt-0.5">
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3 text-slate-400" />
                          <span>{rec.dateDisplay}</span>
                        </span>
                        <span>•</span>
                        <span className="font-mono text-[10px]">
                          {rec.type === 'mri' ? (rec.scanType || 'Axial T1-Weighted Brain MRI (128×128 -> 224×224×3 Tensor)') : 'Composite Assessment'}
                        </span>
                        <span>•</span>
                        <span className="flex items-center gap-1">
                          {rec.inferenceMode === 'edge' ? (
                            <>
                              <Cpu className="w-3 h-3 text-emerald-600" />
                              <span className="text-emerald-700 dark:text-emerald-400 font-semibold">On-Device Edge</span>
                            </>
                          ) : (
                            <>
                              <Cloud className="w-3 h-3 text-indigo-500" />
                              <span className="text-indigo-600 dark:text-indigo-400 font-semibold">Cloud Multimodal</span>
                            </>
                          )}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Right Side: Actions */}
                  <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
                    <button
                      onClick={() => {
                        if (rec.type === 'mri' || rec.type === 'multimodal') {
                          setDossierRecord(rec);
                          setIsDossierOpen(true);
                        } else {
                          setSelectedRecordForModal(rec);
                        }
                      }}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold bg-teal-50 hover:bg-teal-100 dark:bg-teal-950 dark:hover:bg-teal-900 text-[#00a86b] border border-teal-200 dark:border-teal-800 transition-colors cursor-pointer"
                    >
                      {rec.type === 'mri' || rec.type === 'multimodal' ? <Eye className="w-3.5 h-3.5" /> : <FileText className="w-3.5 h-3.5" />}
                      <span>{rec.type === 'mri' || rec.type === 'multimodal' ? (isUrdu ? 'اسکین معائنہ' : isArabic ? 'معاينة الفحص' : 'View Scan') : (isUrdu ? 'تفصیلات' : isArabic ? 'التفاصيل' : 'Details')}</span>
                    </button>

                    <button
                      onClick={(e) => handleDeleteRecord(rec.id, e)}
                      title="Delete record"
                      className="p-2 rounded-xl text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors cursor-pointer"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Collapsible Session Components / Subcategories */}
                {hasSubs && (
                  <div className="border-t border-teal-200/60 dark:border-slate-700/80 bg-teal-50/40 dark:bg-slate-900/40 p-3 sm:px-5">
                    <button
                      onClick={(e) => toggleGroup(rec.id, e)}
                      className="w-full py-1.5 px-3 rounded-xl bg-white/80 dark:bg-slate-800/80 hover:bg-white dark:hover:bg-slate-800 border border-teal-200/80 dark:border-slate-700 text-slate-700 dark:text-slate-300 flex items-center justify-between text-xs font-semibold transition-all cursor-pointer shadow-2xs"
                    >
                      <span className="flex items-center gap-2 text-teal-800 dark:text-teal-300 font-bold">
                        <Layers className="w-3.5 h-3.5 text-[#00a86b]" />
                        <span>
                          {isUrdu
                            ? `سیشن کے منسلک معائنے (${subAssessments.length})`
                            : isArabic
                            ? `فحوصات الجلسة المرتبطة (${subAssessments.length})`
                            : `Session Components & Sub-Assessments (${subAssessments.length})`}
                        </span>
                      </span>
                      <span className="flex items-center gap-1 text-[11px] text-slate-500 font-medium">
                        <span>{isExpanded ? (isUrdu ? 'چھپائیں' : isArabic ? 'طي' : 'Collapse') : (isUrdu ? 'دکھائیں' : isArabic ? 'عرض' : 'Expand')}</span>
                        {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                      </span>
                    </button>

                    {isExpanded && (
                      <div className="mt-2.5 space-y-2 pl-2 sm:pl-4 border-l-2 border-teal-500/50">
                        {subAssessments.map((sub) => (
                          <div
                            key={sub.id}
                            className="p-2.5 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700/80 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 hover:border-teal-300 dark:hover:border-teal-700 transition-all text-xs shadow-2xs"
                          >
                            <div className="flex items-center gap-2.5 min-w-0 flex-1">
                              {sub.thumbnailUrl ? (
                                <img
                                  src={sub.thumbnailUrl}
                                  alt={sub.title}
                                  className="w-10 h-10 rounded-lg object-cover border border-slate-300 dark:border-slate-700 bg-slate-950 shrink-0"
                                />
                              ) : (
                                <div className="w-10 h-10 rounded-lg bg-teal-50 dark:bg-teal-950 text-[#00a86b] flex items-center justify-center shrink-0 border border-teal-200 dark:border-teal-800">
                                  {sub.type === 'memory' ? <Brain className="w-5 h-5" /> : <HeartPulse className="w-5 h-5" />}
                                </div>
                              )}
                              <div className="min-w-0 flex-1">
                                <div className="flex flex-wrap items-center gap-1.5">
                                  <span className="font-bold text-slate-900 dark:text-white truncate text-xs">
                                    {sub.title}
                                  </span>
                                  {sub.classification && (
                                    <span className={`px-1.5 py-0.2 rounded text-[10px] font-bold border ${getStageBadgeColor(sub.classification)}`}>
                                      {sub.classification}
                                    </span>
                                  )}
                                  {sub.score !== undefined && (
                                    <span className="px-1.5 py-0.2 rounded text-[10px] font-bold bg-teal-100 dark:bg-teal-950 text-teal-800 dark:text-teal-300 border border-teal-300">
                                      {sub.score}/100
                                    </span>
                                  )}
                                </div>
                                <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate mt-0.5">
                                  {sub.summary}
                                </p>
                              </div>
                            </div>

                            <div className="flex items-center gap-1.5 self-end sm:self-center shrink-0">
                              <button
                                onClick={() => {
                                  if (sub.type === 'mri') {
                                    setDossierRecord(sub);
                                    setIsDossierOpen(true);
                                  } else {
                                    setSelectedRecordForModal(sub);
                                  }
                                }}
                                className="px-2.5 py-1 rounded-lg text-[11px] font-bold bg-teal-50 hover:bg-teal-100 dark:bg-teal-950 text-[#00a86b] border border-teal-200 dark:border-teal-800 flex items-center gap-1 cursor-pointer"
                              >
                                {sub.type === 'mri' ? <Eye className="w-3 h-3" /> : <FileText className="w-3 h-3" />}
                                <span>{sub.type === 'mri' ? (isUrdu ? 'اسکین معائنہ' : isArabic ? 'معاينة الفحص' : 'View Scan') : (isUrdu ? 'تفصیلات' : isArabic ? 'التفاصيل' : 'Details')}</span>
                              </button>
                              <button
                                onClick={(e) => handleDeleteRecord(sub.id, e)}
                                className="p-1 rounded-lg text-slate-400 hover:text-rose-600 transition-colors cursor-pointer"
                                title="Delete sub-record"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>

      {/* Record Inspection & Details Modal */}
      {selectedRecordForModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/65 backdrop-blur-xs overflow-y-auto">
          <div className="w-full max-w-xl rounded-3xl bg-white dark:bg-slate-900 p-5 sm:p-6 shadow-2xl border border-slate-200 dark:border-slate-800 space-y-4 my-auto">
            <div className="flex items-start justify-between border-b border-slate-100 dark:border-slate-800 pb-3 gap-2">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-teal-600 dark:text-teal-400">
                  {selectedRecordForModal.type === 'mri' ? 'Axial T1 Neuroimaging Record' : 'Clinical Longitudinal Encounter'}
                </span>
                <h3 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white mt-0.5">
                  {selectedRecordForModal.title}
                </h3>
              </div>
              <button
                onClick={() => setSelectedRecordForModal(null)}
                className="p-1.5 rounded-xl text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* In-Place MRI Visual Inspection View */}
            {selectedRecordForModal.type === 'mri' && (
              <div className="flex flex-col sm:flex-row items-center gap-4 p-3.5 rounded-2xl bg-slate-950 text-white border border-slate-800">
                <img
                  src={selectedRecordForModal.thumbnailUrl || '/assets/aistudio/non_17_c01f5258.jpg'}
                  alt="MRI Slice"
                  className="w-28 h-28 rounded-xl object-contain bg-black border border-slate-700 shrink-0"
                />
                <div className="space-y-1.5 text-center sm:text-left flex-1 min-w-0">
                  <div className="flex flex-wrap items-center justify-center sm:justify-start gap-1.5">
                    <span className={`px-2 py-0.5 rounded-md text-xs font-bold ${getStageBadgeColor(selectedRecordForModal.classification)}`}>
                      {selectedRecordForModal.classification || 'Non-Demented'}
                    </span>
                    <span className="text-[11px] font-mono text-teal-300 font-bold">
                      {Math.round((selectedRecordForModal.confidence || 0.98) * 1000) / 10}% Certainty
                    </span>
                  </div>
                  <span className="text-[11px] text-slate-400 block font-mono">
                    Session: {selectedRecordForModal.sessionId || 'SES-4426'} • {selectedRecordForModal.inferenceMode?.toUpperCase() || 'EDGE'} NPU
                  </span>
                  <p className="text-xs text-slate-300 line-clamp-2 leading-relaxed">
                    {selectedRecordForModal.summary}
                  </p>
                </div>
              </div>
            )}

            {/* Anatomical Regions Breakdown if available */}
            {selectedRecordForModal.mriDetails?.anatomicalRegions && (
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700">
                  <span className="text-[10px] text-slate-500 block font-semibold">Hippocampus</span>
                  <span className="font-bold text-slate-800 dark:text-slate-200 text-[11px]">
                    {selectedRecordForModal.mriDetails.anatomicalRegions.hippocampus?.status || 'Preserved'}
                  </span>
                </div>
                <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700">
                  <span className="text-[10px] text-slate-500 block font-semibold">Lateral Ventricles</span>
                  <span className="font-bold text-slate-800 dark:text-slate-200 text-[11px]">
                    {selectedRecordForModal.mriDetails.anatomicalRegions.lateralVentricles?.status || 'Narrow butterfly'}
                  </span>
                </div>
                <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700">
                  <span className="text-[10px] text-slate-500 block font-semibold">Cerebral Cortex</span>
                  <span className="font-bold text-slate-800 dark:text-slate-200 text-[11px]">
                    {selectedRecordForModal.mriDetails.anatomicalRegions.cerebralCortex?.status || 'Dense mantle'}
                  </span>
                </div>
                <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700">
                  <span className="text-[10px] text-slate-500 block font-semibold">Temporal Lobe</span>
                  <span className="font-bold text-slate-800 dark:text-slate-200 text-[11px]">
                    {selectedRecordForModal.mriDetails.anatomicalRegions.medialTemporalLobe?.status || 'Grade 0 Intact'}
                  </span>
                </div>
              </div>
            )}

            <div className="space-y-2.5 text-xs text-slate-600 dark:text-slate-300">
              <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800">
                <span className="font-semibold text-slate-500">Recorded Timestamp:</span>
                <span className="font-mono text-slate-800 dark:text-slate-200">
                  {new Date(selectedRecordForModal.timestamp).toLocaleString()}
                </span>
              </div>
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800 space-y-1">
                <span className="font-semibold text-slate-500 block">Clinical Assessment Note:</span>
                <p className="leading-relaxed text-slate-800 dark:text-slate-200">{selectedRecordForModal.summary}</p>
              </div>
            </div>

            {/* Bottom Actions Bar */}
            <div className="pt-2 flex flex-wrap items-center justify-between gap-2 border-t border-slate-100 dark:border-slate-800">
              <button
                onClick={() => {
                  setDossierRecord(selectedRecordForModal);
                  setIsDossierOpen(true);
                }}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold bg-[#00a86b] hover:bg-[#00925d] text-white shadow-xs transition-colors cursor-pointer"
              >
                <Download className="w-3.5 h-3.5" />
                <span>{isUrdu ? 'آفیشل پی ڈی ایف رپورٹ حاصل کریں' : isArabic ? 'تحميل التقرير الطبي بصيغة PDF' : 'Download Official Clinical PDF'}</span>
              </button>

              <button
                onClick={() => setSelectedRecordForModal(null)}
                className="px-4 py-2 rounded-xl text-xs font-semibold bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-200 transition-colors cursor-pointer"
              >
                {isUrdu ? 'بند کریں' : isArabic ? 'إغلاق' : 'Close'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Embedded Clinical Report Dossier for Instant Single-Page PDF Download */}
      {isDossierOpen && (
        <ClinicalReportDossier
          isOpen={isDossierOpen}
          onClose={() => setIsDossierOpen(false)}
          language={language}
          region={region || 'abu-dhabi'}
          cognitiveScore={dossierRecord?.score || 86}
          mriResult={dossierRecord?.mriDetails || null}
        />
      )}
    </div>
  );
};
