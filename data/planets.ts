import type { Planet, PlanetId } from "./types";

// Map tiles come from NASA Trek (public WMTS service run by NASA SSERVI / JPL, no API key needed).
// Equirectangular projection — Leaflet's EPSG:4326 CRS matches the Trek tile grid
// (zoom 0 = 2×1 tiles, each zoom level doubles the columns and rows).
// URL pattern: {BaseURL}/EQ/{Layer}/1.0.0/default/default028mm/{z}/{y}/{x}.jpg
// Docs: https://trek.nasa.gov/tiles/apidoc/trekAPI.html?body=moon  (…?body=mars)
const TREK = "https://trek.nasa.gov/tiles";
const tile = (body: "Moon" | "Mars", layer: string) =>
  `${TREK}/${body}/EQ/${layer}/1.0.0/default/default028mm/{z}/{y}/{x}.jpg`;

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
    layers: [
      {
        id: "wac",
        name: { ar: "صور فضائية", en: "Imagery" },
        instrument: { ar: "كاميرا LROC WAC — المركبة المدارية LRO", en: "LROC WAC camera — Lunar Reconnaissance Orbiter" },
        url: tile("Moon", "LRO_WAC_Mosaic_Global_303ppd_v02"),
        maxNativeZoom: 7,
        source: { label: "NASA Moon Trek — LRO WAC Global Mosaic", url: "https://trek.nasa.gov/moon/" },
      },
      {
        id: "lola",
        name: { ar: "التضاريس الملونة", en: "Elevation" },
        instrument: { ar: "مقياس الارتفاع بالليزر LOLA — المركبة LRO", en: "LOLA laser altimeter — Lunar Reconnaissance Orbiter" },
        url: tile("Moon", "LRO_LOLA_ClrShade_Global_128ppd_v04"),
        maxNativeZoom: 6,
        source: {
          label: "USGS/NASA — Moon LRO LOLA Color Shaded Relief",
          url: "https://astrogeology.usgs.gov/search/map/moon_lro_lola_color_shaded_relief_388m",
        },
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
    layers: [
      {
        id: "viking",
        name: { ar: "صور فضائية ملونة", en: "Color imagery" },
        instrument: { ar: "مدارات فايكنغ — فسيفساء MDIM 2.1", en: "Viking orbiters — MDIM 2.1 color mosaic" },
        url: tile("Mars", "Viking_MDIM21_ClrMosaic_global_232m"),
        maxNativeZoom: 7,
        source: { label: "NASA Mars Trek — Viking Color Mosaic", url: "https://trek.nasa.gov/mars/" },
      },
      {
        id: "mola",
        name: { ar: "التضاريس الملونة", en: "Elevation" },
        instrument: { ar: "مقياس الارتفاع MOLA — مارس غلوبال سرفيور", en: "MOLA altimeter — Mars Global Surveyor" },
        url: tile("Mars", "Mars_MGS_MOLA_ClrShade_merge_global_463m"),
        maxNativeZoom: 6,
        source: {
          label: "USGS/NASA — Mars MGS MOLA Shaded Relief",
          url: "https://astrogeology.usgs.gov/search/map/mars_mgs_mola_global_shaded_relief_463m",
        },
      },
    ],
  },
];

export function getPlanet(id: string): Planet | undefined {
  return planets.find((p) => p.id === id);
}

export const planetIds: PlanetId[] = planets.map((p) => p.id);
