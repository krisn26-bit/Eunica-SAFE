"use client";

import { ButtonLink } from "@/components/ui/button";
import { STORAGE_KEYS } from "@/lib/storage/local-store";
import { useStoredRecord } from "@/lib/storage/use-stored-record";
import { formatDateTime, formatLongDate, parseDateOnly } from "@/lib/utils";
import {
  BLEEDING_LABELS,
  EMPTY_RECOVERY_LOG,
  MOOD_LABELS,
  recoveryLogSchema,
} from "@/lib/validation/schemas";

export function RecoverySnapshot() {
  const { value: log, isReady } = useStoredRecord(
    STORAGE_KEYS.recovery,
    recoveryLogSchema,
    EMPTY_RECOVERY_LOG,
  );

  if (!isReady) return null;

  const latest = log.entries[0];
  const startOfToday = new Date();
  startOfToday.setHours(0, 0, 0, 0);
  const upcoming = log.appointments
    .filter((item) => {
      const date = parseDateOnly(item.date);
      return date !== null && date.getTime() >= startOfToday.getTime();
    })
    .slice(0, 2);

  if (!latest && upcoming.length === 0) {
    return (
      <div>
        <h2 className="eyebrow mb-2">Your recovery notes</h2>
        <p className="text-ink-soft">
          Nothing recorded yet. A short daily note makes it much easier to
          describe changes to your care team.
        </p>
        <p className="mt-3">
          <ButtonLink href="/recovery" variant="secondary" size="sm">
            Add today&rsquo;s entry
          </ButtonLink>
        </p>
      </div>
    );
  }

  return (
    <div>
      <h2 className="eyebrow mb-3">Your recovery notes</h2>
      {latest ? (
        <div className="border-sage border-l-2 pl-4">
          <p className="text-ink-muted text-[0.82rem] tracking-[0.08em] uppercase">
            Last entry · {formatDateTime(latest.createdAt)}
          </p>
          <p className="text-ink-soft mt-1 text-[0.97rem]">
            {[
              typeof latest.painLevel === "number"
                ? `Pain ${latest.painLevel} of 10`
                : null,
              latest.bleeding ? BLEEDING_LABELS[latest.bleeding] : null,
              latest.mood ? MOOD_LABELS[latest.mood] : null,
              latest.temperature ? `Temperature ${latest.temperature}` : null,
            ]
              .filter(Boolean)
              .join(" · ") || "Notes only"}
          </p>
        </div>
      ) : null}

      {upcoming.length > 0 ? (
        <div className="mt-4">
          <p className="text-ink-muted text-[0.82rem] tracking-[0.08em] uppercase">
            Coming up
          </p>
          <ul className="text-ink-soft mt-1 space-y-1 text-[0.97rem]">
            {upcoming.map((item) => (
              <li key={item.id}>
                {item.title} — {formatLongDate(item.date)}
                {item.time ? ` at ${item.time}` : ""}
              </li>
            ))}
          </ul>
        </div>
      ) : null}

      <p className="mt-4">
        <ButtonLink href="/recovery" variant="secondary" size="sm">
          Open my recovery tracker
        </ButtonLink>
      </p>
    </div>
  );
}
