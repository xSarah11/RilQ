import type { Metadata } from "next";
import DataHubView from "@/components/DataHubView";
import { SOURCES } from "@/lib/nasa/sources";

export const metadata: Metadata = {
  title: "Data Hub | ReliQ — NASA data sources",
  description: "The NASA open data behind ReliQ, with a live connection check.",
};

export default function Page() {
  // Only pass display fields to the client (no internal probe URLs).
  const sources = SOURCES.map(({ id, name, provider, kind, usedFor, docs, updates }) => ({ id, name, provider, kind, usedFor, docs, updates }));
  return <DataHubView sources={sources} />;
}
