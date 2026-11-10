import { Clock, PhoneCall, Siren, Stethoscope } from "lucide-react";

import type { UrgencyHint } from "@/content/warning-signs";
import type { ActionLevel } from "@/lib/safety-rules/types";
import { cn } from "@/lib/utils";

type BadgeConfig = {
  label: string;
  icon: typeof Siren;
  className: string;
};

const configs: Record<ActionLevel, BadgeConfig> = {
  "call-911": {
    label: "Call 911",
    icon: Siren,
    className: "border-emergency bg-emergency text-white",
  },
  "emergency-now": {
    label: "Emergency care now",
    icon: PhoneCall,
    className: "border-serious bg-serious-wash text-serious",
  },
  "contact-team-promptly": {
    label: "Call your care team",
    icon: Stethoscope,
    className: "border-[color:var(--clay)] bg-clay-wash text-clay-deep",
  },
  "monitor-and-contact": {
    label: "Watch and contact",
    icon: Clock,
    className:
      "border-[color:var(--sage)] bg-sage-wash text-[color:var(--color-supportive)]",
  },
};

const hintToLevel: Record<UrgencyHint, ActionLevel> = {
  "call-911": "call-911",
  "emergency-now": "emergency-now",
  "same-day": "contact-team-promptly",
  prompt: "monitor-and-contact",
};

export function UrgencyBadge({
  level,
  hint,
  className,
}: {
  level?: ActionLevel;
  hint?: UrgencyHint;
  className?: string;
}) {
  const resolved: ActionLevel =
    level ?? (hint ? hintToLevel[hint] : "monitor-and-contact");
  const config = configs[resolved];
  const Icon = config.icon;

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 border px-2.5 py-1 text-[0.72rem] font-semibold tracking-[0.08em] uppercase",
        "rounded-[var(--radius-editorial)]",
        config.className,
        className,
      )}
    >
      <Icon aria-hidden="true" className="size-3.5" />
      {config.label}
    </span>
  );
}

export { hintToLevel };
