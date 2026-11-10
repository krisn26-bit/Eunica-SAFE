"use client";

import { Check, Lock } from "lucide-react";
import { useId, useState } from "react";

import { Callout } from "@/components/ui/callout";
import { Button } from "@/components/ui/button";
import { ChoiceGroup, TextAreaField, TextField } from "@/components/ui/field";
import {
  CESAREAN_DELIVERY_TYPES,
  DELIVERY_COMPLICATIONS,
  DELIVERY_COMPLICATION_LABELS,
  DELIVERY_TYPES,
  DELIVERY_TYPE_LABELS,
  HISTORY_CONDITIONS,
  HISTORY_CONDITION_DETAILS,
  HISTORY_CONDITION_LABELS,
  PERINEAL_OUTCOMES,
  PERINEAL_OUTCOME_LABELS,
  PREGNANCY_COMPLICATIONS,
  PREGNANCY_COMPLICATION_LABELS,
  PREVIOUS_PREGNANCY_COUNTS,
  PREVIOUS_PREGNANCY_LABELS,
  YES_NO_UNSURE,
  YES_NO_UNSURE_LABELS,
  isMedicalHistoryComplete,
  missingRequiredAnswers,
  type DeliveryComplication,
  type DeliveryType,
  type HistoryCondition,
  type MedicalHistory,
  type PerinealOutcome,
  type PregnancyComplication,
  type PreviousPregnancyCount,
  type YesNoUnsure,
} from "@/lib/medical-history/schema";

export const MEDICAL_HISTORY_PURPOSE = [
  "It decides which published education you see. A cesarean brings up incision care; a history of preeclampsia brings up blood-pressure follow-up.",
  "It is saved in this browser on this device. It is not sent anywhere, there is no account, and no one at Eunica Safe can read it.",
  "It never diagnoses you, never predicts a complication, and never decides that you are safe. It only chooses which education to show.",
  "You can change or delete any of it at any time, from Privacy and your data.",
];

/**
 * One multi-select answer, honouring the two exclusive options. Picking
 * "none of these" or "I am not sure" clears everything else, and picking
 * anything else clears those two.
 */
function toggleExclusive<T extends string>(
  next: readonly T[],
  previous: readonly T[],
  exclusives: readonly T[],
): T[] {
  const added = next.filter((value) => !previous.includes(value));
  const addedExclusive = added.find((value) => exclusives.includes(value as T));
  if (addedExclusive) return [addedExclusive];
  return next.filter((value) => !exclusives.includes(value));
}

const EXCLUSIVES = ["none", "not-sure"] as const;

type Props = {
  value: MedicalHistory;
  onChange: (next: MedicalHistory) => void;
  /** Rendered inside onboarding, where the surrounding flow owns navigation. */
  embedded?: boolean;
  /** Persists a completed history. Omitted when the parent owns saving. */
  onSave?: (history: MedicalHistory) => void;
};

export function MedicalHistoryForm({
  value,
  onChange,
  embedded = false,
  onSave,
}: Props) {
  const [showErrors, setShowErrors] = useState(false);
  const [savedAt, setSavedAt] = useState<string | null>(null);
  const consentId = useId();

  const missing = missingRequiredAnswers(value);
  const complete = isMedicalHistoryComplete(value);
  const isCesarean =
    value.deliveryType !== undefined &&
    CESAREAN_DELIVERY_TYPES.includes(value.deliveryType);
  const asksPerineal =
    value.deliveryType === "vaginal" ||
    value.deliveryType === "assisted" ||
    value.deliveryType === "vbac";

  function patch(changes: Partial<MedicalHistory>) {
    onChange({ ...value, ...changes, updatedAt: new Date().toISOString() });
  }

  function save() {
    if (!complete) {
      setShowErrors(true);
      return;
    }
    const now = new Date().toISOString();
    const completed = { ...value, completedAt: now, updatedAt: now };
    onChange(completed);
    setSavedAt(now);
    onSave?.(completed);
  }

  return (
    <div className="space-y-8">
      <Callout tone="note" title="Why we ask for this">
        <ul className="mt-1 space-y-1.5">
          {MEDICAL_HISTORY_PURPOSE.map((point) => (
            <li key={point} className="flex gap-2">
              <Lock aria-hidden="true" className="mt-1 size-3.5 shrink-0" />
              <span>{point}</span>
            </li>
          ))}
        </ul>
      </Callout>

      <fieldset className="space-y-6">
        <legend className="font-serif text-[length:var(--step-1)] font-semibold">
          Your pregnancy and birth
        </legend>

        <TextField
          label="When was your baby born?"
          type="date"
          optional={false}
          value={value.deliveryDate ?? ""}
          onChange={(event) => patch({ deliveryDate: event.target.value })}
          purpose="Sets where you are in recovery, which changes which education is most relevant."
          error={
            showErrors && !value.deliveryDate
              ? "Please add the date your baby was born."
              : undefined
          }
        />

        <ChoiceGroup
          legend="What kind of birth did you have?"
          name="delivery-type"
          options={DELIVERY_TYPES.map((id) => ({
            value: id,
            label: DELIVERY_TYPE_LABELS[id],
          }))}
          value={value.deliveryType ? [value.deliveryType] : []}
          onChange={(next) =>
            patch({ deliveryType: (next[0] as DeliveryType) ?? undefined })
          }
          error={
            showErrors && !value.deliveryType
              ? "Please choose the type of birth, or 'I am not sure'."
              : undefined
          }
        />

        {asksPerineal ? (
          <ChoiceGroup
            legend="Did you have a tear or an episiotomy?"
            help="This brings up the right healing information for stitches."
            name="perineal-outcome"
            options={PERINEAL_OUTCOMES.map((id) => ({
              value: id,
              label: PERINEAL_OUTCOME_LABELS[id],
            }))}
            value={value.perinealOutcome ? [value.perinealOutcome] : []}
            onChange={(next) =>
              patch({
                perinealOutcome: (next[0] as PerinealOutcome) ?? undefined,
              })
            }
          />
        ) : null}

        {isCesarean ? (
          <Callout tone="supportive" title="Incision care will be included">
            <p>
              Because you had a cesarean, your safety plan will include how to
              check the incision and which changes to report.
            </p>
          </Callout>
        ) : null}

        <ChoiceGroup
          legend="Had you been pregnant before this?"
          name="previous-pregnancies"
          options={PREVIOUS_PREGNANCY_COUNTS.map((id) => ({
            value: id,
            label: PREVIOUS_PREGNANCY_LABELS[id],
          }))}
          value={value.previousPregnancies ? [value.previousPregnancies] : []}
          onChange={(next) =>
            patch({
              previousPregnancies:
                (next[0] as PreviousPregnancyCount) ?? undefined,
            })
          }
        />

        <ChoiceGroup
          legend="Was your baby born early, before 37 weeks?"
          name="preterm"
          options={YES_NO_UNSURE.map((id) => ({
            value: id,
            label: YES_NO_UNSURE_LABELS[id],
          }))}
          value={value.pretermBirth ? [value.pretermBirth] : []}
          onChange={(next) =>
            patch({ pretermBirth: (next[0] as YesNoUnsure) ?? undefined })
          }
        />

        <ChoiceGroup
          legend="Did anything come up during your pregnancy?"
          name="pregnancy-complications"
          multiple
          options={PREGNANCY_COMPLICATIONS.map((id) => ({
            value: id,
            label: PREGNANCY_COMPLICATION_LABELS[id],
          }))}
          value={value.pregnancyComplications}
          onChange={(next) =>
            patch({
              pregnancyComplications: toggleExclusive(
                next as PregnancyComplication[],
                value.pregnancyComplications,
                EXCLUSIVES as readonly PregnancyComplication[],
              ),
            })
          }
        />

        <ChoiceGroup
          legend="Did anything come up during or just after delivery?"
          name="delivery-complications"
          multiple
          options={DELIVERY_COMPLICATIONS.map((id) => ({
            value: id,
            label: DELIVERY_COMPLICATION_LABELS[id],
          }))}
          value={value.deliveryComplications}
          onChange={(next) =>
            patch({
              deliveryComplications: toggleExclusive(
                next as DeliveryComplication[],
                value.deliveryComplications,
                EXCLUSIVES as readonly DeliveryComplication[],
              ),
            })
          }
        />
      </fieldset>

      <fieldset className="space-y-6">
        <legend className="font-serif text-[length:var(--step-1)] font-semibold">
          Your medical history
        </legend>

        <ChoiceGroup
          legend="Have you ever been told you have any of these?"
          help="Choose everything that applies. If you are not sure, say so — that is a useful answer, and a guess is not."
          name="conditions"
          multiple
          options={HISTORY_CONDITIONS.map((id) => ({
            value: id,
            label: HISTORY_CONDITION_LABELS[id],
            detail: HISTORY_CONDITION_DETAILS[id],
          }))}
          value={value.conditions}
          onChange={(next) =>
            patch({
              conditions: toggleExclusive(
                next as HistoryCondition[],
                value.conditions,
                EXCLUSIVES as readonly HistoryCondition[],
              ),
            })
          }
          error={
            showErrors && value.conditions.length === 0
              ? "Please choose any that apply, or 'None of these'."
              : undefined
          }
        />

        <TextAreaField
          label="Anything else your care team knows about"
          rows={3}
          value={value.otherConditions ?? ""}
          onChange={(event) => patch({ otherConditions: event.target.value })}
          hint="Conditions, surgeries, or anything you would want a clinician to know."
        />
      </fieldset>

      <fieldset className="space-y-6">
        <legend className="font-serif text-[length:var(--step-1)] font-semibold">
          Medicines and allergies
        </legend>

        <TextAreaField
          label="Medicines you are taking now"
          rows={3}
          value={value.currentMedications ?? ""}
          onChange={(event) =>
            patch({ currentMedications: event.target.value })
          }
          hint="Including anything over the counter, vitamins, and herbal remedies."
          purpose="Useful to read out in an emergency, when it is hard to remember."
        />

        <ChoiceGroup
          legend="Are you taking medicine for blood pressure?"
          name="bp-medication"
          options={YES_NO_UNSURE.map((id) => ({
            value: id,
            label: YES_NO_UNSURE_LABELS[id],
          }))}
          value={
            value.bloodPressureMedication ? [value.bloodPressureMedication] : []
          }
          onChange={(next) =>
            patch({
              bloodPressureMedication: (next[0] as YesNoUnsure) ?? undefined,
            })
          }
        />

        <TextAreaField
          label="Medicine allergies"
          rows={2}
          value={value.medicationAllergies ?? ""}
          onChange={(event) =>
            patch({ medicationAllergies: event.target.value })
          }
          hint="What happened, if you remember — a rash is different from trouble breathing."
        />

        <TextAreaField
          label="Other allergies"
          rows={2}
          value={value.otherAllergies ?? ""}
          onChange={(event) => patch({ otherAllergies: event.target.value })}
          hint="Latex, adhesives, foods, anything relevant in hospital."
        />
      </fieldset>

      <div className="border-rule border-t pt-6">
        <label
          htmlFor={consentId}
          className="border-rule-strong flex cursor-pointer items-start gap-3 rounded-[var(--radius-control)] border px-4 py-3.5"
        >
          <input
            id={consentId}
            type="checkbox"
            className="mt-1 size-5 shrink-0 accent-[color:var(--color-action)]"
            checked={Boolean(value.consentAcknowledgedAt)}
            onChange={(event) =>
              patch({
                consentAcknowledgedAt: event.target.checked
                  ? new Date().toISOString()
                  : undefined,
              })
            }
          />
          <span className="text-ink text-[0.97rem]">
            I understand this is saved in this browser on this device, that it
            is used to choose which education I see, and that Eunica Safe does
            not diagnose me or decide that I am safe.
          </span>
        </label>
        {showErrors && !value.consentAcknowledgedAt ? (
          <p
            role="alert"
            className="text-emergency-deep mt-2 text-[0.9rem] font-medium"
          >
            Please confirm this before saving.
          </p>
        ) : null}
      </div>

      {showErrors && missing.length > 0 ? (
        <Callout
          tone="warning"
          title="A few answers are still needed"
          assertive
        >
          <p>Still to answer: {missing.join("; ")}.</p>
        </Callout>
      ) : null}

      {embedded ? null : (
        <div className="border-rule flex flex-wrap items-center gap-3 border-t pt-6">
          <Button variant="primary" size="lg" onClick={save}>
            {savedAt ? (
              <>
                <Check aria-hidden="true" className="size-5" />
                Saved
              </>
            ) : (
              "Save my medical history"
            )}
          </Button>
          {savedAt ? (
            <p className="text-ink-muted text-[0.9rem]">
              Saved on this device.
            </p>
          ) : null}
        </div>
      )}
    </div>
  );
}
