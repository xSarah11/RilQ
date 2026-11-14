// NASA Image and Video Library — search official photos for a rover.
// Docs: https://images.nasa.gov/docs/images.nasa.gov_api_docs.pdf (no API key, Collection+JSON format)
import { fetchJson, type Fetched } from "./fetcher";
import { IMAGES_API_BASE } from "./sources";

export type NasaImage = {
  nasaId: string;
  title: string;
  date: string | null;
  center: string | null;
  description: string;
  thumb: string;
  page: string;
};

type CollectionJson = {
  collection?: {
    items?: {
      data?: { nasa_id?: string; title?: string; date_created?: string; center?: string; description?: string; media_type?: string }[];
      links?: { href?: string; rel?: string; render?: string }[];
    }[];
    metadata?: { total_hits?: number };
  };
};

const httpsOnly = (u: string) => u.replace(/^http:\/\//, "https://");

export async function searchImages(query: string, limit = 9): Promise<Fetched<{ total: number; items: NasaImage[] }>> {
  const url = `${IMAGES_API_BASE}/search?q=${encodeURIComponent(query)}&media_type=image&page_size=${Math.max(limit * 2, 12)}`;
  const res = await fetchJson<CollectionJson>(url, { ttlMs: 60 * 60 * 1000 });

  const items: NasaImage[] = [];
  for (const item of res.data.collection?.items ?? []) {
    const d = item.data?.[0];
    const preview = item.links?.find((l) => l.render === "image" || l.rel === "preview")?.href;
    if (!d?.nasa_id || !preview || (d.media_type && d.media_type !== "image")) continue;
    items.push({
      nasaId: d.nasa_id,
      title: (d.title ?? d.nasa_id).slice(0, 140),
      date: d.date_created ? d.date_created.slice(0, 10) : null,
      center: d.center ?? null,
      description: (d.description ?? "").replace(/<[^>]+>/g, "").slice(0, 400),
      thumb: httpsOnly(preview),
      page: `https://images.nasa.gov/details/${encodeURIComponent(d.nasa_id)}`,
    });
    if (items.length >= limit) break;
  }

  return {
    data: { total: res.data.collection?.metadata?.total_hits ?? items.length, items },
    fetchedAt: res.fetchedAt,
    cached: res.cached,
  };
}
