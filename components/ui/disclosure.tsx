import { ChevronRight } from "lucide-react";
import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

/**
 * Native `details`/`summary` so expansion works without JavaScript, respects
 * reduced-motion by default, and stays keyboard and screen-reader friendly.
 */
export function Disclosure({
  summary,
  children,
  defaultOpen = false,
  className,
}: {
  summary: string;
  children: ReactNode;
  defaultOpen?: boolean;
  className?: string;
}) {
  return (
    <details
      open={defaultOpen}
      className={cn("group border-rule border-t last:border-b", className)}
    >
      <summary className="text-ink hover:text-clay-deep flex cursor-pointer list-none items-center justify-between gap-3 py-4 text-left font-semibold marker:hidden [&::-webkit-details-marker]:hidden">
        <span>{summary}</span>
        <ChevronRight
          aria-hidden="true"
          className="text-ink-muted size-5 shrink-0 transition-transform group-open:rotate-90"
        />
      </summary>
      <div
        data-slot="prose"
        className="text-ink-soft pb-5 text-[0.98rem] leading-relaxed"
      >
        {children}
      </div>
    </details>
  );
}
