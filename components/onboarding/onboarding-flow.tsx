"use client";

import { ArrowLeft, ArrowRight } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

import { Button, ButtonLink } from "@/components/ui/button";
import { Callout } from "@/components/ui/callout";
import { ChoiceGroup, TextField } from "@/components/ui/field";
import { StepList } from "@/components/ui/section";
import { DATA_HANDLING, SCOPE_STATEMENT } from "@/lib/privacy/notices";
import { STORAGE_KEYS } from "@/lib/storage/local-store";
import { useStoredRecord } from "@/lib/storage/use-stored-record";
import {
  BIRTH_TYPES,
  BIRTH_TYPE_LABELS,
  EMPTY_SAFETY_PLAN,
  USER_ROLES,
  USER_ROLE_DETAILS,
  USER_ROLE_LABELS,
  preferencesSchema,
  safetyPlanSchema,
  type UserRole,
} from "@/lib/validation/schemas";
const STEPS = ["scope", "role", "basics", "done"] as const;
type StepId = (typeof STEPS)[number];

export function OnboardingFlow() {
  const router = useRouter();
  const [step, setStep] = useState<StepId>("scope");
  const [role, setRole] = useState<UserRole | null>(null);
  const [deliveryDate, setDeliveryDate] = useState("");
  const [birthType, setBirthType] = useState<string | null>(null);

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

  const index = STEPS.indexOf(step);

  function finish() {
    preferences.save({
      role: role ?? undefined,
      onboardedAt: new Date().toISOString(),
      locationConsent: preferences.value.locationConsent,
      reduceMotion: preferences.value.reduceMotion,
    });
    if (deliveryDate || birthType) {
      plan.update((current) => ({
        ...current,
        deliveryDate: deliveryDate || current.deliveryDate,
        birthType:
          (birthType as (typeof BIRTH_TYPES)[number] | null) ??
          current.birthType,
        updatedAt: new Date().toISOString(),
      }));
    }
    setStep("done");
  }

  return (
    <div className="space-y-8">
      <div
        role="progressbar"
        aria-valuemin={1}
        aria-valuemax={STEPS.length}
        aria-valuenow={index + 1}
        aria-label={`Step ${index + 1} of ${STEPS.length}`}
        className="flex gap-1"
      >
        {STEPS.map((id, position) => (
          <span
            key={id}
            className={
              position <= index ? "bg-clay h-1 flex-1" : "bg-rule h-1 flex-1"
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

      {step === "basics" ? (
        <section className="space-y-6">
          <div>
            <h2 className="font-serif text-[length:var(--step-2)] font-semibold">
              Two optional details
            </h2>
            <p className="text-ink-soft mt-2 max-w-[60ch]">
              These help the app show where you are in recovery. Skip anything
              you would rather not save — guidance does not change either way.
            </p>
          </div>
          <TextField
            label="Date of birth of your baby"
            type="date"
            value={deliveryDate}
            onChange={(event) => setDeliveryDate(event.target.value)}
            purpose="Used to show how many days postpartum you are. It never changes urgency guidance."
          />
          <ChoiceGroup
            legend="Type of birth"
            name="birth-type"
            options={BIRTH_TYPES.map((value) => ({
              value,
              label: BIRTH_TYPE_LABELS[value],
            }))}
            value={birthType ? [birthType] : []}
            onChange={(next) => setBirthType(next[0] ?? null)}
          />
        </section>
      ) : null}

      {step === "done" ? (
        <section className="space-y-6">
          <div>
            <h2 className="font-serif text-[length:var(--step-2)] font-semibold">
              You are set up
            </h2>
            <p className="text-ink-soft mt-2 max-w-[60ch]">
              Here is what to do next, in the order that helps most.
            </p>
          </div>
          <StepList
            items={[
              "Add your hospital, your care team, and one emergency contact to your safety plan. This is the part that saves time in a crisis.",
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
              if (step === "basics") {
                finish();
                return;
              }
              setStep(STEPS[index + 1]);
            }}
          >
            {step === "basics" ? "Save and finish" : "Continue"}
            <ArrowRight aria-hidden="true" className="size-5" />
          </Button>
          <Button variant="quiet" onClick={() => router.push("/dashboard")}>
            Skip setup
          </Button>
        </div>
      ) : null}
    </div>
  );
}
