import type { Metadata } from "next";

import { PageShell } from "@/components/layout/page-shell";
import { OnboardingFlow } from "@/components/onboarding/onboarding-flow";
import { PageHeader } from "@/components/ui/section";

export const metadata: Metadata = {
  title: "Set up",
  description:
    "A three-minute setup: what Eunica Safe can and cannot do, who is using it, and two optional details about your birth.",
};

export default function OnboardingPage() {
  return (
    <PageShell>
      <PageHeader
        eyebrow="Setup"
        title="Three minutes now, so it is ready later"
        standfirst="You can skip any part of this. Nothing you enter is sent anywhere — it is saved in this browser on this device."
      />
      <OnboardingFlow />
    </PageShell>
  );
}
