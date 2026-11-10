"use client";

import { CalendarPlus, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Callout } from "@/components/ui/callout";
import {
  ChoiceGroup,
  FieldShell,
  TextAreaField,
  TextField,
} from "@/components/ui/field";
import { Section } from "@/components/ui/section";
import { recoveryPrompts } from "@/lib/recovery/prompts";
import { setSeekCareHandoff } from "@/lib/seek-care/handoff";
import { STORAGE_KEYS } from "@/lib/storage/local-store";
import { useStoredRecord } from "@/lib/storage/use-stored-record";
import { createId, formatDateTime, formatLongDate } from "@/lib/utils";
import {
  BLEEDING_LABELS,
  BLEEDING_OBSERVATIONS,
  EMPTY_RECOVERY_LOG,
  MOODS,
  MOOD_LABELS,
  recoveryLogSchema,
  type BleedingObservation,
  type Mood,
} from "@/lib/validation/schemas";

const EMPTY_DRAFT = {
  painLevel: "",
  bleeding: "" as BleedingObservation | "",
  temperature: "",
  mood: "" as Mood | "",
  notes: "",
  questionsForCareTeam: "",
};

export function RecoveryTracker() {
  const router = useRouter();
  const log = useStoredRecord(
    STORAGE_KEYS.recovery,
    recoveryLogSchema,
    EMPTY_RECOVERY_LOG,
  );
  const [draft, setDraft] = useState(EMPTY_DRAFT);
  const [saved, setSaved] = useState(false);
  const [appointment, setAppointment] = useState({
    title: "",
    date: "",
    time: "",
    location: "",
  });
  const [appointmentError, setAppointmentError] = useState<string | null>(null);

  const painNumber =
    draft.painLevel === "" ? undefined : Number(draft.painLevel);

  const prompts = recoveryPrompts({
    painLevel: painNumber,
    bleeding: draft.bleeding === "" ? undefined : draft.bleeding,
    temperature: draft.temperature || undefined,
    mood: draft.mood === "" ? undefined : draft.mood,
  });

  function saveEntry() {
    log.update((current) => ({
      ...current,
      entries: [
        {
          id: createId("entry"),
          createdAt: new Date().toISOString(),
          painLevel: painNumber,
          bleeding: draft.bleeding === "" ? undefined : draft.bleeding,
          temperature: draft.temperature || undefined,
          mood: draft.mood === "" ? undefined : draft.mood,
          notes: draft.notes || undefined,
          questionsForCareTeam: draft.questionsForCareTeam || undefined,
        },
        ...current.entries,
      ].slice(0, 200),
    }));
    setDraft(EMPTY_DRAFT);
    setSaved(true);
    window.setTimeout(() => setSaved(false), 4000);
  }

  function addAppointment() {
    if (!appointment.title.trim() || !appointment.date) {
      setAppointmentError("Add a short name and a date.");
      return;
    }
    setAppointmentError(null);
    log.update((current) => ({
      ...current,
      appointments: [
        ...current.appointments,
        {
          id: createId("appt"),
          title: appointment.title.trim(),
          date: appointment.date,
          time: appointment.time || undefined,
          location: appointment.location || undefined,
        },
      ].sort((a, b) => a.date.localeCompare(b.date)),
    }));
    setAppointment({ title: "", date: "", time: "", location: "" });
  }

  function removeEntry(id: string) {
    log.update((current) => ({
      ...current,
      entries: current.entries.filter((entry) => entry.id !== id),
    }));
  }

  function removeAppointment(id: string) {
    log.update((current) => ({
      ...current,
      appointments: current.appointments.filter((item) => item.id !== id),
    }));
  }

  return (
    <div className="space-y-10">
      <Section
        ruled={false}
        eyebrow="Today"
        title="How is recovery going?"
        standfirst="Nothing here is scored or interpreted. It is a record in your own words, so you can describe changes accurately to your care team."
      >
        <div className="space-y-7">
          <FieldShell label="Pain right now" htmlFor="pain-level">
            <div className="flex items-center gap-4">
              <input
                id="pain-level"
                type="range"
                min={0}
                max={10}
                step={1}
                value={draft.painLevel === "" ? 0 : draft.painLevel}
                onChange={(event) =>
                  setDraft((d) => ({ ...d, painLevel: event.target.value }))
                }
                className="h-11 flex-1 accent-[color:var(--color-action)]"
                aria-describedby="pain-level-value"
              />
              <output
                id="pain-level-value"
                htmlFor="pain-level"
                className="text-ink w-28 text-right font-sans text-[0.95rem]"
              >
                {draft.painLevel === ""
                  ? "Not recorded"
                  : `${draft.painLevel} out of 10`}
              </output>
            </div>
          </FieldShell>

          <ChoiceGroup
            legend="Bleeding compared with yesterday"
            name="bleeding"
            options={BLEEDING_OBSERVATIONS.map((value) => ({
              value,
              label: BLEEDING_LABELS[value],
            }))}
            value={draft.bleeding ? [draft.bleeding] : []}
            onChange={(next) =>
              setDraft((d) => ({
                ...d,
                bleeding: (next[0] as BleedingObservation) ?? "",
              }))
            }
          />

          <TextField
            label="Temperature"
            inputMode="decimal"
            placeholder="For example 99.2 F or 37.5 C"
            value={draft.temperature}
            onChange={(event) =>
              setDraft((d) => ({ ...d, temperature: event.target.value }))
            }
            hint="Maternity teams use 100.4°F (38°C) as the threshold for postpartum fever."
          />

          <ChoiceGroup
            legend="How you are feeling"
            name="mood"
            options={MOODS.map((value) => ({
              value,
              label: MOOD_LABELS[value],
            }))}
            value={draft.mood ? [draft.mood] : []}
            onChange={(next) =>
              setDraft((d) => ({ ...d, mood: (next[0] as Mood) ?? "" }))
            }
          />

          <TextAreaField
            label="Notes"
            placeholder="What changed today, what helped, what worried you."
            value={draft.notes}
            onChange={(event) =>
              setDraft((d) => ({ ...d, notes: event.target.value }))
            }
          />

          <TextAreaField
            label="Questions for your care team"
            placeholder="Anything you want to remember to ask."
            rows={3}
            value={draft.questionsForCareTeam}
            onChange={(event) =>
              setDraft((d) => ({
                ...d,
                questionsForCareTeam: event.target.value,
              }))
            }
          />

          {prompts.length > 0 ? (
            <div className="space-y-3">
              {prompts.map((prompt) => (
                <Callout
                  key={prompt.id}
                  tone="serious"
                  title="Worth a call"
                  assertive
                >
                  <p>{prompt.message}</p>
                  {prompt.symptomId ? (
                    <p className="mt-3">
                      <Button
                        variant="secondary"
                        size="sm"
                        onClick={() => {
                          setSeekCareHandoff(prompt.symptomId as string);
                          router.push("/seek-care");
                        }}
                      >
                        Answer questions about this
                      </Button>
                    </p>
                  ) : null}
                </Callout>
              ))}
            </div>
          ) : null}

          <div className="flex flex-wrap items-center gap-3">
            <Button variant="primary" size="lg" onClick={saveEntry}>
              Save today&rsquo;s entry
            </Button>
            <p aria-live="polite" className="text-ink-muted text-[0.9rem]">
              {saved
                ? "Saved to this device."
                : "Saved on this device only, never uploaded."}
            </p>
          </div>
        </div>
      </Section>

      <Section eyebrow="Appointments" title="Visits to remember">
        <div className="space-y-5">
          <TextField
            label="What is it"
            optional={false}
            placeholder="Six-week postpartum visit"
            value={appointment.title}
            onChange={(event) =>
              setAppointment((a) => ({ ...a, title: event.target.value }))
            }
          />
          <div className="grid gap-5 sm:grid-cols-2">
            <TextField
              label="Date"
              optional={false}
              type="date"
              value={appointment.date}
              onChange={(event) =>
                setAppointment((a) => ({ ...a, date: event.target.value }))
              }
            />
            <TextField
              label="Time"
              type="time"
              value={appointment.time}
              onChange={(event) =>
                setAppointment((a) => ({ ...a, time: event.target.value }))
              }
            />
          </div>
          <TextField
            label="Where"
            placeholder="Clinic name or address"
            value={appointment.location}
            onChange={(event) =>
              setAppointment((a) => ({ ...a, location: event.target.value }))
            }
          />
          {appointmentError ? (
            <p
              role="alert"
              className="text-emergency-deep text-[0.9rem] font-medium"
            >
              {appointmentError}
            </p>
          ) : null}
          <Button variant="secondary" onClick={addAppointment}>
            <CalendarPlus aria-hidden="true" className="size-4" />
            Add appointment
          </Button>

          {log.value.appointments.length > 0 ? (
            <ul className="index-list">
              {log.value.appointments.map((item) => (
                <li
                  key={item.id}
                  className="flex items-start justify-between gap-4 py-3.5"
                >
                  <div>
                    <p className="text-ink font-medium">{item.title}</p>
                    <p className="text-ink-muted text-[0.9rem]">
                      {formatLongDate(item.date)}
                      {item.time ? ` · ${item.time}` : ""}
                      {item.location ? ` · ${item.location}` : ""}
                    </p>
                  </div>
                  <Button
                    variant="quiet"
                    size="sm"
                    onClick={() => removeAppointment(item.id)}
                  >
                    <Trash2 aria-hidden="true" className="size-4" />
                    <span className="sr-only">Remove {item.title}</span>
                  </Button>
                </li>
              ))}
            </ul>
          ) : null}
        </div>
      </Section>

      <Section eyebrow="History" title="What you have recorded">
        {log.value.entries.length === 0 ? (
          <p className="text-ink-soft">
            Nothing recorded yet. One short entry a day is enough to notice a
            pattern.
          </p>
        ) : (
          <ul className="index-list">
            {log.value.entries.map((entry) => (
              <li key={entry.id} className="py-4">
                <div className="flex items-start justify-between gap-4">
                  <p className="text-ink-muted text-[0.82rem] tracking-[0.08em] uppercase">
                    {formatDateTime(entry.createdAt)}
                  </p>
                  <Button
                    variant="quiet"
                    size="sm"
                    onClick={() => removeEntry(entry.id)}
                  >
                    <Trash2 aria-hidden="true" className="size-4" />
                    <span className="sr-only">Delete this entry</span>
                  </Button>
                </div>
                <dl className="text-ink-soft mt-2 grid gap-x-6 gap-y-1 text-[0.95rem] sm:grid-cols-2">
                  {typeof entry.painLevel === "number" ? (
                    <div>
                      <dt className="text-ink inline font-medium">Pain: </dt>
                      <dd className="inline">{entry.painLevel} of 10</dd>
                    </div>
                  ) : null}
                  {entry.bleeding ? (
                    <div>
                      <dt className="text-ink inline font-medium">
                        Bleeding:{" "}
                      </dt>
                      <dd className="inline">
                        {BLEEDING_LABELS[entry.bleeding]}
                      </dd>
                    </div>
                  ) : null}
                  {entry.temperature ? (
                    <div>
                      <dt className="text-ink inline font-medium">
                        Temperature:{" "}
                      </dt>
                      <dd className="inline">{entry.temperature}</dd>
                    </div>
                  ) : null}
                  {entry.mood ? (
                    <div>
                      <dt className="text-ink inline font-medium">Feeling: </dt>
                      <dd className="inline">{MOOD_LABELS[entry.mood]}</dd>
                    </div>
                  ) : null}
                </dl>
                {entry.notes ? (
                  <p className="text-ink-soft mt-2 text-[0.95rem]">
                    {entry.notes}
                  </p>
                ) : null}
                {entry.questionsForCareTeam ? (
                  <p className="text-ink-soft mt-2 text-[0.95rem]">
                    <span className="text-ink font-medium">To ask: </span>
                    {entry.questionsForCareTeam}
                  </p>
                ) : null}
              </li>
            ))}
          </ul>
        )}
      </Section>
    </div>
  );
}
