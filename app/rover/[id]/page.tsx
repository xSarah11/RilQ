import { notFound } from "next/navigation";
import RoverView from "@/components/RoverView";
import { getRover, rovers } from "@/data/rovers";

export function generateStaticParams() {
  return rovers.map((r) => ({ id: r.id }));
}

export default async function Page({ params }: PageProps<"/rover/[id]">) {
  const { id } = await params;
  if (!getRover(id)) notFound();
  return <RoverView roverId={id} />;
}
