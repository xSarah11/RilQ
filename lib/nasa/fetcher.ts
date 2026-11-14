// Server-only helpers for calling NASA services: timeout, small in-memory cache, clear errors.
// Every NASA call in ReliQ goes through here, so failures are handled the same way everywhere.

type CacheEntry = { value: unknown; expires: number; fetchedAt: string };
const cache = new Map<string, CacheEntry>();

export class NasaError extends Error {
  constructor(
    message: string,
    public status?: number,
  ) {
    super(message);
  }
}

export type Fetched<T> = { data: T; fetchedAt: string; cached: boolean };

/**
 * GET a JSON document with a timeout and a TTL cache.
 * Throws NasaError on network errors, timeouts, non-2xx answers or invalid JSON.
 */
export async function fetchJson<T>(url: string, { ttlMs = 60 * 60 * 1000, timeoutMs = 10_000 } = {}): Promise<Fetched<T>> {
  const now = Date.now();
  const hit = cache.get(url);
  if (hit && hit.expires > now) {
    return { data: hit.value as T, fetchedAt: hit.fetchedAt, cached: true };
  }

  let res: Response;
  try {
    res = await fetch(url, {
      headers: { Accept: "application/json", "User-Agent": "ReliQ-education-app" },
      signal: AbortSignal.timeout(timeoutMs),
      cache: "no-store",
    });
  } catch (err) {
    throw new NasaError(`Network error: ${(err as Error).name}`);
  }
  if (!res.ok) throw new NasaError(`Upstream answered ${res.status}`, res.status);

  let value: unknown;
  try {
    value = await res.json();
  } catch {
    throw new NasaError("Upstream returned invalid JSON");
  }

  const fetchedAt = new Date(now).toISOString();
  cache.set(url, { value, expires: now + ttlMs, fetchedAt });
  if (cache.size > 200) cache.delete(cache.keys().next().value!);
  return { data: value as T, fetchedAt, cached: false };
}

/** Quick reachability probe (used by the status page). */
export async function probe(url: string, timeoutMs = 8000): Promise<{ ok: boolean; status?: number; ms: number }> {
  const start = Date.now();
  try {
    const res = await fetch(url, { signal: AbortSignal.timeout(timeoutMs), cache: "no-store" });
    // Read a little of the body so image tiles really arrive.
    await res.arrayBuffer();
    return { ok: res.ok, status: res.status, ms: Date.now() - start };
  } catch {
    return { ok: false, ms: Date.now() - start };
  }
}
