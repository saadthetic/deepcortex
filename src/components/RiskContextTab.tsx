import React from 'react';
import {
  Heart,
  Moon,
  Smile,
  Activity,
  Dna,
  Ear,
  CheckCircle2,
  AlertTriangle,
  Lightbulb,
} from 'lucide-react';
import { Language, Region } from '../types';
import { translations } from '../translations';

interface RiskContextTabProps {
  language: Language;
  region: Region;
  riskState: any;
  setRiskState: React.Dispatch<React.SetStateAction<any>>;
}

export const RiskContextTab: React.FC<RiskContextTabProps> = ({
  language,
  riskState,
  setRiskState,
}) => {
  const updateField = (key: string, val: any) => {
    setRiskState((prev: any) => ({ ...prev, [key]: val }));
  };

  // Calculate live friendly Brain Protection Score with multilingual tips
  const calculateScore = () => {
    let scoreVal = 100;
    const tipsList: { en: string; ur: string; ar: string }[] = [];

    if (riskState.bloodPressureSystolic > 130) {
      scoreVal -= 10;
      tipsList.push({
        en: 'Aim for blood pressure below 130/80 with regular brisk walks and lower salt.',
        ur: 'روزانہ تیز چہل قدمی اور نمک میں کمی کے ذریعے بلڈ پریشر کو 130/80 سے نیچے رکھیں۔',
        ar: 'احرص على خفض ضغط الدم إلى أقل من 130/80 عبر المشي السريع المنتظم وتقليل الملح.',
      });
    }
    if (riskState.hba1c > 6.0) {
      scoreVal -= 10;
      tipsList.push({
        en: 'Keep blood sugar balanced with fiber-rich Mediterranean meals.',
        ur: 'فائبر سے بھرپور غذاؤں اور متوازن خوراک سے شوگر کا تناسب برقرار رکھیں۔',
        ar: 'حافظ على توازن السكر في الدم عبر وجبات غنية بالألياف ونظام غذائي صحي.',
      });
    }
    if (riskState.hearingLoss) {
      scoreVal -= 12;
      tipsList.push({
        en: 'Hearing aids or ear checks help protect brain focus and social connection.',
        ur: 'سماعت کے آلات یا کانوں کا معائنہ دماغی توجہ اور سماجی رابطے محفوظ رکھنے میں مدد دیتا ہے۔',
        ar: 'المعينات السمعية وفحص الأذن يحميان التركيز الذهني والتواصل الاجتماعي.',
      });
    }
    if (riskState.sleepHours < 7) {
      scoreVal -= 10;
      tipsList.push({
        en: 'Target 7–8 hours of restful sleep so your brain can naturally clear daily fatigue.',
        ur: '7 سے 8 گھنٹے کی پرسکون نیند لیں تاکہ دماغ قدرتی طور پر تھکن سے پاک ہو سکے۔',
        ar: 'استهدف 7-8 ساعات من النوم العميق ليتمكن الدماغ من التخلص من الإجهاد اليومي طبيعياً.',
      });
    }
    if (riskState.physicalActivityMinutes < 150) {
      scoreVal -= 10;
      tipsList.push({
        en: 'Aim for 30 minutes of walking or cycling 5 days a week.',
        ur: 'ہفتے میں 5 دن کم از کم 30 منٹ چہل قدمی یا ورزش کو معمول بنائیں۔',
        ar: 'استهدف 30 دقيقة من المشي المعتدل 5 أيام في الأسبوع.',
      });
    }
    if (riskState.phqScore >= 3) {
      scoreVal -= 8;
      tipsList.push({
        en: 'High stress or feeling low can cause temporary brain fog. Gentle daily relaxation helps.',
        ur: 'شدید ذہنی دباؤ یادداشت کو متاثر کر سکتا ہے؛ روزانہ کے معمول میں سکون کے لمحات شامل کریں۔',
        ar: 'الضغط النفسي المرتفع يسبب ضبابية مؤقتة؛ فترات الاسترخاء اليومية تعيد النشاط الذهني.',
      });
    }

    if (tipsList.length === 0) {
      tipsList.push({
        en: 'Fantastic daily habits! Keep enjoying regular walks, good sleep, and social chats.',
        ur: 'بہترین روزمرہ عادات! چہل قدمی، اچھی نیند اور دوستوں سے بات چیت جاری رکھیں۔',
        ar: 'عادات يومية ممتازة! واصل النشاط البدني والنوم المنتظم والتواصل الإيجابي.',
      });
    }

    return {
      score: Math.max(45, Math.min(98, scoreVal)),
      tips: tipsList.slice(0, 3),
    };
  };

  const { score, tips } = calculateScore();

  return (
    <div className="w-full max-w-4xl mx-auto space-y-5 pb-16">
      {/* Top Banner: Brain Protection Score */}
      <div className="p-5 sm:p-7 rounded-3xl bg-gradient-to-br from-teal-50 via-emerald-50/70 to-sky-50 dark:from-slate-850 dark:via-slate-900 dark:to-teal-950/40 border border-teal-200/80 dark:border-slate-800 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-5">
        <div className="space-y-1.5 text-center sm:text-left">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-teal-100/80 dark:bg-teal-900/40 text-teal-800 dark:text-teal-300 text-xs font-bold">
            <Heart className="w-3.5 h-3.5" />
            <span>
              {language === 'ur'
                ? 'روزمرہ قابل اصلاح عادات'
                : language === 'ar'
                ? 'عادات يومية قابلة للتعديل'
                : 'Daily Modifiable Habits'}
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">
            {language === 'ur'
              ? 'دماغی حفاظت و قوت کا اسکور'
              : language === 'ar'
              ? 'مؤشر حماية وصحة الدماغ'
              : 'Your Brain Protection Score'}
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 max-w-lg">
            {language === 'ur'
              ? 'تحقیقات کے مطابق یادداشت میں 45% تک تبدیلیاں اچھی نیند، نارمل بلڈ پریشر اور چہل قدمی کے ذریعے روکی جا سکتی ہیں۔'
              : language === 'ar'
              ? 'تشير الدراسات إلى إمكانية الوقاية من 45% من تغيرات الذاكرة من خلال النوم الصحي وضبط الضغط والنشاط البدني.'
              : 'Up to 45% of memory changes are preventable through daily habits like good sleep, healthy blood pressure, and walking.'}
          </p>
        </div>

        {/* Circular Score Badge */}
        <div className="flex flex-col items-center justify-center p-3 rounded-2xl bg-white dark:bg-slate-800 border border-teal-200 dark:border-slate-700 shadow-xs shrink-0">
          <span className="text-3xl font-extrabold text-teal-700 dark:text-teal-400 font-mono">
            {score}<span className="text-sm font-semibold text-slate-400">/100</span>
          </span>
          <span className="text-[11px] font-bold text-slate-600 dark:text-slate-400 mt-0.5">
            {score >= 80
              ? language === 'ur'
                ? 'بہترین تحفظ'
                : language === 'ar'
                ? 'حماية ممتازة'
                : 'Excellent Protection'
              : language === 'ur'
              ? 'اچھا • قابل عمل تجاویز'
              : language === 'ar'
              ? 'جيد • إرشادات فعالة'
              : 'Good • Actionable Tips'}
          </span>
        </div>
      </div>

      {/* Encouraging Practical Daily Tips */}
      <div className="p-4 rounded-2xl bg-white dark:bg-slate-800 border border-teal-100 dark:border-slate-700 shadow-xs space-y-2">
        <div className="flex items-center gap-1.5 text-xs font-bold text-teal-800 dark:text-teal-300">
          <Lightbulb className="w-4 h-4 text-amber-500" />
          <span>
            {language === 'ur'
              ? 'اسکور بڑھانے اور دماغ کو چاق و چوبند رکھنے کے لیے مفید تجاویز:'
              : language === 'ar'
              ? 'خطوات يومية موصى بها لتعزيز مؤشر حماية الدماغ:'
              : 'Recommended Daily Steps to Boost Your Score:'}
          </span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 pt-1">
          {tips.map((tip, idx) => {
            const tipText = language === 'ur' ? tip.ur : language === 'ar' ? tip.ar : tip.en;
            return (
              <div key={idx} className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-750 text-xs text-slate-700 dark:text-slate-300 leading-snug">
                • {tipText}
              </div>
            );
          })}
        </div>
      </div>

      {/* 4 Friendly Wellness Domains */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Domain 1: Blood Pressure & Blood Sugar */}
        <div className="p-5 rounded-2xl bg-white dark:bg-slate-800 border border-teal-100 dark:border-slate-700 shadow-xs space-y-3.5">
          <div className="flex items-center gap-2 pb-2 border-b border-slate-100 dark:border-slate-700">
            <Heart className="w-4 h-4 text-teal-600" />
            <h3 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white">
              {language === 'ur' ? 'بلڈ پریشر اور بلڈ شوگر' : language === 'ar' ? 'ضغط الدم ومستوى السكر' : 'Blood Pressure & Blood Sugar'}
            </h3>
          </div>

          <div className="space-y-1">
            <div className="flex justify-between text-xs">
              <span className="text-slate-600 dark:text-slate-300">
                {language === 'ur' ? 'سسٹولک بلڈ پریشر:' : language === 'ar' ? 'ضغط الدم الانقباضي:' : 'Systolic Blood Pressure:'}
              </span>
              <strong className="text-slate-900 dark:text-white font-mono">{riskState.bloodPressureSystolic} mmHg</strong>
            </div>
            <input
              type="range"
              min="95"
              max="170"
              value={riskState.bloodPressureSystolic}
              onChange={(e) => updateField('bloodPressureSystolic', parseInt(e.target.value, 10))}
              className="w-full accent-teal-600 h-1.5 bg-slate-200 dark:bg-slate-700 rounded-lg cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-slate-400">
              <span>{language === 'ur' ? 'صحت مند (<120)' : language === 'ar' ? 'طبيعي (<120)' : 'Healthy (<120)'}</span>
              <span>{language === 'ur' ? 'ہدف (<130)' : language === 'ar' ? 'المستهدف (<130)' : 'Target (<130)'}</span>
              <span>{language === 'ur' ? 'بلند (>140)' : language === 'ar' ? 'مرتفع (>140)' : 'High (>140)'}</span>
            </div>
          </div>

          <div className="space-y-1">
            <div className="flex justify-between text-xs">
              <span className="text-slate-600 dark:text-slate-300">
                {language === 'ur' ? 'بلڈ شوگر (HbA1c لیول):' : language === 'ar' ? 'سكر الدم التراكمي (HbA1c):' : 'Blood Sugar (HbA1c level):'}
              </span>
              <strong className="text-slate-900 dark:text-white font-mono">{riskState.hba1c}%</strong>
            </div>
            <input
              type="range"
              min="4.5"
              max="9.0"
              step="0.1"
              value={riskState.hba1c}
              onChange={(e) => updateField('hba1c', parseFloat(e.target.value))}
              className="w-full accent-teal-600 h-1.5 bg-slate-200 dark:bg-slate-700 rounded-lg cursor-pointer"
            />
          </div>

          <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 dark:bg-slate-750 border border-slate-200 dark:border-slate-700">
            <div className="flex items-center gap-2">
              <Ear className="w-4 h-4 text-slate-600 dark:text-slate-400" />
              <span className="text-xs font-semibold text-slate-800 dark:text-slate-200">
                {language === 'ur' ? 'سماعت کی جانچ:' : language === 'ar' ? 'فحص السمع:' : 'Hearing Check:'}
              </span>
            </div>
            <button
              onClick={() => updateField('hearingLoss', !riskState.hearingLoss)}
              className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                riskState.hearingLoss
                  ? 'bg-amber-100 text-amber-900 dark:bg-amber-950 dark:text-amber-300'
                  : 'bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300'
              }`}
            >
              {riskState.hearingLoss
                ? language === 'ur'
                  ? 'کمزوری سماعت'
                  : language === 'ar'
                  ? 'ضعف في السمع'
                  : 'Hearing Loss'
                : language === 'ur'
                ? 'نارمل سماعت'
                : language === 'ar'
                ? 'سمع طبيعي'
                : 'Normal Hearing'}
            </button>
          </div>
        </div>

        {/* Domain 2: Sleep Quality & Nightly Rest */}
        <div className="p-5 rounded-2xl bg-white dark:bg-slate-800 border border-teal-100 dark:border-slate-700 shadow-xs space-y-3.5">
          <div className="flex items-center gap-2 pb-2 border-b border-slate-100 dark:border-slate-700">
            <Moon className="w-4 h-4 text-indigo-600" />
            <h3 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white">
              {language === 'ur' ? 'نیند کا معیار اور دورانیہ' : language === 'ar' ? 'جودة وساعات النوم ليلاً' : 'Sleep Quality (Hours per Night)'}
            </h3>
          </div>

          <div className="space-y-1">
            <div className="flex justify-between text-xs">
              <span className="text-slate-600 dark:text-slate-300">
                {language === 'ur' ? 'اوسط نیند کا دورانیہ:' : language === 'ar' ? 'متوسط ساعات النوم:' : 'Average Sleep Duration:'}
              </span>
              <strong className="text-slate-900 dark:text-white font-mono">
                {riskState.sleepHours} {language === 'ur' ? 'گھنٹے' : language === 'ar' ? 'ساعات' : 'Hours'}
              </strong>
            </div>
            <input
              type="range"
              min="4"
              max="10"
              value={riskState.sleepHours}
              onChange={(e) => updateField('sleepHours', parseInt(e.target.value, 10))}
              className="w-full accent-indigo-600 h-1.5 bg-slate-200 dark:bg-slate-700 rounded-lg cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-slate-400">
              <span>{language === 'ur' ? '6 گھنٹے سے کم' : language === 'ar' ? 'أقل من 6 ساعات' : 'Less than 6h'}</span>
              <span>{language === 'ur' ? 'بہترین: 7 تا 8 گھنٹے' : language === 'ar' ? 'المثالي: 7 إلى 8 ساعات' : 'Ideal: 7 to 8 hours'}</span>
              <span>{language === 'ur' ? '9 گھنٹے سے زیادہ' : language === 'ar' ? 'أكثر من 9 ساعات' : 'More than 9h'}</span>
            </div>
          </div>

          <div className="flex items-center justify-between text-xs">
            <span className="text-slate-600 dark:text-slate-300">
              {language === 'ur' ? 'نیند کی کیفیت:' : language === 'ar' ? 'طبيعة النوم:' : 'Sleep Feeling:'}
            </span>
            <div className="inline-flex rounded-lg bg-slate-100 dark:bg-slate-700 p-0.5">
              {(['restorative', 'fragmented'] as const).map((mode) => (
                <button
                  key={mode}
                  onClick={() => updateField('sleepQuality', mode)}
                  className={`px-2.5 py-1 rounded-md text-xs font-semibold capitalize transition-all cursor-pointer ${
                    riskState.sleepQuality === mode
                      ? 'bg-white dark:bg-slate-800 text-teal-800 dark:text-teal-300 shadow-xs'
                      : 'text-slate-500'
                  }`}
                >
                  {mode === 'restorative'
                    ? language === 'ur'
                      ? 'گہری اور پرسکون'
                      : language === 'ar'
                      ? 'نوم عميق ومريح'
                      : 'Deep & Restful'
                    : language === 'ur'
                    ? 'بار بار آنکھ کھلنا'
                    : language === 'ar'
                    ? 'استيقاظ متكرر'
                    : 'Waking Up Frequently'}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Domain 3: Mood & Daily Stress */}
        <div className="p-5 rounded-2xl bg-white dark:bg-slate-800 border border-teal-100 dark:border-slate-700 shadow-xs space-y-3.5">
          <div className="flex items-center gap-2 pb-2 border-b border-slate-100 dark:border-slate-700">
            <Smile className="w-4 h-4 text-emerald-600" />
            <h3 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white">
              {language === 'ur' ? 'مزاج اور روزمرہ تناؤ' : language === 'ar' ? 'المزاج ومستوى التوتر اليومي' : 'Mood & Daily Stress'}
            </h3>
          </div>

          <p className="text-xs text-slate-500 dark:text-slate-400 leading-snug">
            {language === 'ur'
              ? 'افسردگی یا شدید تھکن عارضی طور پر یادداشت کو متاثر کر سکتی ہے۔ اپنے دباؤ کی درجہ بندی کریں:'
              : language === 'ar'
              ? 'الشعور بالإجهاد أو الضغط النفسي قد يسبب ضبابية ذهنية مؤقتة. قيّم مستوى التوتر لديك:'
              : 'Feeling down or burned out can cause temporary memory lapses. Rating your current stress:'}
          </p>

          <div className="space-y-1">
            <div className="flex justify-between text-xs">
              <span className="text-slate-600 dark:text-slate-300">
                {language === 'ur' ? 'تناؤ اور تھکن کی سطح:' : language === 'ar' ? 'مستوى التوتر والإجهاد:' : 'Stress & Burnout Rating:'}
              </span>
              <strong className="text-slate-900 dark:text-white font-mono">
                {riskState.phqScore <= 2
                  ? language === 'ur'
                    ? 'کم تناؤ'
                    : language === 'ar'
                    ? 'توتر منخفض'
                    : 'Low Stress'
                  : language === 'ur'
                  ? 'بڑھا ہوا تناؤ'
                  : language === 'ar'
                  ? 'توتر مرتفع'
                  : 'Elevated Stress'}
              </strong>
            </div>
            <div className="flex gap-1.5 pt-1">
              {[0, 1, 2, 3, 4, 5].map((lvl) => (
                <button
                  key={lvl}
                  onClick={() => {
                    updateField('phqScore', lvl);
                    updateField('gadScore', lvl);
                  }}
                  className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    riskState.phqScore === lvl
                      ? 'bg-emerald-600 text-white shadow-xs'
                      : 'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300'
                  }`}
                >
                  {lvl}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Domain 4: Exercise & Healthy Diet */}
        <div className="p-5 rounded-2xl bg-white dark:bg-slate-800 border border-teal-100 dark:border-slate-700 shadow-xs space-y-3.5">
          <div className="flex items-center gap-2 pb-2 border-b border-slate-100 dark:border-slate-700">
            <Activity className="w-4 h-4 text-sky-600" />
            <h3 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white">
              {language === 'ur' ? 'ورزش اور صحت بخش غذا' : language === 'ar' ? 'النشاط البدني والغذاء الصحي' : 'Exercise & Healthy Diet'}
            </h3>
          </div>

          <div className="space-y-1">
            <div className="flex justify-between text-xs">
              <span className="text-slate-600 dark:text-slate-300">
                {language === 'ur' ? 'ہفتہ وار جسمانی سرگرمی:' : language === 'ar' ? 'النشاط البدني الأسبوعي:' : 'Weekly Physical Activity:'}
              </span>
              <strong className="text-slate-900 dark:text-white font-mono">
                {riskState.physicalActivityMinutes} {language === 'ur' ? 'منٹ' : language === 'ar' ? 'دقيقة' : 'mins'}
              </strong>
            </div>
            <input
              type="range"
              min="0"
              max="300"
              step="15"
              value={riskState.physicalActivityMinutes}
              onChange={(e) => updateField('physicalActivityMinutes', parseInt(e.target.value, 10))}
              className="w-full accent-sky-600 h-1.5 bg-slate-200 dark:bg-slate-700 rounded-lg cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-slate-400">
              <span>{language === 'ur' ? 'کم (0)' : language === 'ar' ? 'منخفض (0)' : 'Low (0)'}</span>
              <span>{language === 'ur' ? 'تجویز کردہ (150 منٹ)' : language === 'ar' ? 'الموصى به (150 دقيقة)' : 'Recommended (150 mins)'}</span>
              <span>{language === 'ur' ? 'چاق و چوبند (300+)' : language === 'ar' ? 'نشط جداً (300+)' : 'Active (300+)'}</span>
            </div>
          </div>

          <div className="space-y-1">
            <div className="flex justify-between text-xs">
              <span className="text-slate-600 dark:text-slate-300">
                {language === 'ur' ? 'غذا اور تروتازہ خوراک اسکور:' : language === 'ar' ? 'درجة النظام الغذائي الصحي:' : 'Diet & Fresh Foods Score:'}
              </span>
              <strong className="text-slate-900 dark:text-white font-mono">{riskState.mindDietScore}/10</strong>
            </div>
            <input
              type="range"
              min="1"
              max="10"
              value={riskState.mindDietScore}
              onChange={(e) => updateField('mindDietScore', parseInt(e.target.value, 10))}
              className="w-full accent-emerald-600 h-1.5 bg-slate-200 dark:bg-slate-700 rounded-lg cursor-pointer"
            />
          </div>
        </div>
      </div>

      {/* Save Snapshot to Vault Button */}
      <div className="flex justify-end pt-2">
        <button
          onClick={() => {
            try {
              const stored = localStorage.getItem('deepcortex_patient_records_v1');
              let records = stored ? JSON.parse(stored) : [];
              const activeSessionId = sessionStorage.getItem('deepcortex_session_id') || 'SES-2110';
              const snapshot = {
                id: 'rec-risk-' + Date.now(),
                type: 'health',
                title: 'Lancet 14-Factor Modifiable Risk Snapshot',
                timestamp: new Date().toISOString(),
                dateDisplay: 'Current Session',
                score,
                inferenceMode: 'edge',
                sessionId: activeSessionId,
                isPersonal: true,
                summary: `BP: ${riskState.bloodPressureSystolic}/${riskState.bloodPressureDiastolic} mmHg, HbA1c: ${riskState.hba1c}%, Sleep: ${riskState.sleepHours}h, Activity: ${riskState.physicalActivityMinutes}m. Brain Protection Index: ${score}/100.`,
              };
              records = [snapshot, ...records.filter((r: any) => r.id !== snapshot.id)].slice(0, 20);
              localStorage.setItem('deepcortex_patient_records_v1', JSON.stringify(records));
              alert(language === 'ur' ? 'صحت کا اسنیپ شاٹ والٹ میں محفوظ ہو گیا!' : language === 'ar' ? 'تم حفظ مؤشرات الصحة في أرشيف المريض!' : 'Lifestyle snapshot saved to Patient History Vault!');
            } catch (e) {
              console.warn(e);
            }
          }}
          className="px-4 py-2 rounded-xl text-xs font-bold bg-[#00a86b] hover:bg-[#008f5a] text-white transition-colors cursor-pointer flex items-center gap-2 shadow-xs"
        >
          <CheckCircle2 className="w-3.5 h-3.5" />
          <span>
            {language === 'ur' ? 'والٹ میں محفوظ کریں' : language === 'ar' ? 'حفظ في سجل المريض' : 'Save Snapshot to History Vault'}
          </span>
        </button>
      </div>
    </div>
  );
};
