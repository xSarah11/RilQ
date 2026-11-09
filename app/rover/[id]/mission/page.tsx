import { notFound } from "next/navigation";
import MissionView from "@/components/MissionView";
import { getRover, rovers } from "@/data/rovers";

export function generateStaticParams() {
  return rovers.map((r) => ({ id: r.id }));
}

export default async function Page({ params }: PageProps<"/rover/[id]/mission">) {
  const { id } = await params;
  if (!getRover(id)) notFound();
  return <MissionView roverId={id} />;
}
