import type { Metadata } from "next";

import { PageShell } from "@/components/layout/page-shell";
import { ProvenanceNote } from "@/components/safety/disclaimers";
import { ResourceDirectory } from "@/components/resources/resource-directory";
import { Callout } from "@/components/ui/callout";
import { PageHeader } from "@/components/ui/section";
import { RESOURCE_CONTENT } from "@/content/meta";
import { RESOURCES } from "@/content/resources";

export const metadata: Metadata = {
  title: "Support directory",
  description:
    "National crisis lines, postpartum mental-health support, domestic-violence help, lactation support, and practical assistance.",
};

export default function ResourcesPage() {
  return (
    <PageShell width="wide">
      <PageHeader
        eyebrow="Support"
        title="People you can call"
        standfirst="National services in the United States, with the hours and cost listed so you know what to expect before you dial."
      />

      <Callout tone="supportive" title="Asking for help is not failing">
        <p>
          Most of these lines are free, confidential, and answered around the
          clock. You do not need to be in crisis to call one.
        </p>
      </Callout>

      <ResourceDirectory resources={RESOURCES} />

      <ProvenanceNote provenance={RESOURCE_CONTENT} />
    </PageShell>
  );
}
