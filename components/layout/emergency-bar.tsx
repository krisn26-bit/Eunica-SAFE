import { Phone } from "lucide-react";
import Link from "next/link";

import { telHref } from "@/lib/utils";

/**
 * Persistent emergency access. This is the first interactive element in the
 * DOM after the skip link, so 911 is always one tap from every screen
 * (spec §4.9, §7).
 */
export function EmergencyBar() {
  return (
    <div className="bg-emergency text-white">
      <div className="mx-auto flex w-full max-w-5xl flex-wrap items-center gap-x-4 gap-y-2 px-5 py-2 sm:px-8">
        <a
          href={telHref("911")}
          className="hover:text-emergency-deep inline-flex min-h-9 items-center gap-2 border-2 border-white px-3 py-1 text-[0.85rem] font-bold tracking-[0.08em] uppercase hover:bg-white"
        >
          <Phone aria-hidden="true" className="size-4" />
          Call 911
        </a>
        <p className="text-[0.85rem] leading-snug">
          If this is an emergency, call 911 or go to the nearest emergency
          department.{" "}
          <Link
            href="/emergency"
            className="font-semibold underline decoration-1 underline-offset-2 hover:decoration-2"
          >
            Emergency help
          </Link>
        </p>
      </div>
    </div>
  );
}
