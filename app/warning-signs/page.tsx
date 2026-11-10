import type { Metadata } from "next";
import Link from "next/link";

import { PageShell } from "@/components/layout/page-shell";
import {
  MedicalDisclaimer,
  ProvenanceNote,
} from "@/components/safety/disclaimers";
import { PageHeader, Section } from "@/components/ui/section";
import { WarningSignIndex } from "@/components/warning-signs/warning-sign-index";
import { WARNING_SIGN_CONTENT } from "@/content/meta";
import { WARNING_SIGNS } from "@/content/warning-signs";

export const metadata: Metadata = {
  title: "Postpartum warning signs",
  description:
    "What each postpartum warning sign looks like, why it matters, and what to do — written in plain language.",
};

export default function WarningSignsPage() {
  return (
    <PageShell width="wide">
      <PageHeader
        eyebrow="Library"
        title="Postpartum warning signs"
        standfirst="Look up what you are noticing. Each entry says what it looks like, why it matters, when to call 911, and when to call your care team."
      />

      <MedicalDisclaimer />

      <WarningSignIndex signs={WARNING_SIGNS} />

      <Section eyebrow="Not sure which one fits?">
        <p className="text-ink-soft max-w-[62ch]">
          If your symptom is not here, that does not mean it is nothing. Answer
          a few questions about what you are feeling, or call your care team and
          describe it in your own words.
        </p>
        <p className="mt-4">
          <Link href="/seek-care" className="link font-semibold">
            Answer questions about my symptom
          </Link>
        </p>
      </Section>

      <ProvenanceNote provenance={WARNING_SIGN_CONTENT} />
    </PageShell>
  );
}
