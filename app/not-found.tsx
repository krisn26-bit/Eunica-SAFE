import Link from "next/link";

import { PageShell } from "@/components/layout/page-shell";
import { Call911Button } from "@/components/safety/call-911";
import { PageHeader } from "@/components/ui/section";

export default function NotFound() {
  return (
    <PageShell>
      <PageHeader
        eyebrow="Page not found"
        title="That page does not exist"
        standfirst="If you were looking for something urgent, do not keep searching."
      />
      <Call911Button />
      <ul className="index-list">
        {[
          { href: "/dashboard", label: "Go to your home screen" },
          { href: "/warning-signs", label: "Look up a warning sign" },
          { href: "/seek-care", label: "Answer questions about a symptom" },
          { href: "/emergency", label: "Emergency and crisis numbers" },
        ].map((item) => (
          <li key={item.href}>
            <Link
              href={item.href}
              className="text-ink hover:text-brand-deep block py-3.5 font-medium"
            >
              {item.label}
            </Link>
          </li>
        ))}
      </ul>
    </PageShell>
  );
}
