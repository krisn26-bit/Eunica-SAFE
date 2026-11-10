"use client";

import { Search, X } from "lucide-react";
import Link from "next/link";
import { useMemo, useState } from "react";

import { Button } from "@/components/ui/button";
import { UrgencyBadge } from "@/components/ui/urgency-badge";
import {
  WARNING_SIGN_CATEGORIES,
  type WarningSign,
  type WarningSignCategory,
} from "@/content/warning-signs";
import { cn } from "@/lib/utils";

function matches(sign: WarningSign, query: string): boolean {
  const haystack = [
    sign.title,
    sign.standfirst,
    sign.whyItMatters,
    ...sign.searchTerms,
    ...sign.looksLike,
  ]
    .join(" ")
    .toLowerCase();
  return query
    .toLowerCase()
    .split(/\s+/)
    .filter(Boolean)
    .every((term) => haystack.includes(term));
}

/**
 * Search runs entirely in the browser over static content, so nothing a user
 * types about their symptoms leaves the device or appears in a URL (spec §9).
 */
export function WarningSignIndex({ signs }: { signs: WarningSign[] }) {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<WarningSignCategory | "all">("all");

  const results = useMemo(() => {
    return signs.filter((sign) => {
      if (category !== "all" && sign.category !== category) return false;
      if (query.trim().length === 0) return true;
      return matches(sign, query.trim());
    });
  }, [signs, query, category]);

  const activeCategories = useMemo(
    () =>
      WARNING_SIGN_CATEGORIES.filter((item) =>
        signs.some((sign) => sign.category === item.id),
      ),
    [signs],
  );

  return (
    <div>
      <div className="relative">
        <label htmlFor="warning-sign-search" className="sr-only">
          Search warning signs
        </label>
        <Search
          aria-hidden="true"
          className="text-ink-muted pointer-events-none absolute top-1/2 left-3 size-5 -translate-y-1/2"
        />
        <input
          id="warning-sign-search"
          type="search"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Search a symptom, for example bleeding or headache"
          autoComplete="off"
          className="border-rule-strong text-ink placeholder:text-ink-muted/70 min-h-12 w-full rounded-[var(--radius-control)] border bg-[color:var(--paper)] py-3 pr-10 pl-11 text-[1rem]"
        />
        {query ? (
          <button
            type="button"
            onClick={() => setQuery("")}
            className="text-ink-muted hover:text-ink absolute top-1/2 right-2 inline-flex size-9 -translate-y-1/2 items-center justify-center"
          >
            <X aria-hidden="true" className="size-5" />
            <span className="sr-only">Clear search</span>
          </button>
        ) : null}
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        <Button
          variant={category === "all" ? "primary" : "secondary"}
          size="sm"
          aria-pressed={category === "all"}
          onClick={() => setCategory("all")}
        >
          All topics
        </Button>
        {activeCategories.map((item) => (
          <Button
            key={item.id}
            variant={category === item.id ? "primary" : "secondary"}
            size="sm"
            aria-pressed={category === item.id}
            onClick={() => setCategory(item.id)}
          >
            {item.label}
          </Button>
        ))}
      </div>

      <p aria-live="polite" className="text-ink-muted mt-5 text-[0.9rem]">
        {results.length === signs.length
          ? `${signs.length} warning signs`
          : `${results.length} of ${signs.length} warning signs`}
      </p>

      {results.length === 0 ? (
        <div className="border-rule-strong mt-4 rounded-[var(--radius-editorial)] border bg-[color:var(--paper)] px-5 py-6">
          <h2 className="font-serif text-[1.15rem] font-semibold">
            No topic matched those words
          </h2>
          <p className="text-ink-soft mt-2">
            That does not mean your symptom is nothing. Try a simpler word, or
            answer a few questions about what you are feeling.
          </p>
          <p className="mt-4">
            <Link href="/seek-care" className="link font-semibold">
              Answer questions about my symptom
            </Link>
          </p>
        </div>
      ) : (
        <ul className={cn("index-list mt-3")}>
          {results.map((sign) => (
            <li key={sign.slug}>
              <Link
                href={`/warning-signs/${sign.slug}`}
                className="group block py-4"
              >
                <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
                  <h2 className="text-ink group-hover:text-clay-deep font-serif text-[1.2rem] font-semibold group-hover:underline group-hover:decoration-1 group-hover:underline-offset-4">
                    {sign.title}
                  </h2>
                  <UrgencyBadge hint={sign.urgencyHint} />
                </div>
                <p className="text-ink-soft mt-1.5 max-w-[62ch] text-[0.97rem]">
                  {sign.standfirst}
                </p>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
