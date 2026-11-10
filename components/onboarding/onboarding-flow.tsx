"use client";

import { ArrowLeft, ArrowRight } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

import { MedicalHistoryForm } from "@/components/medical-history/medical-history-form";
import { Button, ButtonLink } from "@/components/ui/button";
import { Callout } from "@/components/ui/callout";
import { ChoiceGroup } from "@/components/ui/field";
import { StepList } from "@/components/ui/section";
import {
  CESAREAN_DELIVERY_TYPES,
  EMPTY_MEDICAL_HISTORY,
  isMedicalHistoryComplete,
  medicalHistorySchema,
  missingRequiredAnswers,
  type MedicalHistory,
} from "@/lib/medical-history/schema";
import { DATA_HANDLING, SCOPE_STATEMENT } from "@/lib/privacy/notices";
import { STORAGE_KEYS } from "@/lib/storage/local-store";
import { useStoredRecord } from "@/lib/storage/use-stored-record";
import {
  EMPTY_SAFETY_PLAN,
  USER_ROLES,
  USER_ROLE_DETAILS,
  USER_ROLE_LABELS,
  preferencesSchema,
  safetyPlanSchema,
  type BirthType,
  type UserRole,
} from "@/lib/validation/schemas";

const STEPS = ["scope", "role", "history", "done"] as const;
type StepId = (typeof STEPS)[number];

const STEP_LABELS: Record<StepId, string> = {
  scope: "What this is",
  role: "Who is using it",
  history: "Your medical history",
  done: "Finished",
};

/** Keeps the safety plan's own delivery fields aligned with the history. */
function birthTypeFromHistory(history: MedicalHistory): BirthType | undefined {
  if (!history.deliveryType) return undefined;
  if (CESAREAN_DELIVERY_TYPES.includes(history.deliveryType)) return "cesarean";
  if (history.deliveryType === "vaginal") return "vaginal";
  if (history.deliveryType === "assisted") return "assisted";
  if (history.deliveryType === "vbac") return "vbac";
  return "prefer-not-to-say";
}

export function OnboardingFlow() {
  const router = useRouter();
  const [step, setStep] = useState<StepId>("scope");
  const [role, setRole] = useState<UserRole | null>(null);
  const [draft, setDraft] = useState<MedicalHistory>(EMPTY_MEDICAL_HISTORY);
  const [showHistoryErrors, setShowHistoryErrors] = useState(false);

  const preferences = useStoredRecord(
    STORAGE_KEYS.preferences,
    preferencesSchema,
    {
      locationConsent: false,
      reduceMotion: false,
    },
  );
  const plan = useStoredRecord(
    STORAGE_KEYS.safetyPlan,
    safetyPlanSchema,
    EMPTY_SAFETY_PLAN,
  );
  const history = useStoredRecord(
    STORAGE_KEYS.medicalHistory,
    medicalHistorySchema,
    EMPTY_MEDICAL_HISTORY,
  );

  const index = STEPS.indexOf(step);
  const historyComplete = isMedicalHistoryComplete(draft);
  const missing = missingRequiredAnswers(draft);

  function finish() {
    const now = new Date().toISOString();

    history.save({ ...draft, completedAt: now, updatedAt: now });
    preferences.save({
      role: role ?? undefined,
      onboardedAt: now,
      locationConsent: preferences.value.locationConsent,
      reduceMotion: preferences.value.reduceMotion,
    });
    plan.update((current) => ({
      ...current,
      deliveryDate: draft.deliveryDate ?? current.deliveryDate,
      birthType: birthTypeFromHistory(draft) ?? current.birthType,
      updatedAt: now,
    }));

    setStep("done");
  }

  return (
    <div className="space-y-8">
      <div
        role="progressbar"
        aria-valuemin={1}
        aria-valuemax={STEPS.length}
        aria-valuenow={index + 1}
        aria-label={`Step ${index + 1} of ${STEPS.length}: ${STEP_LABELS[step]}`}
        className="flex gap-1"
      >
        {STEPS.map((id, position) => (
          <span
            key={id}
            className={
              position <= index ? "bg-brand h-1 flex-1" : "bg-rule h-1 flex-1"
            }
          />
        ))}
      </div>

      {step === "scope" ? (
        <section className="space-y-6">
          <div>
            <h2 className="font-serif text-[length:var(--step-2)] font-semibold">
              What Eunica Safe is
            </h2>
            <p className="text-ink-soft mt-2 max-w-[60ch]">
              Read this first. Knowing the limits of this app is part of using
              it safely.
            </p>
          </div>

          <div className="grid gap-6 sm:grid-cols-2">
            <div>
              <h3 className="eyebrow mb-2">What it can do</h3>
              <ul className="index-list">
                {SCOPE_STATEMENT.can.map((item) => (
                  <li
                    key={item}
                    className="text-ink-soft py-2.5 text-[0.95rem]"
                  >
                    {item}
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="eyebrow mb-2">What it cannot do</h3>
              <ul className="index-list">
                {SCOPE_STATEMENT.cannot.map((item) => (
                  <li
                    key={item}
                    className="text-ink-soft py-2.5 text-[0.95rem]"
                  >
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <Callout tone="emergency" title="Emergencies come first">
            <p>
              If something feels seriously wrong right now, stop and call 911.
              You can set this up later.
            </p>
          </Callout>
        </section>
      ) : null}

      {step === "role" ? (
        <section className="space-y-6">
          <ChoiceGroup
            legend="Who is using Eunica Safe?"
            help="This only changes the wording you see. You can skip it."
            name="role"
            options={USER_ROLES.map((value) => ({
              value,
              label: USER_ROLE_LABELS[value],
              detail: USER_ROLE_DETAILS[value],
            }))}
            value={role ? [role] : []}
            onChange={(next) => setRole((next[0] as UserRole) ?? null)}
          />
          <Callout tone="note" title="Stored on this device">
            <p>{DATA_HANDLING.points[1]}</p>
          </Callout>
        </section>
      ) : null}

      {step === "history" ? (
        <section className="space-y-6">
          <div>
            <h2 className="font-serif text-[length:var(--step-2)] font-semibold">
              Your medical history
            </h2>
            <p className="text-ink-soft mt-2 max-w-[60ch]">
              This part is needed, because it decides which education your
              safety plan shows you. Most of it is tap-to-answer, and &ldquo;I
              am not sure&rdquo; is a real answer everywhere.
            </p>
          </div>

          <MedicalHistoryForm value={draft} onChange={setDraft} embedded />

          {showHistoryErrors && missing.length > 0 ? (
            <Callout
              tone="warning"
              title="A few answers are still needed"
              assertive
            >
              <p>Still to answer: {missing.join("; ")}.</p>
            </Callout>
          ) : null}
        </section>
      ) : null}

      {step === "done" ? (
        <section className="space-y-6">
          <div>
            <h2 className="font-serif text-[length:var(--step-2)] font-semibold">
              You are set up
            </h2>
            <p className="text-ink-soft mt-2 max-w-[60ch]">
              Your safety plan now includes the education that matches what you
              told us. Here is what to do next, in the order that helps most.
            </p>
          </div>
          <StepList
            items={[
              "Add your hospital, your care team, and one emergency contact to your safety plan. This is the part that saves time in a crisis.",
              "Read the education your history brought up. It is at the top of your safety plan.",
              "Skim the warning signs once, while you are calm. You will recognise them faster later.",
              "Bookmark this page, or add it to your home screen, so it is one tap away.",
            ]}
          />
          <div className="flex flex-wrap gap-3">
            <ButtonLink href="/safety-plan" variant="primary" size="lg">
              Set up my safety plan
            </ButtonLink>
            <ButtonLink href="/dashboard" variant="secondary" size="lg">
              Go to my home screen
            </ButtonLink>
          </div>
        </section>
      ) : null}

      {step !== "done" ? (
        <div className="border-rule flex flex-wrap items-center gap-3 border-t pt-6">
          {index > 0 ? (
            <Button
              variant="secondary"
              onClick={() => setStep(STEPS[index - 1])}
            >
              <ArrowLeft aria-hidden="true" className="size-4" />
              Back
            </Button>
          ) : null}
          <Button
            variant="primary"
            size="lg"
            onClick={() => {
              if (step === "history") {
                if (!historyComplete) {
                  setShowHistoryErrors(true);
                  return;
                }
                finish();
                return;
              }
              setStep(STEPS[index + 1]);
            }}
          >
            {step === "history" ? "Save and finish" : "Continue"}
            <ArrowRight aria-hidden="true" className="size-5" />
          </Button>
          <Button variant="quiet" onClick={() => router.push("/dashboard")}>
            {step === "history" ? "Finish this later" : "Skip setup"}
          </Button>
        </div>
      ) : null}
    </div>
  );
}
