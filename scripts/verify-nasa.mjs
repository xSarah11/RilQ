// Checks that every NASA source used by ReliQ answers correctly from YOUR network.
// Run:  npm run verify:nasa      (uses NASA_API_KEY from .env.local if present, else DEMO_KEY)
// No dependencies — plain Node 18+.
import { readFileSync } from "node:fs";

let key = process.env.NASA_API_KEY;
if (!key) {
  try {
    const env = readFileSync(new URL("../.env.local", import.meta.url), "utf8");
    key = env.match(/^\s*NASA_API_KEY\s*=\s*(.+)\s*$/m)?.[1]?.trim();
  } catch {
    /* no .env.local */
  }
}
const usingDemo = !key;
key ||= "DEMO_KEY";

const trek = (body, layer, z, y, x) =>
  `https://trek.nasa.gov/tiles/${body}/EQ/${layer}/1.0.0/default/default028mm/${z}/${y}/${x}.jpg`;

const checks = [
  ["Moon Trek — LRO WAC mosaic (default Moon layer)", trek("Moon", "LRO_WAC_Mosaic_Global_303ppd_v02", 0, 0, 0), "image"],
  ["Moon Trek — LOLA color shaded relief (Elevation layer)", trek("Moon", "LRO_LOLA_ClrShade_Global_128ppd_v04", 0, 0, 0), "image"],
  ["Mars Trek — Viking MDIM 2.1 color mosaic (default Mars layer)", trek("Mars", "Viking_MDIM21_ClrMosaic_global_232m", 1, 0, 0), "image"],
  ["Mars Trek — MOLA color shaded relief (Elevation layer)", trek("Mars", "Mars_MGS_MOLA_ClrShade_merge_global_463m", 1, 0, 0), "image"],
  ["NASA Image and Video Library API", "https://images-api.nasa.gov/search?q=curiosity%20rover&media_type=image&page_size=1", "json"],
  ["APOD (api.nasa.gov)" + (usingDemo ? " — DEMO_KEY" : " — your key"), `https://api.nasa.gov/planetary/apod?api_key=${encodeURIComponent(key)}`, "json"],
];

let failed = 0;
console.log("\nReliQ — NASA connection check\n");
for (const [name, url, expect] of checks) {
  const t0 = Date.now();
  try {
    const res = await fetch(url, { signal: AbortSignal.timeout(12000) });
    const type = res.headers.get("content-type") ?? "";
    const ok = res.ok && (expect === "image" ? type.startsWith("image/") : type.includes("json"));
    let extra = "";
    if (ok && expect === "json") {
      const j = await res.json();
      extra = j.title ? ` — "${j.title}" (${j.date})` : j.collection ? ` — ${j.collection.metadata?.total_hits} hits` : "";
    } else await res.arrayBuffer();
    const left = res.headers.get("x-ratelimit-remaining");
    console.log(`${ok ? "✅" : "❌"} ${name}\n   HTTP ${res.status} · ${type || "?"} · ${Date.now() - t0} ms${left ? ` · quota left ${left}` : ""}${extra}`);
    if (!ok) failed++;
  } catch (err) {
    failed++;
    console.log(`❌ ${name}\n   ${err.name}: ${err.message}`);
  }
}
console.log(
  failed
    ? `\n${failed} check(s) failed. The site still works: failed map layers are hidden automatically and data cards show a retry message.\n`
    : "\nAll NASA sources are reachable. ✅\n",
);
process.exitCode = failed ? 1 : 0;
