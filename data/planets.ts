import type { Planet, PlanetId } from "./types";

// Map tiles come from NASA Solar System Treks (public WMTS, equirectangular projection, no API key).
// URL pattern: {z}/{y}/{x}; zoom 0 = 2 columns x 1 row, which matches Leaflet's EPSG:4326 CRS.
// Docs: https://trek.nasa.gov/tiles/apidoc/trekAPI.html
const TREK = process.env.NEXT_PUBLIC_NASA_TREK_BASE || "https://trek.nasa.gov/tiles";
const TREK_CREDIT = 'NASA <a href="https://trek.nasa.gov" target="_blank" rel="noreferrer">Solar System Treks</a>';

export const planets: Planet[] = [
  {
    id: "moon",
    name: { ar: "القمر", en: "The Moon" },
    tagline: { ar: "أقرب جار لنا في الفضاء", en: "Our closest neighbor in space" },
    description: {
      ar: "على بعد ٣٨٤ ألف كم فقط، كان القمر أول عالم تسير عليه مركبات من صنع الإنسان، من مركبات تُقاد من الأرض إلى سيارة قادها رواد فضاء.",
      en: "Just 384,000 km away, the Moon was the first world where human-made vehicles drove — from remote-controlled robots to a car driven by astronauts.",
    },
    colors: ["#f1f1f1", "#a3a3a8", "#55555c"],
    radiusKm: 1737.4,
    layers: [
      {
        id: "moon-wac",
        name: { ar: "صور LRO الحقيقية", en: "LRO photo mosaic" },
        url: `${TREK}/Moon/EQ/LRO_WAC_Mosaic_Global_303ppd_v02/1.0.0/default/default028mm/{z}/{y}/{x}.jpg`,
        maxNativeZoom: 7,
        sourceId: "trek-moon-wac",
        attribution: `${TREK_CREDIT} · LRO WAC mosaic (NASA/GSFC/ASU)`,
      },
    ],
  },
  {
    id: "mars",
    name: { ar: "المريخ", en: "Mars" },
    tagline: { ar: "الكوكب الأحمر", en: "The Red Planet" },
    description: {
      ar: "المريخ هو الكوكب الأكثر استكشافًا بعد الأرض. مركباته تبحث عن آثار الماء وعن أي دليل على أن الحياة كانت ممكنة هناك.",
      en: "Mars is the most explored planet after Earth. Its rovers hunt for traces of water and for any sign that life was once possible there.",
    },
    colors: ["#ffb38a", "#d0573a", "#5e1d12"],
    radiusKm: 3389.5,
    layers: [
      {
        id: "mars-viking",
        name: { ar: "صور Viking الملونة", en: "Viking colour mosaic" },
        url: `${TREK}/Mars/EQ/Viking_MDIM21_ClrMosaic_global_232m/1.0.0/default/default028mm/{z}/{y}/{x}.jpg`,
        maxNativeZoom: 7,
        sourceId: "trek-mars-viking",
        attribution: `${TREK_CREDIT} · Viking MDIM 2.1 (NASA/USGS)`,
      },
      {
        id: "mars-mola",
        name: { ar: "تضاريس MOLA (الارتفاعات)", en: "MOLA elevation relief" },
        url: `${TREK}/Mars/EQ/Mars_MGS_MOLA_ClrShade_merge_global_463m/1.0.0/default/default028mm/{z}/{y}/{x}.jpg`,
        maxNativeZoom: 6,
        sourceId: "trek-mars-mola",
        attribution: `${TREK_CREDIT} · MGS MOLA colour shaded relief (NASA/GSFC)`,
      },
    ],
  },
];

export function getPlanet(id: string): Planet | undefined {
  return planets.find((p) => p.id === id);
}

export const planetIds: PlanetId[] = planets.map((p) => p.id);
