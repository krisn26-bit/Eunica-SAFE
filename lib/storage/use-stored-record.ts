"use client";

import { useCallback, useEffect, useState } from "react";
import type { ZodType } from "zod";

import {
  STORAGE_EVENT,
  readRecord,
  removeRecord,
  writeRecord,
  type StorageKey,
} from "./local-store";

type StoredRecord<T> = {
  value: T;
  /** False until the browser value has been read, so SSR markup stays stable. */
  isReady: boolean;
  save: (next: T) => boolean;
  update: (updater: (current: T) => T) => boolean;
  clear: () => void;
};

/**
 * Reads and writes one namespaced local record. Hydration happens in an effect
 * so the server-rendered output never depends on device storage.
 */
export function useStoredRecord<T>(
  key: StorageKey,
  schema: ZodType<T>,
  fallback: T,
): StoredRecord<T> {
  const [value, setValue] = useState<T>(fallback);
  const [isReady, setIsReady] = useState(false);

  const read = useCallback(() => {
    setValue(readRecord(key, schema, fallback));
    setIsReady(true);
    // `fallback` and `schema` are module-level constants in every call site.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key]);

  useEffect(() => {
    read();
  }, [read]);

  useEffect(() => {
    function handle(event: Event) {
      const detail = (event as CustomEvent<{ key: string }>).detail;
      if (!detail || detail.key === key) read();
    }
    window.addEventListener(STORAGE_EVENT, handle);
    window.addEventListener("storage", handle);
    return () => {
      window.removeEventListener(STORAGE_EVENT, handle);
      window.removeEventListener("storage", handle);
    };
  }, [key, read]);

  const save = useCallback(
    (next: T) => {
      setValue(next);
      return writeRecord(key, next);
    },
    [key],
  );

  const update = useCallback(
    (updater: (current: T) => T) => {
      const next = updater(readRecord(key, schema, value));
      setValue(next);
      return writeRecord(key, next);
      // eslint-disable-next-line react-hooks/exhaustive-deps
    },
    [key, value],
  );

  const clear = useCallback(() => {
    removeRecord(key);
    setValue(fallback);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key]);

  return { value, isReady, save, update, clear };
}
