import type { Metadata } from "next";
import {
  ArrowRight,
  BookOpen,
  HeartHandshake,
  MapPin,
  NotebookPen,
  Stethoscope,
} from "lucide-react";
import Link from "next/link";

import { PostpartumStrip } from "@/components/dashboard/postpartum-strip";
import { RecoverySnapshot } from "@/components/dashboard/recovery-snapshot";
import { PageShell } from "@/components/layout/page-shell";
import { Call911Button } from "@/components/safety/call-911";
import { SavedContacts } from "@/components/safety/saved-contacts";
import { ButtonLink } from "@/components/ui/button";
import { PageHeader, Section } from "@/components/ui/section";

export const metadata: Metadata = {
  title: "Home",
  description:
    "Your postpartum home screen: emergency access, warning signs, the care questionnaire, your safety plan, and your recovery notes.",
};

const SHORTCUTS = [
  {
    href: "/seek-care",
    icon: Stethoscope,
    title: "Should I seek care?",
    description: "Answer a few questions about one symptom.",
  },
  {
    href: "/warning-signs",
    icon: BookOpen,
    title: "Warning signs",
    description: "Look up a symptom and what to do about it.",
  },
  {
    href: "/care-locator",
    icon: MapPin,
    title: "Find care near you",
    description: "Emergency departments, maternity units, urgent care.",
  },
  {
    href: "/recovery",
    icon: NotebookPen,
    title: "Recovery tracker",
    description: "Record how today went, in your own words.",
  },
  {
    href: "/resources",
    icon: HeartHandshake,
    title: "Support directory",
    description: "Crisis lines, mental health, feeding, and practical help.",
  },
];

export default function DashboardPage() {
  return (
    <PageShell width="wide">
      <PageHeader
        eyebrow="Your home screen"
        title="What do you need right now?"
        standfirst="Emergency help is at the top of every screen. Everything you save stays on this device."
      />

      <PostpartumStrip />

      <section className="border-emergency bg-emergency-wash rounded-[var(--radius-editorial)] border-2 px-5 py-6">
        <h2 className="font-serif text-[1.35rem] font-semibold">
          If something feels seriously wrong
        </h2>
        <p className="text-ink-soft mt-2 max-w-[60ch] text-[0.98rem]">
          Do not wait to be certain, and do not drive yourself if you feel
          unwell.
        </p>
        <div className="mt-5">
          <Call911Button />
        </div>
        <p className="mt-3 text-[0.9rem]">
          <Link href="/emergency" className="link font-semibold">
            Crisis and emergency numbers
          </Link>
        </p>
      </section>

      <Section eyebrow="Quick access" title="Go straight to">
        <ul className="index-list">
          {SHORTCUTS.map((item) => {
            const Icon = item.icon;
            return (
              <li key={item.href}>
                <Link href={item.href} className="group flex gap-4 py-4">
                  <Icon
                    aria-hidden="true"
                    className="text-brand mt-1 size-5 shrink-0"
                  />
                  <span className="flex-1">
                    <span className="text-ink group-hover:text-brand-deep block font-serif text-[1.15rem] font-semibold group-hover:underline group-hover:decoration-1 group-hover:underline-offset-4">
                      {item.title}
                    </span>
                    <span className="text-ink-soft mt-1 block text-[0.95rem]">
                      {item.description}
                    </span>
                  </span>
                  <ArrowRight
                    aria-hidden="true"
                    className="text-ink-muted mt-1.5 size-4 shrink-0"
                  />
                </Link>
              </li>
            );
          })}
        </ul>
      </Section>

      <Section eyebrow="Your plan">
        <div className="grid gap-10 lg:grid-cols-2">
          <SavedContacts />
          <RecoverySnapshot />
        </div>
      </Section>

      <Section eyebrow="Your data" title="Kept on this device">
        <p className="text-ink-soft max-w-[62ch]">
          Eunica Safe has no account and no server storing your health details.
          You can export or delete everything at any time.
        </p>
        <p className="mt-4">
          <ButtonLink href="/privacy" variant="secondary" size="sm">
            Privacy and data controls
          </ButtonLink>
        </p>
      </Section>
    </PageShell>
  );
}
