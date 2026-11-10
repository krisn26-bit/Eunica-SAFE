"use client";

import { ButtonLink } from "@/components/ui/button";
import { STORAGE_KEYS } from "@/lib/storage/local-store";
import { useStoredRecord } from "@/lib/storage/use-stored-record";
import { postpartumStage } from "@/lib/utils";
import { EMPTY_SAFETY_PLAN, safetyPlanSchema } from "@/lib/validation/schemas";

/**
 * Timing context only. It never changes urgency guidance — a symptom at week
 * ten is treated exactly as seriously as the same symptom at day three.
 */
export function PostpartumStrip() {
  const { value: plan, isReady } = useStoredRecord(
    STORAGE_KEYS.safetyPlan,
    safetyPlanSchema,
    EMPTY_SAFETY_PLAN,
  );

  if (!isReady) return null;

  const stage = plan.deliveryDate ? postpartumStage(plan.deliveryDate) : null;

  if (!stage) {
    return (
      <div className="border-rule border-y bg-[color:var(--paper)] px-5 py-4 sm:px-6">
        <p className="text-ink-soft text-[0.95rem]">
          Add your baby&rsquo;s date of birth to see where you are in recovery.{" "}
          <ButtonLink href="/safety-plan" variant="quiet" size="sm">
            Add it to my safety plan
          </ButtonLink>
        </p>
      </div>
    );
  }

  return (
    <div className="border-rule border-y bg-[color:var(--paper)] px-5 py-4 sm:px-6">
      <p className="eyebrow">Where you are</p>
      <p className="mt-1 font-serif text-[1.3rem] font-semibold">
        {stage.label}
        {stage.week > 0 ? (
          <span className="text-ink-muted ml-2 font-sans text-[0.9rem] font-normal">
            week {stage.week}
          </span>
        ) : null}
      </p>
      <p className="text-ink-soft mt-1.5 max-w-[62ch] text-[0.95rem]">
        {stage.note}
      </p>
    </div>
  );
}
