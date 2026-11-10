"use client";

import { Menu, X } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

import { cn } from "@/lib/utils";

const NAV = [
  { href: "/dashboard", label: "Home" },
  { href: "/warning-signs", label: "Warning signs" },
  { href: "/seek-care", label: "Should I seek care?" },
  { href: "/care-locator", label: "Find care" },
  { href: "/safety-plan", label: "Safety plan" },
  { href: "/recovery", label: "Recovery" },
  { href: "/resources", label: "Support" },
];

export function SiteHeader() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <header className="border-rule border-b bg-[color:var(--paper)]">
      <div className="mx-auto flex w-full max-w-5xl items-center justify-between gap-4 px-5 py-3 sm:px-8">
        <Link href="/" className="group flex items-baseline gap-2">
          <span className="text-ink group-hover:text-clay-deep font-serif text-[1.3rem] font-semibold tracking-tight">
            Eunica&nbsp;Safe
          </span>
          <span className="text-ink-muted hidden text-[0.72rem] tracking-[0.16em] uppercase sm:inline">
            Postpartum
          </span>
        </Link>

        <nav aria-label="Main" className="hidden lg:block">
          <ul className="flex items-center gap-5 text-[0.92rem]">
            {NAV.map((item) => {
              const active =
                pathname === item.href || pathname.startsWith(`${item.href}/`);
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    aria-current={active ? "page" : undefined}
                    className={cn(
                      "py-1 font-medium decoration-1 underline-offset-[6px] hover:underline",
                      active
                        ? "text-clay-deep underline decoration-2"
                        : "text-ink-soft",
                    )}
                  >
                    {item.label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        <button
          type="button"
          onClick={() => setOpen((value) => !value)}
          aria-expanded={open}
          aria-controls="mobile-nav"
          className="border-rule-strong text-ink inline-flex min-h-11 items-center gap-2 rounded-[var(--radius-control)] border px-3 py-2 text-[0.9rem] font-semibold lg:hidden"
        >
          {open ? (
            <X aria-hidden="true" className="size-5" />
          ) : (
            <Menu aria-hidden="true" className="size-5" />
          )}
          Menu
        </button>
      </div>

      {open ? (
        <nav
          id="mobile-nav"
          aria-label="Main"
          className="border-rule border-t lg:hidden"
        >
          <ul className="mx-auto w-full max-w-5xl px-5 sm:px-8">
            {NAV.map((item) => {
              const active =
                pathname === item.href || pathname.startsWith(`${item.href}/`);
              return (
                <li
                  key={item.href}
                  className="border-rule border-b last:border-0"
                >
                  <Link
                    href={item.href}
                    aria-current={active ? "page" : undefined}
                    onClick={() => setOpen(false)}
                    className={cn(
                      "block py-3.5 text-[1rem] font-medium",
                      active ? "text-clay-deep" : "text-ink-soft",
                    )}
                  >
                    {item.label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
      ) : null}
    </header>
  );
}
