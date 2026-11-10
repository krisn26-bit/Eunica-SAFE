import { beforeEach, describe, expect, it } from "vitest";

import {
  STORAGE_KEYS,
  buildExportBundle,
  clearAllRecords,
  isStorageAvailable,
  readRecord,
  removeRecord,
  writeRecord,
} from "@/lib/storage/local-store";
import {
  EMPTY_SAFETY_PLAN,
  exportBundleSchema,
  safetyPlanSchema,
} from "@/lib/validation/schemas";

describe("local store", () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  it("is available in a normal browser environment", () => {
    expect(isStorageAvailable()).toBe(true);
  });

  it("namespaces and versions every key", () => {
    for (const key of Object.values(STORAGE_KEYS)) {
      expect(key.startsWith("eunica-safe.v1.")).toBe(true);
    }
  });

  it("round-trips a validated record", () => {
    const plan = safetyPlanSchema.parse({
      hospital: { name: "Example Hospital" },
    });
    expect(writeRecord(STORAGE_KEYS.safetyPlan, plan)).toBe(true);
    const read = readRecord(
      STORAGE_KEYS.safetyPlan,
      safetyPlanSchema,
      EMPTY_SAFETY_PLAN,
    );
    expect(read.hospital.name).toBe("Example Hospital");
  });

  it("falls back rather than throwing on corrupted data", () => {
    window.localStorage.setItem(STORAGE_KEYS.safetyPlan, "{not json");
    expect(
      readRecord(STORAGE_KEYS.safetyPlan, safetyPlanSchema, EMPTY_SAFETY_PLAN),
    ).toEqual(EMPTY_SAFETY_PLAN);
  });

  it("falls back when stored data fails validation", () => {
    window.localStorage.setItem(
      STORAGE_KEYS.safetyPlan,
      JSON.stringify({ deliveryDate: "yesterday" }),
    );
    expect(
      readRecord(STORAGE_KEYS.safetyPlan, safetyPlanSchema, EMPTY_SAFETY_PLAN),
    ).toEqual(EMPTY_SAFETY_PLAN);
  });

  it("notifies listeners when a record changes", () => {
    let notified = 0;
    const listener = () => {
      notified += 1;
    };
    window.addEventListener("eunica-safe:storage", listener);
    writeRecord(STORAGE_KEYS.preferences, {
      locationConsent: false,
      reduceMotion: false,
    });
    removeRecord(STORAGE_KEYS.preferences);
    window.removeEventListener("eunica-safe:storage", listener);
    expect(notified).toBe(2);
  });

  it("deletes every namespaced record and nothing else", () => {
    window.localStorage.setItem("unrelated-app.key", "keep me");
    writeRecord(STORAGE_KEYS.safetyPlan, EMPTY_SAFETY_PLAN);
    writeRecord(STORAGE_KEYS.recovery, { entries: [], appointments: [] });
    clearAllRecords();
    for (const key of Object.values(STORAGE_KEYS)) {
      expect(window.localStorage.getItem(key)).toBeNull();
    }
    expect(window.localStorage.getItem("unrelated-app.key")).toBe("keep me");
  });

  it("exports a bundle that matches its own schema", () => {
    writeRecord(
      STORAGE_KEYS.safetyPlan,
      safetyPlanSchema.parse({ hospital: { name: "Example Hospital" } }),
    );
    const bundle = buildExportBundle();
    expect(exportBundleSchema.safeParse(bundle).success).toBe(true);
    expect(bundle.safetyPlan?.hospital?.name).toBe("Example Hospital");
  });
});
