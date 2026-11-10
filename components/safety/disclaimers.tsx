import Link from "next/link";

import { Callout } from "@/components/ui/callout";
import { DRAFT_CONTENT_NOTE, type ContentProvenance } from "@/content/meta";
import {
  EMERGENCY_DISCLAIMER,
  MEDICAL_DISCLAIMER,
} from "@/lib/privacy/notices";
import { formatLongDate } from "@/lib/utils";

export function MedicalDisclaimer({ className }: { className?: string }) {
  return (
    <Callout tone="note" title="How to use this" className={className}>
      <p>
        {MEDICAL_DISCLAIMER}{" "}
        <Link href="/about">What this app can and cannot do</Link>.
      </p>
    </Callout>
  );
}

export function EmergencyDisclaimer({ className }: { className?: string }) {
  return (
    <Callout
      tone="emergency"
      title="If this is an emergency"
      className={className}
    >
      <p>{EMERGENCY_DISCLAIMER}</p>
    </Callout>
  );
}

/** Content status is shown wherever clinical content appears (spec §10, §11). */
export function ProvenanceNote({
  provenance,
  className,
}: {
  provenance: ContentProvenance;
  className?: string;
}) {
  const reviewed = provenance.status === "clinician-reviewed";

  return (
    <Callout
      tone={reviewed ? "note" : "warning"}
      title={
        reviewed ? "Clinician reviewed" : "Draft content — not yet reviewed"
      }
      className={className}
    >
      <p>
        {reviewed
          ? `Reviewed by ${provenance.reviewer ?? "the clinical reviewer"}${
              provenance.reviewedOn
                ? ` on ${formatLongDate(provenance.reviewedOn)}`
                : ""
            }.`
          : DRAFT_CONTENT_NOTE}
      </p>
      <p className="text-ink-muted mt-2 text-[0.85rem]">
        Version {provenance.version} · Updated{" "}
        {formatLongDate(provenance.lastUpdated)} · Reviewed{" "}
        {provenance.reviewCadence.toLowerCase()}
      </p>
    </Callout>
  );
}
