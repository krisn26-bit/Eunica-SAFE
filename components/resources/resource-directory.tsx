"use client";

import { ExternalLink, MessageSquare, Phone, Search } from "lucide-react";
import { useMemo, useState } from "react";

import { ActionLink, Button } from "@/components/ui/button";
import { Callout } from "@/components/ui/callout";
import {
  RESOURCE_CATEGORIES,
  type Resource,
  type ResourceCategory,
} from "@/content/resources";
import { smsHref, telHref } from "@/lib/utils";

function matches(resource: Resource, query: string): boolean {
  const haystack = [
    resource.name,
    resource.description,
    resource.audience,
    resource.availability,
  ]
    .join(" ")
    .toLowerCase();
  return query
    .toLowerCase()
    .split(/\s+/)
    .filter(Boolean)
    .every((term) => haystack.includes(term));
}

export function ResourceDirectory({ resources }: { resources: Resource[] }) {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<ResourceCategory | "all">("all");

  const results = useMemo(
    () =>
      resources.filter((resource) => {
        if (category !== "all" && resource.category !== category) return false;
        if (query.trim().length === 0) return true;
        return matches(resource, query.trim());
      }),
    [resources, query, category],
  );

  const activeCategories = useMemo(
    () =>
      RESOURCE_CATEGORIES.filter((item) =>
        resources.some((resource) => resource.category === item.id),
      ),
    [resources],
  );

  return (
    <div>
      <div className="relative">
        <label htmlFor="resource-search" className="sr-only">
          Search support resources
        </label>
        <Search
          aria-hidden="true"
          className="text-ink-muted pointer-events-none absolute top-1/2 left-3 size-5 -translate-y-1/2"
        />
        <input
          id="resource-search"
          type="search"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Search, for example breastfeeding or rides"
          autoComplete="off"
          className="border-rule-strong text-ink min-h-12 w-full rounded-[var(--radius-control)] border bg-[color:var(--paper)] py-3 pr-4 pl-11 text-[1rem]"
        />
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        <Button
          variant={category === "all" ? "primary" : "secondary"}
          size="sm"
          aria-pressed={category === "all"}
          onClick={() => setCategory("all")}
        >
          All support
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
        {results.length} of {resources.length} resources
      </p>

      {results.length === 0 ? (
        <Callout tone="note" title="Nothing matched" className="mt-4">
          <p>
            Try a different word, or call 211 to be connected with local help of
            almost any kind.
          </p>
        </Callout>
      ) : (
        <ul className="index-list mt-3">
          {results.map((resource) => (
            <li key={resource.id} className="py-5">
              <h2 className="font-serif text-[1.2rem] font-semibold">
                {resource.name}
              </h2>
              <p className="text-ink-soft mt-1.5 max-w-[64ch] text-[0.97rem]">
                {resource.description}
              </p>
              <dl className="text-ink-muted mt-3 grid gap-x-6 gap-y-1 text-[0.88rem] sm:grid-cols-2">
                <div>
                  <dt className="text-ink inline font-medium">For: </dt>
                  <dd className="inline">{resource.audience}</dd>
                </div>
                <div>
                  <dt className="text-ink inline font-medium">Hours: </dt>
                  <dd className="inline">{resource.hours}</dd>
                </div>
                <div>
                  <dt className="text-ink inline font-medium">Coverage: </dt>
                  <dd className="inline">{resource.availability}</dd>
                </div>
                <div>
                  <dt className="text-ink inline font-medium">Cost: </dt>
                  <dd className="inline">{resource.cost}</dd>
                </div>
              </dl>

              {resource.emergencyNote ? (
                <p className="border-emergency text-ink-soft mt-3 border-l-2 pl-3 text-[0.9rem]">
                  {resource.emergencyNote}
                </p>
              ) : null}

              <div className="mt-4 flex flex-wrap gap-2">
                {resource.phone ? (
                  <ActionLink
                    href={telHref(resource.phone)}
                    variant="secondary"
                    size="sm"
                  >
                    <Phone aria-hidden="true" className="size-4" />
                    {resource.phoneLabel ?? `Call ${resource.phone}`}
                  </ActionLink>
                ) : null}
                {resource.sms ? (
                  <ActionLink
                    href={smsHref(resource.sms)}
                    variant="secondary"
                    size="sm"
                  >
                    <MessageSquare aria-hidden="true" className="size-4" />
                    {resource.smsLabel ?? `Text ${resource.sms}`}
                  </ActionLink>
                ) : null}
                {resource.website ? (
                  <ActionLink
                    href={resource.website}
                    target="_blank"
                    rel="noreferrer"
                    variant="quiet"
                    size="sm"
                  >
                    Visit website
                    <ExternalLink aria-hidden="true" className="size-3.5" />
                  </ActionLink>
                ) : null}
              </div>
              <p className="text-ink-muted mt-3 text-[0.8rem]">
                Listing last checked {resource.lastReviewed}. Confirm details
                before relying on them.
              </p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
