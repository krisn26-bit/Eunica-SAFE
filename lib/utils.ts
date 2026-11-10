import clsx, { type ClassValue } from "clsx";

export function cn(...inputs: ClassValue[]): string {
  return clsx(inputs);
}

const MS_PER_DAY = 86_400_000;

const DATE_ONLY_PATTERN = /^(\d{4})-(\d{2})-(\d{2})$/;
const NON_DIALABLE_PATTERN = /[^\d+]/g;

/** Parses a `YYYY-MM-DD` string as a local calendar date (no timezone shift). */
export function parseDateOnly(value: string): Date | null {
  const match = DATE_ONLY_PATTERN.exec(value.trim());
  if (!match) return null;
  const [, year, month, day] = match;
  const date = new Date(Number(year), Number(month) - 1, Number(day));
  if (Number.isNaN(date.getTime())) return null;
  return date;
}

export function toDateOnly(date: Date): string {
  const month = `${date.getMonth() + 1}`.padStart(2, "0");
  const day = `${date.getDate()}`.padStart(2, "0");
  return `${date.getFullYear()}-${month}-${day}`;
}

export type PostpartumStage = {
  day: number;
  week: number;
  /** Plain-language description of where the user is in recovery. */
  label: string;
  note: string;
};

/**
 * Postpartum timing is educational context only — it never changes urgency
 * guidance. Day 1 is the day of birth.
 */
export function postpartumStage(
  deliveryDate: string,
  today: Date = new Date(),
): PostpartumStage | null {
  const delivery = parseDateOnly(deliveryDate);
  if (!delivery) return null;

  const startOfToday = new Date(
    today.getFullYear(),
    today.getMonth(),
    today.getDate(),
  );
  const elapsedDays = Math.floor(
    (startOfToday.getTime() - delivery.getTime()) / MS_PER_DAY,
  );
  if (elapsedDays < 0) {
    const daysUntil = Math.abs(elapsedDays);
    return {
      day: 0,
      week: 0,
      label: `${daysUntil} ${daysUntil === 1 ? "day" : "days"} until your due date`,
      note: "You can set up your safety plan now so it is ready when you need it.",
    };
  }

  const day = elapsedDays + 1;
  const week = Math.floor(elapsedDays / 7) + 1;

  let note =
    "Most serious postpartum complications happen in the first six weeks, but they can happen later too.";
  if (day <= 7) {
    note =
      "The first week carries the highest risk of heavy bleeding and blood-pressure problems. Trust changes you notice.";
  } else if (day <= 42) {
    note =
      "Warning signs can still appear during these weeks. Contact your care team about anything new or worsening.";
  } else if (day <= 365) {
    note =
      "Complications can appear up to a year after birth. Your symptoms still deserve attention.";
  }

  return {
    day,
    week,
    label: day === 1 ? "Day 1 postpartum" : `Day ${day} postpartum`,
    note,
  };
}

export function formatLongDate(value: string): string {
  const date = parseDateOnly(value) ?? new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleDateString(undefined, {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export function formatDateTime(isoTimestamp: string): string {
  const date = new Date(isoTimestamp);
  if (Number.isNaN(date.getTime())) return isoTimestamp;
  return date.toLocaleString(undefined, {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

/** Stable id generator that works in the browser and in tests. */
export function createId(prefix = "id"): string {
  const random =
    typeof crypto !== "undefined" && "randomUUID" in crypto
      ? crypto.randomUUID().slice(0, 8)
      : Math.random().toString(36).slice(2, 10);
  return `${prefix}_${random}`;
}

export function telHref(phone: string): string {
  return `tel:${phone.replace(NON_DIALABLE_PATTERN, "")}`;
}

export function smsHref(phone: string, body?: string): string {
  const number = phone.replace(NON_DIALABLE_PATTERN, "");
  return body
    ? `sms:${number}?&body=${encodeURIComponent(body)}`
    : `sms:${number}`;
}
