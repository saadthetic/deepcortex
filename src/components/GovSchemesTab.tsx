import React from 'react';
import {
  Landmark,
  ShieldCheck,
  CheckCircle2,
  ExternalLink,
  PhoneCall,
  Calendar,
  Building2,
  FileText,
  HeartHandshake,
  Users,
  ChevronRight,
} from 'lucide-react';
import { Region, Language } from '../types';

interface GovSchemesTabProps {
  region: Region;
  setRegion: (region: Region) => void;
  language: Language;
}

export const GovSchemesTab: React.FC<GovSchemesTabProps> = ({
  region,
  setRegion,
  language,
}) => {
  const isUrdu = language === 'ur';
  const isArabic = language === 'ar';

  const uaeSchemes = [
    {
      id: 'ifhas',
      title: isUrdu
        ? 'افحص: جامع وقائی اسکریننگ پروگرام (ADPHC)'
        : isArabic
        ? 'برنامج «افحص» للفحص الدوري الشامل (مركز أبوظبي للصحة العامة)'
        : 'IFHAS Comprehensive Periodic Screening (ADPHC / DoH)',
      org: isUrdu ? 'دائرہ صحت ابوظہبی (DoH)' : isArabic ? 'دائرة الصحة - أبوظبي' : 'Abu Dhabi Public Health Centre (ADPHC)',
      badge: isUrdu ? '100% مفت اسکریننگ' : isArabic ? 'فحص وقائي مجاني' : 'Free Preventive Baseline',
      eligibility: isUrdu
        ? '18 سال اور اس سے زائد عمر کے تمام ثقہ (Thiqa) اور اماراتی شہری'
        : isArabic
        ? 'حاملو بطاقات «ثقة» ومواطنو الدولة من سن 18 عاماً فما فوق'
        : 'All Thiqa cardholders and UAE nationals aged 18+',
      coverageLimit: isUrdu ? 'مکمل سالانہ کور' : isArabic ? 'تغطية وقائية كاملة سنوياً' : '100% Annual Periodic Baseline',
      description: isUrdu
        ? 'ابوظہبی ہیلتھ سروسز (SEHA) اور نجی کلینکس میں دماغی، میٹابولک اور دل کی صحت کا جامع معائنہ۔ ملفی (Malaffi) کے ذریعے تمام نتائج براہ راست سنک ہوتے ہیں۔'
        : isArabic
        ? 'فحوصات دورية مبكرة تشمل تقييم صحة الدماغ، والوظائف الأيضية، وصحة القلب والشرايين، مع ربط رقمي فوري بملف «ملفي» الطبي الموحد.'
        : 'Comprehensive early screening for cognitive baseline, cardiovascular, metabolic, and genetic risk factors across 84 SEHA primary healthcare centers with automated Malaffi EHR sync.',
      actions: [
        {
          label: isUrdu ? 'پورٹل ملاحظہ کریں' : isArabic ? 'بوابة افحص' : 'Visit ADPHC Portal',
          url: 'https://www.adphc.gov.ae',
          icon: ExternalLink,
        },
        {
          label: '800-50',
          url: 'tel:80050',
          icon: PhoneCall,
        },
      ],
      highlights: [
        isUrdu ? 'میموری اور علمی صلاحیت کا ابتدائی ٹیسٹ' : isArabic ? 'تقييم خط الأساس للذاكرة والوظائف الإدراكية' : 'Early memory baseline & cognitive risk screening',
        isUrdu ? 'ذیابیطس، بلڈ پریشر اور لپڈ پروفائل' : isArabic ? 'فحوصات السكري، وضغط الدم، والدهون' : 'Cardiovascular & metabolic neuro-vascular panels',
        isUrdu ? 'ملفی ہیلتھ انفارمیشن ایکسچینج سے منسلک' : isArabic ? 'ربط آلي مع منصة «ملفي» الصحية' : 'Automatic synchronization with Malaffi HIE',
      ],
    },
    {
      id: 'thiqa-daman',
      title: isUrdu
        ? 'ثقہ اور ضمان: جدید نیورو ڈائیگنوسٹک کوریج'
        : isArabic
        ? 'تغطية «ثقة» وضمان للتشخيص العصبي المتقدم'
        : 'Thiqa & Daman Enhanced Neuro-Diagnostic Coverage',
      org: isUrdu ? 'نیشنل ہیلتھ انشورنس کمپنی (ضمان / ثقہ)' : isArabic ? 'الشركة الوطنية للضمان الصحي (ضمان / ثقة)' : 'National Health Insurance Co. (Thiqa / Daman)',
      badge: isUrdu ? 'مکمل انشورنس کوریج' : isArabic ? 'تغطية تأمينية شاملة' : '100% Neuroimaging Coverage',
      eligibility: isUrdu
        ? 'ثقہ کارڈ ہولڈرز اور ضمان اینہانسڈ پالیسی حاملین'
        : isArabic
        ? 'مشتركو بطاقة ثقة وتأمين ضمان الفئات المعززة'
        : 'Thiqa cardholders and enhanced Daman policyholders',
      coverageLimit: isUrdu ? 'لا محدود (طبی ضرورت کے مطابق)' : isArabic ? 'تغطية غير محدودة وفق الضرورة الطبية' : 'Full Inpatient/Outpatient Diagnostic Coverage',
      description: isUrdu
        ? 'کلیولینڈ کلینک ابوظہبی، شیخ شخبوط میڈیکل سٹی اور مدینة شخبوط میں ماہر نیورولوجسٹ کنسلٹیشن، 3T برین ایم آر آئی اسکین، اور میموری کلینکس کی 100 فیصد کوریج۔'
        : isArabic
        ? 'تغطية متكاملة لاستشارات استشاريي الأعصاب، والتصوير بالرنين المغناطيسي عالي الدقة 3T، وفحوصات عيادات الذاكرة في مستشفى كليفلاند كلينك أبوظبي ومدينة الشيخ شخبوط الطبية.'
        : 'Full 100% coverage for 3T volumetric brain MRI, specialized neurologist evaluations, cerebrospinal biomarker panels, and memory clinic consultations across Abu Dhabi apex facilities.',
      actions: [
        {
          label: isUrdu ? 'ضمان ثقہ ڈائریکٹری' : isArabic ? 'دليل شبكة ثقة' : 'Thiqa Provider Directory',
          url: 'https://www.damanhealth.ae',
          icon: ExternalLink,
        },
        {
          label: isUrdu ? 'کلیولینڈ کلینک نیورو' : isArabic ? 'كليفلاند كلينك' : 'Cleveland Clinic Abu Dhabi',
          url: 'https://www.clevelandclinicabudhabi.ae',
          icon: ExternalLink,
        },
      ],
      highlights: [
        isUrdu ? '3T ہائی ریزولوشن والومیٹرک برین ایم آر آئی' : isArabic ? 'تصوير رنين مغناطيسي ثلاثي الأبعاد 3T' : '3T volumetric brain MRI neuroimaging',
        isUrdu ? 'ماہر نیورولوجسٹ اور نیورو سائیکولوجسٹ کے معائنے' : isArabic ? 'استشارات كبار استشاريي الأعصاب والذاكرة' : 'Specialist neurologist & neuropsychology panels',
        isUrdu ? 'کوئی پیشگی ادائیگی یا کٹوتی نہیں' : isArabic ? 'دون دفع مسبق في شبكة SEHA ومبادلة' : 'Zero out-of-pocket copay at SEHA/Mubadala apex centers',
      ],
    },
    {
      id: 'senior-care',
      title: isUrdu
        ? 'محکمہ برائے کمیونٹی ڈویلپمنٹ (DCD) اور صحة: سینئر ہوم کیئر'
        : isArabic
        ? 'برنامج الرعاية المنزلية لكبار المواطنين (DCD وشركة صحة)'
        : 'Department of Community Development (DCD) & SEHA Senior Home Care',
      org: isUrdu ? 'DCD اور ابوظہبی ہیلتھ سروسز (صحة)' : isArabic ? 'دائرة تنمية المجتمع وشركة «صحة»' : 'DCD Abu Dhabi & SEHA Home Healthcare',
      badge: isUrdu ? 'گھریلو خصوصی خدمت' : isArabic ? 'رعاية منزلية تخصصية' : 'Senior Home Healthcare',
      eligibility: isUrdu
        ? 'ابوظہبی کے 60 سال یا زائد عمر کے سینئر اماراتی شہری'
        : isArabic
        ? 'كبار المواطنين من عمر 60 عاماً فما فوق في إمارة أبوظبي'
        : 'Emirati seniors aged 60+ and individuals with mobility constraints',
      coverageLimit: isUrdu ? 'مفت جامع گھریلو نگہداشت' : isArabic ? 'خدمات تمريضية وطبية منزلية مجانية' : 'Fully Subsidized Home Visits & Respite',
      description: isUrdu
        ? 'گھر پر ماہر ڈاکٹرز اور نرسنگ اسٹاف کے ذریعے یادداشت کا تفصیلی معائنہ، ادویات کا نظم، فزیو تھراپی اور دیکھ بھال کرنے والے اہلخانہ کی تربیت اور معاونت۔'
        : isArabic
        ? 'فريق طبي متنقل يقدم تقييمات الذاكرة، والعلاج الوظيفي، وإعادة التأهيل الإدراكي، ودعم المرافقين في راحة المنزل دون الحاجة لمراجعة المستشفى.'
        : 'Multidisciplinary in-home cognitive assessments, occupational therapy, vital signs tracking, and specialized caregiver training delivered directly to the patient’s home.',
      actions: [
        {
          label: isUrdu ? 'سروس کی درخواست' : isArabic ? 'طلب خدمة الرعاية' : 'Request Home Care',
          url: 'https://www.tamm.abudhabi',
          icon: ExternalLink,
        },
        {
          label: '800-1111',
          url: 'tel:8001111',
          icon: PhoneCall,
        },
      ],
      highlights: [
        isUrdu ? 'گھر پر باقاعدہ علمی و یادداشت جائزہ' : isArabic ? 'تقييم منزلي مستمر للقدرات الإدراكية' : 'Regular in-home cognitive & ADL evaluations',
        isUrdu ? 'فزیوتھراپی اور پیشہ ورانہ بحالی' : isArabic ? 'علاج طبيعي وإعادة تأهيل عصبي' : 'Physiotherapy & occupational home rehabilitation',
        isUrdu ? 'خاندان کے نگرانوں کے لیے باقاعدہ رہنمائی' : isArabic ? 'برامج دعم وتدريب مرافقي المرضى' : 'Caregiver respite & family mental wellness counseling',
      ],
    },
    {
      id: 'sahatna-malaffi',
      title: isUrdu
        ? 'صحتنا ایپ اور ملفی (Malaffi): ڈیجیٹل کیئر لوپ'
        : isArabic
        ? 'تطبيق «صحتنا» ومنظومة «ملفي» الصحية الرقمية الموحدة'
        : 'Abu Dhabi "Sahatna" & Malaffi Digital Care Loop',
      org: isUrdu ? 'محکمہ صحت ابوظہبی (DoH)' : isArabic ? 'دائرة الصحة - أبوظبي ومنصة ملفي' : 'Department of Health Abu Dhabi (DoH)',
      badge: isUrdu ? 'ڈیجیٹل ہیلتھ ریکارڈ' : isArabic ? 'سجل طبي موحد وفوري' : 'Automated Digital Loop',
      eligibility: isUrdu
        ? 'ابوظہبی کے تمام رہائشی اور مریض'
        : isArabic
        ? 'جميع المواطنين والمقيمين في إمارة أبوظبي'
        : 'All Abu Dhabi residents holding valid Emirates ID',
      coverageLimit: isUrdu ? 'تمام اسپتالوں میں مفت ڈیٹا رسائی' : isArabic ? 'ربط مجاني متكامل بين المستشفيات' : 'Universal Healthcare Interoperability',
      description: isUrdu
        ? 'ابوظہبی کے تمام 100% سرکاری اور نجی اسپتالوں اور لیبز کے نتائج، ایم آر آئی اسکین رپورٹس اور ڈاکٹرز کے نوٹس صحتنا ایپ اور ملفی میں خودکار طور پر محفوظ اور سنک ہوتے ہیں۔'
        : isArabic
        ? 'سجل صحي رقمي موحد يربط 100% من المنشآت الطبية الحكومية والخاصة في أبوظبي، ما يتيح للطبيب المعالج الاطلاع على تاريخ الفحوصات وصور الرنين فورياً لمنع تكرار الإجراءات.'
        : 'Seamless longitudinal synchronization connecting 100% of public and private hospitals, diagnostic centers, and clinics in Abu Dhabi to track cognitive drift over years.',
      actions: [
        {
          label: isUrdu ? 'صحتنا ایپ کھولیں' : isArabic ? 'تطبيق صحتنا' : 'Download Sahatna App',
          url: 'https://sahatna.ae',
          icon: ExternalLink,
        },
        {
          label: isUrdu ? 'ملفی پورٹل' : isArabic ? 'بوابة ملفي' : 'Malaffi Portal',
          url: 'https://malaffi.ae',
          icon: ExternalLink,
        },
      ],
      highlights: [
        isUrdu ? 'طبی تاریخ اور ایم آر آئی اسکینز کا محفوظ ریکارڈ' : isArabic ? 'حفظ دائم لصور الرنين المغناطيسي والتقارير' : 'Secure longitudinal archiving of MRI & clinical labs',
        isUrdu ? 'اسپتالوں کے مابین فوری ڈیٹا شیئرنگ' : isArabic ? 'تبادل فوري للبيانات بين المراكز الطبية' : 'Zero redundant tests when switching between clinics',
        isUrdu ? 'صحتنا ایپ پر مریض کا براہ راست کنٹرول' : isArabic ? 'وصول شخصي مباشر عبر تطبيق صحتنا' : 'Direct patient ownership via the Sahatna app',
      ],
    },
  ];

  const pakistanSchemes = [
    {
      id: 'sehat-sahulat',
      title: isUrdu
        ? 'قومی صحت کارڈ / صحت سہولت پروگرام'
        : isArabic
        ? 'برنامج بطاقة «صحت سہولت» للتغطية الصحية الشاملة'
        : 'Sehat Sahulat Program (Qaumi Sehat Card / UHC)',
      org: isUrdu ? 'حکومت پاکستان و محکمہ صحت پنجاب' : isArabic ? 'حكومة باكستان ووزارة الصحة بإقليم البنجاب' : 'Ministry of National Health Services & Punjab Health',
      badge: isUrdu ? '10 لاکھ روپے تک مفت علاج' : isArabic ? 'تغطية تصل لمليون روبية سنوياً' : 'PKR 1,000,000 / Family',
      eligibility: isUrdu
        ? 'شناختی کارڈ (CNIC) رکھنے والے تمام رجسٹرڈ خاندان'
        : isArabic
        ? 'حاملو بطاقة الهوية الوطنية الباكستانية (CNIC) وأسرهم'
        : 'All permanent resident families holding NADRA CNIC in Punjab/KPK/ICT',
      coverageLimit: isUrdu ? '10 لاکھ روپے سالانہ فی خاندان' : isArabic ? 'مليون روبية باكستانية سنوياً لكل عائلة' : 'PKR 1,000,000 Inpatient Coverage / Year',
      description: isUrdu
        ? 'ملک بھر کے منظور شدہ سرکاری اور نجی اسپتالوں میں برین ایم آر آئی، سی ٹی اسکین، نیورولوجیکل ایڈمیشن اور سرجری کا 100 فیصد مفت علاج۔'
        : isArabic
        ? 'تغطية مجانية شاملة داخل المستشفيات المعتمدة لفحوصات الرنين المغناطيسي للدماغ (MRI)، والتصوير الطبقي، ورعاية أمراض الأعصاب الدقيقة.'
        : 'Comprehensive inpatient neurological care, axial brain MRI neuroimaging, stroke management, and tertiary neurology interventions at over 1,100 empaneled hospitals.',
      actions: [
        {
          label: isUrdu ? 'اہلیت چیک کریں (پورٹل)' : isArabic ? 'التحقق من الأهلية' : 'Check Eligibility',
          url: 'https://www.pmhealthprogram.gov.pk',
          icon: ExternalLink,
        },
        {
          label: '9780 / 1033',
          url: 'tel:1033',
          icon: PhoneCall,
        },
      ],
      highlights: [
        isUrdu ? 'داخل مریضوں کے لیے برین ایم آر آئی اور سی ٹی اسکین مفت' : isArabic ? 'فحوصات الرنين والتصوير المقطعي مجاناً للمنومين' : '100% free inpatient axial brain MRI & neuro-diagnostics',
        isUrdu ? '1,100 سے زائد سرکاری و نجی اسپتالوں کا وسیع نیٹ ورک' : isArabic ? 'شبكة تضم أكثر من 1,100 مستشفى حكومي وخاص' : 'Empaneled network across 1,100+ apex hospitals',
        isUrdu ? 'نادرا شناختی کارڈ کے ذریعے فوری ایڈمیشن' : isArabic ? 'دخول فوري ببطاقة الهوية دون تعقيدات' : 'Instant paperless admission using NADRA CNIC',
      ],
    },
    {
      id: 'punjab-neuro-opd',
      title: isUrdu
        ? 'ڈی ایچ کیو ساہیوال ٹیچنگ اسپتال اور PINS لاہور: مفت نیورو او پی ڈی'
        : isArabic
        ? 'العيادات الخارجية المجانية للأعصاب بمستشفى ساهيوال ومعهد لاهور (PINS)'
        : 'DHQ Teaching Hospital Sahiwal & PINS Lahore Free Neuro-OPD',
      org: isUrdu ? 'محکمہ پرائمری اینڈ سیکنڈری ہیلتھ کیئر پنجاب' : isArabic ? 'دائرة الرعاية الصحية الأولية والثانوية بالبنجاب' : 'Punjab Specialized Healthcare & Medical Education',
      badge: isUrdu ? 'مفت سرکاری اسپتال او پی ڈی' : isArabic ? 'استشارات وعيادات خارجية مجانية' : 'Free Public Neuro-OPD',
      eligibility: isUrdu
        ? 'تمام شہری (مفت رجسٹریشن اور ابتدائی پرچی)'
        : isArabic
        ? 'متاح لجميع المواطنين مجاناً'
        : 'Open to all walk-in patients and physician referrals',
      coverageLimit: isUrdu ? 'مفت ڈاکٹر معائنہ اور رعایتی اسکینز' : isArabic ? 'كشف طبي مجاني وفحوصات مدعومة بالكامل' : 'Free Clinical Consultations & Subsidized Scans',
      description: isUrdu
        ? 'ساہیوال ٹیچنگ اسپتال اور پنجاب انسٹی ٹیوٹ آف نیورو سائنسز (PINS) لاہور میں ماہر نیورولوجسٹ کنسلٹیشن، ای ای جی (EEG)، اور دماغی صحت کلینک کی سہولیات۔'
        : isArabic
        ? 'عيادات تخصصية مجانية لأمراض الأعصاب والذاكرة، وتخطيط كهربية الدماغ (EEG)، والإحالة للتصوير المتقدم في مستشفى ساهيوال ومعهد PINS لاهور.'
        : 'Dedicated outpatient memory clinics, specialist neurological consultations, electroencephalography (EEG), and subsidized diagnostic neuroimaging referrals under Punjab Health.',
      actions: [
        {
          label: isUrdu ? 'ساہیوال میڈیکل کالج' : isArabic ? 'مستشفى ساهيوال التعليمي' : 'Sahiwal Teaching Hospital',
          url: 'http://slmc.edu.pk',
          icon: ExternalLink,
        },
        {
          label: isUrdu ? 'پنجاب ہیلتھ ہیلپ لائن' : isArabic ? 'هاتف صحة البنجاب' : 'Helpline 1033',
          url: 'tel:1033',
          icon: PhoneCall,
        },
      ],
      highlights: [
        isUrdu ? 'ماہر نیورولوجسٹ اور سائیکائٹرسٹ کی مفت او پی ڈی' : isArabic ? 'كشف مجاني مع استشاريي الأعصاب والطب النفسي' : 'Specialist neurologist & geriatric psychiatric OPD',
        isUrdu ? 'پنجاب حکومت کی جانب سے مفت بنیادی ادویات' : isArabic ? 'صرف الأدوية الأساسية مجاناً من صيدلية المستشفى' : 'Free hospital formulary medications for elderly patients',
        isUrdu ? 'لاہور اور ساہیوال میں ترتیری لیول ریفرل' : isArabic ? 'نظام إحالة مباشر للمراكز المتقدمة' : 'Direct referral routing between Sahiwal and Lahore apex centers',
      ],
    },
    {
      id: 'punjab-seniors',
      title: isUrdu
        ? 'پنجاب سینئر سٹیزنز ویلفیئر و سوشل پروٹیکشن اینیشیٹو'
        : isArabic
        ? 'مبادرة رعاية كبار السن والحماية الاجتماعية بإقليم البنجاب'
        : 'Punjab Senior Citizens Welfare & Social Protection Initiative',
      org: isUrdu ? 'پنجاب سوشل پروٹیکشن اتھارٹی (PSPA)' : isArabic ? 'هيئة الحماية الاجتماعية بالبنجاب (PSPA)' : 'Punjab Social Protection Authority (PSPA)',
      badge: isUrdu ? 'سینئر سٹیزن کارڈ سہولیات' : isArabic ? 'تسهيلات بطاقة كبار السن' : 'Senior Welfare Program',
      eligibility: isUrdu
        ? '60 سال یا زائد عمر کے سینئر شہری'
        : isArabic
        ? 'كبار السن من عمر 60 عاماً فما فوق من سكان البنجاب'
        : 'Residents aged 60+ in Punjab with Senior Citizen Card',
      coverageLimit: isUrdu ? 'خصوصی کاؤنٹرز اور مفت ادویات' : isArabic ? 'أولوية طبية وأدوية مجانية' : 'Priority Hospital Queues & Free Essential Meds',
      description: isUrdu
        ? 'تمام ٹیچنگ اور ڈسٹرکٹ اسپتالوں میں سینئر شہریوں کے لیے علیحدہ کاؤنٹرز، مفت معمول کی ادویات، اور کمزور بزرگوں کے لیے فزیوتھراپی و رہنمائی۔'
        : isArabic
        ? 'مسارات سريعة مخصصة لكبار السن بالمستشفيات، وخصومات على الخدمات التشخيصية، وصرف شهري مجاني للأدوية الوقائية لأمراض الضغط والأعصاب.'
        : 'Dedicated fast-track hospital counters, subsidized diagnostics, free essential neuro-protective medications, and priority elderly care at all government teaching hospitals.',
      actions: [
        {
          label: isUrdu ? 'PSPA پورٹل' : isArabic ? 'بوابة هيئة الحماية' : 'PSPA Official Portal',
          url: 'https://pspa.punjab.gov.pk',
          icon: ExternalLink,
        },
        {
          label: '042-99232359',
          url: 'tel:04299232359',
          icon: PhoneCall,
        },
      ],
      highlights: [
        isUrdu ? 'اسپتالوں میں بزرگ شہریوں کے لیے ترجیحی لائنز' : isArabic ? 'طوابير وأولويات خاصة لكبار السن' : 'Zero-wait priority queues for clinical assessments',
        isUrdu ? 'ڈیمنشیا اور الزائمر کے مریضوں کے لیے معاونت' : isArabic ? 'برامج دعم لمرضى الذاكرة والزهايمر وأسرهم' : 'Dedicated support pathways for dementia and memory patients',
        isUrdu ? 'ماہانہ ادویات کی مفت فراہمی' : isArabic ? 'توفير مجاني للأدوية المزمنة الأساسية' : 'Subsidized chronic illness & neurological prescriptions',
      ],
    },
    {
      id: 'bait-ul-maal',
      title: isUrdu
        ? 'پاکستان بیت المال اور زکوٰۃ میڈیکل فنانشل اسسٹنس'
        : isArabic
        ? 'المساعدات الطبية المباشرة من بيت المال ولجان الزكاة'
        : 'Pakistan Bait-ul-Maal & Zakat Medical Financial Assistance',
      org: isUrdu ? 'پاکستان بیت المال (PBM) و وزارت تخفیف غربت' : isArabic ? 'بيت المال الباكستاني ووزارة الحماية الاجتماعية' : 'Pakistan Bait-ul-Maal (PBM) / Poverty Alleviation',
      badge: isUrdu ? 'مستحقین کے لیے براہ راست گرانٹ' : isArabic ? 'منح علاجية مباشرة للأسر المتعففة' : 'Direct Medical Grants',
      eligibility: isUrdu
        ? 'کم آمدنی والے خاندان اور مستحقین جنہیں مہنگے ٹیسٹ درکار ہوں'
        : isArabic
        ? 'الأسر ذات الدخل المحدود التي تحتاج لفحوصات وأدوية تخصصية مكلفة'
        : 'Low-income and vulnerable families requiring specialized neuroimaging',
      coverageLimit: isUrdu ? 'ضرورت کے مطابق 6 لاکھ روپے تک گرانٹ' : isArabic ? 'منح تصل إلى 600,000 روبية حسب الحالة' : 'Up to PKR 600,000 Special Diagnostic Grant',
      description: isUrdu
        ? 'ان مریضوں کے لیے نقد گرانٹ جو مہنگے برین ایم آر آئی، خصوصی ادویات یا طویل مدتی اعصابی نگہداشت کے اخراجات برداشت نہیں کر سکتے۔'
        : isArabic
        ? 'دعم مالي مباشر لتغطية تكاليف التصوير بالرنين المغناطيسي، وجلسات العلاج المتخصصة، والأدوية غير المتوفرة بالمستشفيات العامة للأسر المستحقة.'
        : 'Direct financial assistance cheques issued directly to hospital neurology departments for complex neuroimaging, specialized medications, and long-term dementia care.',
      actions: [
        {
          label: isUrdu ? 'بیت المال فارم ڈاؤن لوڈ' : isArabic ? 'طلب المساعدة الطبية' : 'PBM Medical Aid Form',
          url: 'https://pbm.gov.pk',
          icon: ExternalLink,
        },
        {
          label: '0800-66666',
          url: 'tel:080066666',
          icon: PhoneCall,
        },
      ],
      highlights: [
        isUrdu ? 'مہنگے ایم آر آئی اسکینز کے لیے اسپتال کو براہ راست ادائیگی' : isArabic ? 'سداد مباشر للمستشفيات لفحوصات الرنين الباهظة' : 'Direct vendor payment for expensive 3T MRI & diagnostic panels',
        isUrdu ? 'ڈسٹرکٹ سطح پر بیت المال دفاتر میں آسان درخواست' : isArabic ? 'مكاتب تسجيل متوفرة في كافة المديريات' : 'District-level application submission at DHQ hospitals',
        isUrdu ? 'تیزی سے منظوری برائے ایمرجنسی کیسز' : isArabic ? 'معاملة عاجلة للحالات العصبية الحرجة' : 'Expedited approval for progressive cognitive conditions',
      ],
    },
  ];

  const currentSchemes = region === 'abu-dhabi' ? uaeSchemes : pakistanSchemes;

  return (
    <div className="w-full max-w-6xl mx-auto space-y-6 pb-28 pt-2">
      {/* Hero Banner with Jurisdiction Switcher */}
      <div className="p-6 sm:p-7 rounded-3xl bg-gradient-to-br from-teal-500 via-[#00a86b] to-emerald-700 text-white shadow-lg relative overflow-hidden">
        <div className="absolute -right-10 -bottom-10 w-48 h-48 rounded-full bg-white/10 blur-2xl pointer-events-none" />
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-5 relative z-10">
          <div className="space-y-1.5 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/15 backdrop-blur-md text-white text-xs font-bold border border-white/20">
              <Landmark className="w-3.5 h-3.5" />
              <span>
                {isUrdu
                  ? 'سرکاری و عوامی فلاحی صحت پروگرام'
                  : isArabic
                  ? 'برامج ومبادرات الصحة الحكومية المعتمدة'
                  : 'Official Government Health Schemes & Coverage'}
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              {isUrdu
                ? 'دماغی صحت اور ڈائیگنوسٹک اسکین کے سرکاری پیکجز'
                : isArabic
                ? 'تغطية صحة الدماغ والفحوصات التشخيصية الحكومية'
                : 'Government Brain Health Schemes & Diagnostic Coverage'}
            </h1>
            <p className="text-xs sm:text-sm text-teal-50 font-medium leading-relaxed">
              {isUrdu
                ? 'معلوم کریں کہ آپ کی حکومت برین ایم آر آئی، میموری اسکریننگ اور سینئر کیئر کے لیے کیا مفت یا رعایتی سہولیات فراہم کرتی ہے۔'
                : isArabic
                ? 'تعرف على برامج الرعاية الوقائية وتغطية فحوصات الرنين المغناطيسي المجانية والمدعومة من الجهات الصحية الرسمية في منطقتك.'
                : 'Actionable guidance on public coverage, 100% free baseline memory screenings, and MRI diagnostic funding across Abu Dhabi and Pakistan.'}
            </p>
          </div>

          {/* Region Switcher Inside the Page */}
          <div className="p-1.5 rounded-2xl bg-white/20 backdrop-blur-md border border-white/30 flex items-center gap-1.5 shrink-0 self-stretch sm:self-auto justify-center">
            <button
              onClick={() => setRegion('abu-dhabi')}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center gap-2 cursor-pointer ${
                region === 'abu-dhabi'
                  ? 'bg-white text-teal-800 shadow-md'
                  : 'text-white hover:bg-white/10'
              }`}
            >
              <span className="font-mono font-black text-xs px-1.5 py-0.5 rounded bg-teal-100 text-teal-900">
                AE
              </span>
              <span>{isUrdu ? 'ابوظہبی (DoH / ثقہ)' : isArabic ? 'أبوظبي (دائرة الصحة)' : 'Abu Dhabi (DoH)'}</span>
            </button>

            <button
              onClick={() => setRegion('pakistan')}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center gap-2 cursor-pointer ${
                region === 'pakistan'
                  ? 'bg-white text-[#00a86b] shadow-md'
                  : 'text-white hover:bg-white/10'
              }`}
            >
              <span className="font-mono font-black text-xs px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-900">
                PK
              </span>
              <span>{isUrdu ? 'پاکستان (صحت سہولت)' : isArabic ? 'باكستان (صحت سہولت)' : 'Pakistan (Sehat Card)'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Region Status Pill */}
      <div className="flex items-center justify-between px-1">
        <div className="flex items-center gap-2 text-xs font-bold text-slate-700 dark:text-slate-300">
          <Building2 className="w-4 h-4 text-[#00a86b]" />
          <span>
            {region === 'abu-dhabi'
              ? isUrdu
                ? 'ابوظہبی کے 4 مستند پروگرامز فعال ہیں'
                : isArabic
                ? 'تم تحميل 4 برامج معتمدة لإمارة أبوظبي'
                : 'Showing 4 Verified Schemes for Abu Dhabi Healthcare Ecosystem'
              : isUrdu
              ? 'پاکستان کے 4 مستند پروگرامز فعال ہیں'
              : isArabic
              ? 'تم تحميل 4 برامج معتمدة للنظام الصحي في باكستان'
              : 'Showing 4 Verified Public Healthcare Programs for Pakistan'}
          </span>
        </div>
        <span className="text-[11px] text-slate-500 font-semibold">
          {isUrdu ? 'سرکاری فیس: 0 روپے / مفت کور' : isArabic ? 'الرسوم الحكومية: مجانية للمستحقين' : '100% Verified Public Initiatives'}
        </span>
      </div>

      {/* 4 Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {currentSchemes.map((scheme, idx) => (
          <div
            key={scheme.id}
            className="p-5 sm:p-6 rounded-3xl bg-white dark:bg-slate-800 border border-slate-200/90 dark:border-slate-700 shadow-xs hover:shadow-md transition-all flex flex-col justify-between space-y-4"
          >
            {/* Top Card Info */}
            <div className="space-y-3">
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-center gap-2.5">
                  <div className="w-10 h-10 rounded-2xl bg-teal-50 dark:bg-teal-950/60 text-[#00a86b] flex items-center justify-center font-bold text-sm shrink-0 border border-teal-200 dark:border-teal-800">
                    {idx + 1}
                  </div>
                  <div>
                    <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 block">
                      {scheme.org}
                    </span>
                    <h3 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white leading-snug">
                      {scheme.title}
                    </h3>
                  </div>
                </div>

                <span className="px-2.5 py-1 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 text-[10px] font-bold shrink-0 border border-emerald-300 dark:border-emerald-800">
                  {scheme.badge}
                </span>
              </div>

              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                {scheme.description}
              </p>

              {/* Eligibility & Coverage Pill Box */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1 text-xs">
                <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-750 border border-slate-200/80 dark:border-slate-700 space-y-0.5">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                    {isUrdu ? 'اہلیت' : isArabic ? 'معايير الأهلية' : 'Eligibility'}
                  </span>
                  <span className="font-semibold text-slate-800 dark:text-slate-200 text-[11px]">
                    {scheme.eligibility}
                  </span>
                </div>
                <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-750 border border-slate-200/80 dark:border-slate-700 space-y-0.5">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                    {isUrdu ? 'کوریج کی حد' : isArabic ? 'نطاق التغطية' : 'Coverage Limit'}
                  </span>
                  <span className="font-semibold text-[#00a86b] text-[11px]">
                    {scheme.coverageLimit}
                  </span>
                </div>
              </div>

              {/* Bullet Highlights */}
              <div className="space-y-1.5 pt-1">
                <span className="text-[11px] font-bold text-slate-700 dark:text-slate-300 block">
                  {isUrdu ? 'اہم فوائد اور خدمات:' : isArabic ? 'أبرز المزايا والخدمات:' : 'Key Clinical Benefits:'}
                </span>
                {scheme.highlights.map((hl, hIdx) => (
                  <div key={hIdx} className="flex items-start gap-2 text-xs text-slate-600 dark:text-slate-300">
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#00a86b] shrink-0 mt-0.5" />
                    <span>{hl}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Bottom Action Buttons */}
            <div className="pt-3 border-t border-slate-100 dark:border-slate-700 flex flex-wrap items-center gap-2">
              {scheme.actions.map((act, aIdx) => {
                const Icon = act.icon;
                return (
                  <a
                    key={aIdx}
                    href={act.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold bg-teal-50 hover:bg-teal-100 dark:bg-teal-950/70 dark:hover:bg-teal-900/80 text-teal-800 dark:text-teal-200 border border-teal-200 dark:border-teal-800 transition-colors cursor-pointer"
                  >
                    <Icon className="w-3.5 h-3.5 text-[#00a86b]" />
                    <span>{act.label}</span>
                  </a>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* Advisory Note */}
      <div className="p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900/50 flex items-start gap-3 text-xs text-amber-900 dark:text-amber-200">
        <FileText className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
        <p className="leading-relaxed">
          {isUrdu
            ? 'نوٹ: ڈیپ کورٹیکس اے آئی کی تیار کردہ پی ڈی ایف رپورٹ اور ایم آر آئی گریڈ-کیم فائنڈنگز سرکاری اسپتالوں اور ہیلتھ کارڈ کاؤنٹرز پر معائنے کے لیے بطور ریفرل دستاویز پیش کی جا سکتی ہیں۔'
            : isArabic
            ? 'ملاحظة: يمكنك طباعة تقرير DeepCortex AI المعتمد وتقديمه لعيادات الذاكرة ومراكز التأمين كوثيقة دعم سريرية لتسريع إجراءات التحويل والتصوير المجاني.'
            : 'Clinical Note: DeepCortex AI reports, cognitive composite trends, and Grad-CAM neuroimaging summaries can be printed and presented directly to public hospital neurology OPDs and insurance desks to expedite formal diagnostic workups.'}
        </p>
      </div>
    </div>
  );
};
