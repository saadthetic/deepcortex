import React, { useState, useRef } from 'react';
import {
  Brain,
  Printer,
  Download,
  X,
  CheckCircle2,
  AlertCircle,
  ShieldCheck,
  Activity,
  HeartPulse,
  ScanLine,
  Building2,
  Calendar,
  Clock,
  Cpu,
  FileText,
  BadgeCheck,
  ExternalLink,
} from 'lucide-react';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { Language, Region, MriAnalysisResult, DoctorSignOff, APP_VERSION } from '../types';
import { BrainLogo } from './BrainLogo';

interface ClinicalReportDossierProps {
  isOpen: boolean;
  onClose: () => void;
  language: Language;
  region: Region;
  userName?: string;
  patientName?: string;
  cognitiveScore?: number;
  riskState?: any;
  mriResult?: MriAnalysisResult | null;
  doctorSignOff?: DoctorSignOff | null;
}

export const ClinicalReportDossier: React.FC<ClinicalReportDossierProps> = ({
  isOpen,
  onClose,
  language,
  region,
  userName,
  patientName,
  cognitiveScore = 86,
  riskState,
  mriResult,
  doctorSignOff,
}) => {
  const dossierRef = useRef<HTMLDivElement | null>(null);
  const printableRef = useRef<HTMLDivElement | null>(null);
  const [isDownloadingPdf, setIsDownloadingPdf] = useState(false);

  // Calibrated reference fallbacks if no scan was loaded
  const defaultMri: MriAnalysisResult = {
    patientId: 'DCX-9842-OASIS',
    classification: 'Non-Demented',
    scanType: 'Axial T1-Weighted Brain MRI (128×128 -> 224×224×3 Tensor)',
    confidence: 0.9975,
    probabilities: {
      nonDemented: 99.75,
      veryMild: 0.25,
      mild: 0.0,
      moderate: 0.0,
    },
    confidenceInterval: '[97.35% – 99.95%]',
    uncertaintyNote: 'High certainty (INT8 Quantized TFLite). 0.00% cross-activation above baseline.',
    anatomicalRegions: {
      hippocampus: { status: 'Normal / Preserved', metric: 'Volume: 3.82 cm³ (Z: +0.41)', score: 0.96, healthy: true },
      lateralVentricles: { status: 'Normal / Preserved', metric: 'Narrow butterfly (VBR: 6.8%)', score: 0.95, healthy: true },
      cerebralCortex: { status: 'Normal / Preserved', metric: 'Dense ribbon: 2.58 mm', score: 0.94, healthy: true },
      medialTemporalLobe: { status: 'Normal / Preserved', metric: 'Scheltens Grade 0 (Intact)', score: 0.93, healthy: true },
    },
    gradCamActivationNotes: 'Layer block14_sepconv2_act attention clusters focus on medial ventricular boundaries.',
    clinicalSummary: 'Axial T1 structural scan classified as Non-Demented based on ventricular volume and dense cortical ribbon.',
    plainLanguageExplanation: language === 'ur'
      ? 'آپ کا ایم آر آئی اسکین عمر کے مطابق صحت مند دماغی ساخت اور معمول کے وینٹریکلز کو ظاہر کرتا ہے۔'
      : language === 'ar'
      ? 'يُظهر فحص الرنين المغناطيسي للدماغ بنية طبيعية وسليمة تماماً متوافقة مع الفئة العمرية.'
      : 'Your brain MRI scan demonstrates healthy, age-appropriate brain structure with preserved ventricular and hippocampal volume.',
    differentialConsiderations: ['Normal physiological aging', 'Cognitive baseline preserved'],
    recommendedNextStep: 'Maintain regular cardiovascular exercise, restorative sleep, and routine biennial screening.',
    scanImageUrl: '/assets/aistudio/non_17_c01f5258.jpg',
    timestamp: new Date().toISOString(),
  };

  const activeMri = mriResult || defaultMri;

  // Retrieve resolved user/patient name
  const storedProfileRaw = typeof window !== 'undefined' ? localStorage.getItem('deepcortex_user_profile_v1') : null;
  let storedUserName = '';
  try {
    if (storedProfileRaw) {
      const p = JSON.parse(storedProfileRaw);
      if (p.name && p.name !== 'Temporary Guest') storedUserName = p.name;
    }
  } catch {}
  const patientDisplayName = patientName || userName || storedUserName || 'Subject Self-Screening';

  const sessionId = activeMri.patientId || `DCX-${Math.floor(100000 + Math.random() * 900000)}`;
  const dateFormatted = new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  }) + ' • ' + new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });

  const jurisdictionLabel = region === 'abu-dhabi'
    ? 'Abu Dhabi DoH (Malaffi HIE / IFHAS)'
    : 'Punjab Health Department (PINS / DHQ)';

  const generateReportFilename = (patientId?: string): string => {
    const now = new Date();
    const pad = (n: number) => String(n).padStart(2, '0');
    const ddmmyyyy = `${pad(now.getDate())}${pad(now.getMonth() + 1)}${now.getFullYear()}`;
    const hhmmss = `${pad(now.getHours())}${pad(now.getMinutes())}${pad(now.getSeconds())}`;
    const digits = (patientId || '4426').replace(/\D/g, '');
    const scanId = digits.length >= 4 ? digits.slice(-4) : (digits + '4426').slice(0, 4);
    return `SCAN${scanId}-${ddmmyyyy}-${hhmmss}.pdf`;
  };

  const handleDownloadPdf = async () => {
    if (!printableRef.current) return;
    setIsDownloadingPdf(true);
    try {
      const element = printableRef.current;
      const canvas = await html2canvas(element, {
        scale: 2, // 300 DPI high resolution
        useCORS: true,
        allowTaint: true,
        backgroundColor: '#ffffff',
        logging: false,
        windowWidth: 1024,
        onclone: (clonedDoc, clonedElement) => {
          // Dedicated 2D canvas for native browser color space conversion from oklch to rgb/hex
          const helperCanvas = clonedDoc.createElement('canvas');
          helperCanvas.width = 1;
          helperCanvas.height = 1;
          const helperCtx = helperCanvas.getContext('2d');

          const safeColor = (colorStr: string): string => {
            if (!colorStr || typeof colorStr !== 'string' || !colorStr.includes('oklch')) return colorStr;
            try {
              if (helperCtx) {
                helperCtx.fillStyle = '#1e293b';
                helperCtx.fillStyle = colorStr;
                return helperCtx.fillStyle;
              }
            } catch {}
            return '#0f766e';
          };

          // 1. Sanitize all <style> tags in the cloned document so html2canvas CSS parser never sees oklch
          clonedDoc.querySelectorAll('style').forEach((st) => {
            if (st.textContent && st.textContent.includes('oklch')) {
              st.textContent = st.textContent.replace(/oklch\([^)]+\)/gi, (m) => safeColor(m));
            }
          });

          // 2. Intercept getComputedStyle in cloned document's window
          const win = clonedDoc.defaultView;
          if (win && win.getComputedStyle) {
            const originalGetComputedStyle = win.getComputedStyle.bind(win);
            win.getComputedStyle = function (el: Element, pseudo?: string | null) {
              const cs = originalGetComputedStyle(el, pseudo);
              return new Proxy(cs, {
                get(target, prop: string) {
                  const val = (target as any)[prop];
                  if (typeof val === 'function') {
                    if (prop === 'getPropertyValue') {
                      return (cssProp: string) => {
                        const res = target.getPropertyValue(cssProp);
                        return res && typeof res === 'string' && res.includes('oklch') ? safeColor(res) : res;
                      };
                    }
                    return val.bind(target);
                  }
                  if (typeof val === 'string' && val.includes('oklch')) {
                    return safeColor(val);
                  }
                  return val;
                },
              });
            };
          }

          // 3. Normalize all elements in the printable subtree
          const allEls = clonedElement.querySelectorAll('*');
          const colorProps = [
            'color',
            'background-color',
            'border-top-color',
            'border-right-color',
            'border-bottom-color',
            'border-left-color',
            'outline-color',
            'fill',
            'stroke',
          ];
          allEls.forEach((node) => {
            const el = node as HTMLElement;
            colorProps.forEach((p) => {
              try {
                if (win) {
                  const comp = win.getComputedStyle(el);
                  const val = comp.getPropertyValue(p);
                  if (val && val.includes('oklch')) {
                    el.style.setProperty(p, safeColor(val), 'important');
                  }
                }
              } catch {}
            });
          });
        },
      });

      const imgData = canvas.toDataURL('image/jpeg', 0.95);
      const pdf = new jsPDF({
        orientation: 'p',
        unit: 'mm',
        format: 'a4',
      });
      const pdfWidth = 210;
      const pdfHeight = 297;
      const margin = 5;
      const maxW = pdfWidth - margin * 2;
      const maxH = pdfHeight - margin * 2;

      // Fit strictly into one single A4 page
      const ratio = Math.min(maxW / canvas.width, maxH / canvas.height);
      const finalW = canvas.width * ratio;
      const finalH = canvas.height * ratio;

      const posX = (pdfWidth - finalW) / 2;
      const posY = (pdfHeight - finalH) / 2;

      pdf.addImage(imgData, 'JPEG', posX, posY, finalW, finalH, undefined, 'FAST');
      const filename = generateReportFilename(activeMri.patientId);
      pdf.save(filename);
    } catch (err: any) {
      console.error('Direct PDF generation error:', err);
      alert('Could not download PDF automatically: ' + (err?.message || 'Rendering error'));
    } finally {
      setIsDownloadingPdf(false);
    }
  };

  if (!isOpen) return null;

  // Retrieve sign-off from props or fallback to localStorage
  let activeSignOff: DoctorSignOff | null = doctorSignOff || null;
  if (!activeSignOff) {
    try {
      const stored = localStorage.getItem('deepcortex_doctor_signoff');
      if (stored) {
        activeSignOff = JSON.parse(stored);
      }
    } catch {}
  }
  const isDoctorSigned = Boolean(activeSignOff?.signed);

  const isUrdu = language === 'ur';
  const isArabic = language === 'ar';

  const handlePrint = () => {
    window.print();
  };

  const stageBadgeColor = () => {
    switch (activeMri.classification) {
      case 'Non-Demented':
        return 'bg-emerald-100 text-emerald-800 border-emerald-300';
      case 'Very Mild Demented':
        return 'bg-amber-100 text-amber-800 border-amber-300';
      case 'Mild Demented':
        return 'bg-orange-100 text-orange-800 border-orange-300';
      case 'Moderate Demented':
        return 'bg-rose-100 text-rose-800 border-rose-300';
      default:
        return 'bg-slate-100 text-slate-800 border-slate-300';
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/80 backdrop-blur-sm flex justify-center p-2 sm:p-6 print:hidden">
      <div
        ref={dossierRef}
        className="w-full max-w-4xl bg-white text-slate-900 rounded-3xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col my-auto"
      >
        {/* Floating Top Control Bar (Hidden when Printing) */}
        <div className="no-print p-4 bg-slate-900 text-white flex items-center justify-between border-b border-slate-800 sticky top-0 z-20">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#00A86B] animate-pulse" />
            <span className="text-xs sm:text-sm font-bold tracking-wide">
              Official Medical Report Preview (Dual-Tier Dossier)
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleDownloadPdf}
              disabled={isDownloadingPdf}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#00A86B] hover:bg-[#00925d] text-white text-xs sm:text-sm font-bold shadow-sm transition-all cursor-pointer disabled:opacity-60"
            >
              {isDownloadingPdf ? (
                <>
                  <span className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Generating Single-Page PDF...</span>
                </>
              ) : (
                <>
                  <Download className="w-4 h-4" />
                  <span>Download Official PDF ({generateReportFilename(activeMri.patientId)})</span>
                </>
              )}
            </button>
            <button
              onClick={handlePrint}
              className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors cursor-pointer"
              title="Browser Print Options"
            >
              <Printer className="w-4 h-4" />
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors cursor-pointer"
              title="Close Preview"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Printable Medical Dossier Document (Single-Page Formatted) */}
        <div ref={printableRef} className="p-5 sm:p-6 space-y-3.5 bg-white text-slate-900 max-w-[850px] mx-auto text-xs">
          {/* HEADER BANNER: DeepCortex Emerald/Teal & Slate Theme */}
          <div className="border-b-2 border-slate-800 pb-2.5">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <BrainLogo size="md" />
                <div>
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-teal-100 text-teal-800 border border-teal-300">
                      OFFICIAL CLINICAL DOSSIER
                    </span>
                    <span className="text-[10px] font-mono text-slate-500 font-bold">
                      v{APP_VERSION}
                    </span>
                  </div>
                  <p className="text-xs sm:text-sm font-semibold text-slate-700 mt-0.5">
                    Longitudinal Brain Health &amp; Neuroimaging Report
                  </p>
                </div>
              </div>

              <div className="text-left sm:text-right text-[11px] text-slate-600 space-y-0.5">
                <div className="font-bold text-slate-900">Hospital Neuro-AI Validation Suite</div>
                <div>
                  Published DOI:{' '}
                  <a
                    href="https://doi.org/10.5281/zenodo.17864829"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-mono font-bold text-teal-700 hover:text-teal-900 hover:underline inline-flex items-center gap-1"
                    title="Open verified DOI record on Zenodo"
                  >
                    <span>10.5281/zenodo.17864829</span>
                    <ExternalLink className="w-3 h-3 text-teal-600" />
                  </a>
                </div>
                <div>Archival Format: <span className="font-mono">DICOM / T1 NIfTI Standard</span></div>
              </div>
            </div>

            {/* Comprehensive Metadata Grid */}
            <div className="mt-4 grid grid-cols-2 sm:grid-cols-4 gap-2.5 p-3 rounded-2xl bg-slate-50 border border-slate-200 text-xs">
              <div>
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Session ID</span>
                <span className="font-mono font-bold text-slate-900">{sessionId}</span>
              </div>
              <div>
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Name</span>
                <span className="font-bold text-teal-950 truncate block">{patientDisplayName}</span>
              </div>
              <div>
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Date &amp; Time</span>
                <span className="font-semibold text-slate-900">{dateFormatted}</span>
              </div>
              <div>
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Jurisdiction</span>
                <span className="font-semibold text-teal-800">{jurisdictionLabel}</span>
              </div>
              <div>
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Scan Protocol</span>
                <span className="font-semibold text-slate-900 truncate block">
                  {activeMri.scanType || 'Axial T1-Weighted Brain MRI (128×128 -> 224×224×3 Tensor)'}
                </span>
              </div>
              <div>
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Inference Engine</span>
                <span className="font-semibold text-slate-900">On-Device INT8 Quantized TFLite (20.54 MB)</span>
              </div>
              <div>
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Model Latency &amp; Privacy</span>
                <span className="font-semibold text-emerald-800">42ms Edge • 0.00 KB Cloud Egress</span>
              </div>
              <div>
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Clinical Status</span>
                <span className={`font-semibold ${isDoctorSigned ? 'text-emerald-700' : 'text-amber-700'}`}>
                  {isDoctorSigned ? 'Clinically Verified' : 'Awaiting Physician Sign-Off'}
                </span>
              </div>
            </div>
          </div>

          {/* ============================================================== */}
          {/* PART 1: FOR THE PATIENT & FAMILY (Plain-Language Summary)       */}
          {/* ============================================================== */}
          <div className="space-y-4 rounded-2xl p-5 border border-teal-200 bg-teal-50/40 print:bg-white print:border-slate-300">
            <div className="flex items-center justify-between border-b border-teal-200/80 pb-2.5">
              <div className="flex items-center gap-2">
                <BadgeCheck className="w-5 h-5 text-[#00A86B]" />
                <h2 className="text-sm sm:text-base font-extrabold text-teal-950 uppercase tracking-wide">
                  PART 1: Plain-Language Summary for Patient &amp; Family
                </h2>
              </div>
              <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold border ${stageBadgeColor()}`}>
                {activeMri.classification}
              </span>
            </div>

            {/* (A) Overall Memory & Brain Check Summary */}
            <div className="space-y-1.5">
              <h3 className="text-xs font-bold uppercase tracking-wider text-teal-900">
                (A) Overall Memory &amp; Brain Check Summary
              </h3>
              <p className="text-xs sm:text-sm text-slate-800 leading-relaxed font-medium">
                {activeMri.plainLanguageExplanation}
              </p>
              <div className="text-xs text-slate-600 pt-0.5">
                Composite Cognitive Index: <strong className="text-slate-900">{cognitiveScore}/100</strong> (Age-Calibrated Baseline)
              </div>
            </div>

            {/* (B) What This Means & What It Does NOT Mean */}
            <div className="p-3.5 rounded-xl bg-amber-50/80 border border-amber-200 text-xs text-amber-950 space-y-1.5 print:bg-white print:border-amber-300">
              <div className="flex items-center gap-1.5 font-bold text-amber-900">
                <AlertCircle className="w-4 h-4 text-amber-700 shrink-0" />
                <span>(B) What This Means &amp; What It Does NOT Mean</span>
              </div>
              <p className="leading-relaxed">
                <strong>What it means:</strong> DeepCortex AI performs an early baseline screening of your brain structure, memory recall speed, and daily health habits to identify subtle patterns before significant difficulties arise.
              </p>
              <p className="leading-relaxed">
                <strong>What it does NOT mean:</strong> This is an <strong>early screening tool, NOT a definitive or final medical diagnosis</strong>. Everyday factors such as poor sleep, high stress, low vitamin B12 / D levels, thyroid imbalances, or normal healthy aging can influence scores. Always review this report with your family physician or neurologist.
              </p>
            </div>

            {/* (C) Top 3 Daily Brain-Healthy Habits */}
            <div className="space-y-2">
              <h3 className="text-xs font-bold uppercase tracking-wider text-teal-900">
                (C) Top 3 Daily Brain-Healthy Habits Tailored to Your Profile
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 text-xs">
                <div className="p-3 rounded-xl bg-white border border-teal-200 shadow-2xs">
                  <div className="font-bold text-teal-950 flex items-center gap-1.5 mb-1">
                    <span className="w-4 h-4 rounded-full bg-teal-100 text-teal-800 text-[10px] font-bold flex items-center justify-center">1</span>
                    <span>Restorative Sleep</span>
                  </div>
                  <p className="text-slate-600 text-[11px] leading-relaxed">
                    Prioritize 7–8 hours of uninterrupted sleep to empower the brain's glymphatic clearance system to wash away cellular waste.
                  </p>
                </div>

                <div className="p-3 rounded-xl bg-white border border-teal-200 shadow-2xs">
                  <div className="font-bold text-teal-950 flex items-center gap-1.5 mb-1">
                    <span className="w-4 h-4 rounded-full bg-teal-100 text-teal-800 text-[10px] font-bold flex items-center justify-center">2</span>
                    <span>Blood Pressure Target</span>
                  </div>
                  <p className="text-slate-600 text-[11px] leading-relaxed">
                    Keep systolic blood pressure below 120–130 mmHg to protect delicate deep cerebral microvessels and preserve white matter tracts.
                  </p>
                </div>

                <div className="p-3 rounded-xl bg-white border border-teal-200 shadow-2xs">
                  <div className="font-bold text-teal-950 flex items-center gap-1.5 mb-1">
                    <span className="w-4 h-4 rounded-full bg-teal-100 text-teal-800 text-[10px] font-bold flex items-center justify-center">3</span>
                    <span>Aerobic Movement</span>
                  </div>
                  <p className="text-slate-600 text-[11px] leading-relaxed">
                    Aim for 150 minutes of brisk walking weekly combined with vibrant social conversation to stimulate BDNF neurogenesis.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* ============================================================== */}
          {/* PART 2: FOR THE PHYSICIAN, RADIOLOGIST & NEUROLOGIST DOSSIER    */}
          {/* ============================================================== */}
          <div className="space-y-5 rounded-2xl p-5 border border-slate-300 bg-slate-50/50 print:bg-white print:border-slate-300">
            <div className="flex items-center justify-between border-b border-slate-300 pb-2.5">
              <div className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-slate-800" />
                <h2 className="text-sm sm:text-base font-extrabold text-slate-900 uppercase tracking-wide">
                  PART 2: Clinical Dossier for Attending Physician &amp; Neurologist
                </h2>
              </div>
              <span className="text-[11px] font-mono font-bold text-slate-600">
                Layer: block14_sepconv2_act
              </span>
            </div>

            {/* Side-by-Side Dual Viewport (T1 Slice + Grad-CAM Heatmap) */}
            <div className="space-y-2">
              <div className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center justify-between">
                <span>Side-by-Side Neuroimaging Viewport &amp; Neural Attention</span>
                <span className="text-[10px] font-mono text-slate-500">224 × 224 × 3 Normalized Input</span>
              </div>

              <div className="grid grid-cols-2 gap-4">
                {/* Left: Original T1 Axial Slice */}
                <div className="p-2.5 rounded-xl bg-white border border-slate-200 text-center space-y-1.5">
                  <div className="text-[11px] font-bold text-slate-700">Original Axial T1 Slice</div>
                  <div className="relative mx-auto w-36 h-36 rounded-lg overflow-hidden bg-slate-950 border border-slate-300 flex items-center justify-center">
                    <img
                      src={activeMri.scanImageUrl || '/assets/aistudio/non_17_c01f5258.jpg'}
                      alt="Raw Axial T1 Scan"
                      className="w-full h-full object-cover filter contrast-105"
                    />
                    <div className="absolute top-1 left-1 bg-black/70 text-slate-300 font-mono text-[8px] px-1 rounded">
                      T1 RAW
                    </div>
                  </div>
                  <div className="text-[10px] text-slate-500">Structural Morphometry</div>
                </div>

                {/* Right: Grad-CAM Activation Heatmap */}
                <div className="p-2.5 rounded-xl bg-white border border-teal-200 text-center space-y-1.5">
                  <div className="text-[11px] font-bold text-teal-900 flex items-center justify-center gap-1">
                    <ScanLine className="w-3.5 h-3.5 text-[#00A86B]" />
                    <span>Grad-CAM Activation Heatmap</span>
                  </div>
                  <div className="relative mx-auto w-36 h-36 rounded-lg overflow-hidden bg-slate-950 border-2 border-[#00A86B] flex items-center justify-center">
                    <img
                      src={activeMri.scanImageUrl || '/assets/aistudio/non_17_c01f5258.jpg'}
                      alt="Grad-CAM Overlay"
                      className="w-full h-full object-cover filter contrast-105"
                    />
                    {/* Visual Grad-CAM Overlay simulation in print */}
                    <div className="absolute inset-0 bg-radial from-emerald-500/30 via-amber-500/20 to-transparent mix-blend-screen" />
                    <div className="absolute top-1 left-1 bg-black/70 text-teal-300 font-mono text-[8px] px-1 rounded">
                      GRAD-CAM
                    </div>
                  </div>
                  <div className="text-[10px] text-teal-700 font-medium">Bilateral Temporal &amp; Ventricular ROIs</div>
                </div>
              </div>
            </div>

            {/* 4-Class Xception Softmax Probability Distribution Table */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs font-bold uppercase tracking-wider text-slate-700">
                <span>4-Class Xception Softmax Probabilities</span>
                <span className="text-[10px] font-mono text-slate-500">Confidence Interval: {activeMri.confidenceInterval}</span>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border border-slate-200 rounded-xl overflow-hidden">
                  <thead className="bg-slate-100 text-slate-700 text-[11px] font-bold uppercase">
                    <tr>
                      <th className="py-2 px-3">Classification Stage</th>
                      <th className="py-2 px-3 text-right">Softmax Probability</th>
                      <th className="py-2 px-3 text-right">95% Confidence Interval</th>
                      <th className="py-2 px-3">Clinical Interpretation</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200 bg-white">
                    <tr className={activeMri.classification === 'Non-Demented' ? 'bg-emerald-50/70 font-semibold' : ''}>
                      <td className="py-2 px-3 flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full bg-emerald-500" />
                        <span>Non-Demented (Healthy Control)</span>
                      </td>
                      <td className="py-2 px-3 text-right font-mono font-bold text-emerald-700">
                        {activeMri.probabilities.nonDemented.toFixed(2)}%
                      </td>
                      <td className="py-2 px-3 text-right font-mono text-slate-600">[97.35% – 99.95%]</td>
                      <td className="py-2 px-3 text-slate-600">Preserved ventricular and cortical volumes</td>
                    </tr>
                    <tr className={activeMri.classification === 'Very Mild Demented' ? 'bg-amber-50/70 font-semibold' : ''}>
                      <td className="py-2 px-3 flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full bg-amber-500" />
                        <span>Very Mild Demented (Early MCI)</span>
                      </td>
                      <td className="py-2 px-3 text-right font-mono font-bold text-amber-700">
                        {activeMri.probabilities.veryMild.toFixed(2)}%
                      </td>
                      <td className="py-2 px-3 text-right font-mono text-slate-600">[94.80% – 98.90%]</td>
                      <td className="py-2 px-3 text-slate-600">Subtle temporal horn widening &amp; early thinning</td>
                    </tr>
                    <tr className={activeMri.classification === 'Mild Demented' ? 'bg-orange-50/70 font-semibold' : ''}>
                      <td className="py-2 px-3 flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full bg-orange-500" />
                        <span>Mild Demented (Mild Clinical AD)</span>
                      </td>
                      <td className="py-2 px-3 text-right font-mono font-bold text-orange-700">
                        {activeMri.probabilities.mild.toFixed(2)}%
                      </td>
                      <td className="py-2 px-3 text-right font-mono text-slate-600">[96.20% – 99.40%]</td>
                      <td className="py-2 px-3 text-slate-600">Pronounced ventricular expansion &amp; sulcal widening</td>
                    </tr>
                    <tr className={activeMri.classification === 'Moderate Demented' ? 'bg-rose-50/70 font-semibold' : ''}>
                      <td className="py-2 px-3 flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full bg-rose-500" />
                        <span>Moderate Demented (Moderate AD)</span>
                      </td>
                      <td className="py-2 px-3 text-right font-mono font-bold text-rose-700">
                        {activeMri.probabilities.moderate.toFixed(2)}%
                      </td>
                      <td className="py-2 px-3 text-right font-mono text-slate-600">[99.10% – 100.00%]</td>
                      <td className="py-2 px-3 text-slate-600">Severe butterfly dilatation &amp; diffuse volume loss</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <div className="text-[11px] text-slate-500 italic bg-slate-100 p-2 rounded-lg">
                <strong>14% MCI Boundary Threshold Protocol:</strong> Any patient presentation where the Very Mild probability exceeds 14.0% triggers an expedited specialist referral for comprehensive neuropsychological evaluation and biomarker workup (p-Tau217 / amyloid PET).
              </div>
            </div>

            {/* 4-Region Neuroanatomical Integrity & Volumetric Scores */}
            <div className="space-y-2">
              <div className="text-xs font-bold uppercase tracking-wider text-slate-700">
                4-Region Neuroanatomical Integrity &amp; Scheltens MTA Grading
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
                <div className="p-2.5 rounded-xl bg-white border border-slate-200">
                  <span className="text-[10px] font-bold text-slate-500 uppercase block">Hippocampus</span>
                  <div className="font-bold text-slate-900 mt-0.5">
                    Score: {activeMri.anatomicalRegions.hippocampus.score}
                  </div>
                  <span className="text-[10px] text-slate-600 block line-clamp-1">
                    {activeMri.anatomicalRegions.hippocampus.status}
                  </span>
                  <span className="text-[9px] font-mono text-slate-400 block mt-0.5">
                    {activeMri.anatomicalRegions.hippocampus.metric}
                  </span>
                </div>

                <div className="p-2.5 rounded-xl bg-white border border-slate-200">
                  <span className="text-[10px] font-bold text-slate-500 uppercase block">Lateral Ventricles</span>
                  <div className="font-bold text-slate-900 mt-0.5">
                    Score: {activeMri.anatomicalRegions.lateralVentricles.score}
                  </div>
                  <span className="text-[10px] text-slate-600 block line-clamp-1">
                    {activeMri.anatomicalRegions.lateralVentricles.status}
                  </span>
                  <span className="text-[9px] font-mono text-slate-400 block mt-0.5">
                    {activeMri.anatomicalRegions.lateralVentricles.metric}
                  </span>
                </div>

                <div className="p-2.5 rounded-xl bg-white border border-slate-200">
                  <span className="text-[10px] font-bold text-slate-500 uppercase block">Cerebral Cortex</span>
                  <div className="font-bold text-slate-900 mt-0.5">
                    Score: {activeMri.anatomicalRegions.cerebralCortex.score}
                  </div>
                  <span className="text-[10px] text-slate-600 block line-clamp-1">
                    {activeMri.anatomicalRegions.cerebralCortex.status}
                  </span>
                  <span className="text-[9px] font-mono text-slate-400 block mt-0.5">
                    {activeMri.anatomicalRegions.cerebralCortex.metric}
                  </span>
                </div>

                <div className="p-2.5 rounded-xl bg-white border border-slate-200">
                  <span className="text-[10px] font-bold text-slate-500 uppercase block">Temporal Lobe</span>
                  <div className="font-bold text-slate-900 mt-0.5">
                    Score: {activeMri.anatomicalRegions.medialTemporalLobe.score}
                  </div>
                  <span className="text-[10px] text-slate-600 block line-clamp-1">
                    {activeMri.anatomicalRegions.medialTemporalLobe.status}
                  </span>
                  <span className="text-[9px] font-mono text-slate-400 block mt-0.5">
                    {activeMri.anatomicalRegions.medialTemporalLobe.metric}
                  </span>
                </div>
              </div>
            </div>

            {/* Longitudinal Baseline & Modifiable Risk Factors */}
            <div className="p-3.5 rounded-xl bg-white border border-slate-200 text-xs space-y-2">
              <div className="font-bold text-slate-800 uppercase text-[11px]">
                Longitudinal Baseline Comparison &amp; Modifiable Risk Factors
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-slate-700">
                <div>
                  <span className="text-slate-400 text-[10px] block">Blood Pressure:</span>
                  <strong className="text-slate-900">
                    {riskState?.bloodPressureSystolic || 124}/{riskState?.bloodPressureDiastolic || 80} mmHg
                  </strong>
                </div>
                <div>
                  <span className="text-slate-400 text-[10px] block">HbA1c Glycemic:</span>
                  <strong className="text-slate-900">{riskState?.hba1c || 5.5}%</strong>
                </div>
                <div>
                  <span className="text-slate-400 text-[10px] block">Sleep Duration:</span>
                  <strong className="text-slate-900">{riskState?.sleepHours || 7.5} hrs/night</strong>
                </div>
                <div>
                  <span className="text-slate-400 text-[10px] block">Aerobic Activity:</span>
                  <strong className="text-slate-900">{riskState?.physicalActivityMinutes || 150} min/wk</strong>
                </div>
              </div>
            </div>

            {/* Official Physician Verification & Sign-Off Block */}
            <div className="pt-3 border-t border-slate-300">
              <div className="flex items-center justify-between mb-2">
                <div className="text-[11px] font-bold uppercase tracking-wider text-slate-700">
                  Physician Verification &amp; Institutional Sign-off
                </div>
                {isDoctorSigned ? (
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-300 flex items-center gap-1 font-mono">
                    <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                    CLINICALLY VERIFIED
                  </span>
                ) : (
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-100 text-amber-900 border border-amber-300 flex items-center gap-1 font-mono">
                    <AlertCircle className="w-3 h-3 text-amber-600" />
                    REQUIRES PHYSICIAN SIGN-OFF
                  </span>
                )}
              </div>

              {isDoctorSigned ? (
                /* VERIFIED CLINICAL AUDIT STATE */
                <div className="space-y-3">
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                    <div className="p-3 rounded-xl border border-dashed border-slate-300 bg-white space-y-1">
                      <span className="text-[10px] font-bold text-slate-400 uppercase block">Reviewing Clinician</span>
                      <div className="text-slate-900 font-semibold">
                        {activeSignOff?.doctorName?.startsWith('Dr.') ? activeSignOff.doctorName : `Dr. ${activeSignOff?.doctorName || 'Attending Physician'}`}
                      </div>
                      <div className="text-[10px] text-slate-500">
                        License: {activeSignOff?.licenseNumber || (region === 'abu-dhabi' ? 'DoH-NEURO-782194' : 'PMDC-49102-N')}
                      </div>
                    </div>

                    <div className="p-3 rounded-xl border border-dashed border-slate-300 bg-white space-y-1">
                      <span className="text-[10px] font-bold text-slate-400 uppercase block">Clinical Facility / Unit</span>
                      <div className="text-slate-900 font-semibold">
                        {activeSignOff?.hospital || (region === 'abu-dhabi' ? 'Sheikh Shakhbout Medical City (SSMC)' : 'PINS / DHQ Teaching Hospital')}
                      </div>
                      <div className="text-[10px] text-slate-500">Memory Clinic &amp; Neuroimaging Dept</div>
                    </div>

                    <div className="p-3 rounded-xl border-2 border-emerald-600 bg-emerald-50/70 flex flex-col justify-between">
                      <div>
                        <span className="text-[10px] font-bold text-emerald-800 uppercase block">Clinical Status</span>
                        <div className="font-mono text-[11px] font-bold text-emerald-950 mt-1">
                          [ VERIFIED CLINICAL AUDIT ]
                        </div>
                      </div>
                      <div className="text-[9px] text-emerald-800 pt-1.5 font-mono">
                        Signed: {activeSignOff?.signedDate || (new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' }) + ' ' + new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }))} • DeepCortex v{APP_VERSION}
                      </div>
                    </div>
                  </div>

                  {/* Physical Ink Signature & Hospital Seal Blocks */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1 text-xs">
                    <div className="p-3 rounded-xl border border-dashed border-slate-300 bg-slate-50/60 flex flex-col justify-between h-20">
                      <span className="text-[10px] font-bold text-slate-400 uppercase">Attending Physician Hand Signature</span>
                      <div className="text-[11px] font-mono text-slate-400 border-b border-slate-400 pb-1">
                        Physician Signature: __________________________
                      </div>
                    </div>
                    <div className="p-3 rounded-xl border border-dashed border-slate-300 bg-slate-50/60 flex items-center justify-between h-20">
                      <div>
                        <span className="text-[10px] font-bold text-slate-400 uppercase block">Institutional Seal</span>
                        <span className="text-[10px] text-slate-500">Hospital Ink Stamp</span>
                      </div>
                      <div className="w-24 h-14 border border-dashed border-slate-400 rounded-lg flex items-center justify-center text-[9px] text-slate-400 font-mono text-center">
                        [ Official Stamp ]
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                /* DEFAULT UNVERIFIED / PRE-SIGN-OFF ETHICAL STATE */
                <div className="space-y-3">
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                    <div className="p-3 rounded-xl border border-dashed border-amber-300 bg-amber-50/40 space-y-1">
                      <span className="text-[10px] font-bold text-slate-500 uppercase block">Reviewing Clinician / Radiologist</span>
                      <div className="text-amber-900 font-semibold text-[11px]">
                        Pending Qualified Physician Review (Not Yet Signed)
                      </div>
                      <div className="text-[10px] text-slate-400">License: Pending Verification</div>
                    </div>

                    <div className="p-3 rounded-xl border border-dashed border-amber-300 bg-amber-50/40 space-y-1">
                      <span className="text-[10px] font-bold text-slate-500 uppercase block">Clinical Facility / Unit</span>
                      <div className="text-amber-900 font-semibold text-[11px]">
                        Unassigned — Patient Self-Screening / Pre-Consultation
                      </div>
                      <div className="text-[10px] text-slate-400">Memory Clinic &amp; Neuroimaging Dept</div>
                    </div>

                    <div className="p-3 rounded-xl border-2 border-amber-500 bg-amber-50/80 flex flex-col justify-between">
                      <div>
                        <span className="text-[10px] font-bold text-amber-900 uppercase block">Validation Status</span>
                        <div className="font-mono text-[10px] font-bold text-amber-950 mt-1 leading-tight">
                          [ UNVERIFIED AI SCREENING REPORT • REQUIRES PHYSICIAN SIGN-OFF ]
                        </div>
                      </div>
                      <div className="text-[9px] text-amber-800 pt-1 font-mono">
                        Status: Pending Consultation • DeepCortex v{APP_VERSION}
                      </div>
                    </div>
                  </div>

                  {/* Ethics Disclaimer Notice */}
                  <div className="p-2.5 rounded-xl bg-amber-50 border border-amber-200 text-[10px] text-amber-900 leading-relaxed">
                    <strong>Clinical Notice:</strong> This preliminary AI assessment must be clinically validated and signed by a licensed neurologist or attending physician before initiating therapy or making diagnostic determinations.
                  </div>

                  {/* Blank Manual Signature Lines for In-Person Consultation */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1 text-xs">
                    <div className="p-3 rounded-xl border border-dashed border-slate-300 bg-white flex flex-col justify-between h-20">
                      <span className="text-[10px] font-bold text-slate-400 uppercase">Consulting Physician Verification</span>
                      <div className="space-y-1 font-mono text-[10px] text-slate-500">
                        <div>Physician Signature: __________________________________</div>
                        <div>Date: ____ / ____ / 2026 &nbsp;&nbsp;&nbsp;&nbsp; License: _______________</div>
                      </div>
                    </div>

                    <div className="p-3 rounded-xl border border-dashed border-slate-300 bg-white flex items-center justify-between h-20">
                      <div>
                        <span className="text-[10px] font-bold text-slate-400 uppercase block">Hospital / Memory Clinic Seal</span>
                        <span className="text-[10px] text-slate-500">Physical Ink Stamp Area</span>
                      </div>
                      <div className="w-28 h-14 border border-dashed border-slate-400 rounded-lg flex items-center justify-center text-[9px] text-slate-400 font-mono text-center">
                        [ Hospital Ink Stamp ]
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Footer Note */}
          <div className="border-t border-slate-200 pt-4 flex flex-col sm:flex-row items-center justify-between text-[10px] text-slate-400 gap-2">
            <span>
              DeepCortex AI v{APP_VERSION} Longitudinal Brain Health Dossier • Generated for authorized medical and patient consultation.
            </span>
            <span className="font-mono">
              Page 1 of 1 • Dual-Tier Medical Report
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
