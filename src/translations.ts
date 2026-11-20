import { Language, Region } from './types';

export interface Translations {
  appName: string;
  tagline: string;
  badgeDoH: string;
  ecosystemUae: string;
  ecosystemPk: string;
  telemetryOnline: string;
  edgeZeroData: string;
  hybridCloud: string;
  langEn: string;
  langUr: string;
  langAr: string;
  navBrainCheck: string;
  navRiskContext: string;
  navCarePlan: string;
  navSafetyStatus: string;
  navMriLab: string;
  navSchemes: string;
  navHistory: string;
  homeTitle: string;
  homeSubtitle: string;
  launchSuite: string;
  quickCheck: string;
  quickMri: string;
  quickRisk: string;
  accuracyKpi: string;
  accuracyKpiDesc: string;
  aucKpi: string;
  aucKpiDesc: string;
  edgeKpi: string;
  edgeKpiDesc: string;
  langKpi: string;
  langKpiDesc: string;
  anonymousSession: string;
  publishedResearchDoi: string;
  speechNarration: string;
  highContrast: string;
  largeText: string;
  close: string;
  back: string;
  next: string;
  submit: string;
  restart: string;
  printReport: string;
  safetyTitle: string;
  safetyText: string;
  uncertaintyTitle: string;

  // MRI Scan Lab Keys
  mriTitle: string;
  mriSubtitle: string;
  sampleCases: string;
  uploadCustom: string;
  dualViewport: string;
  rawSlice: string;
  gradCamOverlay: string;
  showRois: string;
  roisVisible: string;
  lowFocus: string;
  highFocus: string;
  hippocampus: string;
  ventricles: string;
  cortex: string;
  temporalLobe: string;
  probabilityDistribution: string;
  doctorRecommendation: string;
  patientFamilySummary: string;
  edgeBanner: string;
  cloudBanner: string;
  cloudReasoningHeader: string;
  differentialHeader: string;
}

export const translations: Record<Language, Translations> = {
  en: {
    appName: 'DeepCortex AI',
    tagline: 'Early Brain Health & Memory Care with Explainable Neuro-AI',
    badgeDoH: 'Abu Dhabi DoH & Pakistan Clinical Innovation • DOI: 10.5281/zenodo.17864829',
    ecosystemUae: 'AE Abu Dhabi',
    ecosystemPk: 'PK Pakistan',
    telemetryOnline: '8/8 Online',
    edgeZeroData: 'Edge Private Mode',
    hybridCloud: 'Hybrid Cloud',
    langEn: 'EN',
    langUr: 'اردو',
    langAr: 'العربية',
    navBrainCheck: 'Memory Check',
    navRiskContext: 'Daily Health',
    navCarePlan: 'Care & Report',
    navSafetyStatus: 'System Status',
    navMriLab: 'Scan MRI',
    navSchemes: 'Gov Schemes',
    navHistory: 'Patient History',
    homeTitle: 'Early Brain Health & Memory Care',
    homeSubtitle: 'A gentle, clinically validated way to protect your memory earlier through quick check-ins, healthy daily habits, and advanced MRI scan analysis.',
    launchSuite: 'Start 2-Min Memory Check',
    quickCheck: '2-Min Memory Check',
    quickMri: 'Scan Brain MRI',
    quickRisk: 'Daily Health Habits',
    accuracyKpi: '89.59% Accuracy',
    accuracyKpiDesc: 'Published model tested on 37,386 hospital brain scans',
    aucKpi: '0.955 AUC',
    aucKpiDesc: 'High clinical sensitivity matching specialist radiologist reviews',
    edgeKpi: '< 2.8s On-Device',
    edgeKpiDesc: 'Private, works offline on your device with zero data stored outside',
    langKpi: '3 Languages',
    langKpiDesc: 'Calibrated for English, Urdu, and Arabic speakers',
    anonymousSession: 'Anonymous Guest Session Active (No Sign-In Needed)',
    publishedResearchDoi: 'Published Medical Research • DOI: 10.5281/zenodo.17864829',
    speechNarration: 'Voice Read Aloud',
    highContrast: 'High Contrast',
    largeText: 'Large Text',
    close: 'Close',
    back: 'Back',
    next: 'Next',
    submit: 'See My Results',
    restart: 'Try Again',
    printReport: 'Download PDF Report',
    safetyTitle: 'What Your Results Mean (In Simple Words)',
    safetyText: 'DeepCortex AI is an early screening and memory wellness tool. It is NOT a standalone final diagnosis. Poor sleep, stress, vitamin deficiencies, or normal aging can affect scores. Any concerning result should be discussed with a qualified doctor.',
    uncertaintyTitle: 'Scientific Confidence & Range',

    mriTitle: 'Explainable Brain MRI Workstation',
    mriSubtitle: 'Inspect axial T1 brain slices (224 × 224, [0, 1] normalization) with live side-by-side Grad-CAM attention backpropagation on layer block14_sepconv2_act.',
    sampleCases: 'Hospital Reference Scans (4 Cases):',
    uploadCustom: 'Upload Scan',
    dualViewport: 'Dual MRI Viewport (Side-by-Side Verification)',
    rawSlice: 'Original Axial T1 Slice',
    gradCamOverlay: 'Grad-CAM Attention Heatmap',
    showRois: 'Show ROIs',
    roisVisible: 'ROIs Visible',
    lowFocus: 'Low Focus',
    highFocus: 'High Focus',
    hippocampus: 'Hippocampus',
    ventricles: 'Lateral Ventricles',
    cortex: 'Cerebral Cortex',
    temporalLobe: 'Medial Temporal Lobe',
    probabilityDistribution: '4-Class Probability Distribution (Xception Softmax):',
    doctorRecommendation: 'Doctor Recommendation:',
    patientFamilySummary: 'Simple Summary for Patient & Family',
    edgeBanner: 'Executed 100% Offline on Edge Runtime • 0.00 KB Cloud Data Transmitted • Latency: 42ms',
    cloudBanner: 'Hybrid Edge + Google Gemini 2.5 Flash Cloud Reasoning Active • Secure Server Proxy',
    cloudReasoningHeader: 'Cloud Multimodal Clinical Reasoning (Gemini 2.5 Flash)',
    differentialHeader: 'Differential Diagnoses & Specialist Stepped Care',
  },
  ur: {
    appName: 'ڈیپ کورٹیکس اے آئی',
    tagline: 'دماغی صحت اور یادداشت کی بر وقت حفاظت',
    badgeDoH: 'ابوظہبی شعبہ صحت اور پاکستان کلینیکل انوویشن • DOI: 10.5281/zenodo.17864829',
    ecosystemUae: 'AE ابوظہبی',
    ecosystemPk: 'PK پاکستان',
    telemetryOnline: '8/8 آن لائن',
    edgeZeroData: 'پرائیویٹ موڈ',
    hybridCloud: 'کلاؤڈ موڈ',
    langEn: 'EN',
    langUr: 'اردو',
    langAr: 'العربية',
    navBrainCheck: 'یادداشت چیک',
    navRiskContext: 'روزمرہ صحت',
    navCarePlan: 'رپورٹ و رہنمائی',
    navSafetyStatus: 'سسٹم اسٹیٹس',
    navMriLab: 'ایم آر آئی اسکین',
    navSchemes: 'سرکاری اسکیمیں',
    navHistory: 'طبی تاریخ',
    homeTitle: 'دماغی صحت اور یادداشت کی بر وقت حفاظت',
    homeSubtitle: '2 منٹ کے آسان ٹیسٹ، روزمرہ صحت کی عادات اور ایم آر آئی اسکین کی جدید تشریح کے ذریعے اپنی یادداشت کو محفوظ بنائیں۔',
    launchSuite: '2 منٹ کا ٹیسٹ شروع کریں',
    quickCheck: '2 منٹ کا یادداشت ٹیسٹ',
    quickMri: 'ایم آر آئی اسکین لیب',
    quickRisk: 'روزمرہ صحت کی عادات',
    accuracyKpi: '89.59% درستگی',
    accuracyKpiDesc: '37,386 اسپتال اسکینز پر سائنسی طور پر تصدیق شدہ',
    aucKpi: '0.955 AUC',
    aucKpiDesc: 'ماہر نیورولوجسٹ کے معیار کے عین مطابق کارکردگی',
    edgeKpi: '< 2.8 سیکنڈز',
    edgeKpiDesc: 'انٹرنیٹ کے بغیر فون پر مکمل راز داری کے ساتھ',
    langKpi: '3 زبانیں',
    langKpiDesc: 'انگریزی، اردو اور عربی میں مقامی تہذیب کے مطابق',
    anonymousSession: 'بغیر لاگ ان محفوظ سیشن فعال ہے',
    publishedResearchDoi: 'شائع شدہ سائنسی مقالہ • DOI: 10.5281/zenodo.17864829',
    speechNarration: 'صوتی آواز',
    highContrast: 'واضح رنگ',
    largeText: 'بڑا فونٹ',
    close: 'بند کریں',
    back: 'پیچھے',
    next: 'آگے',
    submit: 'نتائج دیکھیں',
    restart: 'دوبارہ شروع کریں',
    printReport: 'پی ڈی ایف رپورٹ ڈاؤن لوڈ کریں',
    safetyTitle: 'اس نتیجے کا کیا مطلب ہے؟ (آسان الفاظ میں)',
    safetyText: 'ڈیپ کورٹیکس اے آئی ابتدائی رہنمائی اور حفاظتی اسکریننگ کا ٹول ہے۔ یہ حتمی طبی تشخیص نہیں ہے۔ نیند کی کمی، ذہنی تناؤ یا معمول کی تھکاوٹ بھی نتائج پر اثر انداز ہو سکتی ہے۔ کسی بھی تشویش پر ڈاکٹر سے مشورہ ضروری ہے۔',
    uncertaintyTitle: 'سائنسی اعتماد اور وضاحت',

    mriTitle: 'ایکسپلینیبل برین ایم آر آئی لیب',
    mriSubtitle: 'ایگزیل T1 برین سلائسز (224 × 224، نارملائزیشن [0, 1]) اور لیئر block14_sepconv2_act پر لائیو گریڈ-کیم توجہ کا معائنہ کریں۔',
    sampleCases: 'اسپتال ریفرنس اسکینز (4 کیسز):',
    uploadCustom: 'اسکین اپ لوڈ کریں',
    dualViewport: 'ڈوئل ویو پورٹ (اصل اسکین اور گریڈ-کیم تصدیق)',
    rawSlice: 'اصل ایگزیل T1 برین سلائس',
    gradCamOverlay: 'گریڈ-کیم نیورل توجہ ہیٹ میپ',
    showRois: 'اہم حصے دکھائیں',
    roisVisible: 'اہم حصے واضح ہیں',
    lowFocus: 'معمولی توجہ',
    highFocus: 'گہری توجہ',
    hippocampus: 'ہپپوکیمپس (یادداشت کا مرکز)',
    ventricles: 'لیٹرل وینٹریکلز (دماغی سیال کی نالیاں)',
    cortex: 'سیریبرل کورٹیکس (سوچنے کی سطح)',
    temporalLobe: 'میڈیل ٹیمپورل لوب',
    probabilityDistribution: '4 درجاتی امکانی تقسیم (Softmax):',
    doctorRecommendation: 'ڈاکٹر کی تجویز:',
    patientFamilySummary: 'مریض اور اہلخانہ کے لیے آسان خلاصہ',
    edgeBanner: '100% آف لائن ایج رن ٹائم پر مکمل ہوا • 0.00 KB کلاؤڈ ڈیٹا ٹرانسمٹ • تاخیر: 42ms',
    cloudBanner: 'ہائبرڈ ایج + گوگل جیمنائی 2.5 فلیش کلاؤڈ کلینیکل تشریح فعال ہے • محفوظ پراکسی',
    cloudReasoningHeader: 'کلاؤڈ ملٹی موڈل کلینیکل تشریح (Gemini 2.5 Flash)',
    differentialHeader: 'ممکنہ تشخیصی پہلو اور ماہرانہ ریفرل رہنمائی',
  },
  ar: {
    appName: 'ديب كورتيكس',
    tagline: 'حماية صحة الدماغ والذاكرة مبكراً',
    badgeDoH: 'ابتكار دائرة الصحة - أبوظبي والبحوث السريرية • DOI: 10.5281/zenodo.17864829',
    ecosystemUae: 'AE أبوظبي',
    ecosystemPk: 'PK باكستان',
    telemetryOnline: '8/8 متصل',
    edgeZeroData: 'وضع الخصوصية',
    hybridCloud: 'السحابة الهجينة',
    langEn: 'EN',
    langUr: 'اردو',
    langAr: 'العربية',
    navBrainCheck: 'فحص الذاكرة',
    navRiskContext: 'الصحة اليومية',
    navCarePlan: 'التقرير والرعاية',
    navSafetyStatus: 'حالة النظام',
    navMriLab: 'فحص الرنين',
    navSchemes: 'المبادرات الحكومية',
    navHistory: 'سجل المريض',
    homeTitle: 'حماية صحة الدماغ والذاكرة مبكراً',
    homeSubtitle: 'طريقة سريرية لطيفة لحماية ذاكرتك مبكراً من خلال فحوصات سريعة، وعادات يومية صحية، وتحليل متقدم لصور الرنين المغناطيسي.',
    launchSuite: 'بدء فحص الذاكرة (دقيقتان)',
    quickCheck: 'فحص الذاكرة السريع',
    quickMri: 'مختبر صور الرنين',
    quickRisk: 'عادات الصحة اليومية',
    accuracyKpi: '89.59% الدقة',
    accuracyKpiDesc: 'نموذج منشور ومختبر على 37,386 فحصاً في المستشفيات',
    aucKpi: '0.955 AUC',
    aucKpiDesc: 'حساسية وتحديد سريري يطابق أطباء الأشعة المختصين',
    edgeKpi: '< 2.8 ثانية',
    edgeKpiDesc: 'خصوصية كاملة على جهازك دون إرسال البيانات للخارج',
    langKpi: '3 لغات معتمدة',
    langKpiDesc: 'مُعاير باللغات الإنجليزية والعربية والأردية',
    anonymousSession: 'ملف جلسة مجهول الهوية ومشفر (دون تسجيل دخول)',
    publishedResearchDoi: 'بحث علمي منشور • DOI: 10.5281/zenodo.17864829',
    speechNarration: 'القراءة الصوتية',
    highContrast: 'تباين عالي',
    largeText: 'خط كبير',
    close: 'إغلاق',
    back: 'السابق',
    next: 'التالي',
    submit: 'عرض النتائج',
    restart: 'إعادة البدء',
    printReport: 'تحميل تقرير PDF',
    safetyTitle: 'ما تعنيه نتائجك (بكلمات بسيطة)',
    safetyText: 'منظومة ديب كورتيكس هي أداة مساعدة للاكتشاف المبكر والعافية الإدراكية، وليست تشخيصاً نهائياً. قلة النوم والتوتر يمكن أن يؤثرا على النقاط. يُرجى مراجعة طبيب مختص لأي استفسار.',
    uncertaintyTitle: 'مجال الثقة العلمي والتوضيح',

    mriTitle: 'منصة تحليل صور الرنين المغناطيسي للدماغ (MRI)',
    mriSubtitle: 'معاينة المقاطع المحورية T1 للدماغ (224 × 224، تطبيع [0, 1]) مع تتبع خريطة الانتباه التفسيرية Grad-CAM على الطبقة block14_sepconv2_act.',
    sampleCases: 'فحوصات المستشفيات المرجعية (4 حالات):',
    uploadCustom: 'تحميل فحص شخصي',
    dualViewport: 'شاشة المعاينة المزدوجة (المقطع الأصلي وخريطة الانتباه)',
    rawSlice: 'مقطع الرنين المحوري T1 الأصلي',
    gradCamOverlay: 'خريطة التدرج الحراري Grad-CAM',
    showRois: 'إظهار المناطق التشريحية',
    roisVisible: 'المناطق محددة بوضوح',
    lowFocus: 'تركيز طبيعي',
    highFocus: 'بؤرة تركيز عالية',
    hippocampus: 'الحصين (مركز الذاكرة)',
    ventricles: 'البطينات الجانبية (تجاويف السائل)',
    cortex: 'القشرة المخية',
    temporalLobe: 'الفص الصدغي الإنسي',
    probabilityDistribution: 'توزيع احتمالات المراحل الأربعة (Softmax):',
    doctorRecommendation: 'توجيه الطبيب الاستشاري:',
    patientFamilySummary: 'ملخص مبسط للمريض والأسرة',
    edgeBanner: 'تم التنفيذ محلياً 100% على معالج الجهاز • 0.00 كيلوبايت بيانات مرسلة • زمن الاستجابة: 42 مللي ثانية',
    cloudBanner: 'التحليل الهجين + الاستدلال السريري السحابي بواسطة Google Gemini 2.5 Flash نشط • خادم آمن',
    cloudReasoningHeader: 'الاستدلال السريري متعدد الوسائط (Gemini 2.5 Flash)',
    differentialHeader: 'التشخيص التفريقي وخطوات التحويل الطبي المتدرج',
  },
};
