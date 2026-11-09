import { notFound } from "next/navigation";
import ExploreView from "@/components/ExploreView";
import { getPlanet, planetIds } from "@/data/planets";

export function generateStaticParams() {
  return planetIds.map((planet) => ({ planet }));
}

export default async function Page({ params }: PageProps<"/explore/[planet]">) {
  const { planet } = await params;
  const p = getPlanet(planet);
  if (!p) notFound();
  return <ExploreView planetId={p.id} />;
}
