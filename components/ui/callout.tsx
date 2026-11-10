import {
  AlertTriangle,
  HeartHandshake,
  Info,
  PhoneCall,
  ShieldAlert,
} from "lucide-react";
import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

export type CalloutTone =
  "note" | "supportive" | "warning" | "serious" | "emergency";

/**
 * Urgency is carried by the label, the icon, and the border weight as well as
 * color, so meaning survives color blindness, grayscale printing, and
 * high-contrast modes (spec §5.3, §6).
 */
const tones: Record<
  CalloutTone,
  { wrapper: string; label: string; icon: typeof Info; defaultTitle: string }
> = {
  note: {
    wrapper: "border-l-4 border-l-rule-strong bg-[color:var(--paper)]",
    label: "text-ink-muted",
    icon: Info,
    defaultTitle: "Good to know",
  },
  supportive: {
    wrapper: "border-l-4 border-l-accent bg-accent-wash",
    label: "text-[color:var(--color-supportive)]",
    icon: HeartHandshake,
    defaultTitle: "Support",
  },
  warning: {
    wrapper: "border-l-4 border-l-caution bg-caution-wash",
    label: "text-[color:var(--color-warning)]",
    icon: AlertTriangle,
    defaultTitle: "Take this seriously",
  },
  serious: {
    wrapper: "border-l-4 border-l-serious bg-serious-wash",
    label: "text-serious",
    icon: ShieldAlert,
    defaultTitle: "This can be serious",
  },
  emergency: {
    wrapper: "border-2 border-emergency bg-emergency-wash",
    label: "text-emergency-deep",
    icon: PhoneCall,
    defaultTitle: "Emergency",
  },
};

type CalloutProps = {
  tone?: CalloutTone;
  title?: string;
  children: ReactNode;
  className?: string;
  /** Renders as an alert for assistive technology when urgent. */
  assertive?: boolean;
};

export function Callout({
  tone = "note",
  title,
  children,
  className,
  assertive,
}: CalloutProps) {
  const config = tones[tone];
  const Icon = config.icon;

  return (
    <aside
      role={assertive ? "alert" : undefined}
      className={cn(
        "px-4 py-3.5 sm:px-5",
        "rounded-[var(--radius-editorial)]",
        config.wrapper,
        className,
      )}
    >
      <p
        className={cn(
          "mb-1 flex items-center gap-2 text-[0.78rem] font-semibold tracking-[0.1em] uppercase",
          config.label,
        )}
      >
        <Icon aria-hidden="true" className="size-4 shrink-0" />
        {title ?? config.defaultTitle}
      </p>
      <div
        data-slot="prose"
        className="text-ink-soft text-[0.97rem] leading-relaxed [&>p+p]:mt-2"
      >
        {children}
      </div>
    </aside>
  );
}
