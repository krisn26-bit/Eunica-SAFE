import type { Metadata } from "next";

import { PageShell } from "@/components/layout/page-shell";
import { DataControls } from "@/components/privacy/data-controls";
import { Callout } from "@/components/ui/callout";
import { PageHeader, Prose, Section } from "@/components/ui/section";
import {
  DATA_HANDLING,
  DATA_RETENTION,
  LOCATION_EXPLAINER,
} from "@/lib/privacy/notices";
import { STORAGE_KEYS } from "@/lib/storage/local-store";

export const metadata: Metadata = {
  title: "Privacy and your data",
  description:
    "What Eunica Safe stores, where it stores it, and how to export or delete everything. No account, no server, no analytics.",
};

export default function PrivacyPage() {
  return (
    <PageShell>
      <PageHeader
        eyebrow="Privacy"
        title={DATA_HANDLING.headline}
        standfirst="Postpartum health information is sensitive. The safest way to handle it was to not collect it."
      />

      <Section ruled={false} eyebrow="In short">
        <ul className="index-list">
          {DATA_HANDLING.points.map((point) => (
            <li key={point} className="text-ink-soft py-3">
              {point}
            </li>
          ))}
        </ul>
      </Section>

      <Callout
        tone="serious"
        title="What local storage cannot protect you from"
      >
        <ul className="list-disc space-y-1.5 pl-5">
          {DATA_HANDLING.caveats.map((caveat) => (
            <li key={caveat}>{caveat}</li>
          ))}
        </ul>
      </Callout>

      <Section eyebrow="Location">
        <Prose>
          <p>{LOCATION_EXPLAINER}</p>
          <p>
            When you open a map search, your map provider receives the search
            terms, as it would for any search you typed there yourself. Eunica
            Safe sends nothing.
          </p>
        </Prose>
      </Section>

      <Section eyebrow="What is stored" title="Exactly what is kept, and where">
        <ul className="index-list">
          <li className="py-3">
            <p className="text-ink font-medium">Preferences</p>
            <p className="text-ink-soft text-[0.92rem]">
              Who is using the app and whether you agreed to a location lookup.
              Key{" "}
              <code className="text-[0.85rem]">{STORAGE_KEYS.preferences}</code>
            </p>
          </li>
          <li className="py-3">
            <p className="text-ink font-medium">Safety plan</p>
            <p className="text-ink-soft text-[0.92rem]">
              Hospital, care team, contacts, and the medical details you chose
              to write down. Key{" "}
              <code className="text-[0.85rem]">{STORAGE_KEYS.safetyPlan}</code>
            </p>
          </li>
          <li className="py-3">
            <p className="text-ink font-medium">Recovery notes</p>
            <p className="text-ink-soft text-[0.92rem]">
              Your daily entries and appointments. Key{" "}
              <code className="text-[0.85rem]">{STORAGE_KEYS.recovery}</code>
            </p>
          </li>
          <li className="py-3">
            <p className="text-ink font-medium">Saved location</p>
            <p className="text-ink-soft text-[0.92rem]">
              Only if you tap save on the care locator. Key{" "}
              <code className="text-[0.85rem]">{STORAGE_KEYS.location}</code>
            </p>
          </li>
        </ul>
        <p className="text-ink-soft mt-4 text-[0.95rem]">
          Your answers in the questionnaire are not stored at all. They live in
          the page while you use it and disappear when you close the tab, and
          they are never put in the web address.
        </p>
      </Section>

      <Section eyebrow="Your controls" title="Export or delete">
        <p className="text-ink-soft mb-6 max-w-[62ch]">
          {DATA_RETENTION.summary}
        </p>
        <DataControls />
      </Section>
    </PageShell>
  );
}
