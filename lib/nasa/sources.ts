// Catalog of every NASA data source ReliQ uses: where it comes from, what it powers, and how to reach it.
// Base URLs can be overridden with environment variables (used for automated tests); defaults are NASA's.

export const TREK_BASE = process.env.NASA_TREK_BASE || "https://trek.nasa.gov/tiles";
export const IMAGES_API_BASE = process.env.NASA_IMAGES_API_BASE || "https://images-api.nasa.gov";
export const MMGIS_BASE = process.env.NASA_MMGIS_BASE || "https://mars.nasa.gov/mmgis-maps";

export type SourceId = "trek-moon-wac" | "trek-mars-viking" | "trek-mars-mola" | "nasa-images" | "m20-traverse" | "m20-waypoints";

export type DataSource = {
  id: SourceId;
  name: string;
  provider: string;
  kind: "map tiles" | "REST API" | "GeoJSON";
  usedFor: { ar: string; en: string };
  docs: string;
  /** URL the status check calls to prove the source is reachable */
  probeUrl: string;
  apiKey: false;
  updates: { ar: string; en: string };
};

export const SOURCES: DataSource[] = [
  {
    id: "trek-moon-wac",
    name: "LRO WAC Global Mosaic 303ppd v02 (Moon Trek WMTS)",
    provider: "NASA SSERVI / JPL Solar System Treks",
    kind: "map tiles",
    usedFor: { ar: "خريطة القمر", en: "Moon map" },
    docs: "https://trek.nasa.gov/tiles/apidoc/trekAPI.html?body=moon",
    probeUrl: `${TREK_BASE}/Moon/EQ/LRO_WAC_Mosaic_Global_303ppd_v02/1.0.0/default/default028mm/0/0/0.jpg`,
    apiKey: false,
    updates: { ar: "خريطة ثابتة (فسيفساء عالمية)", en: "Static global mosaic" },
  },
  {
    id: "trek-mars-viking",
    name: "Viking MDIM 2.1 Color Mosaic 232m (Mars Trek WMTS)",
    provider: "NASA SSERVI / JPL Solar System Treks",
    kind: "map tiles",
    usedFor: { ar: "خريطة المريخ الملونة", en: "Mars colour map" },
    docs: "https://trek.nasa.gov/tiles/apidoc/trekAPI.html?body=mars",
    probeUrl: `${TREK_BASE}/Mars/EQ/Viking_MDIM21_ClrMosaic_global_232m/1.0.0/default/default028mm/0/0/0.jpg`,
    apiKey: false,
    updates: { ar: "خريطة ثابتة (فسيفساء عالمية)", en: "Static global mosaic" },
  },
  {
    id: "trek-mars-mola",
    name: "MGS MOLA Colour Shaded Relief 463m (Mars Trek WMTS)",
    provider: "NASA SSERVI / JPL Solar System Treks",
    kind: "map tiles",
    usedFor: { ar: "طبقة تضاريس المريخ (الارتفاعات)", en: "Mars elevation layer" },
    docs: "https://trek.nasa.gov/tiles/apidoc/trekAPI.html?body=mars",
    probeUrl: `${TREK_BASE}/Mars/EQ/Mars_MGS_MOLA_ClrShade_merge_global_463m/1.0.0/default/default028mm/0/0/0.jpg`,
    apiKey: false,
    updates: { ar: "خريطة ثابتة", en: "Static global map" },
  },
  {
    id: "nasa-images",
    name: "NASA Image and Video Library API",
    provider: "NASA",
    kind: "REST API",
    usedFor: { ar: "صور ناسا الرسمية لكل مركبة", en: "Official NASA photos of each rover" },
    docs: "https://images.nasa.gov/docs/images.nasa.gov_api_docs.pdf",
    probeUrl: `${IMAGES_API_BASE}/search?q=rover&media_type=image&page_size=1`,
    apiKey: false,
    updates: { ar: "تتحدث كلما نشرت ناسا صورًا جديدة (نخزنها ساعة)", en: "Updated as NASA publishes (cached 1 hour)" },
  },
  {
    id: "m20-traverse",
    name: "Mars 2020 Perseverance traverse (MMGIS GeoJSON)",
    provider: "NASA / JPL Mars 2020 mission",
    kind: "GeoJSON",
    usedFor: { ar: "مسار Perseverance الحقيقي على الخريطة", en: "Perseverance's real drive path on the map" },
    docs: "https://science.nasa.gov/mission/mars-2020-perseverance/location-map/",
    probeUrl: `${MMGIS_BASE}/M20/Layers/json/M20_traverse.json`,
    apiKey: false,
    updates: { ar: "تتحدث بعد كل رحلة للمركبة (نخزنها ٦ ساعات)", en: "Updated after rover drives (cached 6 hours)" },
  },
  {
    id: "m20-waypoints",
    name: "Mars 2020 Perseverance waypoints (MMGIS GeoJSON)",
    provider: "NASA / JPL Mars 2020 mission",
    kind: "GeoJSON",
    usedFor: { ar: "آخر موقع للمركبة ورقم اليوم المريخي", en: "Rover's latest position and sol" },
    docs: "https://science.nasa.gov/mission/mars-2020-perseverance/location-map/",
    probeUrl: `${MMGIS_BASE}/M20/Layers/json/M20_waypoints.json`,
    apiKey: false,
    updates: { ar: "تتحدث بعد كل رحلة للمركبة (نخزنها ٦ ساعات)", en: "Updated after rover drives (cached 6 hours)" },
  },
];

export function getSource(id: SourceId) {
  return SOURCES.find((s) => s.id === id)!;
}
