"use client";

import { useCallback, useMemo, useSyncExternalStore } from "react";
import type { ZodType } from "zod";

import {
  isStorageAvailable,
  removeRecord,
  subscribeToStorage,
  writeRecord,
  type StorageKey,
} from "./local-store";

/** Returned before hydration so server and client markup agree. */
const NOT_HYDRATED = "\u0000server";

type StoredRecord<T> = {
  value: T;
  /** False until the browser value has been read, so SSR markup stays stable. */
  isReady: boolean;
  save: (next: T) => boolean;
  update: (updater: (current: T) => T) => boolean;
  clear: () => void;
};

/**
 * Reads and writes one namespaced local record. Local storage is an external
 * store, so it is read through `useSyncExternalStore`: the first render always
 * matches the server, and every component sharing a key updates together.
 */
export function useStoredRecord<T>(
  key: StorageKey,
  schema: ZodType<T>,
  fallback: T,
): StoredRecord<T> {
  const getSnapshot = useCallback(() => {
    if (!isStorageAvailable()) return "";
    return window.localStorage.getItem(key) ?? "";
  }, [key]);

  const raw = useSyncExternalStore(
    subscribeToStorage,
    getSnapshot,
    () => NOT_HYDRATED,
  );

  const isReady = raw !== NOT_HYDRATED;

  const value = useMemo(() => {
    if (!isReady || raw === "") return fallback;
    try {
      const parsed = schema.safeParse(JSON.parse(raw));
      return parsed.success ? parsed.data : fallback;
    } catch {
      return fallback;
    }
    // `schema` and `fallback` are module-level constants at every call site.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [raw, isReady]);

  const save = useCallback((next: T) => writeRecord(key, next), [key]);

  const update = useCallback(
    (updater: (current: T) => T) => writeRecord(key, updater(value)),
    [key, value],
  );

  const clear = useCallback(() => removeRecord(key), [key]);

  return { value, isReady, save, update, clear };
}
