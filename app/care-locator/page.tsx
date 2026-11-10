import type { Metadata } from "next";

import { CareLocator } from "@/components/care-locator/care-locator";
import { PageShell } from "@/components/layout/page-shell";
import { PageHeader } from "@/components/ui/section";

export const metadata: Metadata = {
  title: "Find care near you",
  description:
    "Search for emergency departments, hospitals with labor and delivery, and urgent care using your own map application. Your location stays on your device.",
};

export default function CareLocatorPage() {
  return (
    <PageShell>
      <PageHeader
        eyebrow="Care locator"
        title="Find care near you"
        standfirst="Eunica Safe hands your search to the map application on your device rather than listing facilities it cannot verify."
      />
      <CareLocator />
    </PageShell>
  );
}
