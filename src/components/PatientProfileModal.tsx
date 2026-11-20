import React, { useState, useEffect } from 'react';
import {
  X,
  UserCheck,
  ShieldCheck,
  Lock,
  Mail,
  User,
  Trash2,
  AlertTriangle,
  CheckCircle2,
  Activity,
  Brain,
  Microscope,
  FileText,
  LifeBuoy,
  KeyRound,
  LogOut,
  Sparkles,
  Cloud,
  Check,
  Globe2,
} from 'lucide-react';
import { UserProfile, Language, Region, UserConsentSettings } from '../types';
import {
  signInWithGoogleService,
  signInWithEmailService,
  signOutUserService,
  clearClinicalDataService,
  deleteEntireAccountService,
  saveProfileLocally,
} from '../services/firebaseAuthService';

interface PatientProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  userProfile: UserProfile;
  setUserProfile: React.Dispatch<React.SetStateAction<UserProfile>>;
  language: Language;
  region: Region;
  setRegion?: (r: Region) => void;
  onProfileUpdated?: (updated: UserProfile) => void;
  onDataWiped?: () => void;
}

export const PatientProfileModal: React.FC<PatientProfileModalProps> = ({
  isOpen,
  onClose,
  userProfile,
  setUserProfile,
  language,
  region,
  setRegion,
  onProfileUpdated,
  onDataWiped,
}) => {
  const [authMode, setAuthMode] = useState<'signin' | 'signup'>('signup');
  const [emailInput, setEmailInput] = useState('');
  const [passwordInput, setPasswordInput] = useState('');
  const [nameInput, setNameInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [feedbackMsg, setFeedbackMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Auto-dismiss floating toast notification after 5 seconds
  useEffect(() => {
    if (!feedbackMsg) return;
    const timer = setTimeout(() => {
      setFeedbackMsg(null);
    }, 5000);
    return () => clearTimeout(timer);
  }, [feedbackMsg]);

  // Deletion confirm states
  const [isConfirmingClear, setIsConfirmingClear] = useState(false);
  const [isConfirmingDeleteAll, setIsConfirmingDeleteAll] = useState(false);

  if (!isOpen) return null;

  const isUrdu = language === 'ur';
  const isArabic = language === 'ar';
  const isPakistan = region === 'pakistan';

  const governanceTitle = isPakistan
    ? isUrdu
      ? 'قومی ادارہ برائے صحت اسلام آباد (NIH) و صحت سہولت ہیلتھ ڈیٹا گورننس'
      : isArabic
      ? 'المعهد الوطني للصحة إسلام آباد (NIH) وبرنامج صحت سہولت للحوكمة الصحية'
      : 'NIH Islamabad & Sehat Sahulat Sovereign Health Data Governance'
    : isUrdu
    ? 'محکمہ صحت ابوظہبی (DoH) کلینیکل ڈیٹا اور زیرو ایکسیس گورننس'
    : isArabic
    ? 'دائرة الصحة بأبوظبي (DoH) لحوكمة البيانات السريرية والخصوصية التامة'
    : 'DoH Abu Dhabi Sovereign Clinical Data & Zero-Access Governance';

  const getFriendlyErrorMessage = (err: any, fallback: string): string => {
    const msg = String(err?.message || '');
    const code = String(err?.code || '');
    if (code.includes('popup-closed-by-user') || msg.includes('popup-closed-by-user') || code.includes('cancelled-popup-request')) {
      return isUrdu
        ? 'سائن ان ونڈو بند ہو گئی۔ براہ کرم دوبارہ کوشش کریں۔'
        : isArabic
        ? 'تم إغلاق نافذة تسجيل الدخول. يرجى المحاولة مرة أخرى.'
        : 'Sign-in window was closed. Please try again or use Email sign-in.';
    }
    if (code.includes('popup-blocked') || msg.includes('popup-blocked')) {
      return isUrdu
        ? 'براؤزر نے پاپ اپ بلاک کر دیا۔ براہ کرم اجازت دیں یا ای میل سے سائن ان کریں۔'
        : isArabic
        ? 'حظر المتصفح النافذة المنبثقة. يرجى السماح بالنوافذ أو استخدام البريد الإلكتروني.'
        : 'Browser popup was blocked. Please allow popups or use Email sign-in.';
    }
    if (code.includes('email-already-in-use') || msg.includes('email-already-in-use')) {
      return isUrdu
        ? 'یہ ای میل پہلے سے رجسٹرڈ ہے۔ براہ کرم "سائن ان" منتخب کریں۔'
        : isArabic
        ? 'هذا البريد مسجل مسبقاً. يرجى اختيار تسجيل الدخول.'
        : 'This email is already registered. Please switch to Sign In.';
    }
    if (
      code.includes('wrong-password') ||
      code.includes('user-not-found') ||
      code.includes('invalid-credential') ||
      msg.includes('wrong-password') ||
      msg.includes('invalid-credential')
    ) {
      return isUrdu
        ? 'ای میل یا پاس ورڈ درست نہیں۔ براہ کرم دوبارہ چیک کریں۔'
        : isArabic
        ? 'البريد الإلكتروني أو كلمة المرور غير صحيحة. يرجى التحقق وإعادة المحاولة.'
        : 'Invalid email or password. Please verify your credentials.';
    }
    if (code.includes('weak-password') || msg.includes('weak-password')) {
      return isUrdu
        ? 'پاس ورڈ کم از کم 6 حروف پر مشتمل ہونا چاہیے۔'
        : isArabic
        ? 'كلمة المرور ضعيفة. يرجى استخدام 6 أحرف على الأقل.'
        : 'Password must be at least 6 characters long.';
    }
    if (code.includes('requires-recent-login') || msg.includes('requires-recent-login')) {
      return isUrdu
        ? 'حفاظتی وجوہات کی بنا پر اکاؤنٹ حذف کرنے سے پہلے دوبارہ لاگ ان درکار ہے۔'
        : isArabic
        ? 'لدواعي الأمان، يرجى إعادة تسجيل الدخول قبل حذف الحساب نهائياً.'
        : 'For security, please sign in again before permanently deleting your account.';
    }
    if (code.includes('network-request-failed') || msg.includes('network')) {
      return isUrdu
        ? 'انٹرنیٹ کنکشن کا مسئلہ۔ براہ کرم رابطہ چیک کریں۔'
        : isArabic
        ? 'تعذر الاتصال بالشبكة. يرجى التحقق من اتصال الإنترنت.'
        : 'Network connection issue. Please check your internet connection.';
    }
    if (msg && !msg.startsWith('Firebase:') && !msg.includes('auth/')) {
      return msg;
    }
    return fallback;
  };

  const handleGoogleSignIn = async () => {
    setIsLoading(true);
    setFeedbackMsg(null);
    try {
      const updated = await signInWithGoogleService(userProfile);
      setUserProfile(updated);
      if (onProfileUpdated) onProfileUpdated(updated);
      setFeedbackMsg({
        type: 'success',
        text: isUrdu
          ? 'گوگل اکاؤنٹ کے ساتھ کامیابی سے محفوظ اور منسلک ہو گیا!'
          : isArabic
          ? 'تم تسجيل الدخول وربط الحساب عبر Google بنجاح!'
          : 'Successfully signed in and synced with Google Cloud Vault!',
      });
    } catch (err: any) {
      setFeedbackMsg({
        type: 'error',
        text: getFriendlyErrorMessage(err, 'Unable to sign in with Google. Please try again or use Email.'),
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!emailInput.trim() || !passwordInput.trim()) {
      setFeedbackMsg({
        type: 'error',
        text: isUrdu ? 'براہ کرم ای میل اور پاس ورڈ درج کریں' : isArabic ? 'يرجى إدخال البريد الإلكتروني وكلمة المرور' : 'Please enter email and password',
      });
      return;
    }

    setIsLoading(true);
    setFeedbackMsg(null);
    try {
      const updated = await signInWithEmailService(
        emailInput,
        passwordInput,
        authMode === 'signup',
        nameInput,
        userProfile
      );
      setUserProfile(updated);
      if (onProfileUpdated) onProfileUpdated(updated);
      setFeedbackMsg({
        type: 'success',
        text: isUrdu
          ? 'اکاؤنٹ کامیابی سے لاگ ان اور ہم آہنگ ہو گیا!'
          : isArabic
          ? 'تم تسجيل الدخول وحفظ البيانات السريرية بنجاح!'
          : 'Successfully authenticated and synced clinical profile!',
      });
    } catch (err: any) {
      setFeedbackMsg({
        type: 'error',
        text: getFriendlyErrorMessage(err, 'Authentication could not be completed. Please check your details.'),
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignOut = async () => {
    setIsLoading(true);
    try {
      const guest = await signOutUserService(userProfile);
      setUserProfile(guest);
      if (onProfileUpdated) onProfileUpdated(guest);
      setFeedbackMsg({
        type: 'success',
        text: isUrdu ? 'سائن آؤٹ ہو گیا۔ آپ اب محفوظ مہمان موڈ میں ہیں۔' : isArabic ? 'تم تسجيل الخروج. أنت الآن في وضع الزائر.' : 'Signed out. You are now in sovereign guest mode.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const toggleConsent = (key: keyof UserConsentSettings) => {
    // Prohibit turning off employerZeroAccess
    if (key === 'employerZeroAccess') return;

    const updatedSettings = {
      ...userProfile.consentSettings,
      [key]: !userProfile.consentSettings[key],
    };
    const updated: UserProfile = {
      ...userProfile,
      consentSettings: updatedSettings,
    };
    setUserProfile(updated);
    saveProfileLocally(updated);
    if (onProfileUpdated) onProfileUpdated(updated);
  };

  const handleClearClinicalProfile = async () => {
    setIsLoading(true);
    setFeedbackMsg(null);
    try {
      const updated = await clearClinicalDataService(userProfile);
      setUserProfile(updated);
      if (onProfileUpdated) onProfileUpdated(updated);
      if (onDataWiped) onDataWiped();
      setIsConfirmingClear(false);
      setFeedbackMsg({
        type: 'success',
        text: isUrdu
          ? 'طبی اسکینز اور تاریخ صاف کر دی گئی ہے (اکاؤنٹ برقرار ہے)۔'
          : isArabic
          ? 'تم مسح السجلات الطبية بنجاح (الحساب لا يزال نشطاً).'
          : 'Clinical scans and assessment history cleared (account retained).',
      });
    } catch (err: any) {
      setFeedbackMsg({
        type: 'error',
        text: getFriendlyErrorMessage(err, 'Could not clear clinical profile. Please try again.'),
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteEntireAccount = async () => {
    setIsLoading(true);
    setFeedbackMsg(null);
    try {
      const freshGuest = await deleteEntireAccountService(userProfile);
      setUserProfile(freshGuest);
      if (onProfileUpdated) onProfileUpdated(freshGuest);
      if (onDataWiped) onDataWiped();
      setIsConfirmingDeleteAll(false);
      setFeedbackMsg({
        type: 'success',
        text: isUrdu
          ? 'اکاؤنٹ اور تمام ریکارڈز مکمل طور پر حذف کر دیے گئے ہیں۔'
          : isArabic
          ? 'تم حذف الحساب وجميع السجلات بالكامل.'
          : 'Entire account and all session records completely removed.',
      });
    } catch (err: any) {
      setFeedbackMsg({
        type: 'error',
        text: getFriendlyErrorMessage(err, 'Could not complete account deletion. Please try again.'),
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="fixed inset-0 bg-slate-900/65 backdrop-blur-xs transition-opacity" onClick={onClose} />
      <div className="flex min-h-full items-center justify-center p-3 sm:p-5">
        <div className="relative w-full max-w-3xl rounded-3xl bg-white dark:bg-slate-800 shadow-2xl border border-slate-200 dark:border-slate-700 overflow-hidden my-4">
          {/* Header */}
          <div className="p-4 sm:p-5 border-b border-slate-100 dark:border-slate-700 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-50 dark:bg-slate-750">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-teal-600 text-white flex items-center justify-center shadow-xs shrink-0">
                <UserCheck className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white">
                  {isUrdu
                    ? 'میرا برین ہیلتھ پروفائل اور کانسنٹ والٹ'
                    : isArabic
                    ? 'ملفي الصحي العصبي وخزنة الموافقات والخصوصية'
                    : 'My Brain Health Profile & Consent Vault'}
                </h3>
                <p className="text-[11px] font-semibold text-teal-700 dark:text-teal-300">
                  {governanceTitle}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <button
                onClick={onClose}
                className="p-1.5 rounded-xl text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors cursor-pointer"
                aria-label="Close Profile Vault"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Body content */}
          <div className="p-4 sm:p-6 space-y-6 max-h-[82vh] overflow-y-auto text-xs sm:text-sm">
            {/* SECTION 1: Live Collected Profile Summary */}
            <div className="space-y-3">
              <div className="flex items-center justify-between pb-1 border-b border-slate-100 dark:border-slate-700">
                <span className="text-[11px] font-bold uppercase tracking-wider text-teal-700 dark:text-teal-400 flex items-center gap-1.5">
                  <Activity className="w-3.5 h-3.5" />
                  <span>
                    {isUrdu ? 'سیکشن 1: لائیو ریکارڈ و کلینیکل سمری' : isArabic ? 'القسم 1: ملخص السجلات والبيانات الحية' : 'Section 1 — Live Collected Profile Summary'}
                  </span>
                </span>
                <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300">
                  {userProfile.isGuest ? (isUrdu ? 'عارضی مہمان' : isArabic ? 'وضع الزائر' : 'Guest Mode') : (isUrdu ? 'کلاؤڈ سنکڈ' : isArabic ? 'مربوط بالسحابة' : 'Cloud Synced')}
                </span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                <div className="p-3 rounded-2xl bg-teal-50/60 dark:bg-slate-750 border border-teal-100 dark:border-slate-700">
                  <span className="text-[10px] text-slate-500 dark:text-slate-400 block font-semibold">
                    {isUrdu ? 'تعلیمی پس منظر' : isArabic ? 'المستوى التعليمي' : 'Education Level'}
                  </span>
                  <strong className="text-xs font-bold text-teal-900 dark:text-teal-200 capitalize">
                    {userProfile.educationLevel || 'Secondary'}
                  </strong>
                </div>

                <div className="p-3 rounded-2xl bg-emerald-50/60 dark:bg-slate-750 border border-emerald-100 dark:border-slate-700">
                  <span className="text-[10px] text-slate-500 dark:text-slate-400 block font-semibold">
                    {isUrdu ? 'آخری یادداشت اسکور' : isArabic ? 'آخر درجة للذاكرة' : 'Memory Score'}
                  </span>
                  <strong className="text-xs font-bold text-emerald-800 dark:text-emerald-300 font-mono">
                    {userProfile.latestMemoryScore !== null ? `${userProfile.latestMemoryScore}/100` : 'Not Taken Yet'}
                  </strong>
                </div>

                <div className="p-3 rounded-2xl bg-sky-50/60 dark:bg-slate-750 border border-sky-100 dark:border-slate-700">
                  <span className="text-[10px] text-slate-500 dark:text-slate-400 block font-semibold">
                    {isUrdu ? 'دماغی حفاظت انڈیکس' : isArabic ? 'مؤشر حماية الدماغ' : 'Brain Protection'}
                  </span>
                  <strong className="text-xs font-bold text-sky-800 dark:text-sky-300 font-mono">
                    {userProfile.brainProtectionScore !== null ? `${userProfile.brainProtectionScore}/100` : '84/100 (Default)'}
                  </strong>
                </div>

                <div className="p-3 rounded-2xl bg-indigo-50/60 dark:bg-slate-750 border border-indigo-100 dark:border-slate-700">
                  <span className="text-[10px] text-slate-500 dark:text-slate-400 block font-semibold">
                    {isUrdu ? 'ذاتی ایم آر آئی اسکینز' : isArabic ? 'فحوصات الرنين الشخصية' : 'Personal MRI Scans'}
                  </span>
                  <strong className="text-xs font-bold text-indigo-900 dark:text-indigo-200">
                    {userProfile.personalScansCount} {isUrdu ? 'اسکینز' : isArabic ? 'فحوصات' : 'scans'}
                  </strong>
                </div>

                <div className="p-3 rounded-2xl bg-amber-50/60 dark:bg-slate-750 border border-amber-100 dark:border-slate-700">
                  <span className="text-[10px] text-slate-500 dark:text-slate-400 block font-semibold">
                    {isUrdu ? 'پی ڈی ایف کلینیکل رپورٹس' : isArabic ? 'تقارير PDF المحفوظة' : 'Saved PDF Reports'}
                  </span>
                  <strong className="text-xs font-bold text-amber-900 dark:text-amber-200">
                    {userProfile.savedReportsCount || 0} {isUrdu ? 'رپورٹس' : isArabic ? 'تقارير' : 'reports'}
                  </strong>
                </div>

                <div className="p-3 rounded-2xl bg-purple-50/60 dark:bg-slate-750 border border-purple-100 dark:border-slate-700">
                  <span className="text-[10px] text-slate-500 dark:text-slate-400 block font-semibold">
                    {isUrdu ? 'سپورٹ اور سیفٹی ٹکٹس' : isArabic ? 'تذاكر الدعم والسلامة' : 'Support Tickets'}
                  </span>
                  <strong className="text-xs font-bold text-purple-900 dark:text-purple-200">
                    {userProfile.submittedTicketsCount || 0} {isUrdu ? 'ٹکٹس' : isArabic ? 'تذاكر' : 'tickets'}
                  </strong>
                </div>
              </div>
            </div>

            {/* SECTION 2: Save & Sync Account (Google & Email/Password) */}
            <div className="space-y-3.5 pt-2 border-t border-slate-100 dark:border-slate-700">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold uppercase tracking-wider text-teal-700 dark:text-teal-400 flex items-center gap-1.5">
                  <Cloud className="w-3.5 h-3.5" />
                  <span>
                    {isUrdu ? 'سیکشن 2: سائن ان اور کلاؤڈ سنک (فائر بیس والٹ)' : isArabic ? 'القسم 2: الحفظ والمزامنة السحابية (Firebase)' : 'Section 2 — Save & Sync Account (Google & Email)'}
                  </span>
                </span>
              </div>

              {!userProfile.isGuest ? (
                // Authenticated Profile State
                <div className="p-4 rounded-2xl bg-emerald-50/80 dark:bg-slate-750 border border-emerald-200 dark:border-slate-700 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white font-bold flex items-center justify-center text-sm shadow-xs">
                      {userProfile.name.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <div className="flex items-center gap-1.5">
                        <strong className="text-sm font-bold text-slate-900 dark:text-white">
                          {userProfile.name}
                        </strong>
                        <span className="px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 text-[10px] font-bold flex items-center gap-1 border border-emerald-300">
                          <CheckCircle2 className="w-3 h-3" />
                          <span>Cloud Synced</span>
                        </span>
                      </div>
                      <span className="text-xs text-slate-500 dark:text-slate-400">
                        {userProfile.email} • {userProfile.authProvider.toUpperCase()}
                      </span>
                    </div>
                  </div>

                  <button
                    onClick={handleSignOut}
                    disabled={isLoading}
                    className="py-1.5 px-3 rounded-xl border border-slate-300 dark:border-slate-600 hover:bg-white dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    <span>{isUrdu ? 'سائن آؤٹ' : isArabic ? 'تسجيل الخروج' : 'Sign Out'}</span>
                  </button>
                </div>
              ) : (
                // Unauthenticated / Guest State
                <div className="p-4 sm:p-5 rounded-2xl bg-slate-50 dark:bg-slate-750 border border-slate-200 dark:border-slate-700 space-y-4">
                  <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                    {isUrdu
                      ? 'اپنے اسکینز، 6 ماہ کی میموری ٹرینڈز اور پی ڈی ایف رپورٹس کو محفوظ بیک اپ کرنے کے لیے گوگل یا ای میل سے کنیکٹ کریں:'
                      : isArabic
                      ? 'قم بربط حسابك لحفظ صور الرنين ومخطط تتبع الذاكرة وتقاريرك السريرية بأمان:'
                      : 'Connect your account to securely back up your scans, memory baseline, and official clinical PDF reports:'}
                  </p>

                  {/* Google OAuth Button */}
                  <button
                    onClick={handleGoogleSignIn}
                    disabled={isLoading}
                    className="w-full py-2.5 px-4 rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-100 font-bold text-xs sm:text-sm flex items-center justify-center gap-2.5 shadow-xs transition-all cursor-pointer"
                  >
                    <svg className="w-4 h-4" viewBox="0 0 24 24">
                      <path
                        fill="#4285F4"
                        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                      />
                      <path
                        fill="#34A853"
                        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                      />
                      <path
                        fill="#FBBC05"
                        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                      />
                      <path
                        fill="#EA4335"
                        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                      />
                    </svg>
                    <span>{isUrdu ? 'گوگل کے ساتھ جاری رکھیں' : isArabic ? 'المتابعة باستخدام Google' : 'Continue with Google'}</span>
                  </button>

                  <div className="flex items-center gap-3">
                    <div className="h-px bg-slate-200 dark:bg-slate-700 flex-1" />
                    <span className="text-[11px] text-slate-400 uppercase font-semibold">
                      {isUrdu ? 'یا ای میل کے ساتھ' : isArabic ? 'أو بالبريد الإلكتروني' : 'Or with Email'}
                    </span>
                    <div className="h-px bg-slate-200 dark:bg-slate-700 flex-1" />
                  </div>

                  {/* Email & Password Form */}
                  <form onSubmit={handleEmailAuth} className="space-y-3">
                    {authMode === 'signup' && (
                      <div>
                        <label className="text-[11px] font-bold text-slate-600 dark:text-slate-400 block mb-1">
                          {isUrdu ? 'نام' : isArabic ? 'الاسم' : 'Name'}
                        </label>
                        <input
                          type="text"
                          required
                          value={nameInput}
                          onChange={(e) => setNameInput(e.target.value)}
                          placeholder="Name"
                          className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-850 text-xs focus:ring-2 focus:ring-teal-500 focus:outline-hidden"
                        />
                      </div>
                    )}

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                      <div>
                        <label className="text-[11px] font-bold text-slate-600 dark:text-slate-400 block mb-1">
                          {isUrdu ? 'ای میل ایڈریس' : isArabic ? 'البريد الإلكتروني' : 'Email Address'}
                        </label>
                        <input
                          type="email"
                          required
                          value={emailInput}
                          onChange={(e) => setEmailInput(e.target.value)}
                          placeholder="user@example.com"
                          className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-850 text-xs focus:ring-2 focus:ring-teal-500 focus:outline-hidden"
                        />
                      </div>

                      <div>
                        <label className="text-[11px] font-bold text-slate-600 dark:text-slate-400 block mb-1">
                          {isUrdu ? 'پاس ورڈ' : isArabic ? 'كلمة المرور' : 'Password'}
                        </label>
                        <input
                          type="password"
                          required
                          value={passwordInput}
                          onChange={(e) => setPasswordInput(e.target.value)}
                          placeholder="••••••••"
                          className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-850 text-xs focus:ring-2 focus:ring-teal-500 focus:outline-hidden"
                        />
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-1">
                      <button
                        type="button"
                        onClick={() => setAuthMode(authMode === 'signup' ? 'signin' : 'signup')}
                        className="text-xs text-teal-600 hover:underline font-semibold cursor-pointer"
                      >
                        {authMode === 'signup'
                          ? (isUrdu ? 'پہلے سے اکاؤنٹ ہے؟ لاگ ان کریں' : isArabic ? 'لديك حساب بالفعل؟ تسجيل الدخول' : 'Already have an account? Sign In')
                          : (isUrdu ? 'نیا اکاؤنٹ بنائیں (سائن اپ)' : isArabic ? 'إنشاء حساب جديد' : 'Need an account? Sign Up')}
                      </button>

                      <button
                        type="submit"
                        disabled={isLoading}
                        className="py-2 px-4 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs shadow-xs transition-colors cursor-pointer"
                      >
                        {authMode === 'signup'
                          ? (isUrdu ? 'سائن اپ کریں' : isArabic ? 'إنشاء الحساب' : 'Create & Sync')
                          : (isUrdu ? 'لاگ ان کریں' : isArabic ? 'تسجيل الدخول' : 'Sign In & Sync')}
                      </button>
                    </div>
                  </form>
                </div>
              )}
            </div>

            {/* SECTION 3: Granular, Revocable Consent Toggles (DoH Rubric) */}
            <div className="space-y-3.5 pt-2 border-t border-slate-100 dark:border-slate-700">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold uppercase tracking-wider text-teal-700 dark:text-teal-400 flex items-center gap-1.5">
                  <Lock className="w-3.5 h-3.5" />
                  <span>
                    {isUrdu ? 'سیکشن 3: قابل تنسیخ رضامندی و پرائیویسی کنٹرول' : isArabic ? 'القسم 3: خيارات الموافقة السريرية وحماية الخصوصية' : 'Section 3 — Granular, Revocable Consent Toggles'}
                  </span>
                </span>
                <span className="text-[10px] text-teal-700 dark:text-teal-400 font-bold">
                  {isPakistan
                    ? (isUrdu ? 'این آئی ایچ اسلام آباد و صحت سہولت رولز' : isArabic ? 'قواعد المعهد الوطني للصحة وبرنامج صحت سہولت' : 'NIH Islamabad & Sehat Sahulat Certified Rules')
                    : (isUrdu ? 'محکمہ صحت ابوظہبی (DoH) رولز' : isArabic ? 'قواعد دائرة الصحة بأبوظبي المعتمدة' : 'Abu Dhabi DoH Certified Rules')}
                </span>
              </div>

              <div className="space-y-2.5">
                {/* 1. Longitudinal tracking */}
                <div className="p-3 rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 flex items-center justify-between gap-3">
                  <div className="space-y-0.5">
                    <strong className="text-xs font-bold text-slate-900 dark:text-white block">
                      {isUrdu ? 'طویل مدتی موازنہ (6 تا 12 ماہ کا ٹرینڈ)' : isArabic ? 'تتبع خط الأساس الطولي (مقارنة 6-12 شهراً)' : 'Consent to Longitudinal Baseline Tracking'}
                    </strong>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400">
                      {isUrdu
                        ? 'میرے اسکورز کا گزشتہ 6 سے 12 ماہ کی بنیاد پر موازنہ کرنے کی اجازت دیں تاکہ معمولی تغیرات بروقت پتہ چل سکیں۔'
                        : isArabic
                        ? 'مقارنة درجات الذاكرة خلال 6-12 شهراً لرصد أي تغيرات طفيفة مبكراً.'
                        : 'Compare memory & focus scores over 6–12 months to detect subtle cognitive drift early.'}
                    </p>
                  </div>
                  <input
                    type="checkbox"
                    checked={userProfile.consentSettings.longitudinalTracking}
                    onChange={() => toggleConsent('longitudinalTracking')}
                    className="w-4 h-4 accent-teal-600 rounded cursor-pointer shrink-0"
                  />
                </div>

                {/* 2. Clinical Handover */}
                <div className="p-3 rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 flex items-center justify-between gap-3">
                  <div className="space-y-0.5">
                    <strong className="text-xs font-bold text-slate-900 dark:text-white block">
                      {isUrdu ? 'ڈاکٹر / نیورولوجسٹ کے ساتھ اشتراک کی اجازت' : isArabic ? 'الموافقة على التسليم السريري للطبيب' : 'Consent to Clinical Handover'}
                    </strong>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400">
                      {isUrdu
                        ? 'میرے مشیر معالج کو اسکین، حرارتی نقشے اور خطرے کے عوامل دیکھنے کی اجازت دیں۔'
                        : isArabic
                        ? 'السماح لطبيبي المعالج باستعراض نتائج الرنين وخرائط Grad-CAM وحزمة عوامل الخطر.'
                        : 'Allow my reviewing physician or neurologist to securely review my MRI packet and PDF summary.'}
                    </p>
                  </div>
                  <input
                    type="checkbox"
                    checked={userProfile.consentSettings.clinicalHandover}
                    onChange={() => toggleConsent('clinicalHandover')}
                    className="w-4 h-4 accent-teal-600 rounded cursor-pointer shrink-0"
                  />
                </div>

                {/* 3. Strict Employer & Insurer Zero-Access Shield (LOCKED ON) */}
                <div className="p-3 rounded-2xl border border-emerald-200 dark:border-emerald-900 bg-emerald-50/50 dark:bg-emerald-950/30 flex items-center justify-between gap-3">
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-1.5">
                      <strong className="text-xs font-bold text-emerald-950 dark:text-emerald-200">
                        {isUrdu ? 'ملازمت و انشورنس کمپنیوں تک مکمل رسائی کی بندش' : isArabic ? 'درع الحظر التام على جهات العمل والتأمين' : 'Strict Employer & Insurer Zero-Access Shield'}
                      </strong>
                      <span className="px-1.5 py-0.2 rounded-md bg-emerald-700 text-white text-[9px] font-black uppercase">
                        Locked ON
                      </span>
                    </div>
                    <p className="text-[11px] text-emerald-800 dark:text-emerald-300">
                      {isPakistan
                        ? (isUrdu
                          ? 'این آئی ایچ اسلام آباد و صحت سہولت ریگولیشن: کسی بھی آجر، انشورنس کمپنی یا فریق ثالث کو طبی ڈیٹا تک رسائی سختی سے ممنوع ہے۔'
                          : isArabic
                          ? 'نظام المعهد الوطني للصحة وبرنامج صحت سہولت: يحظر قطعياً وصول جهات العمل وشركات التأمين إلى بياناتك العصبية.'
                          : 'NIH Islamabad & Sehat Sahulat Standard: Prohibits any corporate, employer, or commercial insurance third-party access.')
                        : (isUrdu
                          ? 'محکمہ صحت ابوظہبی (DoH) کلینیکل معیار: کسی بھی تجارتی، آجر یا انشورنس کمپنی کو ذاتی طبی ڈیٹا تک رسائی سختی سے ممنوع ہے۔'
                          : isArabic
                          ? 'معيار دائرة الصحة بأبوظبي (DoH): يحظر قطعياً وصول أي جهة عمل أو شركات التأمين التجاري إلى بياناتك العصبية.'
                          : 'Abu Dhabi DoH Standard: Prohibits any corporate, employer, or commercial insurance access to personal clinical data.')}
                    </p>
                  </div>
                  <input
                    type="checkbox"
                    checked={true}
                    disabled
                    className="w-4 h-4 accent-emerald-600 rounded cursor-not-allowed shrink-0"
                  />
                </div>
              </div>
            </div>

            {/* SECTION 4: Dual-Delete Vault Controls */}
            <div className="space-y-3.5 pt-2 border-t border-slate-100 dark:border-slate-700">
              <span className="text-[11px] font-bold uppercase tracking-wider text-rose-700 dark:text-rose-400 flex items-center gap-1.5">
                <Trash2 className="w-3.5 h-3.5" />
                <span>
                  {isUrdu ? 'سیکشن 4: ڈیٹا صفائی اور اکاؤنٹ ڈیلیشن کنٹرولز' : isArabic ? 'القسم 4: خيارات مسح السجلات أو حذف الحساب بالكامل' : 'Section 4 — Two Separate Data & Account Deletion Controls'}
                </span>
              </span>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {/* Control 1: Clear Clinical Profile & History */}
                <div className="p-3.5 rounded-2xl border border-amber-200 dark:border-amber-900/60 bg-amber-50/40 dark:bg-slate-750 space-y-2">
                  <strong className="text-xs font-bold text-amber-950 dark:text-amber-300 block">
                    {isUrdu ? '1. طبی تاریخ اور اسکینز صاف کریں' : isArabic ? '1. مسح السجلات السريرية وفحوصات الرنين' : '1. Clear Clinical Profile & Scan History'}
                  </strong>
                  <p className="text-[11px] text-slate-600 dark:text-slate-400 leading-snug">
                    {isUrdu
                      ? 'تمام ذاتی ایم آر آئی اسکینز، یادداشت اسکورز اور رپورٹس کو مٹا دیں جبکہ آپ کا لاگ ان اکاؤنٹ برقرار رہے۔'
                      : isArabic
                      ? 'مسح جميع صور الرنين ونتائج الذاكرة والتقارير مع الإبقاء على حسابك نشطاً.'
                      : 'Wipes all personal MRI scans, cognitive scores, and reports (resets data to 0 while keeping login active).'}
                  </p>

                  {isConfirmingClear ? (
                    <div className="flex items-center gap-2 pt-1">
                      <button
                        onClick={handleClearClinicalProfile}
                        disabled={isLoading}
                        className="py-1.5 px-3 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs cursor-pointer"
                      >
                        {isUrdu ? 'ہاں، تاریخ صاف کریں' : isArabic ? 'تأكيد المسح' : 'Confirm Clear'}
                      </button>
                      <button
                        onClick={() => setIsConfirmingClear(false)}
                        className="py-1.5 px-2.5 rounded-xl text-slate-500 hover:text-slate-800 text-xs font-semibold cursor-pointer"
                      >
                        {isUrdu ? 'منسوخ' : isArabic ? 'إلغاء' : 'Cancel'}
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => setIsConfirmingClear(true)}
                      className="py-2 px-3 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 text-amber-900 dark:text-amber-300 border border-amber-300 dark:border-amber-800 font-bold text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>{isUrdu ? 'طبی تاریخ صاف کریں' : isArabic ? 'مسح السجلات فقط' : 'Clear Clinical Profile'}</span>
                    </button>
                  )}
                </div>

                {/* Control 2: Delete Entire Account & All Records */}
                <div className="p-3.5 rounded-2xl border border-rose-200 dark:border-rose-900/60 bg-rose-50/40 dark:bg-slate-750 space-y-2">
                  <strong className="text-xs font-bold text-rose-950 dark:text-rose-300 block">
                    {isUrdu ? '2. اکاؤنٹ اور تمام ریکارڈز ڈیلیٹ کریں' : isArabic ? '2. حذف الحساب وجميع البيانات' : '2. Delete Entire Account & All Records'}
                  </strong>
                  <p className="text-[11px] text-slate-600 dark:text-slate-400 leading-snug">
                    {isUrdu
                      ? 'اکاؤنٹ، کلاؤڈ والٹ، ٹیسٹ اور تمام مقامی سیشن ڈیٹا کو مکمل طور پر مٹا دیں۔'
                      : isArabic
                      ? 'حذف كامل للحساب من السحابة ومسح جميع السجلات والجلسات المحلية بالكامل.'
                      : 'Completely removes both your authentication record and all cloud + local session data.'}
                  </p>

                  {isConfirmingDeleteAll ? (
                    <div className="flex items-center gap-2 pt-1">
                      <button
                        onClick={handleDeleteEntireAccount}
                        disabled={isLoading}
                        className="py-1.5 px-3 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs cursor-pointer"
                      >
                        {isUrdu ? 'اکاؤنٹ ڈیلیٹ کریں' : isArabic ? 'تأكيد الحذف' : 'Confirm Delete Account'}
                      </button>
                      <button
                        onClick={() => setIsConfirmingDeleteAll(false)}
                        className="py-1.5 px-2.5 rounded-xl text-slate-500 hover:text-slate-800 text-xs font-semibold cursor-pointer"
                      >
                        {isUrdu ? 'منسوخ' : isArabic ? 'إلغاء' : 'Cancel'}
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => setIsConfirmingDeleteAll(true)}
                      className="py-2 px-3 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-900 dark:text-rose-300 border border-rose-300 dark:border-rose-800 font-bold text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>{isUrdu ? 'اکاؤنٹ حذف کریں' : isArabic ? 'حذف الحساب' : 'Delete Account'}</span>
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Floating Toast Notification (Always Visible in Viewport, No Scrolling Required) */}
      {feedbackMsg && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[100] max-w-lg w-[92%] sm:w-auto min-w-[320px] transition-all animate-in fade-in slide-in-from-bottom-4 duration-300">
          <div
            className={`p-4 rounded-2xl shadow-2xl flex items-center justify-between gap-3 border backdrop-blur-md ${
              feedbackMsg.type === 'success'
                ? 'bg-emerald-950/95 text-emerald-100 border-emerald-500/70 shadow-emerald-950/60'
                : 'bg-rose-950/95 text-rose-100 border-rose-500/70 shadow-rose-950/60'
            }`}
          >
            <div className="flex items-center gap-2.5 min-w-0">
              {feedbackMsg.type === 'success' ? (
                <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
              ) : (
                <AlertTriangle className="w-5 h-5 text-rose-400 shrink-0" />
              )}
              <span className="text-xs sm:text-sm font-semibold">{feedbackMsg.text}</span>
            </div>
            <button
              onClick={() => setFeedbackMsg(null)}
              className="p-1 rounded-lg text-slate-300 hover:text-white hover:bg-white/10 transition-colors shrink-0 cursor-pointer"
              aria-label="Dismiss Notification"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
