"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Check, Printer } from "lucide-react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";

import { Button } from "@/components/ui/button";
import { Callout } from "@/components/ui/callout";
import { SelectField, TextAreaField, TextField } from "@/components/ui/field";
import { Section } from "@/components/ui/section";
import { DATA_HANDLING } from "@/lib/privacy/notices";
import { STORAGE_KEYS } from "@/lib/storage/local-store";
import { useStoredRecord } from "@/lib/storage/use-stored-record";
import {
  BIRTH_TYPES,
  BIRTH_TYPE_LABELS,
  EMPTY_SAFETY_PLAN,
  safetyPlanSchema,
  type SafetyPlan,
  type SafetyPlanInput,
} from "@/lib/validation/schemas";
import { formatDateTime } from "@/lib/utils";

/** A cleared date or select reports "", which is not a valid stored value. */
function blankToUndefined(value: unknown) {
  return value === "" ? undefined : value;
}

export function SafetyPlanForm() {
  const { value, isReady, save } = useStoredRecord(
    STORAGE_KEYS.safetyPlan,
    safetyPlanSchema,
    EMPTY_SAFETY_PLAN,
  );
  const [savedAt, setSavedAt] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isDirty },
  } = useForm<SafetyPlanInput, undefined, SafetyPlan>({
    resolver: zodResolver(safetyPlanSchema),
    defaultValues: EMPTY_SAFETY_PLAN,
  });

  useEffect(() => {
    if (isReady) reset(value);
    // Reset once the device value has been read.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isReady]);

  function onSubmit(plan: SafetyPlan) {
    const updatedAt = new Date().toISOString();
    save({ ...plan, updatedAt });
    setSavedAt(updatedAt);
    reset({ ...plan, updatedAt });
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-10">
      <Callout tone="note" title="Nothing here leaves your device">
        <p>{DATA_HANDLING.points[1]}</p>
        <p className="mt-2">
          Every field is optional. Skip anything you would rather not write
          down.
        </p>
      </Callout>

      <Section ruled={false} eyebrow="Your birth" title="Dates and birth type">
        <div className="space-y-5">
          <TextField
            label="Date your baby was born"
            type="date"
            purpose="Shows how many days postpartum you are. It never changes urgency guidance."
            error={errors.deliveryDate?.message}
            {...register("deliveryDate", { setValueAs: blankToUndefined })}
          />
          <SelectField
            label="Type of birth"
            placeholder="Prefer not to say"
            options={BIRTH_TYPES.map((value) => ({
              value,
              label: BIRTH_TYPE_LABELS[value],
            }))}
            error={errors.birthType?.message}
            {...register("birthType", { setValueAs: blankToUndefined })}
          />
        </div>
      </Section>

      <Section eyebrow="Hospital" title="Where you would go">
        <div className="space-y-5">
          <TextField
            label="Hospital or birth center"
            error={errors.hospital?.name?.message}
            {...register("hospital.name")}
          />
          <TextField
            label="Address"
            autoComplete="off"
            error={errors.hospital?.address?.message}
            {...register("hospital.address")}
          />
          <TextField
            label="Phone"
            type="tel"
            inputMode="tel"
            error={errors.hospital?.phone?.message}
            {...register("hospital.phone")}
          />
          <TextAreaField
            label="Notes for arriving"
            rows={3}
            hint="For example which entrance to use at night, or where to park."
            error={errors.hospital?.notes?.message}
            {...register("hospital.notes")}
          />
        </div>
      </Section>

      <Section eyebrow="Care team" title="Who looks after you">
        <div className="space-y-5">
          <TextField
            label="Name of your OB/GYN or midwife"
            error={errors.provider?.name?.message}
            {...register("provider.name")}
          />
          <TextField
            label="Practice or role"
            error={errors.provider?.role?.message}
            {...register("provider.role")}
          />
          <TextField
            label="Daytime phone"
            type="tel"
            inputMode="tel"
            error={errors.provider?.phone?.message}
            {...register("provider.phone")}
          />
          <TextField
            label="After-hours or on-call phone"
            type="tel"
            inputMode="tel"
            hint="Most maternity units have a number staffed around the clock. It is worth asking for it."
            error={errors.provider?.afterHoursPhone?.message}
            {...register("provider.afterHoursPhone")}
          />
        </div>
      </Section>

      <Section eyebrow="Contacts" title="People who can get to you">
        <div className="space-y-5">
          <TextField
            label="Emergency contact name"
            error={errors.emergencyContact?.name?.message}
            {...register("emergencyContact.name")}
          />
          <TextField
            label="Relationship"
            error={errors.emergencyContact?.relationship?.message}
            {...register("emergencyContact.relationship")}
          />
          <TextField
            label="Phone"
            type="tel"
            inputMode="tel"
            error={errors.emergencyContact?.phone?.message}
            {...register("emergencyContact.phone")}
          />
          <TextField
            label="Backup contact name"
            error={errors.backupContact?.name?.message}
            {...register("backupContact.name")}
          />
          <TextField
            label="Backup phone"
            type="tel"
            inputMode="tel"
            error={errors.backupContact?.phone?.message}
            {...register("backupContact.phone")}
          />
        </div>
      </Section>

      <Section
        eyebrow="Medical"
        title="What a clinician would want to know"
        standfirst="Only write what you would be comfortable having on this device. Anyone who can unlock it can read it."
      >
        <div className="space-y-5">
          <TextAreaField
            label="Conditions, complications, or history"
            rows={4}
            purpose="Helpful to read out when you call, especially if you are exhausted."
            error={errors.medicalHistory?.message}
            {...register("medicalHistory")}
          />
          <TextAreaField
            label="Allergies"
            rows={2}
            error={errors.allergies?.message}
            {...register("allergies")}
          />
          <TextAreaField
            label="Medications"
            rows={3}
            error={errors.medications?.message}
            {...register("medications")}
          />
        </div>
      </Section>

      <div className="border-rule-strong sticky bottom-0 -mx-5 border-t bg-[color:var(--parchment)] px-5 py-4 sm:-mx-8 sm:px-8">
        <div className="flex flex-wrap items-center gap-3">
          <Button type="submit" variant="primary" size="lg">
            {isDirty ? "Save my safety plan" : "Saved"}
          </Button>
          <Button
            variant="secondary"
            onClick={() => window.print()}
            type="button"
          >
            <Printer aria-hidden="true" className="size-4" />
            Print or save as PDF
          </Button>
          <p aria-live="polite" className="text-ink-muted text-[0.88rem]">
            {savedAt ? (
              <span className="inline-flex items-center gap-1.5">
                <Check aria-hidden="true" className="text-sage-deep size-4" />
                Saved {formatDateTime(savedAt)}
              </span>
            ) : value.updatedAt ? (
              `Last saved ${formatDateTime(value.updatedAt)}`
            ) : (
              "Not saved yet"
            )}
          </p>
        </div>
      </div>
    </form>
  );
}
