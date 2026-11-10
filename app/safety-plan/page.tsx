import type { Metadata } from "next";

import { PageShell } from "@/components/layout/page-shell";
import { PersonalisedPlan } from "@/components/safety-plan/personalised-plan";
import { SafetyPlanForm } from "@/components/safety-plan/safety-plan-form";
import { PageHeader } from "@/components/ui/section";

export const metadata: Metadata = {
  title: "My safety plan",
  description:
    "Save your hospital, your care team, your emergency contacts, and the medical details you would want read out in a hard moment. Stored on your device only.",
};

export default function SafetyPlanPage() {
  return (
    <PageShell>
      <PageHeader
        eyebrow="Preparation"
        title="My safety plan"
        standfirst="The numbers and details you would struggle to find at 3am. Fill in as much or as little as you want."
      />
      <PersonalisedPlan />
      <SafetyPlanForm />
    </PageShell>
  );
}
