import React, { useState, useEffect, useRef } from 'react';
import { CloudUpload, Clock, Trash2, X } from 'lucide-react';
import { UserProfile, Language } from '../types';

interface PostScanSavePromptProps {
  isOpen: boolean;
  onClose: () => void;
  onSaveProfile: () => void;
  onEraseSession?: () => void;
  userProfile?: UserProfile;
  language: Language;
}

export const PostScanSavePrompt: React.FC<PostScanSavePromptProps> = ({
  isOpen,
  onClose,
  onSaveProfile,
  onEraseSession,
  userProfile,
  language,
}) => {
  const [secondsLeft, setSecondsLeft] = useState(5);
  const [isPaused, setIsPaused] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (!isOpen) {
      setSecondsLeft(5);
      setIsPaused(false);
      if (timerRef.current) clearInterval(timerRef.current);
      return;
    }

    setSecondsLeft(5);

    timerRef.current = setInterval(() => {
      setSecondsLeft((prev) => {
        if (isPaused) return prev;
        if (prev <= 1) {
          if (timerRef.current) clearInterval(timerRef.current);
          onClose();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isOpen, isPaused, onClose]);

  if (!isOpen) return null;

  const isUrdu = language === 'ur';
  const isArabic = language === 'ar';

  const title = isUrdu
    ? 'اپنا برین ہیلتھ پروفائل اور اسکین محفوظ کریں؟'
    : isArabic
    ? 'هل تريد حفظ ملفك العصبي وتقرير الرنين؟'
    : 'Save Your Brain Health Profile & MRI Report?';

  const body = isUrdu
    ? 'آپ اس وقت عارضی مہمان موڈ میں ہیں۔ اپنے اسکینز، 6 ماہ کا میموری بیس لائن اور پی ڈی ایف رپورٹس کلاؤڈ پر محفوظ کرنے کے لیے گوگل یا ای میل سے لاگ ان کریں، یا کسی بھی وقت ڈیٹا مٹا دیں۔'
    : isArabic
    ? 'أنت حالياً في وضع الزائر المؤقت. قم بتسجيل الدخول عبر Google أو البريد الإلكتروني لحفظ صور الرنين ومؤشر الذاكرة وتقاريرك بأمان، أو مسح الجلسة في أي وقت.'
    : 'You are currently in temporary Guest Mode. Sign in with Google or Email to securely back up your scans, 6-month memory baseline, and PDF reports, or keep as a guest.';

  return (
    <div
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      className="fixed bottom-6 left-4 right-4 sm:left-auto sm:right-6 sm:max-w-lg z-50 animate-in fade-in slide-in-from-bottom-5 duration-300"
    >
      <div className="p-4 sm:p-5 rounded-2xl bg-slate-900/95 dark:bg-slate-900/95 text-white shadow-2xl border border-teal-500/40 backdrop-blur-md space-y-3.5 relative overflow-hidden">
        {/* Animated 5-Second Countdown Bar at top */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-slate-800">
          <div
            className="h-full bg-gradient-to-r from-teal-400 to-[#00A86B] transition-all duration-1000 ease-linear"
            style={{ width: `${(secondsLeft / 5) * 100}%` }}
          />
        </div>

        <div className="flex items-start justify-between gap-3 pt-1">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-teal-500/20 text-teal-400 flex items-center justify-center shrink-0">
              <CloudUpload className="w-4 h-4" />
            </div>
            <div>
              <h4 className="text-xs sm:text-sm font-bold text-white">{title}</h4>
              <span className="text-[10px] text-teal-300 font-medium">
                {isUrdu
                  ? `${secondsLeft} سیکنڈ میں خودکار بندش • ڈیٹا تاریخ میں محفوظ رہے گا`
                  : isArabic
                  ? `إغلاق تلقائي خلال ${secondsLeft} ثوانٍ • يبقى محفوظاً بالسجل`
                  : `Auto-closing in ${secondsLeft}s (keeps data in local history)`}
              </span>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
            title="Close Prompt"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <p className="text-xs text-slate-300 leading-relaxed">{body}</p>

        <div className="flex flex-wrap items-center gap-2 pt-1">
          <button
            onClick={() => {
              onClose();
              onSaveProfile();
            }}
            className="flex-1 py-2 px-3 rounded-xl bg-teal-600 hover:bg-teal-500 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-sm transition-all cursor-pointer"
          >
            <CloudUpload className="w-3.5 h-3.5" />
            <span>{isUrdu ? 'پروفائل محفوظ کریں (گوگل / ای میل)' : isArabic ? 'حفظ الملف (Google / بريد)' : 'Save Profile (Google / Email)'}</span>
          </button>

          <button
            onClick={onClose}
            className="py-2 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold text-xs flex items-center gap-1 transition-all cursor-pointer"
          >
            <Clock className="w-3.5 h-3.5 text-slate-400" />
            <span>{isUrdu ? 'بعد میں (مہمان رہیں)' : isArabic ? 'لاحقاً (متابعة كزائر)' : 'Keep as Guest'}</span>
          </button>

          {onEraseSession && (
            <button
              onClick={onEraseSession}
              className="py-2 px-2.5 rounded-xl text-rose-400 hover:text-rose-300 hover:bg-rose-950/40 font-semibold text-xs flex items-center gap-1 transition-all cursor-pointer"
              title="Erase guest data"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>{isUrdu ? 'ڈیٹا مٹائیں' : isArabic ? 'مسح البيانات' : 'Erase'}</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
