"use client";

import { ArrowRight, FileText, Pencil } from "lucide-react";
import Link from "next/link";

import { ButtonLink } from "@/components/ui/button";
import { Callout } from "@/components/ui/callout";
import { historyInsights } from "@/lib/medical-history/insights";
import {
  EMPTY_MEDICAL_HISTORY,
  isMedicalHistoryComplete,
  medicalHistorySchema,
  missingRequiredAnswers,
} from "@/lib/medical-history/schema";
import { STORAGE_KEYS } from "@/lib/storage/local-store";
import { useStoredRecord } from "@/lib/storage/use-stored-record";

/**
 * The part of the safety plan that medical history unlocks.
 *
 * Contact details deliberately stay available whether or not the history is
 * finished: making a mother complete a questionnaire before she can save the
 * number for her maternity unit would be a safety problem, not a feature. What
 * is gated is the personalised education, which is the part the history is
 * actually for.
 */
export function PersonalisedPlan() {
  const { value, isReady } = useStoredRecord(
    STORAGE_KEYS.medicalHistory,
    medicalHistorySchema,
    EMPTY_MEDICAL_HISTORY,
  );

  if (!isReady) {
    return (
      <div
        aria-hidden="true"
        className="border-rule bg-brand-wash h-40 animate-pulse rounded-[var(--radius-editorial)] border"
      />
    );
  }

  if (!isMedicalHistoryComplete(value)) {
    const missing = missingRequiredAnswers(value);
    const started = missing.length < 4;

    return (
      <section
        aria-labelledby="personalised-plan-heading"
        className="border-rule-strong bg-brand-wash rounded-[var(--radius-editorial)] border p-5 sm:p-7"
      >
        <p className="eyebrow mb-2">Your personalised plan</p>
        <h2
          id="personalised-plan-heading"
          className="font-serif text-[length:var(--step-2)] font-semibold"
        >
          {started
            ? "Finish your medical history to unlock this"
            : "Add your medical history to unlock this"}
        </h2>
        <p className="text-ink-soft mt-3 max-w-[60ch]">
          Your history decides which education belongs in your plan — incision
          care after a cesarean, blood-pressure follow-up after preeclampsia,
          healing after stitches. It takes a few minutes, most of it is
          tap-to-answer, and it never leaves this device.
        </p>
        <p className="text-ink-muted mt-3 text-[0.9rem]">
          Still to answer: {missing.join("; ")}.
        </p>
        <div className="mt-5 flex flex-wrap gap-3">
          <ButtonLink href="/medical-history" variant="primary" size="lg">
            {started ? "Finish my medical history" : "Add my medical history"}
            <ArrowRight aria-hidden="true" className="size-5" />
          </ButtonLink>
        </div>
        <p className="text-ink-muted mt-4 text-[0.88rem]">
          Everything below — your hospital, your care team, your contacts —
          works right now without it.
        </p>
      </section>
    );
  }

  const insights = historyInsights(value);

  return (
    <section aria-labelledby="personalised-plan-heading" className="space-y-5">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="eyebrow mb-2">Your personalised plan</p>
          <h2
            id="personalised-plan-heading"
            className="font-serif text-[length:var(--step-2)] font-semibold"
          >
            Education chosen by what you told us
          </h2>
        </div>
        <Link
          href="/medical-history"
          className="link text-ink-soft inline-flex items-center gap-1.5 text-[0.92rem]"
        >
          <Pencil aria-hidden="true" className="size-4" />
          Update my medical history
        </Link>
      </div>

      {insights.length === 0 ? (
        <Callout tone="note" title="Nothing extra to add from your history">
          <p>
            What you told us does not bring up any additional education beyond
            the warning signs everyone should know. That is not the same as
            being low risk, and it is not a judgement about your health. Read
            the warning signs, and call your care team about anything that
            worries you.
          </p>
          <p className="mt-2">
            <Link href="/warning-signs" className="link font-semibold">
              Read the warning signs
            </Link>
          </p>
        </Callout>
      ) : (
        <ul className="space-y-4">
          {insights.map((insight) => (
            <li
              key={insight.id}
              className="border-rule-strong border-l-accent rounded-[var(--radius-editorial)] border border-l-4 bg-[color:var(--paper)] p-5"
            >
              <h3 className="font-serif text-[length:var(--step-1)] font-semibold">
                {insight.title}
              </h3>
              <p className="text-ink-muted mt-1 flex items-start gap-1.5 text-[0.85rem]">
                <FileText
                  aria-hidden="true"
                  className="mt-0.5 size-3.5 shrink-0"
                />
                {insight.becauseYouTold}
              </p>
              <p className="text-ink-soft mt-3 leading-relaxed">
                {insight.body}
              </p>
              <div className="mt-4 flex flex-wrap gap-x-5 gap-y-2 text-[0.92rem]">
                {insight.warningSignSlug ? (
                  <Link
                    href={`/warning-signs/${insight.warningSignSlug}`}
                    className="link font-semibold"
                  >
                    Read the warning signs
                  </Link>
                ) : null}
                {insight.actionHref && insight.actionLabel ? (
                  <Link
                    href={insight.actionHref}
                    className="link font-semibold"
                  >
                    {insight.actionLabel}
                  </Link>
                ) : null}
              </div>
            </li>
          ))}
        </ul>
      )}

      <Callout tone="note" title="What this is not">
        <p>
          This education is chosen by the answers you gave, nothing more. It
          does not mean you have any of these conditions now, it does not
          predict what will happen, and it cannot tell you that you are safe.
          Anything that worries you is worth a call.
        </p>
      </Callout>
    </section>
  );
}
