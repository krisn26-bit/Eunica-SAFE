import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

/** Standard reading column for content pages. */
export function PageShell({
  children,
  width = "default",
  className,
}: {
  children: ReactNode;
  width?: "default" | "narrow" | "wide";
  className?: string;
}) {
  const widths = {
    narrow: "max-w-2xl",
    default: "max-w-3xl",
    wide: "max-w-5xl",
  } as const;

  return (
    <div
      className={cn(
        "mx-auto w-full px-5 py-8 sm:px-8 sm:py-12",
        widths[width],
        className,
      )}
    >
      <div className="space-y-10">{children}</div>
    </div>
  );
}
