import { Ban } from "lucide-react";

import type { WarningSignTier } from "@/content/warning-signs";
import { ACTION_LEVELS } from "@/lib/safety-rules/types";
import { UrgencyBadge } from "@/components/ui/urgency-badge";

/**
 * Renders the bands of a topic that spans more than one action level, each
 * with its own heading, instruction set, and the things not to do. The bands
 * are deliberately separate blocks rather than one merged list, so that a
 * mother reading quickly cannot carry the response for one band across to the
 * other.
 */
export function TierBands({ tiers }: { tiers: WarningSignTier[] }) {
  return (
    <div className="space-y-8">
      {tiers.map((tier) => {
        const action = ACTION_LEVELS[tier.level];
        return (
          <article
            key={tier.id}
            className="border-rule bg-paper rounded-[var(--radius-editorial)] border p-5 sm:p-6"
          >
            <div className="flex flex-wrap items-center gap-3">
              <h3 className="font-serif text-[1.3rem] font-semibold">
                {tier.label}
              </h3>
              <UrgencyBadge level={tier.level} />
            </div>

            {tier.threshold ? (
              <p className="text-ink mt-2 font-semibold">{tier.threshold}</p>
            ) : null}

            <p className="text-ink-soft mt-2 max-w-[64ch]">{action.meaning}</p>

            <h4 className="text-ink-muted mt-5 text-[0.76rem] font-semibold tracking-[0.1em] uppercase">
              What this band looks like
            </h4>
            <ul className="text-ink-soft mt-2 list-disc space-y-1.5 pl-5">
              {tier.looksLike.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>

            <h4 className="text-ink-muted mt-5 text-[0.76rem] font-semibold tracking-[0.1em] uppercase">
              What to do
            </h4>
            <ol className="text-ink-soft mt-2 list-decimal space-y-1.5 pl-5">
              {tier.whatToDo.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ol>

            {tier.doNot?.length ? (
              <div className="border-rule mt-5 border-t pt-4">
                <h4 className="text-ink-muted flex items-center gap-1.5 text-[0.76rem] font-semibold tracking-[0.1em] uppercase">
                  <Ban aria-hidden="true" className="size-3.5" />
                  What not to do
                </h4>
                <ul className="text-ink-soft mt-2 list-disc space-y-1.5 pl-5">
                  {tier.doNot.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </div>
            ) : null}
          </article>
        );
      })}
    </div>
  );
}
