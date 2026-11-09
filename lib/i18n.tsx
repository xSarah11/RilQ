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
