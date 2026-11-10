import type { Metadata } from "next";

import { PageShell } from "@/components/layout/page-shell";
import { SeekCareFlow } from "@/components/seek-care/seek-care-flow";
import { EmergencyDisclaimer } from "@/components/safety/disclaimers";
import { Disclosure } from "@/components/ui/disclosure";
import { PageHeader } from "@/components/ui/section";
import { RULES_REVIEW, SAFETY_RULES_VERSION } from "@/lib/safety-rules/rules";

export const metadata: Metadata = {
  title: "Should I seek care?",
  description:
    "Answer a short set of questions about one postpartum symptom and get a clear action: call 911, seek emergency care now, contact your care team, or watch closely.",
};

export default function SeekCarePage() {
  return (
    <PageShell>
      <PageHeader
        eyebrow="Decision support"
        title="Should I seek care?"
        standfirst="A few questions about one symptom, then a clear action. This cannot diagnose you and it cannot rule out an emergency."
      />

      <EmergencyDisclaimer />

      <SeekCareFlow />

      <Disclosure summary="How this works, and what it will never do">
        <p>
          Your answers are compared against a fixed list of published postpartum
          warning signs. It is a rule table, not a model: the same answers
          always produce the same result, and every result can be traced to the
          rules that matched.
        </p>
        <p className="mt-2">
          It will never tell you that you are fine, and it will never rule out
          an emergency. When answers are unclear, it errs toward seeking care.
        </p>
        <p className="mt-2">
          Rule set {SAFETY_RULES_VERSION}, status {RULES_REVIEW.status}. Not yet
          reviewed by a clinician.
        </p>
      </Disclosure>
    </PageShell>
  );
}
