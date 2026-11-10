"use client";

import { Hospital, Phone, UserRound } from "lucide-react";

import { ActionLink, ButtonLink } from "@/components/ui/button";
import { Callout } from "@/components/ui/callout";
import { STORAGE_KEYS } from "@/lib/storage/local-store";
import { useStoredRecord } from "@/lib/storage/use-stored-record";
import {
  EMPTY_SAFETY_PLAN,
  safetyPlanSchema,
  type SafetyPlan,
} from "@/lib/validation/schemas";
import { cn, telHref } from "@/lib/utils";

type Entry = {
  key: string;
  icon: typeof Phone;
  label: string;
  name?: string;
  detail?: string;
  phone?: string;
};

function entriesFrom(plan: SafetyPlan): Entry[] {
  return [
    {
      key: "provider",
      icon: UserRound,
      label: "Your care team",
      name: plan.provider.name,
      detail: plan.provider.afterHoursPhone
        ? `After hours: ${plan.provider.afterHoursPhone}`
        : plan.provider.role,
      phone: plan.provider.phone ?? plan.provider.afterHoursPhone,
    },
    {
      key: "hospital",
      icon: Hospital,
      label: "Your hospital",
      name: plan.hospital.name,
      detail: plan.hospital.address,
      phone: plan.hospital.phone,
    },
    {
      key: "emergency-contact",
      icon: Phone,
      label: "Emergency contact",
      name: plan.emergencyContact.name,
      detail: plan.emergencyContact.relationship,
      phone: plan.emergencyContact.phone,
    },
    {
      key: "backup-contact",
      icon: Phone,
      label: "Backup contact",
      name: plan.backupContact.name,
      detail: plan.backupContact.relationship,
      phone: plan.backupContact.phone,
    },
  ].filter((entry) => entry.name || entry.phone);
}

/**
 * Surfaces the numbers the user saved so they do not have to remember them in
 * a hard moment. Reads only from this device.
 */
export function SavedContacts({
  className,
  heading = "Your saved numbers",
}: {
  className?: string;
  heading?: string;
}) {
  const { value: plan, isReady } = useStoredRecord(
    STORAGE_KEYS.safetyPlan,
    safetyPlanSchema,
    EMPTY_SAFETY_PLAN,
  );

  const entries = entriesFrom(plan);

  if (!isReady) {
    return (
      <div className={cn("text-ink-muted text-[0.95rem]", className)}>
        <p>Checking this device for your saved numbers…</p>
      </div>
    );
  }

  if (entries.length === 0) {
    return (
      <Callout
        tone="supportive"
        title="Nothing saved yet"
        className={className}
      >
        <p>
          Add your hospital, your care team, and one person who can get to you.
          It takes a few minutes now and saves you searching later.
        </p>
        <p className="mt-3">
          <ButtonLink href="/safety-plan" variant="secondary" size="sm">
            Start my safety plan
          </ButtonLink>
        </p>
      </Callout>
    );
  }

  return (
    <div className={className}>
      <h2 className="eyebrow mb-2">{heading}</h2>
      <ul className="index-list">
        {entries.map((entry) => {
          const Icon = entry.icon;
          return (
            <li key={entry.key} className="py-3.5">
              <div className="flex items-start gap-3">
                <Icon
                  aria-hidden="true"
                  className="text-brand mt-1 size-4 shrink-0"
                />
                <div className="min-w-0 flex-1">
                  <p className="text-ink-muted text-[0.78rem] tracking-[0.1em] uppercase">
                    {entry.label}
                  </p>
                  <p className="text-ink font-medium">
                    {entry.name ?? "Saved number"}
                  </p>
                  {entry.detail ? (
                    <p className="text-ink-muted text-[0.9rem]">
                      {entry.detail}
                    </p>
                  ) : null}
                </div>
                {entry.phone ? (
                  <ActionLink
                    href={telHref(entry.phone)}
                    variant="secondary"
                    size="sm"
                  >
                    <Phone aria-hidden="true" className="size-4" />
                    Call
                  </ActionLink>
                ) : null}
              </div>
            </li>
          );
        })}
      </ul>
      <p className="text-ink-muted mt-3 text-[0.85rem]">
        Saved on this device only.{" "}
        <ButtonLink href="/safety-plan" variant="quiet" size="sm">
          Edit your safety plan
        </ButtonLink>
      </p>
    </div>
  );
}
