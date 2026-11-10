/**
 * Map hand-off.
 *
 * This build deliberately has no map provider and no facility database. Instead
 * of listing places we cannot verify, we hand the search to the map application
 * the user already trusts, which keeps their location on their device and avoids
 * inventing hospital data (spec §4.5, §11.10).
 */

export type Coordinates = { latitude: number; longitude: number };

export type CareSearchPreset = {
  id: string;
  /** What the user is looking for, in their words. */
  label: string;
  /** Query handed to the map application. */
  query: string;
  description: string;
  /** Emergency departments must never be visually equated with urgent care. */
  kind: "emergency" | "hospital" | "urgent-care";
};

export const CARE_SEARCH_PRESETS: CareSearchPreset[] = [
  {
    id: "emergency-department",
    label: "Emergency department",
    query: "emergency room",
    description:
      "Open 24 hours, equipped for heavy bleeding, chest pain, breathing trouble, seizures, and blood-pressure emergencies.",
    kind: "emergency",
  },
  {
    id: "obstetric-hospital",
    label: "Hospital with labor and delivery",
    query: "hospital labor and delivery",
    description:
      "Maternity units can assess postpartum bleeding, blood pressure, and infection. Call ahead to confirm they take postpartum walk-ins.",
    kind: "hospital",
  },
  {
    id: "maternal-fetal-medicine",
    label: "Maternal-fetal medicine",
    query: "maternal fetal medicine specialist",
    description:
      "Specialist clinics for high-risk pregnancy and postpartum complications. Usually by referral and during business hours.",
    kind: "hospital",
  },
  {
    id: "urgent-care",
    label: "Urgent care",
    query: "urgent care",
    description:
      "For minor concerns only. Urgent care cannot manage postpartum hemorrhage, severe blood pressure, or suspected blood clots.",
    kind: "urgent-care",
  },
];

function locationSuffix(location?: string, coordinates?: Coordinates): string {
  if (coordinates) {
    return ` near ${coordinates.latitude.toFixed(4)},${coordinates.longitude.toFixed(4)}`;
  }
  if (location && location.trim().length > 0) {
    return ` near ${location.trim()}`;
  }
  return " near me";
}

export function googleMapsSearchUrl(
  query: string,
  options: { location?: string; coordinates?: Coordinates } = {},
): string {
  const search = `${query}${locationSuffix(options.location, options.coordinates)}`;
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(search)}`;
}

export function appleMapsSearchUrl(
  query: string,
  options: { location?: string; coordinates?: Coordinates } = {},
): string {
  const params = new URLSearchParams({ q: query });
  if (options.coordinates) {
    params.set(
      "sll",
      `${options.coordinates.latitude},${options.coordinates.longitude}`,
    );
  } else if (options.location) {
    params.set("q", `${query} near ${options.location}`);
  }
  return `https://maps.apple.com/?${params.toString()}`;
}

export function directionsUrl(destination: string): string {
  return `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(
    destination,
  )}`;
}
