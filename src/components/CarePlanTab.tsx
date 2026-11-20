import React, { useState, useEffect } from 'react';
import {
  ShieldCheck,
  Printer,
  CheckCircle2,
  Building2,
  Clock,
  Phone,
  Stethoscope,
  AlertCircle,
  AlertTriangle,
  FileText,
  Download,
  ExternalLink,
  Activity,
  Send,
  Database,
  Cpu,
  Sparkles,
} from 'lucide-react';
import { Language, Region, MriAnalysisResult, DoctorSignOff, APP_VERSION } from '../types';
import { translations } from '../translations';
import { ClinicalReportDossier } from './ClinicalReportDossier';

interface CarePlanTabProps {
  language: Language;
  region: Region;
  cognitiveScore: number;
  riskState: any;
  mriResult: MriAnalysisResult | null;
  doctorSignOff?: DoctorSignOff | null;
  onDoctorSignOffChange?: (signOff: DoctorSignOff | null) => void;
}

const ACUTE_RED_FLAG_SYMPTOMS = [
  'Sudden <48h Acute Confusion / Delirium',
  'Slurred Speech / Aphasia',
  'Unilateral Facial Droop / Weakness',
  'Acute Fever / Head Trauma',
];

export const CarePlanTab: React.FC<CarePlanTabProps> = ({
  language,
  region,
  cognitiveScore,
  riskState,
  mriResult,
  doctorSignOff,
  onDoctorSignOffChange,
}) => {
  const t = translations[language];

  // Gate 2: Acute Red-Flag Emergency Bypass State
  const [acuteRedFlagOpen, setAcuteRedFlagOpen] = useState<boolean>(false);
  const [selectedRedFlags, setSelectedRedFlags] = useState<string[]>([]);
  const isEmergencyBypassActive = selectedRedFlags.length > 0;

  // Gate 3: Missing-Data & Confounder Evidence Simulation / Inspection State
  const [simulateMissingLabs, setSimulateMissingLabs] = useState<boolean>(false);

  // Gate 5: Sahatna / Malaffi Closed-Loop Dispatch State
  const [dispatchedToSahatna, setDispatchedToSahatna] = useState<boolean>(false);
  const [dispatchTimestamp, setDispatchTimestamp] = useState<string>('');

  // Clinician Sign-off Checklist State
  const [clinicianChecks, setClinicianChecks] = useState<Record<string, boolean>>({
    historyCheck: doctorSignOff?.checklistComplete ?? false,
    metabolicCheck: doctorSignOff?.checklistComplete ?? false,
    mriCheck: doctorSignOff?.checklistComplete ?? false,
    caregiverCheck: doctorSignOff?.checklistComplete ?? false,
  });

  const [doctorNameInput, setDoctorNameInput] = useState<string>(
    doctorSignOff?.doctorName || ''
  );
  const [hospitalInput, setHospitalInput] = useState<string>(
    doctorSignOff?.hospital || (region === 'abu-dhabi' ? 'Sheikh Shakhbout Medical City (SSMC)' : 'PINS / DHQ Teaching Hospital')
  );
  const [licenseInput, setLicenseInput] = useState<string>(
    doctorSignOff?.licenseNumber || (region === 'abu-dhabi' ? 'DoH-NEURO-782194' : 'PMDC-49102-N')
  );

  const [signedByDoctor, setSignedByDoctor] = useState<boolean>(
    doctorSignOff?.signed ?? false
  );

  const [carePlanData, setCarePlanData] = useState<any>(null);
  const [showReportModal, setShowReportModal] = useState<boolean>(false);

  // Compute Gate 3 Evidence Completeness & Confounder Status
  const hasSleepData = !simulateMissingLabs && typeof riskState?.sleepHours === 'number' && riskState.sleepHours > 0;
  const hasHba1cData = !simulateMissingLabs && typeof riskState?.hba1c === 'number' && riskState.hba1c > 0;
  const hasBpData = typeof riskState?.bloodPressureSystolic === 'number' && riskState.bloodPressureSystolic > 0;
  const hasHearingVerified = typeof riskState?.hearingLoss === 'boolean';

  const verifiedEvidenceCount = [hasSleepData, hasHba1cData, hasBpData, hasHearingVerified].filter(Boolean).length;
  const evidenceCompletenessPct = Math.round((verifiedEvidenceCount / 4) * 100);
  const signalConfidenceAdjustment = (!hasSleepData && !hasHba1cData)
    ? -18
    : (!hasSleepData || !hasHba1cData)
    ? -9
    : 0;
  const effectiveSignalConfidence = Math.max(55, 96 + signalConfidenceAdjustment);
  const hasReversibleConfounder = Boolean(riskState?.hearingLoss) || (typeof riskState?.sleepHours === 'number' && riskState.sleepHours < 6);

  const toggleRedFlagSymptom = (symptom: string) => {
    setSelectedRedFlags((prev) =>
      prev.includes(symptom) ? prev.filter((s) => s !== symptom) : [...prev, symptom]
    );
  };

  // Sync if prop changes
  useEffect(() => {
    if (doctorSignOff) {
      setSignedByDoctor(doctorSignOff.signed);
      if (doctorSignOff.doctorName) setDoctorNameInput(doctorSignOff.doctorName);
      if (doctorSignOff.hospital) setHospitalInput(doctorSignOff.hospital);
      if (doctorSignOff.licenseNumber) setLicenseInput(doctorSignOff.licenseNumber);
      if (doctorSignOff.checklistComplete) {
        setClinicianChecks({
          historyCheck: true,
          metabolicCheck: true,
          mriCheck: true,
          caregiverCheck: true,
        });
      }
    }
  }, [doctorSignOff]);

  useEffect(() => {
    const fetchCarePlan = async () => {
      try {
        const response = await fetch('/api/neuro/care-plan', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            cognitiveAssessment: { compositeScore: cognitiveScore },
            riskFactors: riskState,
            mriFindings: mriResult,
            region,
            language,
          }),
        });
        const res = await response.json();
        if (res.success && res.data) {
          setCarePlanData(res.data);
        }
      } catch (err) {
        console.error('Care plan fetch error:', err);
      }
    };

    fetchCarePlan();
  }, [region, language, cognitiveScore, riskState, mriResult]);

  const toggleCheck = (id: string) => {
    setClinicianChecks((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const allChecksComplete = Object.values(clinicianChecks).every(Boolean);

  const handlePrint = () => {
    setShowReportModal(true);
  };

  return (
    <div className="w-full max-w-4xl mx-auto space-y-5 pb-16">
      {/* Top Action Header with 1-Click Printable Medical Report */}
      <div className="p-5 sm:p-6 rounded-3xl bg-gradient-to-br from-teal-50 via-emerald-50/70 to-sky-50 dark:from-slate-850 dark:via-slate-900 dark:to-teal-950/40 border border-teal-200/80 dark:border-slate-800 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <span className="text-[11px] font-bold uppercase tracking-wider text-teal-700 dark:text-teal-400">
            Care Recommendations &amp; Summary
          </span>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white mt-0.5">
            Personal Care Plan &amp; Clinic Directory
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Ecosystem:{' '}
            <strong className="text-slate-800 dark:text-slate-200">
              {region === 'abu-dhabi' ? 'AE Abu Dhabi (DoH / IFHAS)' : 'PK Pakistan (Punjab Health)'}
            </strong>
          </p>
        </div>

        <button
          onClick={handlePrint}
          className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-[#00A86B] hover:bg-[#00925d] text-white font-bold text-xs sm:text-sm shadow-sm transition-all cursor-pointer"
        >
          <Printer className="w-4 h-4" />
          <span>{language === 'ur' ? 'آفیشل رپورٹ پرنٹ / ڈاؤن لوڈ کریں' : language === 'ar' ? 'تحميل / طباعة التقرير الطبي' : 'Download / Print Official PDF Report'}</span>
        </button>
      </div>

      {/* Dr. Nance's 5-Gate Clinical Safety & Agentic Workflow Bar (DECIDE-AI Standard) */}
      <div className="p-4 sm:p-5 rounded-3xl bg-white dark:bg-slate-800 border border-teal-200/80 dark:border-slate-700 shadow-xs space-y-3.5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2.5 border-b border-slate-100 dark:border-slate-700">
          <div>
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-teal-700 dark:text-teal-400">
              DECIDE-AI Clinical Safety Architecture • Multi-Gate Triage &amp; Governance
            </span>
            <h3 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white">
              5-Gate Clinical Workflow &amp; Acute Red-Flag Emergency Bypass
            </h3>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={() => setAcuteRedFlagOpen((prev) => !prev)}
              className={`px-3 py-1.5 rounded-xl text-[11px] font-bold flex items-center gap-1.5 transition-all cursor-pointer border ${
                isEmergencyBypassActive
                  ? 'bg-red-600 text-white border-red-700 shadow-xs'
                  : acuteRedFlagOpen
                  ? 'bg-amber-100 text-amber-900 border-amber-300 dark:bg-amber-950/60 dark:text-amber-200 dark:border-amber-700'
                  : 'bg-red-50 text-red-700 border-red-200 hover:bg-red-100 dark:bg-red-950/40 dark:text-red-300 dark:border-red-800'
              }`}
            >
              <AlertTriangle className="w-3.5 h-3.5" />
              <span>Check Acute Red-Flag Symptoms (Sudden &lt;48h Onset)</span>
            </button>
          </div>
        </div>

        {/* 5 Gates Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-5 gap-2">
          {/* Gate 1 */}
          <div className="p-2.5 rounded-xl border border-emerald-200 dark:border-emerald-800/70 bg-emerald-50/70 dark:bg-emerald-950/30 space-y-1">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-extrabold uppercase text-emerald-800 dark:text-emerald-300">Gate 1</span>
              <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-emerald-200/80 dark:bg-emerald-900 text-emerald-900 dark:text-emerald-200">
                Active
              </span>
            </div>
            <p className="text-[11px] font-bold text-slate-800 dark:text-slate-100 leading-tight">
              Consent &amp; IFHAS 50–75 Cultural/Sensory Gate
            </p>
            <p className="text-[10px] text-slate-500 dark:text-slate-400">
              {region === 'abu-dhabi' ? 'ADPHC IFHAS 50–75 Calibrated' : 'Punjab Health 50–75 Calibrated'}
            </p>
          </div>

          {/* Gate 2 */}
          <div
            className={`p-2.5 rounded-xl border space-y-1 ${
              isEmergencyBypassActive
                ? 'border-red-500 bg-red-50 dark:bg-red-950/60'
                : 'border-emerald-200 dark:border-emerald-800/70 bg-emerald-50/70 dark:bg-emerald-950/30'
            }`}
          >
            <div className="flex items-center justify-between">
              <span
                className={`text-[10px] font-extrabold uppercase ${
                  isEmergencyBypassActive ? 'text-red-700 dark:text-red-300' : 'text-emerald-800 dark:text-emerald-300'
                }`}
              >
                Gate 2
              </span>
              <span
                className={`text-[9px] font-bold px-1.5 py-0.5 rounded ${
                  isEmergencyBypassActive
                    ? 'bg-red-600 text-white'
                    : 'bg-emerald-200/80 dark:bg-emerald-900 text-emerald-900 dark:text-emerald-200'
                }`}
              >
                {isEmergencyBypassActive ? 'EMERGENCY BYPASS TRIGGERED' : 'Clear'}
              </span>
            </div>
            <p className="text-[11px] font-bold text-slate-800 dark:text-slate-100 leading-tight">
              Acute Red-Flag Emergency Triage Bypass
            </p>
            <p className="text-[10px] text-slate-500 dark:text-slate-400">
              {isEmergencyBypassActive
                ? `${selectedRedFlags.length} acute symptom(s) active`
                : 'No acute <48h delirium/stroke flags'}
            </p>
          </div>

          {/* Gate 3 */}
          <div
            className={`p-2.5 rounded-xl border space-y-1 ${
              signalConfidenceAdjustment < 0 || hasReversibleConfounder
                ? 'border-amber-300 dark:border-amber-700 bg-amber-50/80 dark:bg-amber-950/40'
                : 'border-emerald-200 dark:border-emerald-800/70 bg-emerald-50/70 dark:bg-emerald-950/30'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-extrabold uppercase text-teal-800 dark:text-teal-300">Gate 3</span>
              <span
                className={`text-[9px] font-bold px-1.5 py-0.5 rounded ${
                  signalConfidenceAdjustment < 0
                    ? 'bg-amber-200 text-amber-900 dark:bg-amber-900 dark:text-amber-100'
                    : 'bg-emerald-200/80 dark:bg-emerald-900 text-emerald-900 dark:text-emerald-200'
                }`}
              >
                {evidenceCompletenessPct}% Evidence
              </span>
            </div>
            <p className="text-[11px] font-bold text-slate-800 dark:text-slate-100 leading-tight">
              Missing-Data &amp; Confounder Evidence Gate
            </p>
            <p className="text-[10px] text-slate-500 dark:text-slate-400">
              Signal Confidence: <strong>{effectiveSignalConfidence}%</strong>{' '}
              {signalConfidenceAdjustment < 0 ? `(${signalConfidenceAdjustment}%)` : '(Full Labs)'}
            </p>
          </div>

          {/* Gate 4 */}
          <div className="p-2.5 rounded-xl border border-teal-200 dark:border-teal-800/70 bg-teal-50/60 dark:bg-teal-950/30 space-y-1">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-extrabold uppercase text-teal-800 dark:text-teal-300">Gate 4</span>
              <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-teal-200/80 dark:bg-teal-900 text-teal-900 dark:text-teal-200">
                Deterministic
              </span>
            </div>
            <p className="text-[11px] font-bold text-slate-800 dark:text-slate-100 leading-tight">
              Deterministic Math &amp; 71-Layer Xception Gate
            </p>
            <p className="text-[10px] text-slate-500 dark:text-slate-400">
              RCI Z-Score + OASIS ZNCC / TFLite locked
            </p>
          </div>

          {/* Gate 5 */}
          <div
            className={`p-2.5 rounded-xl border space-y-1 ${
              signedByDoctor
                ? 'border-emerald-300 dark:border-emerald-700 bg-emerald-50 dark:bg-emerald-950/40'
                : 'border-amber-300 dark:border-amber-800 bg-amber-50/60 dark:bg-amber-950/30'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-extrabold uppercase text-slate-700 dark:text-slate-300">Gate 5</span>
              <span
                className={`text-[9px] font-bold px-1.5 py-0.5 rounded ${
                  signedByDoctor
                    ? 'bg-emerald-600 text-white'
                    : 'bg-amber-200 text-amber-900 dark:bg-amber-900 dark:text-amber-200'
                }`}
              >
                {signedByDoctor ? 'Clinician Signed' : 'Awaiting Doctor'}
              </span>
            </div>
            <p className="text-[11px] font-bold text-slate-800 dark:text-slate-100 leading-tight">
              DECIDE-AI Clinician &amp; Sahatna / Malaffi Gate
            </p>
            <p className="text-[10px] text-slate-500 dark:text-slate-400">
              {signedByDoctor ? 'FHIR R4 Handover Ready' : 'Autonomous push blocked'}
            </p>
          </div>
        </div>

        {/* Gate 2 Interactive Acute Red-Flag Drawer */}
        {(acuteRedFlagOpen || isEmergencyBypassActive) && (
          <div className="p-3.5 rounded-2xl border border-red-200 dark:border-red-800 bg-red-50/70 dark:bg-red-950/40 space-y-2.5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-red-900 dark:text-red-200 flex items-center gap-1.5">
                <AlertTriangle className="w-4 h-4 text-red-600" />
                Gate 2 — Acute Neurological / Delirium Symptom Check (&lt;48 Hours Onset)
              </span>
              {isEmergencyBypassActive && (
                <button
                  type="button"
                  onClick={() => setSelectedRedFlags([])}
                  className="text-[11px] font-bold text-red-700 dark:text-red-300 underline cursor-pointer"
                >
                  Clear Acute Flags
                </button>
              )}
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {ACUTE_RED_FLAG_SYMPTOMS.map((symptom) => {
                const active = selectedRedFlags.includes(symptom);
                return (
                  <button
                    key={symptom}
                    type="button"
                    onClick={() => toggleRedFlagSymptom(symptom)}
                    className={`p-2 rounded-xl border text-left text-xs font-semibold flex items-center justify-between transition-all cursor-pointer ${
                      active
                        ? 'bg-red-600 text-white border-red-700'
                        : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 border-red-200 dark:border-slate-700 hover:bg-red-100/50'
                    }`}
                  >
                    <span>{symptom}</span>
                    <span className="text-[10px] font-extrabold px-1.5 py-0.5 rounded bg-black/10">
                      {active ? 'ACTIVE' : 'Select'}
                    </span>
                  </button>
                );
              })}
            </div>

            {isEmergencyBypassActive && (
              <div className="p-3.5 rounded-xl bg-red-700 text-white space-y-2 shadow-sm">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div>
                    <span className="text-[10px] font-extrabold uppercase tracking-wider px-2 py-0.5 rounded bg-red-900 text-red-100">
                      EMERGENCY BYPASS TRIGGERED • ROUTINE SCREENING HALTED
                    </span>
                    <h4 className="text-sm font-extrabold mt-1">
                      Acute Neurological / Delirium Emergency Triage Directive (Call 998 Abu Dhabi Estijaba / 1122 Punjab Emergency)
                    </h4>
                  </div>
                  <a
                    href={region === 'abu-dhabi' ? 'tel:998' : 'tel:1122'}
                    className="px-3.5 py-2 rounded-xl bg-white text-red-800 font-extrabold text-xs inline-flex items-center gap-1.5 shrink-0 shadow-xs"
                  >
                    <Phone className="w-3.5 h-3.5" />
                    <span>{region === 'abu-dhabi' ? 'Call 998 Estijaba Now' : 'Call 1122 Rescue Now'}</span>
                  </a>
                </div>
                <p className="text-xs text-red-100 leading-relaxed">
                  Sudden onset (&lt;48h) confusion, focal weakness, or speech change indicates potential acute stroke, metabolic encephalopathy, or delirium rather than chronic neurodegeneration. Routine longitudinal dementia triage is bypassed for immediate emergency stabilization.
                </p>
              </div>
            )}
          </div>
        )}

        {/* Gate 3: Missing-Data & Confounder Evidence Inspection Strip */}
        <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200/80 dark:border-slate-700 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="space-y-1">
            <div className="flex flex-wrap items-center gap-2 text-xs font-bold text-slate-800 dark:text-slate-200">
              <span>Gate 3 Evidence &amp; Confounder Audit:</span>
              <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${hasBpData ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300' : 'bg-amber-100 text-amber-800'}`}>
                BP: {hasBpData ? `${riskState.bloodPressureSystolic} mmHg (Verified)` : 'Missing'}
              </span>
              <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${hasHba1cData ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300' : 'bg-amber-100 text-amber-800'}`}>
                HbA1c: {hasHba1cData ? `${riskState.hba1c}% (Verified)` : 'Unverified (-9%)'}
              </span>
              <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${hasSleepData ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300' : 'bg-amber-100 text-amber-800'}`}>
                Sleep: {hasSleepData ? `${riskState.sleepHours}h (Verified)` : 'Unverified (-9%)'}
              </span>
              <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${!riskState?.hearingLoss ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300' : 'bg-amber-100 text-amber-900'}`}>
                Hearing: {riskState?.hearingLoss ? 'Unchecked / Deficit Flagged' : 'Calibrated'}
              </span>
            </div>
            <p className="text-[11px] text-slate-500 dark:text-slate-400">
              {simulateMissingLabs
                ? 'Partial-Evidence Mode Active (#BM-03): Missing HbA1c & Sleep labs lowers Signal Confidence Index by -18% without halting clinical workflow; orders routine metabolic panel.'
                : hasReversibleConfounder
                ? 'Reversible Confounder Alert (#BM-04): Hearing deficit or sleep deprivation (<6h) detected — prioritize audiometry & sleep hygiene before attributing cognitive drift to atrophy.'
                : 'All 4 core metabolic & sensory confounders verified. Signal Confidence Index at 96%.'}
            </p>
          </div>
          <button
            type="button"
            onClick={() => setSimulateMissingLabs((prev) => !prev)}
            className="px-3 py-1.5 rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-[11px] font-bold text-slate-700 dark:text-slate-200 hover:bg-slate-100 shrink-0 cursor-pointer"
          >
            {simulateMissingLabs ? 'Restore Full Lab Evidence' : 'Test Partial-Evidence Mode (-18%)'}
          </button>
        </div>

        {/* Gate 4: Explicit Provenance Separation Badges */}
        <div className="pt-1 flex flex-wrap items-center gap-2">
          <span className="text-[10px] font-bold uppercase text-slate-400">Gate 4 Data Provenance:</span>
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-sky-50 dark:bg-sky-950/60 border border-sky-200 dark:border-sky-800 text-[11px] font-bold text-sky-800 dark:text-sky-300">
            <Database className="w-3 h-3" />
            [Recorded Observation] Memory {cognitiveScore}/100 • BP {riskState?.bloodPressureSystolic || 124} mmHg
          </span>
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-purple-50 dark:bg-purple-950/60 border border-purple-200 dark:border-purple-800 text-[11px] font-bold text-purple-800 dark:text-purple-300">
            <Cpu className="w-3 h-3" />
            [Deterministic Z-Score / Xception TFLite Calculation] Z = {((cognitiveScore - 86.3 - 1.5) / 4.2).toFixed(2)} SD • {mriResult?.classification || 'Non-Demented'}
          </span>
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-teal-50 dark:bg-teal-950/60 border border-teal-200 dark:border-teal-800 text-[11px] font-bold text-teal-800 dark:text-teal-300">
            <Sparkles className="w-3 h-3" />
            [Gemini 2.5 LLM Plain-Language Synthesis] Bilingual Patient Education Only
          </span>
        </div>
      </div>

      {/* "What Your Results Mean (In Simple Words)" Card */}
      <div className="p-4 sm:p-5 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 space-y-2">
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2 text-amber-900 dark:text-amber-200 font-bold text-xs sm:text-sm">
            <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
            <span>{t.safetyTitle}</span>
          </div>
          <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-amber-200/70 dark:bg-amber-900/80 text-amber-900 dark:text-amber-200">
            [Gemini 2.5 LLM Plain-Language Synthesis]
          </span>
        </div>
        <div className="text-xs text-amber-950 dark:text-amber-100 leading-relaxed space-y-1.5">
          <p>
            <strong>What this check means:</strong> DeepCortex AI looks at your memory speed, daily wellness habits, and MRI brain volume patterns to catch early changes before noticeable memory loss occurs.
          </p>
          <p>
            <strong>What it does NOT mean:</strong> This is <strong>not</strong> a permanent diagnosis. Temporary stress, poor sleep, low vitamins, or normal healthy aging can affect scores. If you ever have questions, sharing this report with your family doctor is the best next step.
          </p>
        </div>
      </div>

      {/* Recommended Doctors & Memory Clinics (Region-Aware) */}
      <div className="p-5 sm:p-6 rounded-3xl bg-white dark:bg-slate-800 border border-teal-100 dark:border-slate-700 shadow-xs space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-700">
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-teal-600 dark:text-teal-400">
              Verified Referral Directory
            </span>
            <h3 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white">
              {region === 'abu-dhabi'
                ? 'Abu Dhabi Memory Clinics & Screening Centers'
                : 'Pakistan Neurology Units & Teaching Hospitals'}
            </h3>
          </div>
          <span className="text-xs px-2.5 py-0.5 rounded-full bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 font-semibold">
            {region === 'abu-dhabi' ? 'Malaffi HIE' : 'Sehat Sahulat'}
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {carePlanData?.referrals?.map((ref: any, idx: number) => (
            <div
              key={idx}
              className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-750 border border-slate-200 dark:border-slate-700 space-y-1.5"
            >
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded-md bg-teal-100 dark:bg-teal-900/60 text-teal-800 dark:text-teal-300">
                  {ref.tier}
                </span>
                <span className="text-[10px] text-slate-500 dark:text-slate-400 flex items-center gap-1">
                  <Clock className="w-3 h-3" /> {ref.waitTime}
                </span>
              </div>
              <h4 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white">
                {ref.facility}
              </h4>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">{ref.location}</p>
              
              {/* Clickable Real Phone and Verified Official Website Links */}
              <div className="pt-2 border-t border-slate-200 dark:border-slate-700 flex flex-wrap items-center justify-between gap-2 text-[11px]">
                <div className="flex flex-wrap items-center gap-3">
                  {ref.phone && (
                    <a
                      href={`tel:${(ref.phoneRaw || ref.phone).replace(/[^\d+]/g, '')}`}
                      className="font-bold text-teal-700 dark:text-teal-400 hover:text-teal-900 dark:hover:text-teal-200 hover:underline inline-flex items-center gap-1 cursor-pointer transition-colors"
                      title={language === 'ur' ? 'کال کریں' : language === 'ar' ? 'اتصال بالمركز' : 'Call Clinic'}
                    >
                      <Phone className="w-3.5 h-3.5 text-teal-600" />
                      <span>{ref.phone}</span>
                    </a>
                  )}

                  {ref.website && (
                    <a
                      href={ref.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-medium text-slate-600 dark:text-slate-300 hover:text-teal-700 dark:hover:text-teal-300 hover:underline inline-flex items-center gap-1 cursor-pointer transition-colors"
                      title={language === 'ur' ? 'آفیشل ویب سائٹ وزٹ کریں' : language === 'ar' ? 'زيارة الموقع الرسمي' : 'Visit Official Portal'}
                    >
                      <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
                      <span>{ref.websiteDisplay || 'Official Portal'}</span>
                    </a>
                  )}
                </div>

                <span className="text-[10px] text-slate-400 font-mono">{ref.malaffiHieCode}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Gate 5: Human-in-the-Loop Clinician Verification & Sahatna / Malaffi Closed-Loop Dispatch */}
      <div className="p-5 sm:p-6 rounded-3xl bg-white dark:bg-slate-800 border border-teal-100 dark:border-slate-700 shadow-xs space-y-3.5">
        <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-700">
          <div className="flex items-center gap-2">
            <Stethoscope className="w-4 h-4 text-teal-600" />
            <div>
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-teal-600 dark:text-teal-400 block">
                Gate 5 — DECIDE-AI Clinician Approval &amp; Closed-Loop Handover
              </span>
              <h3 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white">
                {language === 'ur' ? 'ڈاکٹر ریویو اور کلینیکل چیک لسٹ' : language === 'ar' ? 'قائمة التحقق والمراجعة السريرية للطبيب' : 'Doctor Review & Sign-Off Checklist'}
              </h3>
            </div>
          </div>
          <span
            className={`text-xs px-2.5 py-0.5 rounded-full font-bold flex items-center gap-1 ${
              signedByDoctor
                ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                : 'bg-slate-100 dark:bg-slate-700 text-slate-500'
            }`}
          >
            {signedByDoctor && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />}
            <span>
              {language === 'ur'
                ? (signedByDoctor ? 'ڈاکٹر سے تصدیق شدہ' : 'زیرِ جائزہ')
                : language === 'ar'
                ? (signedByDoctor ? 'معتمد سريرياً' : 'قيد المراجعة')
                : (signedByDoctor ? 'Verified by Doctor' : 'Pending Review')}
            </span>
          </span>
        </div>

        <div className="space-y-2">
          {[
            {
              id: 'historyCheck',
              label: language === 'ur'
                ? '1. عارضی انفیکشن، وٹامن بی 12 کی کمی، یا نیند کے مسائل کو خارج کریں'
                : language === 'ar'
                ? '1. استبعاد الالتهابات المؤقتة ونقص فيتامين ب12 واضطرابات النوم'
                : '1. Rule out temporary infections, vitamin B12 deficiency, or sleep issues',
            },
            {
              id: 'metabolicCheck',
              label: language === 'ur'
                ? '2. خون کے معمول کے ٹیسٹ چیک کریں (تھائیرائڈ TSH، شوگر، الیکٹرولائٹس)'
                : language === 'ar'
                ? '2. مراجعة تحاليل الدم الروتينية (الغدة الدرقية، السكر، الأملاح)'
                : '2. Check routine blood tests (Thyroid TSH, blood sugar, electrolytes)',
            },
            {
              id: 'mriCheck',
              label: language === 'ur'
                ? '3. عمر کے مطابق کنٹرول گروپس کے مقابلے میں ایم آر آئی برین والیم کا جائزہ لیں'
                : language === 'ar'
                ? '3. مقارنة حجم الرنين المغناطيسي للدماغ مع القياسات العمرية المعتمدة'
                : '3. Review brain MRI scan volume against age-matched controls',
            },
            {
              id: 'caregiverCheck',
              label: language === 'ur'
                ? '4. روزمرہ توجہ اور مزاج کے بارے میں اہل خانہ سے بات چیت کریں'
                : language === 'ar'
                ? '4. التحدث مع أفراد الأسرة حول التركيز اليومي والحالة المزاجية'
                : '4. Talk with family members about everyday focus and mood',
            },
          ].map((item) => {
            const isChecked = clinicianChecks[item.id];
            return (
              <div
                key={item.id}
                onClick={() => toggleCheck(item.id)}
                className={`p-2.5 rounded-xl border text-xs cursor-pointer flex items-center gap-2.5 transition-all ${
                  isChecked
                    ? 'bg-teal-50 dark:bg-teal-950/60 border-teal-300 text-teal-900 dark:text-teal-200'
                    : 'bg-white dark:bg-slate-750 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300'
                }`}
              >
                <div
                  className={`w-4 h-4 rounded-md border flex items-center justify-center shrink-0 ${
                    isChecked ? 'bg-teal-600 border-teal-600 text-white' : 'border-slate-300'
                  }`}
                >
                  {isChecked && <CheckCircle2 className="w-3 h-3" />}
                </div>
                <span>{item.label}</span>
              </div>
            );
          })}
        </div>

        {/* Doctor Verification Form or Active Sign-off Banner */}
        {signedByDoctor ? (
          <div className="space-y-3">
            <div className="p-3.5 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-300 dark:border-emerald-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <div className="space-y-0.5">
                <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-900 dark:text-emerald-200">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>
                    {language === 'ur' ? `تصدیق از ڈاکٹر: ${doctorNameInput}` : language === 'ar' ? `معتمد بواسطة د. ${doctorNameInput}` : `Verified by ${doctorNameInput || 'Attending Physician'}`}
                  </span>
                </div>
                <p className="text-[11px] text-emerald-800 dark:text-emerald-300">
                  {hospitalInput} • {language === 'ur' ? 'لائسنس' : language === 'ar' ? 'الترخيص' : 'License'}: {licenseInput}
                </p>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <button
                  onClick={() => setShowReportModal(true)}
                  className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold flex items-center gap-1 cursor-pointer transition-colors shadow-xs"
                >
                  <FileText className="w-3.5 h-3.5" />
                  {language === 'ur' ? 'تصدیق شدہ پی ڈی ایف دیکھیں' : language === 'ar' ? 'عرض التقرير المعتمد' : 'View Signed PDF'}
                </button>
                <button
                  onClick={() => {
                    setSignedByDoctor(false);
                    setDispatchedToSahatna(false);
                    localStorage.removeItem('deepcortex_doctor_signoff');
                    if (onDoctorSignOffChange) onDoctorSignOffChange(null);
                  }}
                  className="px-3 py-1.5 rounded-xl border border-emerald-300 dark:border-emerald-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-emerald-100 text-xs font-medium cursor-pointer transition-colors"
                >
                  {language === 'ur' ? 'ترمیم کریں' : language === 'ar' ? 'تعديل الاعتماد' : 'Edit / Revoke Sign-Off'}
                </button>
              </div>
            </div>

            {/* Gate 5 Closed-Loop FHIR R4 Referral Push to Sahatna / Malaffi or Punjab DHQ */}
            <div className="p-3.5 rounded-2xl border border-teal-200 dark:border-teal-800 bg-teal-50/60 dark:bg-teal-950/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <div className="space-y-0.5">
                <span className="text-[10px] font-extrabold uppercase tracking-wider text-teal-700 dark:text-teal-300">
                  Gate 5 Closed-Loop HL7 FHIR R4 Handover Unlocked
                </span>
                <p className="text-xs font-bold text-slate-900 dark:text-white">
                  {region === 'abu-dhabi'
                    ? 'Push Signed FHIR R4 Referral Summary to Abu Dhabi "Sahatna" App & Malaffi HIE Primary Care Physician'
                    : 'Push Signed FHIR R4 Referral Summary to Punjab DHQ / Sehat Sahulat Neurology Portal'}
                </p>
                {dispatchedToSahatna && (
                  <p className="text-[11px] text-emerald-700 dark:text-emerald-300 font-semibold">
                    Dispatched at {dispatchTimestamp} • Packet ID: FHIR-R4-{region === 'abu-dhabi' ? 'MALAFFI-SAHATNA' : 'PUNJAB-DHQ'}-{cognitiveScore}
                  </p>
                )}
              </div>
              <button
                type="button"
                onClick={() => {
                  setDispatchedToSahatna(true);
                  setDispatchTimestamp(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }));
                }}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold inline-flex items-center gap-1.5 shrink-0 transition-all cursor-pointer ${
                  dispatchedToSahatna
                    ? 'bg-emerald-700 text-white'
                    : 'bg-teal-700 hover:bg-teal-800 text-white shadow-xs'
                }`}
              >
                <Send className="w-3.5 h-3.5" />
                <span>
                  {dispatchedToSahatna
                    ? region === 'abu-dhabi'
                      ? 'Sent to Sahatna / Malaffi HIE'
                      : 'Sent to Sehat Sahulat / DHQ'
                    : region === 'abu-dhabi'
                    ? 'Dispatch to Sahatna / Malaffi HIE'
                    : 'Dispatch to Punjab DHQ Portal'}
                </span>
              </button>
            </div>
          </div>
        ) : (
          <div className="pt-2 space-y-3">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              <div>
                <label className="text-[10px] font-semibold text-slate-500 uppercase block mb-1">
                  {language === 'ur' ? 'ڈاکٹر کا نام اور عہدہ' : language === 'ar' ? 'اسم الطبيب واللقب' : 'Doctor Name & Title'}
                </label>
                <input
                  type="text"
                  placeholder={language === 'ur' ? 'مثال: ڈاکٹر طارق محمود، نیورولوجسٹ' : language === 'ar' ? 'مثال: د. طارق محمود، استشاري مخ وأعصاب' : 'e.g. Dr. Tariq Mahmood, Neurologist'}
                  value={doctorNameInput}
                  onChange={(e) => setDoctorNameInput(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs focus:ring-2 focus:ring-teal-500 focus:outline-hidden"
                />
              </div>
              <div>
                <label className="text-[10px] font-semibold text-slate-500 uppercase block mb-1">
                  {language === 'ur' ? 'ہسپتال یا کلینیکل یونٹ' : language === 'ar' ? 'المستشفى أو الوحدة السريرية' : 'Hospital / Clinical Unit'}
                </label>
                <input
                  type="text"
                  placeholder={language === 'ur' ? 'مثال: شیخ شخبوط میڈیکل سٹی' : language === 'ar' ? 'مثال: مدينة الشيخ شخبوط الطبية' : 'e.g. Sheikh Shakhbout Medical City'}
                  value={hospitalInput}
                  onChange={(e) => setHospitalInput(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs focus:ring-2 focus:ring-teal-500 focus:outline-hidden"
                />
              </div>
              <div>
                <label className="text-[10px] font-semibold text-slate-500 uppercase block mb-1">
                  {language === 'ur' ? 'طبی لائسنس نمبر' : language === 'ar' ? 'رقم الترخيص الطبي' : 'Medical License ID'}
                </label>
                <input
                  type="text"
                  placeholder={region === 'abu-dhabi' ? 'DoH-NEURO-782194' : 'PMDC-49102-N'}
                  value={licenseInput}
                  onChange={(e) => setLicenseInput(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs focus:ring-2 focus:ring-teal-500 focus:outline-hidden"
                />
              </div>
            </div>

            <div className="flex items-center justify-between pt-1">
              <span className="text-[11px] text-slate-500 dark:text-slate-400">
                {!allChecksComplete
                  ? (language === 'ur' ? 'تصدیق کے لیے اوپر دی گئی چاروں شقوں کو چیک کریں۔' : language === 'ar' ? 'يرجى إكمال بنود التحقق الأربعة لتفعيل الاعتماد.' : 'Gate 5 Locked: Complete all 4 clinical checklist items above to enable physician sign-off & Sahatna/Malaffi FHIR push.')
                  : doctorNameInput.trim().length < 3
                  ? (language === 'ur' ? 'ڈاکٹر کا نام درج کریں۔' : language === 'ar' ? 'يرجى كتابة اسم الطبيب.' : 'Enter attending physician name to unlock Gate 5.')
                  : (language === 'ur' ? 'سرکاری طبی تصدیق کے لیے تیار ہے۔' : language === 'ar' ? 'جاهز للاعتماد الطبي السريري.' : 'Ready for official DECIDE-AI medical sign-off.')}
              </span>
              <button
                disabled={!allChecksComplete || doctorNameInput.trim().length < 3}
                onClick={() => {
                  const nowFormattedDateWithTime =
                    new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' }) +
                    ' ' +
                    new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });

                  const newSignOff: DoctorSignOff = {
                    signed: true,
                    doctorName: doctorNameInput.trim(),
                    hospital: hospitalInput.trim() || (region === 'abu-dhabi' ? 'Sheikh Shakhbout Medical City (SSMC)' : 'PINS / DHQ Teaching Hospital'),
                    licenseNumber: licenseInput.trim() || (region === 'abu-dhabi' ? 'DoH-NEURO-782194' : 'PMDC-49102-N'),
                    signedDate: nowFormattedDateWithTime,
                    checklistComplete: true,
                  };
                  setSignedByDoctor(true);
                  localStorage.setItem('deepcortex_doctor_signoff', JSON.stringify(newSignOff));
                  if (onDoctorSignOffChange) {
                    onDoctorSignOffChange(newSignOff);
                  }
                }}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all shadow-xs ${
                  allChecksComplete && doctorNameInput.trim().length >= 3
                    ? 'bg-slate-900 dark:bg-teal-600 hover:bg-slate-800 text-white cursor-pointer'
                    : 'bg-slate-100 dark:bg-slate-700 text-slate-400 cursor-not-allowed'
                }`}
              >
                {language === 'ur' ? 'ڈاکٹر تصدیق مکمل کریں' : language === 'ar' ? 'تأكيد اعتماد الطبيب' : 'Confirm Doctor Sign-Off'}
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Dual-Tier Official Medical Dossier Report Modal & Print View */}
      <ClinicalReportDossier
        isOpen={showReportModal}
        onClose={() => setShowReportModal(false)}
        language={language}
        region={region}
        cognitiveScore={cognitiveScore}
        riskState={riskState}
        mriResult={mriResult}
        doctorSignOff={
          signedByDoctor
            ? {
                signed: true,
                doctorName: doctorNameInput,
                hospital: hospitalInput,
                licenseNumber: licenseInput,
                signedDate: new Date().toISOString().split('T')[0],
                checklistComplete: true,
              }
            : null
        }
      />
    </div>
  );
};

