import type { Metadata } from "next";
import DataSourcesView from "@/components/DataSourcesView";

export const metadata: Metadata = {
  title: "NASA Data | ReliQ",
  description: "Every NASA open-data source used by ReliQ, with a live connection check.",
};

export default function Page() {
  return <DataSourcesView />;
}
