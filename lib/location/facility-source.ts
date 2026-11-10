import type { Coordinates } from "./maps";

/**
 * Facility data contract.
 *
 * No verified facility dataset is wired into this build, so the app must not
 * display hospital listings. The interface exists so a reviewed data source can
 * be added later without changing the UI contract, and so the data-freshness
 * policy is written down before any listing is ever shown (spec §4.5, §11.10).
 */

export type FacilityKind =
  | "emergency-department"
  | "hospital"
  | "obstetric-unit"
  | "maternal-fetal-medicine"
  | "urgent-care";

export type Facility = {
  id: string;
  name: string;
  kind: FacilityKind;
  address: string;
  phone?: string;
  hours?: string;
  /** Only services the source explicitly publishes may be listed. */
  verifiedServices: string[];
  distanceMiles?: number;
  travelTimeMinutes?: number;
  /** ISO date the source last confirmed this record. */
  sourceUpdatedAt: string;
  sourceName: string;
};

export type FacilityQuery = {
  coordinates?: Coordinates;
  locationText?: string;
  kinds?: FacilityKind[];
  limit?: number;
};

export type FacilityLookupResult =
  | {
      status: "ok";
      facilities: Facility[];
      sourceName: string;
      freshness: string;
    }
  | { status: "not-configured"; message: string }
  | { status: "error"; message: string };

export interface FacilityDataSource {
  readonly name: string;
  search(query: FacilityQuery): Promise<FacilityLookupResult>;
}

export const FACILITY_DATA_POLICY = {
  requirement:
    "Listings may only come from a named source with a documented update cadence — for example a state hospital licensing registry or the CMS hospital dataset.",
  freshness:
    "Records older than 90 days must be re-fetched before display, and each listing must show the date its source last confirmed it.",
  serviceClaims:
    "Obstetric, maternal-fetal medicine, and emergency-department capability may only be shown when the source publishes it. The app never infers a service from a facility name.",
  fallback:
    "When no source is configured or a lookup fails, the app hands the search to the user's map application instead of showing an unverified list.",
} as const;

/** Default source for this build: intentionally returns no listings. */
export const notConfiguredFacilitySource: FacilityDataSource = {
  name: "none configured",
  async search() {
    return {
      status: "not-configured",
      message:
        "No verified facility dataset is connected in this build, so Eunica Safe does not list hospitals. Search with your map application below, or call your saved hospital.",
    };
  },
};

export function getFacilityDataSource(): FacilityDataSource {
  return notConfiguredFacilitySource;
}
