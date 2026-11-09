import type { Planet, PlanetId } from "./types";

// Map tiles come from NASA Trek (public WMTS service, equirectangular projection).
// URL pattern: {z}/{y}/{x} — Leaflet uses the EPSG:4326 CRS to match it.
const TREK = "https://trek.nasa.gov/tiles";

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
    tiles: [`${TREK}/Moon/EQ/LRO_WAC_Mosaic_Global_303ppd_v02/1.0.0/default/default028mm/{z}/{y}/{x}.jpg`],
    maxNativeZoom: 7,
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
    tiles: [
      `${TREK}/Mars/EQ/Mars_Viking_MDIM21_ClrMosaic_global_232m/1.0.0/default/default028mm/{z}/{y}/{x}.jpg`,
      `${TREK}/Mars/EQ/Viking_MDIM21_ClrMosaic_global_232m/1.0.0/default/default028mm/{z}/{y}/{x}.jpg`,
    ],
    maxNativeZoom: 7,
  },
];

export function getPlanet(id: string): Planet | undefined {
  return planets.find((p) => p.id === id);
}

export const planetIds: PlanetId[] = planets.map((p) => p.id);
