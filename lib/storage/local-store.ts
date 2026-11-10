import type { ZodType } from "zod";

import {
  EMPTY_MEDICAL_HISTORY,
  medicalHistorySchema,
} from "@/lib/medical-history/schema";
import {
  EMPTY_RECOVERY_LOG,
  EMPTY_SAFETY_PLAN,
  EXPORT_FORMAT_VERSION,
  preferencesSchema,
  recoveryLogSchema,
  safetyPlanSchema,
  savedLocationSchema,
  type ExportBundle,
} from "@/lib/validation/schemas";

/**
 * Local-first storage.
 *
 * Nothing a user types is sent anywhere. There is no database, no account, and
 * no analytics in this build, so `localStorage` on the user's own device is the
 * entire data layer (spec §7, §9). Keys are namespaced and versioned so that a
 * future migration can be explicit rather than silent.
 */

const NAMESPACE = "eunica-safe.v1";

export const STORAGE_KEYS = {
  preferences: `${NAMESPACE}.preferences`,
  safetyPlan: `${NAMESPACE}.safety-plan`,
  medicalHistory: `${NAMESPACE}.medical-history`,
  recovery: `${NAMESPACE}.recovery`,
  location: `${NAMESPACE}.location`,
} as const;

export type StorageKey = (typeof STORAGE_KEYS)[keyof typeof STORAGE_KEYS];

export const STORAGE_EVENT = "eunica-safe:storage";

export function isStorageAvailable(): boolean {
  if (typeof window === "undefined") return false;
  try {
    const probe = `${NAMESPACE}.probe`;
    window.localStorage.setItem(probe, "1");
    window.localStorage.removeItem(probe);
    return true;
  } catch {
    return false;
  }
}

function notify(key: StorageKey) {
  if (typeof window === "undefined") return;
  window.dispatchEvent(new CustomEvent(STORAGE_EVENT, { detail: { key } }));
}

/**
 * One pair of window listeners for the whole app, however many components read
 * stored records. Subscribers are fanned out from here instead of each hook
 * instance registering its own listeners.
 */
const subscribers = new Set<() => void>();
let listening = false;

function broadcast() {
  for (const subscriber of subscribers) subscriber();
}

export function subscribeToStorage(onChange: () => void): () => void {
  subscribers.add(onChange);
  if (!listening) {
    window.addEventListener(STORAGE_EVENT, broadcast);
    window.addEventListener("storage", broadcast);
    listening = true;
  }
  return () => {
    subscribers.delete(onChange);
    if (subscribers.size === 0) {
      window.removeEventListener(STORAGE_EVENT, broadcast);
      window.removeEventListener("storage", broadcast);
      listening = false;
    }
  };
}

export function readRecord<T>(
  key: StorageKey,
  schema: ZodType<T>,
  fallback: T,
): T {
  if (!isStorageAvailable()) return fallback;
  try {
    const raw = window.localStorage.getItem(key);
    if (!raw) return fallback;
    const parsed = schema.safeParse(JSON.parse(raw));
    return parsed.success ? parsed.data : fallback;
  } catch {
    return fallback;
  }
}

export function writeRecord<T>(key: StorageKey, value: T): boolean {
  if (!isStorageAvailable()) return false;
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
    notify(key);
    return true;
  } catch {
    return false;
  }
}

export function removeRecord(key: StorageKey): void {
  if (!isStorageAvailable()) return;
  window.localStorage.removeItem(key);
  notify(key);
}

export function clearAllRecords(): void {
  if (!isStorageAvailable()) return;
  for (const key of Object.values(STORAGE_KEYS)) {
    window.localStorage.removeItem(key);
    notify(key);
  }
}

export function buildExportBundle(): ExportBundle {
  return {
    app: "eunica-safe",
    formatVersion: EXPORT_FORMAT_VERSION,
    exportedAt: new Date().toISOString(),
    preferences: readRecord(STORAGE_KEYS.preferences, preferencesSchema, {
      locationConsent: false,
      reduceMotion: false,
    }),
    safetyPlan: readRecord(
      STORAGE_KEYS.safetyPlan,
      safetyPlanSchema,
      EMPTY_SAFETY_PLAN,
    ),
    medicalHistory: readRecord(
      STORAGE_KEYS.medicalHistory,
      medicalHistorySchema,
      EMPTY_MEDICAL_HISTORY,
    ),
    recovery: readRecord(
      STORAGE_KEYS.recovery,
      recoveryLogSchema,
      EMPTY_RECOVERY_LOG,
    ),
  };
}

/** Writes the user's own data to a file they control. No network request. */
export function downloadExport(): void {
  if (typeof window === "undefined") return;
  const bundle = buildExportBundle();
  const blob = new Blob([JSON.stringify(bundle, null, 2)], {
    type: "application/json",
  });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = `eunica-safe-export-${new Date().toISOString().slice(0, 10)}.json`;
  document.body.appendChild(anchor);
  anchor.click();
  anchor.remove();
  URL.revokeObjectURL(url);
}

export const locationStore = {
  key: STORAGE_KEYS.location,
  schema: savedLocationSchema,
};
