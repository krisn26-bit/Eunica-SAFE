"use client";

import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

import { MedicalHistoryForm } from "@/components/medical-history/medical-history-form";
import { Callout } from "@/components/ui/callout";
import {
  EMPTY_MEDICAL_HISTORY,
  isMedicalHistoryComplete,
  medicalHistorySchema,
  type MedicalHistory,
} from "@/lib/medical-history/schema";
import { STORAGE_KEYS } from "@/lib/storage/local-store";
import { useStoredRecord } from "@/lib/storage/use-stored-record";

/** Loads the stored history, edits a local draft, and writes it back on save. */
export function MedicalHistoryEditor() {
  const { value, save, isReady } = useStoredRecord(
    STORAGE_KEYS.medicalHistory,
    medicalHistorySchema,
    EMPTY_MEDICAL_HISTORY,
  );
  const [draft, setDraft] = useState<MedicalHistory | null>(null);
  const [justSaved, setJustSaved] = useState(false);

  // Edits win over the stored record once there are any; before that the
  // stored record seeds the form, as soon as hydration delivers it.
  const current = draft ?? (isReady ? value : null);

  if (!current) {
    return (
      <div
        aria-hidden="true"
        className="border-rule bg-brand-wash h-64 animate-pulse rounded-[var(--radius-editorial)] border"
      />
    );
  }

  return (
    <div className="space-y-6">
      {justSaved ? (
        <Callout tone="supportive" title="Saved on this device" assertive>
          <p>
            Your safety plan now shows the education that matches your answers.
          </p>
          <p className="mt-2">
            <Link href="/safety-plan" className="link font-semibold">
              Go to my safety plan
              <ArrowRight aria-hidden="true" className="ml-1 inline size-4" />
            </Link>
          </p>
        </Callout>
      ) : null}

      <MedicalHistoryForm
        value={current}
        onChange={(next) => {
          setDraft(next);
          setJustSaved(false);
        }}
        onSave={(history) => {
          save(history);
          setJustSaved(true);
        }}
      />

      {isMedicalHistoryComplete(current) ? null : (
        <p className="text-ink-muted text-[0.9rem]">
          Your hospital, care team, and emergency contacts work without this.
          Only the personalised education waits on it.
        </p>
      )}
    </div>
  );
}
