// Server-side helpers for calling NASA APIs.
// ⚠️ Import this file ONLY from route handlers (app/api/**). It reads NASA_API_KEY from the environment.

type Entry = { at: number; data: unknown };
const cache = new Map<string, Entry>();

/** Returns the NASA key from the server environment, or the public DEMO_KEY (heavily rate-limited). */
export function nasaApiKey() {
  const key = process.env.NASA_API_KEY?.trim();
  return { key: key || "DEMO_KEY", isDemo: !key };
}

export class UpstreamError extends Error {
  constructor(
    public status: number,
    message: string,
  ) {
    super(message);
  }
}

/**
 * Fetch JSON with a timeout and a small in-memory cache.
 * - Fresh cache (younger than ttlMs) → returned without calling NASA.
 * - If NASA fails and we have an older copy → that copy is returned with `stale: true`.
 * The cache key must NOT contain secrets (pass the URL without the key as `cacheKey`).
 */
export async function cachedJson<T>(
  url: string,
  { ttlMs, cacheKey = url, timeoutMs = 10_000 }: { ttlMs: number; cacheKey?: string; timeoutMs?: number },
): Promise<{ data: T; fetchedAt: number; stale: boolean; cached: boolean }> {
  const now = Date.now();
  const hit = cache.get(cacheKey);
  if (hit && now - hit.at < ttlMs) return { data: hit.data as T, fetchedAt: hit.at, stale: false, cached: true };

  try {
    const res = await fetch(url, {
      headers: { Accept: "application/json", "User-Agent": "ReliQ-education/1.0" },
      signal: AbortSignal.timeout(timeoutMs),
      cache: "no-store", // we cache ourselves (predictable, works the same in dev and prod)
    });
    if (!res.ok) throw new UpstreamError(res.status, `NASA responded ${res.status}`);
    const data = (await res.json()) as T;
    cache.set(cacheKey, { at: now, data });
    if (cache.size > 300) cache.delete(cache.keys().next().value!); // keep memory bounded
    return { data, fetchedAt: now, stale: false, cached: false };
  } catch (err) {
    if (hit) return { data: hit.data as T, fetchedAt: hit.at, stale: true, cached: true };
    throw err;
  }
}

/** Standard JSON response with CDN caching headers (no secrets ever included). */
export function jsonResponse(body: unknown, { status = 200, sMaxAge = 0 }: { status?: number; sMaxAge?: number } = {}) {
  return Response.json(body, {
    status,
    headers:
      status === 200 && sMaxAge > 0
        ? { "Cache-Control": `public, s-maxage=${sMaxAge}, stale-while-revalidate=${sMaxAge * 2}` }
        : { "Cache-Control": "no-store" },
  });
}

export function errorCode(err: unknown): "TIMEOUT" | "RATE_LIMIT" | "BAD_KEY" | "UPSTREAM" {
  if (err instanceof UpstreamError) {
    if (err.status === 429) return "RATE_LIMIT";
    if (err.status === 403 || err.status === 401) return "BAD_KEY";
    return "UPSTREAM";
  }
  if (err instanceof Error && (err.name === "TimeoutError" || err.name === "AbortError")) return "TIMEOUT";
  return "UPSTREAM";
}

/** Only allow image URLs from NASA domains to be passed to the browser. */
export function isNasaUrl(u: unknown): u is string {
  if (typeof u !== "string") return false;
  try {
    const { protocol, hostname } = new URL(u);
    return protocol === "https:" && (hostname === "nasa.gov" || hostname.endsWith(".nasa.gov"));
  } catch {
    return false;
  }
}
