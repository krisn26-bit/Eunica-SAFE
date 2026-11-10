import { cn } from "@/lib/utils";

/**
 * Eunica Safe brand marks.
 *
 * The mark carries four elements, and all four are load-bearing: a mother
 * holding her newborn, a heart enclosing and protecting them, a medical cross
 * for healthcare and safety, and the wordmark in plum and dusty rose.
 *
 * The cross is drawn in brand rose, never in emergency red. Red is reserved
 * for 911 and emergency-care actions, and a red cross in a logo on every page
 * would spend that meaning (see styles/tokens.css).
 */

export const BRAND_TAGLINE = "Know the signs. Know when to act. Keep Mom safe.";

/** Light = for cream/ivory surfaces. Dark = for plum/ink surfaces. */
export type BrandTone = "light" | "dark" | "mono";

type MarkPalette = {
  heart: string;
  mother: string;
  baby: string;
  arm: string;
  cross: string;
  /** Separates the infant from the mother when both are one color. */
  relief: string;
};

const PALETTES: Record<BrandTone, MarkPalette> = {
  light: {
    heart: "url(#eunica-heart-gradient)",
    mother: "#48123F",
    baby: "#B85F80",
    arm: "#651B4F",
    cross: "#A75176",
    relief: "#FFF8F3",
  },
  dark: {
    heart: "#E8B9C8",
    mother: "#FFF8F3",
    baby: "#B85F80",
    arm: "#E8B9C8",
    cross: "#E8B9C8",
    relief: "#48123F",
  },
  mono: {
    heart: "currentColor",
    mother: "currentColor",
    baby: "currentColor",
    arm: "currentColor",
    cross: "currentColor",
    relief: "transparent",
  },
};

const HEART_PATH =
  "M32 57C10.8 42.3 4 33.2 4 23.4 4 15 10.6 8.3 18.8 8.3c5.4 0 10.2 2.9 12.7 7.3h1c2.5-4.4 7.3-7.3 12.7-7.3C53.4 8.3 60 15 60 23.4c0 9.8-6.8 18.9-28 33.6Z";

const MOTHER_BODY_PATH =
  "M31 29.8c-6.2 0-10.2 4.6-10.8 12-.1 1 .7 1.9 1.7 1.9h18.2c1 0 1.8-.9 1.7-1.9-.6-7.4-4.6-12-10.8-12Z";

const BABY_BODY_PATH =
  "M37.2 36.4c3.1 0 5.6 2.5 5.6 5.6 0 .6-.1 1.2-.3 1.7h-10.6c-.2-.5-.3-1.1-.3-1.7 0-3.1 2.5-5.6 5.6-5.6Z";

const ARM_PATH = "M24.6 35.1c3.6 4.1 8.3 6.3 14.1 6.6";

const CROSS_PATH = "M45.8 14.5h3.4v3.8h3.8v3.4h-3.8v3.8h-3.4v-3.8H42v-3.4h3.8z";

type MarkProps = {
  tone?: BrandTone;
  className?: string;
  /**
   * Drops the infant and arm detail, which turn to mush below about 32px.
   * Used for the favicon and the small header lockup.
   */
  simplified?: boolean;
};

/**
 * The mark on its own. Decorative by default: the lockups below carry the
 * accessible name, so a bare mark beside the wordmark is not announced twice.
 */
export function EunicaMark({
  tone = "light",
  className,
  simplified = false,
}: MarkProps) {
  const palette = PALETTES[tone];
  const monochrome = tone === "mono";

  return (
    <svg
      viewBox="0 0 64 64"
      role="img"
      aria-hidden="true"
      focusable="false"
      className={cn("size-10", className)}
    >
      {tone === "light" ? (
        <defs>
          <linearGradient
            id="eunica-heart-gradient"
            x1="0"
            y1="0"
            x2="1"
            y2="1"
          >
            <stop offset="0%" stopColor="#48123F" />
            <stop offset="55%" stopColor="#651B4F" />
            <stop offset="100%" stopColor="#A75176" />
          </linearGradient>
        </defs>
      ) : null}

      <path
        d={HEART_PATH}
        fill="none"
        stroke={palette.heart}
        strokeWidth={simplified ? 4 : 3}
        strokeLinejoin="round"
      />

      <circle cx="31" cy="23.5" r="5.4" fill={palette.mother} />
      <path d={MOTHER_BODY_PATH} fill={palette.mother} />

      {simplified ? null : (
        <>
          <path
            d={BABY_BODY_PATH}
            fill={palette.baby}
            stroke={monochrome ? palette.relief : "none"}
            strokeWidth={monochrome ? 1.6 : 0}
          />
          <circle
            cx="37.2"
            cy="34"
            r="3.4"
            fill={palette.baby}
            stroke={monochrome ? palette.relief : "none"}
            strokeWidth={monochrome ? 1.6 : 0}
          />
          <path
            d={ARM_PATH}
            fill="none"
            stroke={palette.arm}
            strokeWidth="2.4"
            strokeLinecap="round"
          />
        </>
      )}

      <path d={CROSS_PATH} fill={palette.cross} />
    </svg>
  );
}

type WordmarkProps = {
  tone?: BrandTone;
  className?: string;
};

/** "Eunica" in deep plum, "Safe" in dusty rose, both in the serif face. */
export function EunicaWordmark({ tone = "light", className }: WordmarkProps) {
  return (
    <span
      className={cn(
        "font-serif font-semibold tracking-tight whitespace-nowrap",
        className,
      )}
    >
      <span
        className={
          tone === "dark"
            ? "text-[color:var(--cream)]"
            : "text-[color:var(--plum)]"
        }
      >
        Eunica
      </span>{" "}
      <span
        className={
          tone === "dark"
            ? "text-[color:var(--blush)]"
            : "text-[color:var(--rose-deep)]"
        }
      >
        Safe
      </span>
    </span>
  );
}

type LogoProps = {
  tone?: BrandTone;
  /** Horizontal for headers, stacked for splash and print. */
  orientation?: "horizontal" | "stacked";
  showTagline?: boolean;
  simplifiedMark?: boolean;
  className?: string;
  markClassName?: string;
  wordmarkClassName?: string;
};

/**
 * The primary logo: mark plus wordmark, optionally with the tagline. The whole
 * lockup carries one accessible name so assistive tech reads it as a unit.
 */
export function EunicaLogo({
  tone = "light",
  orientation = "horizontal",
  showTagline = false,
  simplifiedMark = false,
  className,
  markClassName,
  wordmarkClassName,
}: LogoProps) {
  const stacked = orientation === "stacked";

  return (
    <span
      role="img"
      aria-label={`Eunica Safe${showTagline ? `. ${BRAND_TAGLINE}` : ""}`}
      className={cn(
        "inline-flex",
        stacked
          ? "flex-col items-center gap-2 text-center"
          : "flex-row items-center gap-2.5",
        className,
      )}
    >
      <EunicaMark
        tone={tone}
        simplified={simplifiedMark}
        className={cn(stacked ? "size-16" : "size-9", markClassName)}
      />
      <span
        className={cn(
          stacked ? "flex flex-col items-center gap-1.5" : "flex flex-col",
        )}
      >
        <EunicaWordmark
          tone={tone}
          className={cn(
            stacked ? "text-[length:var(--step-3)]" : "text-[1.3rem]",
            wordmarkClassName,
          )}
        />
        {showTagline ? (
          <span
            className={cn(
              "font-sans text-[0.82rem] leading-snug",
              tone === "dark" ? "text-[color:var(--blush)]" : "text-ink-muted",
            )}
          >
            {BRAND_TAGLINE}
          </span>
        ) : null}
      </span>
    </span>
  );
}
