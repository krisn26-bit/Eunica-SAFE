import type { Metadata } from "next";

import { PageShell } from "@/components/layout/page-shell";
import { RecoveryTracker } from "@/components/recovery/recovery-tracker";
import { Callout } from "@/components/ui/callout";
import { PageHeader } from "@/components/ui/section";

export const metadata: Metadata = {
  title: "Recovery tracker",
  description:
    "Record pain, bleeding, temperature, mood, and questions for your care team. Nothing is scored or interpreted, and nothing leaves your device.",
};

export default function RecoveryPage() {
  return (
    <PageShell>
      <PageHeader
        eyebrow="Recovery"
        title="How recovery is going"
        standfirst="A short daily note gives you accurate words for your next appointment, and makes changes easier to notice."
      />
      <Callout tone="note" title="This is a record, not an assessment">
        <p>
          Nothing here is scored, graded, or interpreted. When something you
          record matches a published threshold — such as a fever at or above
          100.4°F — the app tells you so and suggests a call. It never tells you
          that your numbers look fine.
        </p>
      </Callout>
      <RecoveryTracker />
    </PageShell>
  );
}
