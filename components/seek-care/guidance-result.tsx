"use client";

import { BookOpen, Check, Copy, MapPin } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

import { Call911Button } from "@/components/safety/call-911";
import { SavedContacts } from "@/components/safety/saved-contacts";
import { Button, ButtonLink } from "@/components/ui/button";
import { Callout } from "@/components/ui/callout";
import { Disclosure } from "@/components/ui/disclosure";
import { UrgencyBadge } from "@/components/ui/urgency-badge";
import { getWarningSign } from "@/content/warning-signs";
import { guidanceShareText } from "@/lib/safety-rules/engine";
import type { Guidance } from "@/lib/safety-rules/types";

const WHAT_TO_SAY = [
  "I gave birth on [date] and I am [number] days postpartum.",
  "I am experiencing [describe what you are noticing, and when it started].",
  "It is [getting worse / staying the same / coming and going].",
  "I need to know whether I should be seen right now.",
];

export function GuidanceResult({ guidance }: { guidance: Guidance }) {
  const [copied, setCopied] = useState(false);
  const warningSign = guidance.warningSignSlug
    ? getWarningSign(guidance.warningSignSlug)
    : undefined;

  const isEmergency =
    guidance.level === "call-911" || guidance.level === "emergency-now";

  async function copySummary() {
    try {
      await navigator.clipboard.writeText(guidanceShareText(guidance));
      setCopied(true);
      window.setTimeout(() => setCopied(false), 4000);
    } catch {
      setCopied(false);
    }
  }

  return (
    <div className="space-y-8">
      <section
        role="alert"
        aria-labelledby="guidance-headline"
        className={
          isEmergency
            ? "border-emergency bg-emergency-wash rounded-[var(--radius-editorial)] border-2 px-5 py-6 sm:px-7"
            : "border-l-clay rounded-[var(--radius-editorial)] border-l-4 bg-[color:var(--paper)] px-5 py-6 sm:px-7"
        }
      >
        <div className="flex flex-wrap items-center gap-3">
          <UrgencyBadge level={guidance.level} />
          <span className="text-ink-muted text-[0.82rem] tracking-wide">
            Based on what you told us about: {guidance.symptomLabel}
          </span>
        </div>
        <h2
          id="guidance-headline"
          className="mt-3 font-serif text-[length:var(--step-3)] font-semibold"
        >
          {guidance.presentation.headline}
        </h2>
        <p className="text-ink-soft mt-3 max-w-[60ch] text-[1.05rem]">
          {guidance.presentation.meaning}
        </p>

        <div className="mt-6 space-y-3">
          {guidance.level === "call-911" ? <Call911Button /> : null}
          {guidance.level === "emergency-now" ? (
            <>
              <ButtonLink
                href="/care-locator"
                variant="serious"
                size="lg"
                fullWidth
              >
                <MapPin aria-hidden="true" className="size-5" />
                Find the nearest emergency care
              </ButtonLink>
              <Call911Button label="Call 911 instead" />
            </>
          ) : null}
          {guidance.level === "contact-team-promptly" ? (
            <ButtonLink
              href="/safety-plan"
              variant="primary"
              size="lg"
              fullWidth
            >
              Call my care team
            </ButtonLink>
          ) : null}
        </div>
      </section>

      <section>
        <h3 className="eyebrow mb-3">Why you are seeing this</h3>
        <ul className="index-list">
          {guidance.reasons.map((reason, index) => (
            <li key={index} className="text-ink-soft py-3">
              {reason}
            </li>
          ))}
        </ul>
      </section>

      <Callout
        tone="warning"
        title="If anything changes"
        assertive={isEmergency}
      >
        <ul className="list-disc space-y-1.5 pl-5">
          {guidance.escalation.map((line, index) => (
            <li key={index}>{line}</li>
          ))}
        </ul>
      </Callout>

      <section>
        <h3 className="eyebrow mb-3">What to say when you call</h3>
        <ol className="index-list">
          {WHAT_TO_SAY.map((line, index) => (
            <li key={index} className="text-ink-soft py-3">
              {line}
            </li>
          ))}
        </ol>
        <div className="mt-4 flex flex-wrap gap-3">
          <Button variant="secondary" size="sm" onClick={copySummary}>
            {copied ? (
              <Check aria-hidden="true" className="size-4" />
            ) : (
              <Copy aria-hidden="true" className="size-4" />
            )}
            {copied ? "Copied to your clipboard" : "Copy a summary to share"}
          </Button>
        </div>
        <p aria-live="polite" className="text-ink-muted mt-2 text-[0.85rem]">
          {copied
            ? "The summary is on your clipboard. It contains only the action level and reasons."
            : "The summary has no personal details in it."}
        </p>
      </section>

      <SavedContacts heading="Numbers you saved on this device" />

      {warningSign ? (
        <section className="border-rule border-t pt-6">
          <Link
            href={`/warning-signs/${warningSign.slug}`}
            className="group flex items-start gap-3"
          >
            <BookOpen
              aria-hidden="true"
              className="text-clay mt-1 size-5 shrink-0"
            />
            <span>
              <span className="text-ink group-hover:text-clay-deep block font-serif text-[1.15rem] font-semibold group-hover:underline">
                Read more: {warningSign.title}
              </span>
              <span className="text-ink-soft mt-1 block text-[0.95rem]">
                {warningSign.standfirst}
              </span>
            </span>
          </Link>
        </section>
      ) : null}

      <Disclosure summary="How this guidance was produced">
        <p>
          Eunica Safe compared your answers against a fixed, versioned list of
          published postpartum warning signs. There is no model, no scoring, and
          no interpretation of your medical history. The same answers always
          produce the same result.
        </p>
        <p className="mt-2">
          Rule set {guidance.rulesVersion}. Matched rules:{" "}
          {guidance.matchedRuleIds.length > 0
            ? guidance.matchedRuleIds.join(", ")
            : "none beyond the baseline for this symptom"}
          .
        </p>
        <p className="mt-2">
          This rule set is a draft and has not been reviewed by a clinician. It
          cannot examine you and cannot rule out an emergency.
        </p>
      </Disclosure>
    </div>
  );
}
