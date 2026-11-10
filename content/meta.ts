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

/**
 * Inflammation is taught, and illustrated, almost entirely as redness. On
 * brown and Black skin it frequently is not red, and a mother who is waiting
 * to see redness can wait through an infection. Every sign that mentions skin
 * colour carries this note.
 */
export const SKIN_TONE_NOTE =
  "Redness is not the only sign, and on brown and Black skin it is often not the first one. Inflamed skin can look purple, brown, grey, or simply darker and shinier than the skin around it. Compare the area with the same spot on the other side of your body, in good light, and give warmth, swelling, firmness, and tenderness the same weight you would give colour.";

/**
 * A published source a piece of clinical content is drawn from. Thresholds and
 * recommendations in this app must be traceable to one of these; we do not
 * publish a number we cannot point at a source for.
 */
export type Reference = {
  organisation: string;
  title: string;
  url: string;
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
