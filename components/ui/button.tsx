import Link from "next/link";
import type { ComponentPropsWithoutRef, ReactNode } from "react";

import { cn } from "@/lib/utils";

export type ButtonVariant =
  "primary" | "secondary" | "quiet" | "emergency" | "serious";

export type ButtonSize = "sm" | "md" | "lg";

const base =
  "inline-flex items-center justify-center gap-2 font-sans font-semibold leading-tight transition-colors disabled:cursor-not-allowed disabled:bg-[var(--color-disabled-bg)] disabled:text-[var(--color-disabled-text)] disabled:border-transparent";

const variants: Record<ButtonVariant, string> = {
  primary:
    "bg-clay text-[var(--ink-inverse)] border border-clay hover:bg-clay-deep hover:border-clay-deep rounded-[var(--radius-control)]",
  secondary:
    "bg-transparent text-ink border border-rule-strong hover:bg-clay-wash hover:border-clay rounded-[var(--radius-control)]",
  quiet:
    "bg-transparent text-ink-soft border border-transparent underline decoration-1 underline-offset-4 hover:text-clay-deep",
  emergency:
    "bg-emergency text-white border-2 border-emergency hover:bg-emergency-deep hover:border-emergency-deep rounded-[var(--radius-control)] uppercase tracking-[0.06em]",
  serious:
    "bg-serious text-white border border-serious hover:brightness-110 rounded-[var(--radius-control)]",
};

const sizes: Record<ButtonSize, string> = {
  sm: "min-h-9 px-3 py-1.5 text-[0.9rem]",
  md: "min-h-11 px-4 py-2.5 text-[0.98rem]",
  lg: "min-h-14 px-6 py-3 text-[1.05rem]",
};

export function buttonClasses(
  variant: ButtonVariant = "primary",
  size: ButtonSize = "md",
  fullWidth = false,
  className?: string,
): string {
  return cn(
    base,
    variants[variant],
    sizes[size],
    fullWidth && "w-full",
    className,
  );
}

type ButtonProps = ComponentPropsWithoutRef<"button"> & {
  variant?: ButtonVariant;
  size?: ButtonSize;
  fullWidth?: boolean;
};

export function Button({
  variant = "primary",
  size = "md",
  fullWidth,
  className,
  type = "button",
  ...props
}: ButtonProps) {
  return (
    <button
      type={type}
      className={buttonClasses(variant, size, fullWidth, className)}
      {...props}
    />
  );
}

type ButtonLinkProps = ComponentPropsWithoutRef<typeof Link> & {
  variant?: ButtonVariant;
  size?: ButtonSize;
  fullWidth?: boolean;
  children: ReactNode;
};

export function ButtonLink({
  variant = "primary",
  size = "md",
  fullWidth,
  className,
  children,
  ...props
}: ButtonLinkProps) {
  return (
    <Link
      className={buttonClasses(variant, size, fullWidth, className)}
      {...props}
    >
      {children}
    </Link>
  );
}

type ExternalButtonLinkProps = ComponentPropsWithoutRef<"a"> & {
  variant?: ButtonVariant;
  size?: ButtonSize;
  fullWidth?: boolean;
};

/** For `tel:`, `sms:`, and map hand-offs, which must not use the router. */
export function ActionLink({
  variant = "primary",
  size = "md",
  fullWidth,
  className,
  ...props
}: ExternalButtonLinkProps) {
  return (
    <a
      className={buttonClasses(variant, size, fullWidth, className)}
      {...props}
    />
  );
}
