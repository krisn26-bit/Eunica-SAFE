import type { Metadata } from "next";
import Link from "next/link";

import { PageShell } from "@/components/layout/page-shell";
import { Callout } from "@/components/ui/callout";
import { Disclosure } from "@/components/ui/disclosure";
import { PageHeader, Prose, Section } from "@/components/ui/section";
import { RESOURCE_CONTENT, WARNING_SIGN_CONTENT } from "@/content/meta";
import { SCOPE_STATEMENT } from "@/lib/privacy/notices";
import { RULES_REVIEW, SAFETY_RULES_VERSION } from "@/lib/safety-rules/rules";
import { formatLongDate } from "@/lib/utils";

export const metadata: Metadata = {
  title: "What this is and is not",
  description:
    "Eunica Safe is educational postpartum safety information. It does not diagnose, cannot examine you, and will never tell you that you are fine.",
};

export default function AboutPage() {
  return (
    <PageShell>
      <PageHeader
        eyebrow="About"
        title="What this is, and what it is not"
        standfirst="Read this before you rely on anything here. Knowing the limits is part of using it safely."
      />

      <Section ruled={false} eyebrow="Scope">
        <div className="grid gap-8 sm:grid-cols-2">
          <div>
            <h2 className="font-serif text-[1.2rem] font-semibold">
              What it can do
            </h2>
            <ul className="index-list mt-3">
              {SCOPE_STATEMENT.can.map((item) => (
                <li key={item} className="text-ink-soft py-2.5 text-[0.95rem]">
                  {item}
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h2 className="font-serif text-[1.2rem] font-semibold">
              What it cannot do
            </h2>
            <ul className="index-list mt-3">
              {SCOPE_STATEMENT.cannot.map((item) => (
                <li key={item} className="text-ink-soft py-2.5 text-[0.95rem]">
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </Section>

      <Callout tone="emergency" title="The rule we do not bend">
        <p>
          Eunica Safe will never tell you that you are fine, and it will never
          rule out an emergency. If a result says to watch and contact your care
          team, that means the answers you gave did not match an emergency rule
          — not that nothing is wrong.
        </p>
      </Callout>

      <Section
        eyebrow="How guidance is produced"
        title="A rule table, not a model"
      >
        <Prose>
          <p>
            The questionnaire compares your answers against a fixed list of
            published postpartum warning signs. There is no machine learning, no
            scoring, and no interpretation of your medical history. The same
            answers always produce the same result, and each result records the
            rule set version that produced it.
          </p>
          <p>
            Each symptom has a floor: guidance for it can never drop below a
            defined minimum, no matter what else you answer. Universal red flags
            — heavy bleeding, chest pain, trouble breathing, seizure, fainting,
            stroke symptoms, thoughts of harm, and immediate danger — override
            everything and go straight to 911.
          </p>
          <p>
            Current rule set: {SAFETY_RULES_VERSION} ({RULES_REVIEW.status}).
          </p>
        </Prose>
      </Section>

      <Section eyebrow="Content governance" title="Who checks this content">
        <div className="space-y-5">
          <div className="border-sand border-l-2 pl-4">
            <h3 className="font-serif text-[1.1rem] font-semibold">
              Warning sign library
            </h3>
            <p className="text-ink-soft mt-1 text-[0.95rem]">
              Version {WARNING_SIGN_CONTENT.version} · status{" "}
              {WARNING_SIGN_CONTENT.status} · updated{" "}
              {formatLongDate(WARNING_SIGN_CONTENT.lastUpdated)}
            </p>
            <p className="text-ink-muted mt-1 text-[0.9rem]">
              Owner: {WARNING_SIGN_CONTENT.owner}. Review cadence:{" "}
              {WARNING_SIGN_CONTENT.reviewCadence.toLowerCase()}.
            </p>
          </div>
          <div className="border-sand border-l-2 pl-4">
            <h3 className="font-serif text-[1.1rem] font-semibold">
              Support directory
            </h3>
            <p className="text-ink-soft mt-1 text-[0.95rem]">
              Version {RESOURCE_CONTENT.version} · status{" "}
              {RESOURCE_CONTENT.status} · updated{" "}
              {formatLongDate(RESOURCE_CONTENT.lastUpdated)}
            </p>
            <p className="text-ink-muted mt-1 text-[0.9rem]">
              Owner: {RESOURCE_CONTENT.owner}. Review cadence:{" "}
              {RESOURCE_CONTENT.reviewCadence.toLowerCase()}.
            </p>
          </div>
          <p className="text-ink-soft text-[0.95rem]">
            Nothing in this build has been signed off by a clinician. Until it
            is, every page that carries clinical content is labelled as draft.
          </p>
        </div>
      </Section>

      <Disclosure summary="Why there are no hospital listings">
        <p>
          No verified facility dataset is connected in this build. Listing a
          hospital we cannot verify would be worse than listing none, because a
          wrong address or a closed maternity unit costs time in an emergency.
          Searches are handed to your own map application instead.
        </p>
      </Disclosure>

      <Disclosure summary="Why there is no chatbot">
        <p>
          A conversational assistant would invite exactly the question this app
          must not answer: &ldquo;is this serious?&rdquo; told in free text,
          interpreted by a model, with no way to audit what it said. Structured
          questions and a reviewable rule table can be checked by a clinician.
        </p>
      </Disclosure>

      <Section eyebrow="Your data">
        <p className="text-ink-soft max-w-[62ch]">
          There is no account and no server storing your health details.{" "}
          <Link href="/privacy" className="link font-semibold">
            Read how your data is handled
          </Link>
          .
        </p>
      </Section>
    </PageShell>
  );
}
