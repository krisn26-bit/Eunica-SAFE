import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

type PageHeaderProps = {
  eyebrow?: string;
  title: string;
  standfirst?: string;
  meta?: ReactNode;
  children?: ReactNode;
};

/** Editorial page opener: eyebrow, serif headline, standfirst, then a rule. */
export function PageHeader({
  eyebrow,
  title,
  standfirst,
  meta,
  children,
}: PageHeaderProps) {
  return (
    <header className="border-rule border-b pb-7">
      {eyebrow ? <p className="eyebrow mb-3">{eyebrow}</p> : null}
      <h1 className="text-[length:var(--step-3)] font-semibold">{title}</h1>
      {standfirst ? (
        <p className="text-ink-soft mt-3 max-w-[54ch] text-[1.05rem]">
          {standfirst}
        </p>
      ) : null}
      {meta ? (
        <div className="text-ink-muted mt-4 text-[0.85rem]">{meta}</div>
      ) : null}
      {children ? <div className="mt-5">{children}</div> : null}
    </header>
  );
}

type SectionProps = {
  id?: string;
  eyebrow?: string;
  title?: string;
  standfirst?: string;
  children: ReactNode;
  className?: string;
  /** Adds a top rule, for stacked editorial sections. */
  ruled?: boolean;
};

export function Section({
  id,
  eyebrow,
  title,
  standfirst,
  children,
  className,
  ruled = true,
}: SectionProps) {
  return (
    <section
      id={id}
      className={cn(ruled && "border-rule border-t pt-8", className)}
    >
      {/*
        When a section has no headline the eyebrow is its only label, so it has
        to be the heading. Otherwise the section's own h3s would follow the
        page h1 with no h2 between them, and a screen-reader user navigating by
        heading would hear a level skipped.
      */}
      {eyebrow ? (
        title ? (
          <p className="eyebrow mb-2">{eyebrow}</p>
        ) : (
          <h2 className="eyebrow mb-2">{eyebrow}</h2>
        )
      ) : null}
      {title ? (
        <h2 className="text-[length:var(--step-2)] font-semibold">{title}</h2>
      ) : null}
      {standfirst ? (
        <p className="text-ink-soft mt-2 max-w-[60ch]">{standfirst}</p>
      ) : null}
      <div className={cn(title || standfirst ? "mt-5" : undefined)}>
        {children}
      </div>
    </section>
  );
}

/** Full-width tonal band used to break up long pages without cards. */
export function Band({
  children,
  tone = "paper",
  className,
}: {
  children: ReactNode;
  tone?: "paper" | "ink" | "accent" | "brand";
  className?: string;
}) {
  const tones = {
    paper: "bg-[color:var(--paper)] border-y border-rule text-ink",
    ink: "bg-ink-panel text-[color:var(--ink-inverse)]",
    accent:
      "bg-accent-wash border-y border-[color:var(--color-secondary)]/25 text-ink",
    brand:
      "bg-brand-wash border-y border-[color:var(--color-action)]/25 text-ink",
  } as const;

  return (
    <div className={cn("w-full", tones[tone], className)}>
      <div className="mx-auto w-full max-w-5xl px-5 py-10 sm:px-8">
        {children}
      </div>
    </div>
  );
}

export function PullQuote({
  children,
  attribution,
}: {
  children: ReactNode;
  attribution?: string;
}) {
  return (
    <blockquote className="border-brand text-ink border-l-2 pl-5 font-serif text-[length:var(--step-2)] leading-snug">
      {children}
      {attribution ? (
        <footer className="text-ink-muted mt-3 font-sans text-[0.85rem] tracking-wide">
          {attribution}
        </footer>
      ) : null}
    </blockquote>
  );
}

export function Prose({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      data-slot="prose"
      className={cn(
        "text-ink-soft max-w-[68ch] space-y-4 text-[1.02rem] leading-relaxed",
        className,
      )}
    >
      {children}
    </div>
  );
}

/** Numbered, ruled list that reads like printed instructions. */
export function StepList({ items }: { items: ReactNode[] }) {
  return (
    <ol className="index-list">
      {items.map((item, index) => (
        <li key={index} className="flex gap-4 py-3.5">
          <span
            aria-hidden="true"
            className="text-brand mt-0.5 font-serif text-[1.05rem]"
          >
            {index + 1}
          </span>
          <span className="text-ink-soft">{item}</span>
        </li>
      ))}
    </ol>
  );
}
