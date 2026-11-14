// GET /api/nasa/status  →  live check of every NASA source. The Data Hub page shows the result,
// so the site only claims "live NASA data" for sources that really answered.
import { connection } from "next/server";
import { probe } from "@/lib/nasa/fetcher";
import { SOURCES } from "@/lib/nasa/sources";

let last: { at: number; body: unknown } | null = null;

export async function GET() {
  await connection(); // always run at request time, never at build

  if (last && Date.now() - last.at < 5 * 60 * 1000) return Response.json(last.body);

  const results = await Promise.all(
    SOURCES.map(async (s) => {
      const r = await probe(s.probeUrl);
      return { id: s.id, ok: r.ok, status: r.status ?? null, ms: r.ms };
    }),
  );
  const body = { checkedAt: new Date().toISOString(), results };
  last = { at: Date.now(), body };
  return Response.json(body, { headers: { "Cache-Control": "no-store" } });
}
