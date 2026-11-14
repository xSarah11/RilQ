// NASA Image and Video Library proxy (images-api.nasa.gov — public, no key required).
// GET /api/nasa/images?rover=<roverId>  → up to 9 official NASA images about that rover.
// Only rover ids from data/rovers.ts are accepted, so the endpoint can't be abused as an open proxy.
import { connection } from "next/server";
import { getRover } from "@/data/rovers";
import { cachedJson, errorCode, isNasaUrl, jsonResponse } from "@/lib/nasa/server";

type SearchResponse = {
  collection?: {
    metadata?: { total_hits?: number };
    items?: {
      data?: {
        nasa_id?: string;
        title?: string;
        date_created?: string;
        center?: string;
        description?: string;
        secondary_creator?: string;
        photographer?: string;
      }[];
      links?: { href?: string; rel?: string; render?: string }[];
    }[];
  };
};

const TTL = 12 * 60 * 60 * 1000; // 12 hours
const MAX = 9;

export async function GET(request: Request) {
  await connection(); // always run at request time (never frozen at build with cacheComponents)
  const roverId = new URL(request.url).searchParams.get("rover") ?? "";
  const rover = getRover(roverId);
  if (!rover) return jsonResponse({ error: "BAD_REQUEST" }, { status: 400 });

  const query = rover.nasaImageQuery;
  const url = `https://images-api.nasa.gov/search?media_type=image&page_size=40&q=${encodeURIComponent(query)}`;

  try {
    const { data, fetchedAt, stale } = await cachedJson<SearchResponse>(url, { ttlMs: TTL });
    const items = (data.collection?.items ?? [])
      .map((it) => {
        const meta = it.data?.[0];
        const thumb = it.links?.find((l) => l.rel === "preview" || l.render === "image")?.href;
        if (!meta?.nasa_id || !meta.title || !isNasaUrl(thumb)) return null;
        return {
          id: meta.nasa_id,
          title: meta.title.slice(0, 160),
          date: meta.date_created?.slice(0, 10) ?? null,
          center: meta.center ?? null,
          credit: meta.secondary_creator || meta.photographer || null,
          description: (meta.description ?? "").replace(/<[^>]+>/g, "").slice(0, 300),
          thumb,
          page: `https://images.nasa.gov/details/${encodeURIComponent(meta.nasa_id)}`,
        };
      })
      .filter((x): x is NonNullable<typeof x> => x !== null)
      .slice(0, MAX);

    return jsonResponse(
      {
        query,
        total: data.collection?.metadata?.total_hits ?? items.length,
        items,
        source: {
          name: "NASA Image and Video Library",
          url: `https://images.nasa.gov/search?q=${encodeURIComponent(query)}&media=image`,
        },
        fetchedAt: new Date(fetchedAt).toISOString(),
        stale,
      },
      { sMaxAge: 43200 },
    );
  } catch (err) {
    console.error("NASA images request failed", err);
    return jsonResponse({ error: errorCode(err) }, { status: 502 });
  }
}
