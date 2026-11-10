import { ArrowRight, BookOpen, ClipboardList, Stethoscope } from "lucide-react";
import Link from "next/link";

import { Call911Button } from "@/components/safety/call-911";
import { ButtonLink } from "@/components/ui/button";
import { Band, PullQuote, Section } from "@/components/ui/section";
import { WARNING_SIGNS } from "@/content/warning-signs";
import { SCOPE_STATEMENT } from "@/lib/privacy/notices";

const ENTRY_POINTS = [
  {
    href: "/seek-care",
    icon: Stethoscope,
    title: "Should I seek care?",
    description:
      "Answer a short set of questions about one symptom and get a clear action: 911, emergency care now, call your care team, or watch closely.",
  },
  {
    href: "/warning-signs",
    icon: BookOpen,
    title: "Know the warning signs",
    description:
      "Nineteen postpartum warning signs in plain language — what they look like, why they matter, and what to do.",
  },
  {
    href: "/safety-plan",
    icon: ClipboardList,
    title: "Build your safety plan",
    description:
      "Save your hospital, your care team, and the people who can get to you, so you are not searching for numbers at 3am.",
  },
];

export default function LandingPage() {
  const emergencySigns = WARNING_SIGNS.filter(
    (sign) => sign.urgencyHint === "call-911",
  ).slice(0, 6);

  return (
    <>
      <div className="mx-auto w-full max-w-5xl px-5 pt-10 pb-12 sm:px-8 sm:pt-16">
        <div className="grid gap-10 lg:grid-cols-[1.35fr_1fr] lg:gap-16">
          <div>
            <p className="eyebrow">Postpartum safety, in plain language</p>
            <h1 className="display mt-4">
              You know your body.
              <br />
              This helps you act on it.
            </h1>
            <p className="text-ink-soft mt-6 max-w-[52ch] text-[1.15rem] leading-relaxed">
              Most serious postpartum complications give warning. Eunica Safe
              tells you which signs matter, helps you decide whether to seek
              care, and keeps the numbers you need where you can find them.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <ButtonLink href="/seek-care" variant="primary" size="lg">
                Should I seek care?
                <ArrowRight aria-hidden="true" className="size-5" />
              </ButtonLink>
              <ButtonLink href="/onboarding" variant="secondary" size="lg">
                Set up in three minutes
              </ButtonLink>
            </div>
            <p className="text-ink-muted mt-5 text-[0.9rem]">
              No account. No tracking. Everything you save stays on your device.
            </p>
          </div>

          <aside className="border-emergency bg-emergency-wash rounded-[var(--radius-editorial)] border-2 px-5 py-6">
            <p className="text-emergency-deep text-[0.78rem] font-semibold tracking-[0.1em] uppercase">
              If something is wrong right now
            </p>
            <h2 className="mt-2 font-serif text-[1.45rem] font-semibold">
              Do not wait to be sure
            </h2>
            <p className="text-ink-soft mt-2 text-[0.97rem]">
              Heavy bleeding, chest pain, trouble breathing, a seizure,
              fainting, or thoughts of harming yourself — call 911 now.
            </p>
            <div className="mt-5">
              <Call911Button />
            </div>
            <p className="text-ink-soft mt-3 text-[0.88rem]">
              <Link href="/emergency" className="link font-semibold">
                Other emergency and crisis numbers
              </Link>
            </p>
          </aside>
        </div>
      </div>

      <Band tone="ink">
        <p className="text-[0.78rem] font-semibold tracking-[0.14em] text-[color:var(--sand)] uppercase">
          Call 911 for any of these
        </p>
        <ul className="mt-5 grid gap-x-10 gap-y-3 sm:grid-cols-2">
          {emergencySigns.map((sign) => (
            <li
              key={sign.slug}
              className="border-t border-white/15 pt-3 text-[1rem]"
            >
              <Link
                href={`/warning-signs/${sign.slug}`}
                className="font-medium text-[color:var(--ink-inverse)] underline decoration-white/30 decoration-1 underline-offset-4 hover:decoration-white"
              >
                {sign.title}
              </Link>
              <p className="mt-1 text-[0.92rem] text-white/70">
                {sign.standfirst}
              </p>
            </li>
          ))}
        </ul>
        <p className="mt-6 text-[0.9rem] text-white/70">
          This is not a complete list, and nothing here can rule out an
          emergency.
        </p>
      </Band>

      <div className="mx-auto w-full max-w-5xl space-y-12 px-5 py-14 sm:px-8">
        <Section ruled={false} eyebrow="Start here" title="Three ways in">
          <ul className="index-list">
            {ENTRY_POINTS.map((item) => {
              const Icon = item.icon;
              return (
                <li key={item.href}>
                  <Link href={item.href} className="group flex gap-4 py-5">
                    <Icon
                      aria-hidden="true"
                      className="text-clay mt-1 size-5 shrink-0"
                    />
                    <span>
                      <span className="text-ink group-hover:text-clay-deep block font-serif text-[1.3rem] font-semibold group-hover:underline group-hover:decoration-1 group-hover:underline-offset-4">
                        {item.title}
                      </span>
                      <span className="text-ink-soft mt-1.5 block max-w-[62ch] text-[0.98rem]">
                        {item.description}
                      </span>
                    </span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </Section>

        <Section eyebrow="Why it exists">
          <div className="grid gap-8 lg:grid-cols-[1fr_1fr] lg:gap-14">
            <PullQuote attribution="Why we are careful about what this app claims">
              Being sent home does not mean you are safe. Knowing the words for
              what you are feeling is often what gets you taken seriously.
            </PullQuote>
            <div className="text-ink-soft space-y-4 text-[1rem] leading-relaxed">
              <p>
                Serious complications are most common in the first six weeks
                after birth, and they can happen up to a year later. Many of
                them are survivable when they are caught early.
              </p>
              <p>
                Eunica Safe is deliberately narrow. It will not diagnose you, it
                will not interpret your chart, and it will never tell you that
                you are fine.
              </p>
              <p>
                <Link href="/about" className="link font-semibold">
                  Read exactly what this app can and cannot do
                </Link>
              </p>
            </div>
          </div>
        </Section>

        <Section eyebrow="Limits" title="What this is not">
          <ul className="index-list">
            {SCOPE_STATEMENT.cannot.map((item) => (
              <li key={item} className="text-ink-soft py-3">
                {item}
              </li>
            ))}
          </ul>
        </Section>
      </div>
    </>
  );
}
