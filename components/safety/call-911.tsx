import { MessageSquare, Phone } from "lucide-react";

import { ActionLink } from "@/components/ui/button";
import { EMERGENCY_LINES } from "@/content/resources";
import { cn, smsHref, telHref } from "@/lib/utils";

/**
 * The single, unmissable 911 action. Rendered large and in reserved emergency
 * red so it reads the same way on every screen (spec §4.9, §5.3).
 */
export function Call911Button({
  className,
  label = "Call 911 now",
}: {
  className?: string;
  label?: string;
}) {
  return (
    <ActionLink
      href={telHref("911")}
      variant="emergency"
      size="lg"
      fullWidth
      className={cn("text-[1.15rem]", className)}
      data-testid="call-911"
    >
      <Phone aria-hidden="true" className="size-6" />
      {label}
    </ActionLink>
  );
}

export function CrisisLineList({ className }: { className?: string }) {
  return (
    <ul className={cn("index-list", className)}>
      {EMERGENCY_LINES.map((line) => (
        <li key={line.id} className="py-4">
          <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
            <h3 className="font-serif text-[1.1rem] font-semibold">
              {line.label}
            </h3>
            <span className="text-ink font-sans text-[0.95rem] font-semibold tracking-wide">
              {line.number}
            </span>
          </div>
          <p className="text-ink-soft mt-1 text-[0.95rem]">
            {line.description}
          </p>
          <div className="mt-3 flex flex-wrap gap-2">
            <ActionLink
              href={telHref(line.number)}
              variant={line.tone === "emergency" ? "emergency" : "secondary"}
              size="sm"
            >
              <Phone aria-hidden="true" className="size-4" />
              Call {line.number}
            </ActionLink>
            {line.id === "988" ? (
              <ActionLink href={smsHref("988")} variant="secondary" size="sm">
                <MessageSquare aria-hidden="true" className="size-4" />
                Text 988
              </ActionLink>
            ) : null}
          </div>
        </li>
      ))}
    </ul>
  );
}
