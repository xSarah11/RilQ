// NASA APOD (Astronomy Picture of the Day) proxy.
// The browser calls /api/nasa/apod → this server calls api.nasa.gov with the secret key → returns clean JSON.
import { connection } from "next/server";
import { cachedJson, errorCode, isNasaUrl, jsonResponse, nasaApiKey } from "@/lib/nasa/server";

type Apod = {
  date?: string;
  title?: string;
  explanation?: string;
  media_type?: string;
  url?: string;
  hdurl?: string;
  copyright?: string;
};

const TTL = 60 * 60 * 1000; // 1 hour

export async function GET() {
  await connection(); // always run at request time (never frozen at build with cacheComponents)
  const { key, isDemo } = nasaApiKey();
  const url = `https://api.nasa.gov/planetary/apod?api_key=${encodeURIComponent(key)}`;

  try {
    const { data, fetchedAt, stale } = await cachedJson<Apod>(url, { ttlMs: TTL, cacheKey: "apod:today" });
    if (!data?.title || !data.date) return jsonResponse({ error: "EMPTY" }, { status: 502 });

    const isImage = data.media_type === "image" && isNasaUrl(data.url);
    const [y, m, d] = data.date.split("-");
    return jsonResponse(
      {
        title: data.title,
        date: data.date,
        explanation: (data.explanation ?? "").slice(0, 1200),
        mediaType: isImage ? "image" : "other",
        image: isImage ? data.url : null,
        hdImage: isImage && isNasaUrl(data.hdurl) ? data.hdurl : null,
        copyright: data.copyright?.replace(/\s+/g, " ").trim() || null,
        pageUrl: `https://apod.nasa.gov/apod/ap${y.slice(2)}${m}${d}.html`,
        source: { name: "NASA APOD API", url: "https://api.nasa.gov/" },
        fetchedAt: new Date(fetchedAt).toISOString(),
        stale,
        demoKey: isDemo,
      },
      { sMaxAge: 3600 },
    );
  } catch (err) {
    console.error("APOD request failed", err);
    return jsonResponse({ error: errorCode(err) }, { status: 502 });
  }
}
