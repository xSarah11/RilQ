// GET /api/nasa/traverse  →  Perseverance's real drive path + latest position (NASA/JPL Mars 2020 GeoJSON).
import { connection } from "next/server";
import { getPerseveranceTraverse } from "@/lib/nasa/traverse";

export async function GET() {
  await connection(); // always run at request time, never at build

  try {
    const t = await getPerseveranceTraverse();
    return Response.json(
      { ok: true, source: "m20-traverse", ...t },
      { headers: { "Cache-Control": "public, s-maxage=21600, stale-while-revalidate=86400" } },
    );
  } catch (err) {
    console.error("NASA traverse failed", err);
    return Response.json({ ok: false, error: "NASA_UNAVAILABLE" }, { status: 502 });
  }
}
