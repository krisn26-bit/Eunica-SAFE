import { ArrowLeft } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { PageShell } from "@/components/layout/page-shell";
import { Call911Button } from "@/components/safety/call-911";
import { ProvenanceNote } from "@/components/safety/disclaimers";
import { ExperiencingThisButton } from "@/components/warning-signs/experiencing-this-button";
import { ButtonLink } from "@/components/ui/button";
import { Callout } from "@/components/ui/callout";
import { PageHeader, Section, StepList } from "@/components/ui/section";
import { UrgencyBadge } from "@/components/ui/urgency-badge";
import {
  URGENCY_HINT_LABELS,
  WARNING_SIGNS,
  getWarningSign,
} from "@/content/warning-signs";

type Params = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return WARNING_SIGNS.map((sign) => ({ slug: sign.slug }));
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params;
  const sign = getWarningSign(slug);
  if (!sign) return { title: "Warning sign not found" };
  return {
    title: sign.title,
    description: sign.standfirst,
  };
}

export default async function WarningSignPage({ params }: Params) {
  const { slug } = await params;
  const sign = getWarningSign(slug);
  if (!sign) notFound();

  const isEmergencyTopic =
    sign.urgencyHint === "call-911" || sign.urgencyHint === "emergency-now";

  return (
    <PageShell>
      <p>
        <Link
          href="/warning-signs"
          className="text-ink-muted hover:text-brand-deep inline-flex items-center gap-1.5 text-[0.9rem]"
        >
          <ArrowLeft aria-hidden="true" className="size-4" />
          All warning signs
        </Link>
      </p>

      <PageHeader
        eyebrow={URGENCY_HINT_LABELS[sign.urgencyHint]}
        title={sign.title}
        standfirst={sign.standfirst}
        meta={<UrgencyBadge hint={sign.urgencyHint} />}
      />

      {isEmergencyTopic ? (
        <Callout tone="emergency" title="This can be an emergency">
          <p className="mb-4">
            If what you are noticing matches the list below, call 911 rather
            than waiting to see whether it passes.
          </p>
          <Call911Button />
        </Callout>
      ) : null}

      <Section ruled={false} eyebrow="What it looks like">
        <ul className="index-list">
          {sign.looksLike.map((item) => (
            <li key={item} className="text-ink-soft py-3">
              {item}
            </li>
          ))}
        </ul>
      </Section>

      <Section eyebrow="Why it matters">
        <p className="text-ink-soft max-w-[64ch] text-[1.02rem] leading-relaxed">
          {sign.whyItMatters}
        </p>
      </Section>

      <Section eyebrow="What to do">
        <StepList items={sign.whatToDo} />
      </Section>

      <Section eyebrow="When to call 911">
        <Callout tone="emergency" title="Call 911 if">
          <ul className="list-disc space-y-1.5 pl-5">
            {sign.call911When.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </Callout>
      </Section>

      <Section eyebrow="When to call your care team">
        <Callout tone="warning" title="Contact your care team if">
          <ul className="list-disc space-y-1.5 pl-5">
            {sign.contactCareTeamWhen.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
          <p className="mt-3">
            Being sent home before does not mean this is nothing. Say clearly
            that you are postpartum and describe what changed.
          </p>
        </Callout>
      </Section>

      <Section eyebrow="Next step">
        <div className="space-y-3">
          {sign.symptomId ? (
            <ExperiencingThisButton symptomId={sign.symptomId} />
          ) : (
            <ButtonLink href="/seek-care" variant="primary" size="lg" fullWidth>
              Answer questions about my symptom
            </ButtonLink>
          )}
          <ButtonLink
            href="/care-locator"
            variant="secondary"
            size="lg"
            fullWidth
          >
            Find care near me
          </ButtonLink>
        </div>
      </Section>

      <ProvenanceNote provenance={sign.provenance} />
    </PageShell>
  );
}
