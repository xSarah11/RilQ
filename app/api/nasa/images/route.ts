// GET /api/nasa/images?rover=<id>  →  official NASA photos for that rover (NASA Image and Video Library).
import { getRover } from "@/data/rovers";
import { searchImages } from "@/lib/nasa/images";

export async function GET(request: Request) {
  const roverId = new URL(request.url).searchParams.get("rover") ?? "";
  const rover = getRover(roverId);
  if (!rover) return Response.json({ ok: false, error: "UNKNOWN_ROVER" }, { status: 400 });

  try {
    const res = await searchImages(rover.nasaImagesQuery);
    return Response.json(
      { ok: true, source: "nasa-images", query: rover.nasaImagesQuery, fetchedAt: res.fetchedAt, ...res.data },
      { headers: { "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400" } },
    );
  } catch (err) {
    console.error("NASA images failed", err);
    return Response.json({ ok: false, error: "NASA_UNAVAILABLE" }, { status: 502 });
  }
}
