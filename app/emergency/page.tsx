import type { Metadata } from "next";

import { PageShell } from "@/components/layout/page-shell";
import { Call911Button, CrisisLineList } from "@/components/safety/call-911";
import { SavedContacts } from "@/components/safety/saved-contacts";
import { ButtonLink } from "@/components/ui/button";
import { Callout } from "@/components/ui/callout";
import { PageHeader, Section, StepList } from "@/components/ui/section";

export const metadata: Metadata = {
  title: "Emergency help",
  description:
    "Call 911, reach a crisis line, use the numbers you saved, and know what to say.",
};

export default function EmergencyPage() {
  return (
    <PageShell>
      <PageHeader
        eyebrow="Emergency"
        title="Get help now"
        standfirst="Call first, read second. You do not need to work out what is wrong before you call."
      />

      <section className="border-emergency bg-emergency-wash rounded-[var(--radius-editorial)] border-2 px-5 py-6">
        <Call911Button />
        <p className="text-ink-soft mt-4 text-[0.97rem]">
          Tell them you gave birth recently and describe what is happening. Stay
          on the line. If you are alone with your baby, unlock the door if you
          can.
        </p>
      </section>

      <Callout tone="warning" title="Do not drive yourself">
        <p>
          If you are bleeding heavily, faint, in severe pain, or struggling to
          breathe, driving puts you and anyone with you at risk. Call 911 or
          have someone else drive.
        </p>
      </Callout>

      <Section ruled={false} eyebrow="Crisis and support lines">
        <CrisisLineList />
      </Section>

      <Section eyebrow="Your numbers">
        <SavedContacts heading="Saved on this device" />
      </Section>

      <Section eyebrow="What to say">
        <StepList
          items={[
            "I gave birth on [date] — I am [number] days postpartum.",
            "I am experiencing [what you are noticing] and it started [when].",
            "It is getting [worse / better / staying the same].",
            "I need to be assessed now.",
            'If you are brushed off: ask directly, "Could this be a postpartum emergency, and what should make me come back?" Ask for the answer in writing.',
          ]}
        />
      </Section>

      <Section eyebrow="Where to go">
        <p className="text-ink-soft max-w-[62ch]">
          Emergency departments are open around the clock and can treat heavy
          bleeding, blood-pressure emergencies, clots, and infection. Urgent
          care cannot.
        </p>
        <p className="mt-4">
          <ButtonLink href="/care-locator" variant="secondary" size="lg">
            Find the nearest emergency care
          </ButtonLink>
        </p>
      </Section>
    </PageShell>
  );
}
