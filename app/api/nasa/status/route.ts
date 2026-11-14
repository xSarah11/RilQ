// Live health check for every NASA source used by ReliQ.
// GET /api/nasa/status → [{ id, ok, ms, http, checkedAt, note }]
// The result is memoized for 10 minutes so visitors can't hammer NASA (or burn the API-key quota) through this endpoint.
import { connection } from "next/server";
import { nasaApiKey } from "@/lib/nasa/server";
import type { DataSource } from "@/lib/nasa/sources";

type Check = { id: DataSource["id"]; ok: boolean; ms: number; http: number | null; checkedAt: string; note: string | null };

let memo: { at: number; checks: Check[] } | null = null;
const MEMO_MS = 10 * 60_000;

async function probe(id: Check["id"], url: string, expect: "image" | "json"): Promise<Check> {
  const t0 = Date.now();
  try {
    const res = await fetch(url, { signal: AbortSignal.timeout(8000), cache: "no-store" });
    const type = res.headers.get("content-type") ?? "";
    const ok = res.ok && (expect === "image" ? type.startsWith("image/") : type.includes("json"));
    // Drain the body so the connection is released.
    await res.arrayBuffer().catch(() => null);
    return {
      id,
      ok,
      ms: Date.now() - t0,
      http: res.status,
      checkedAt: new Date().toISOString(),
      note: ok ? null : res.status === 429 ? "RATE_LIMIT" : res.status === 403 ? "BAD_KEY" : `HTTP ${res.status} ${type}`,
    };
  } catch (err) {
    return {
      id,
      ok: false,
      ms: Date.now() - t0,
      http: null,
      checkedAt: new Date().toISOString(),
      note: err instanceof Error && err.name === "TimeoutError" ? "TIMEOUT" : "NETWORK",
    };
  }
}

export async function GET() {
  await connection(); // always run at request time (never frozen at build with cacheComponents)
  if (memo && Date.now() - memo.at < MEMO_MS) {
    return Response.json({ checks: memo.checks, demoKey: nasaApiKey().isDemo }, { headers: { "Cache-Control": "no-store" } });
  }
  const { key, isDemo } = nasaApiKey();
  const checks = await Promise.all([
    probe("trek-moon", "https://trek.nasa.gov/tiles/Moon/EQ/LRO_WAC_Mosaic_Global_303ppd_v02/1.0.0/default/default028mm/0/0/0.jpg", "image"),
    probe("trek-mars", "https://trek.nasa.gov/tiles/Mars/EQ/Viking_MDIM21_ClrMosaic_global_232m/1.0.0/default/default028mm/1/0/0.jpg", "image"),
    probe("images", "https://images-api.nasa.gov/search?q=curiosity%20rover&media_type=image&page_size=1", "json"),
    probe("apod", `https://api.nasa.gov/planetary/apod?api_key=${encodeURIComponent(key)}`, "json"),
  ]);
  memo = { at: Date.now(), checks };
  return Response.json({ checks, demoKey: isDemo }, { headers: { "Cache-Control": "no-store" } });
}
