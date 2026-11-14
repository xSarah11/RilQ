// Catalog of every official NASA data source ReliQ uses.
// Shown on the /data page and used by /api/nasa/status to run live connection checks.
// Shared by server and client (no secrets here).

import type { Text } from "@/data/types";

export type DataSource = {
  id: "trek-moon" | "trek-mars" | "images" | "apod";
  name: string;
  provider: string;
  description: Text;
  /** Where it appears on the site */
  usedIn: Text;
  docs: string;
  /** Example endpoint (shown to users; never contains a key) */
  endpoint: string;
  needsKey: boolean;
  /** How often the source itself changes */
  updates: Text;
  /** How long ReliQ caches it on the server */
  cache: Text;
};

export const dataSources: DataSource[] = [
  {
    id: "trek-moon",
    name: "Moon Trek WMTS — LRO WAC Global Mosaic",
    provider: "NASA SSERVI / JPL Trek team",
    description: {
      ar: "صور فسيفساء لكامل سطح القمر التقطتها كاميرا LROC الواسعة على المركبة المدارية LRO، تُقدَّم كمربعات خريطة (Tiles).",
      en: "A global mosaic of the Moon from the LROC Wide Angle Camera on the Lunar Reconnaissance Orbiter, served as map tiles.",
    },
    usedIn: { ar: "خريطة القمر (طبقة الصور + طبقة التضاريس)", en: "Moon map (imagery + elevation layers)" },
    docs: "https://trek.nasa.gov/tiles/apidoc/trekAPI.html?body=moon",
    endpoint: "https://trek.nasa.gov/tiles/Moon/EQ/LRO_WAC_Mosaic_Global_303ppd_v02/1.0.0/default/default028mm/{z}/{y}/{x}.jpg",
    needsKey: false,
    updates: { ar: "ثابتة (فسيفساء مؤرشفة)", en: "Static (archived mosaic)" },
    cache: { ar: "يخزنها المتصفح", en: "Cached by the browser" },
  },
  {
    id: "trek-mars",
    name: "Mars Trek WMTS — Viking MDIM 2.1 Color Mosaic",
    provider: "NASA SSERVI / JPL Trek team",
    description: {
      ar: "فسيفساء ملونة لكامل سطح المريخ من مدارات فايكنغ، إضافة إلى طبقة تضاريس ملونة من مقياس الارتفاع MOLA.",
      en: "A global color mosaic of Mars from the Viking orbiters, plus a color elevation layer from the MOLA laser altimeter.",
    },
    usedIn: { ar: "خريطة المريخ (طبقة الصور + طبقة التضاريس)", en: "Mars map (imagery + elevation layers)" },
    docs: "https://trek.nasa.gov/tiles/apidoc/trekAPI.html?body=mars",
    endpoint: "https://trek.nasa.gov/tiles/Mars/EQ/Viking_MDIM21_ClrMosaic_global_232m/1.0.0/default/default028mm/{z}/{y}/{x}.jpg",
    needsKey: false,
    updates: { ar: "ثابتة (فسيفساء مؤرشفة)", en: "Static (archived mosaic)" },
    cache: { ar: "يخزنها المتصفح", en: "Cached by the browser" },
  },
  {
    id: "images",
    name: "NASA Image and Video Library API",
    provider: "NASA (images.nasa.gov)",
    description: {
      ar: "أرشيف ناسا الرسمي للصور والفيديو. نبحث فيه عن صور كل مركبة ونعرض العنوان والتاريخ والمصدر.",
      en: "NASA's official image and video archive. We search it for each rover and show the title, date and credit.",
    },
    usedIn: { ar: "معرض «صور من أرشيف ناسا» في صفحة كل مركبة", en: "“From the NASA archive” gallery on every rover page" },
    docs: "https://images.nasa.gov/docs/images.nasa.gov_api_docs.pdf",
    endpoint: "https://images-api.nasa.gov/search?q={rover}&media_type=image",
    needsKey: false,
    updates: { ar: "تُضاف صور جديدة باستمرار", en: "New media added continuously" },
    cache: { ar: "١٢ ساعة على الخادم", en: "12 hours on the server" },
  },
  {
    id: "apod",
    name: "APOD — Astronomy Picture of the Day",
    provider: "NASA Open APIs (api.nasa.gov)",
    description: {
      ar: "صورة فلكية جديدة كل يوم مع شرح يكتبه فلكيون محترفون.",
      en: "A new astronomy image every day, with an explanation written by professional astronomers.",
    },
    usedIn: { ar: "بطاقة «صورة اليوم من ناسا» في الصفحة الرئيسية", en: "“NASA picture of the day” card on the home page" },
    docs: "https://api.nasa.gov/",
    endpoint: "https://api.nasa.gov/planetary/apod?api_key=***",
    needsKey: true,
    updates: { ar: "يوميًا", en: "Daily" },
    cache: { ar: "ساعة واحدة على الخادم", en: "1 hour on the server" },
  },
];
