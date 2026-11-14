"use client";

import { createContext, useCallback, useContext, useEffect, useState } from "react";
import type { Lang, Text } from "@/data/types";

// UI strings (labels, buttons). Rover content lives in data/rovers.ts.
const ui = {
  brandTagline: { ar: "منصة تعليمية لاستكشاف مركبات الفضاء", en: "Learn the stories of rovers in space" },
  heroTitle: { ar: "اكتشف المركبات التي سارت على عوالم أخرى", en: "Discover the rovers that drove on other worlds" },
  heroText: {
    ar: "اختر كوكبًا، تجول على خريطته، افحص المركبات بتقنية ثلاثية الأبعاد، ثم خض مهمة حقيقية بنفسك.",
    en: "Pick a world, explore its map, inspect rovers in 3D, then take on a real mission yourself.",
  },
  choosePlanet: { ar: "اختر وجهتك", en: "Choose your destination" },
  explore: { ar: "استكشف", en: "Explore" },
  rovers: { ar: "مركبات", en: "rovers" },
  howItWorks: { ar: "كيف تعمل الرحلة؟", en: "How the journey works" },
  step1: { ar: "اختر الكوكب", en: "Pick a planet" },
  step2: { ar: "تجول في الخريطة", en: "Explore the map" },
  step3: { ar: "افحص المركبة 3D", en: "Inspect the rover in 3D" },
  step4: { ar: "خض المهمة", en: "Take the mission" },
  back: { ar: "رجوع", en: "Back" },
  home: { ar: "الرئيسية", en: "Home" },
  mapHint: { ar: "اسحب الخريطة وقرّب، ثم اضغط على أي مركبة", en: "Drag and zoom the map, then tap any rover" },
  landed: { ar: "تاريخ الهبوط", en: "Landed" },
  viewRover: { ar: "افتح المركبة", en: "Open rover" },
  roversOn: { ar: "المركبات على", en: "Rovers on" },
  mapFallback: {
    ar: "تعذر تحميل صور الخريطة من ناسا — تُعرض خريطة مبسطة.",
    en: "Couldn't load NASA map imagery — showing a simplified map.",
  },
  story: { ar: "القصة", en: "The Story" },
  achievements: { ar: "أبرز الإنجازات", en: "Key Achievements" },
  keyParts: { ar: "٣ أجزاء رئيسية", en: "3 Key Parts" },
  keyPartsHint: { ar: "اضغط على جزء لتراه يضيء على المجسم", en: "Tap a part to see it glow on the model" },
  funFact: { ar: "معلومة ممتعة", en: "Fun fact" },
  dragToRotate: { ar: "اسحب للتدوير • قرّب بإصبعين", en: "Drag to rotate • pinch to zoom" },
  startMission: { ar: "ابدأ المهمة", en: "Start the mission" },
  partsExplored: { ar: "أجزاء استكشفتها", en: "parts explored" },
  agency: { ar: "الجهة", en: "Agency" },
  site: { ar: "موقع الهبوط", en: "Landing site" },
  question: { ar: "الموقف", en: "Situation" },
  of: { ar: "من", en: "of" },
  next: { ar: "التالي", en: "Next" },
  finish: { ar: "إنهاء المهمة", en: "Finish mission" },
  correct: { ar: "قرار صحيح!", en: "Great call!" },
  wrong: { ar: "ليس تمامًا", en: "Not quite" },
  missionComplete: { ar: "انتهت المهمة", en: "Mission complete" },
  yourScore: { ar: "نتيجتك", en: "Your score" },
  badgeGold: { ar: "قائد مهمات خبير 🏅", en: "Expert Mission Commander 🏅" },
  badgeSilver: { ar: "مستكشف واعد 🥈", en: "Promising Explorer 🥈" },
  badgeTry: { ar: "متدرب فضاء — حاول مرة أخرى 🚀", en: "Space Trainee — try again 🚀" },
  retry: { ar: "أعد المهمة", en: "Retry mission" },
  backToRover: { ar: "العودة للمركبة", en: "Back to rover" },
  moreRovers: { ar: "مركبات أخرى", en: "More rovers" },
  completed: { ar: "مكتملة", en: "Completed" },
  best: { ar: "أفضل نتيجة", en: "Best" },
  chatTitle: { ar: "مساعد ريليك", en: "ReliQ Assistant" },
  chatPlaceholder: { ar: "اكتب سؤالك...", en: "Ask a question..." },
  chatWelcome: {
    ar: "مرحبًا! أنا مساعدك الفضائي. اسألني أي شيء عن هذه المركبة أو عن الفضاء.",
    en: "Hi! I'm your space assistant. Ask me anything about this rover or about space.",
  },
  chatSuggestions: { ar: "أسئلة مقترحة", en: "Try asking" },
  chatError: { ar: "حدث خطأ، حاول مرة أخرى.", en: "Something went wrong, please try again." },
  chatOpen: { ar: "اسأل المساعد", en: "Ask the assistant" },
  talkToRover: { ar: "كلّم المركبة", en: "Talk to the rover" },
  chatRoleNote: { ar: "مساعد ذكي يتقمص دور المركبة", en: "An AI assistant playing the rover" },
  send: { ar: "إرسال", en: "Send" },
  loading3d: { ar: "جاري تحميل المجسم...", en: "Loading 3D model..." },
  footer: { ar: "مشروع تعليمي — البيانات من ناسا ووكالات الفضاء", en: "Educational project — data from NASA and space agencies" },
  notFound: { ar: "الصفحة غير موجودة", en: "Page not found" },

  // Navigation
  navMoon: { ar: "القمر", en: "Moon" },
  navMars: { ar: "المريخ", en: "Mars" },
  navData: { ar: "بيانات ناسا", en: "NASA Data" },
  navLab: { ar: "مختبر البيانات", en: "Data Lab" },

  // Map
  mapLayers: { ar: "طبقات الخريطة", en: "Map layers" },
  grid: { ar: "خطوط الطول والعرض", en: "Lat/Lon grid" },
  resetView: { ar: "عرض الكوكب كاملًا", en: "Whole planet" },
  close: { ar: "إغلاق", en: "Close" },
  liveFromNasa: { ar: "متصل مباشرة بخادم NASA Trek", en: "Live from NASA Trek" },
  sourceOffline: { ar: "خوادم ناسا غير متاحة الآن", en: "NASA servers unavailable" },
  connecting: { ar: "جارٍ الاتصال بناسا…", en: "Connecting to NASA…" },
  dataset: { ar: "مجموعة البيانات", en: "Dataset" },

  // Mission status
  statusActive: { ar: "تعمل الآن", en: "Active" },
  statusEnded: { ar: "انتهت", en: "Ended" },
  statusUnknown: { ar: "الحالة غير مؤكدة", en: "Status unconfirmed" },

  // APOD
  apodTitle: { ar: "صورة اليوم من ناسا", en: "NASA Picture of the Day" },
  apodLoading: { ar: "جارٍ جلب صورة اليوم من ناسا…", en: "Fetching today's picture from NASA…" },
  apodError: { ar: "تعذر الاتصال بخدمة APOD الآن. حاول لاحقًا.", en: "Couldn't reach NASA APOD right now. Try again later." },
  apodVideo: { ar: "صورة اليوم مقطع فيديو — شاهده على موقع ناسا", en: "Today's APOD is a video — watch it on NASA's site" },
  apodNote: { ar: "الشرح الأصلي بالإنجليزية من ناسا", en: "Original explanation by NASA" },
  readMore: { ar: "اقرأ المزيد", en: "Read more" },
  showLess: { ar: "عرض أقل", en: "Show less" },
  viewOnNasa: { ar: "عرض على موقع ناسا", en: "View on NASA" },
  retryShort: { ar: "إعادة المحاولة", en: "Retry" },
  updated: { ar: "آخر تحديث", en: "Updated" },
  cachedCopy: { ar: "نسخة محفوظة (ناسا لا تستجيب الآن)", en: "Saved copy (NASA not responding)" },
  demoKeyNote: {
    ar: "يعمل بمفتاح DEMO_KEY العام (حد منخفض). أضف NASA_API_KEY على الخادم.",
    en: "Running on the public DEMO_KEY (low limit). Add NASA_API_KEY on the server.",
  },
  source: { ar: "المصدر", en: "Source" },

  // Data Lab
  labTitle: { ar: "مختبر البيانات", en: "Data Lab" },
  labText: {
    ar: "قارن المركبات بالأرقام. اضغط على أي عمود لتفتح المركبة.",
    en: "Compare the rovers by the numbers. Tap any bar to open that rover.",
  },
  metricMass: { ar: "الكتلة (كغ)", en: "Mass (kg)" },
  metricDistance: { ar: "المسافة المقطوعة (كم)", en: "Distance driven (km)" },
  metricDays: { ar: "مدة العمل على السطح (يوم)", en: "Days on the surface" },
  metricTimeline: { ar: "الخط الزمني", en: "Timeline" },
  logScale: { ar: "مقياس لوغاريتمي", en: "Log scale" },
  distanceNote: {
    ar: "تُعرض المسافة للمهمات المنتهية فقط؛ مسافة المركبات العاملة تتغير يوميًا (راجع خرائط ناسا المباشرة).",
    en: "Distance is shown for finished missions only — active rovers' totals change daily (see NASA's live maps).",
  },
  daysNote: {
    ar: "للمركبات العاملة تُحسب الأيام حتى اليوم. مدة أبولو تشمل المهمات ١٥ إلى ١٧.",
    en: "Active rovers are counted up to today. The Apollo LRV span covers Apollo 15–17.",
  },
  today: { ar: "اليوم", en: "Today" },
  days: { ar: "يوم", en: "days" },
  chartSources: { ar: "مصادر الأرقام موجودة في صفحة كل مركبة", en: "Each rover page lists the official sources for these numbers" },

  // Rover page — NASA gallery & sources
  galleryTitle: { ar: "صور من أرشيف ناسا", en: "From the NASA archive" },
  galleryLoading: { ar: "جارٍ البحث في مكتبة صور ناسا…", en: "Searching the NASA Image Library…" },
  galleryEmpty: { ar: "لم نجد صورًا لهذه المركبة في مكتبة ناسا.", en: "No images of this rover found in the NASA library." },
  galleryError: { ar: "تعذر الاتصال بمكتبة صور ناسا الآن.", en: "Couldn't reach the NASA Image Library right now." },
  galleryHint: { ar: "صور رسمية تُجلب مباشرة من images.nasa.gov", en: "Official images fetched live from images.nasa.gov" },
  sourcesTitle: { ar: "المصادر الرسمية", en: "Official sources" },

  // Data page
  dataTitle: { ar: "بيانات ناسا في ريليك", en: "NASA Data in ReliQ" },
  dataText: {
    ar: "كل مصدر بيانات يستخدمه الموقع، من أين يأتي، وأين يظهر — مع فحص اتصال مباشر.",
    en: "Every data source the site uses, where it comes from and where it appears — with a live connection check.",
  },
  checkNow: { ar: "افحص الاتصال الآن", en: "Check connection now" },
  checking: { ar: "جارٍ الفحص…", en: "Checking…" },
  connected: { ar: "متصل", en: "Connected" },
  notConnected: { ar: "غير متصل", en: "Not connected" },
  notChecked: { ar: "لم يُفحص", en: "Not checked" },
  needsKey: { ar: "يحتاج مفتاح API", en: "Needs API key" },
  noKey: { ar: "بدون مفتاح", en: "No key needed" },
  usedIn: { ar: "أين يظهر", en: "Used in" },
  updatesEvery: { ar: "تحديث المصدر", en: "Source updates" },
  cachedFor: { ar: "التخزين المؤقت", en: "Cached" },
  docs: { ar: "التوثيق", en: "Docs" },
  flowTitle: { ar: "كيف تنتقل البيانات من ناسا إليك؟", en: "How data travels from NASA to you" },
  flow1: { ar: "خوادم ناسا", en: "NASA servers" },
  flow2: { ar: "خادم ريليك (يحفظ المفتاح ويخزن مؤقتًا)", en: "ReliQ server (holds the key, caches)" },
  flow3: { ar: "متصفحك", en: "Your browser" },
  flowTiles: { ar: "مربعات الخريطة تُحمَّل مباشرة من NASA Trek إلى المتصفح (لا تحتاج مفتاحًا).", en: "Map tiles load straight from NASA Trek into the browser (no key needed)." },
  archivedNote: {
    ar: "ملاحظة: واجهة Mars Rover Photos القديمة أُرشفت رسميًا في api.nasa.gov، لذلك لم نعتمد عليها.",
    en: "Note: the old Mars Rover Photos API has been officially archived on api.nasa.gov, so ReliQ does not depend on it.",
  },
  ms: { ar: "مللي ثانية", en: "ms" },
} satisfies Record<string, Text>;

export type UIKey = keyof typeof ui;

type Ctx = {
  lang: Lang;
  setLang: (l: Lang) => void;
  toggle: () => void;
  t: (key: UIKey) => string;
  tx: (text: Text) => string;
};

const LangContext = createContext<Ctx | null>(null);
const STORAGE_KEY = "reliq-lang";

export function LangProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLangState] = useState<Lang>("ar");

  // Load saved language once on the client.
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      // eslint-disable-next-line react-hooks/set-state-in-effect -- reading browser storage after mount
      if (saved === "ar" || saved === "en") setLangState(saved);
    } catch {
      /* storage unavailable — keep default */
    }
  }, []);

  // Keep <html lang/dir> in sync so the whole page flips RTL/LTR.
  useEffect(() => {
    document.documentElement.lang = lang;
    document.documentElement.dir = lang === "ar" ? "rtl" : "ltr";
  }, [lang]);

  const setLang = useCallback((l: Lang) => {
    setLangState(l);
    try {
      localStorage.setItem(STORAGE_KEY, l);
    } catch {
      /* ignore */
    }
  }, []);

  const value: Ctx = {
    lang,
    setLang,
    toggle: () => setLang(lang === "ar" ? "en" : "ar"),
    t: (key) => ui[key][lang],
    tx: (text) => text[lang],
  };

  return <LangContext.Provider value={value}>{children}</LangContext.Provider>;
}

export function useLang() {
  const ctx = useContext(LangContext);
  if (!ctx) throw new Error("useLang must be used inside <LangProvider>");
  return ctx;
}

export function formatDate(iso: string, lang: Lang) {
  return new Date(iso + "T00:00:00Z").toLocaleDateString(lang === "ar" ? "ar-SA-u-ca-gregory" : "en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
    timeZone: "UTC",
  });
}
