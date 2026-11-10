/**
 * Content governance metadata.
 *
 * Every piece of safety content in this app ships with a review status. Until a
 * qualified maternal-health clinician signs off, the status stays `draft` and
 * the UI labels it as draft everywhere it appears (spec §10).
 */

export type ReviewStatus = "draft" | "clinician-reviewed";

export type ContentProvenance = {
  version: string;
  status: ReviewStatus;
  lastUpdated: string;
  /** Who owns corrections to this content. */
  owner: string;
  reviewer: string | null;
  reviewedOn: string | null;
  /** Cadence for the next scheduled review. */
  reviewCadence: string;
};

export const WARNING_SIGN_CONTENT: ContentProvenance = {
  version: "0.1.0-draft",
  status: "draft",
  lastUpdated: "2026-09-21",
  owner: "Eunica Safe clinical content lead (unassigned in this build)",
  reviewer: null,
  reviewedOn: null,
  reviewCadence: "Every 6 months, and immediately on any urgent correction",
};

export const RESOURCE_CONTENT: ContentProvenance = {
  version: "0.1.0-draft",
  status: "draft",
  lastUpdated: "2026-09-21",
  owner: "Eunica Safe resource directory lead (unassigned in this build)",
  reviewer: null,
  reviewedOn: null,
  reviewCadence:
    "Every 3 months — phone numbers and websites must be re-verified",
};

export const DRAFT_CONTENT_NOTE =
  "Draft content. Written in plain language for this pilot build and not yet reviewed by a clinician. Do not rely on it as medical advice.";

export const UNVERIFIED_LISTING_NOTE =
  "Listing details have not been independently verified for this build. Confirm phone numbers, hours, and services before relying on them.";
