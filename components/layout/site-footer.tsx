import Link from "next/link";

import { EunicaLogo } from "@/components/brand/logo";
import { WARNING_SIGN_CONTENT } from "@/content/meta";
import { MEDICAL_DISCLAIMER } from "@/lib/privacy/notices";
import { SAFETY_RULES_VERSION } from "@/lib/safety-rules/rules";

const COLUMNS = [
  {
    heading: "Know the signs",
    links: [
      { href: "/warning-signs", label: "Warning sign library" },
      { href: "/seek-care", label: "Should I seek care?" },
      { href: "/emergency", label: "Emergency help" },
    ],
  },
  {
    heading: "Get ready",
    links: [
      { href: "/safety-plan", label: "My safety plan" },
      { href: "/medical-history", label: "My medical history" },
      { href: "/recovery", label: "Recovery tracker" },
      { href: "/care-locator", label: "Find care near you" },
    ],
  },
  {
    heading: "About",
    links: [
      { href: "/about", label: "What this is and is not" },
      { href: "/privacy", label: "Privacy and your data" },
      { href: "/resources", label: "Support directory" },
    ],
  },
];

export function SiteFooter() {
  return (
    <footer className="border-rule-strong mt-16 border-t bg-[color:var(--parchment-deep)]">
      <div className="mx-auto w-full max-w-5xl px-5 py-10 sm:px-8">
        <div className="border-rule mb-8 border-b pb-8">
          <EunicaLogo showTagline markClassName="size-11" />
          <p className="text-ink-muted mt-3 max-w-[48ch] text-[0.85rem]">
            Named for Eunica, and built so the next mother has the words and the
            numbers ready before she needs them.
          </p>
        </div>

        <div className="grid gap-8 sm:grid-cols-3">
          {COLUMNS.map((column) => (
            <div key={column.heading}>
              <h2 className="eyebrow mb-3">{column.heading}</h2>
              <ul className="space-y-2 text-[0.95rem]">
                {column.links.map((link) => (
                  <li key={link.href}>
                    <Link href={link.href} className="link text-ink-soft">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="border-rule text-ink-muted mt-10 border-t pt-6 text-[0.85rem] leading-relaxed">
          <p className="max-w-[70ch]">{MEDICAL_DISCLAIMER}</p>
          <p className="mt-3">
            Content version {WARNING_SIGN_CONTENT.version} · Safety rules{" "}
            {SAFETY_RULES_VERSION} · Draft content pending clinical review.
          </p>
          <p className="mt-3">
            Eunica Safe stores your information on your device only. No account,
            no tracking.
          </p>
        </div>
      </div>
    </footer>
  );
}
