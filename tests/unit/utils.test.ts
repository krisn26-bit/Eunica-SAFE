import { describe, expect, it } from "vitest";

import {
  cn,
  createId,
  parseDateOnly,
  postpartumStage,
  smsHref,
  telHref,
  toDateOnly,
} from "@/lib/utils";

describe("date helpers", () => {
  it("parses a calendar date without shifting timezone", () => {
    const date = parseDateOnly("2026-03-04");
    expect(date?.getFullYear()).toBe(2026);
    expect(date?.getMonth()).toBe(2);
    expect(date?.getDate()).toBe(4);
  });

  it("rejects anything that is not a calendar date", () => {
    expect(parseDateOnly("")).toBeNull();
    expect(parseDateOnly("04/03/2026")).toBeNull();
    expect(parseDateOnly("2026-3-4")).toBeNull();
  });

  it("round-trips through toDateOnly", () => {
    const value = "2026-11-09";
    expect(toDateOnly(parseDateOnly(value) as Date)).toBe(value);
  });
});

describe("postpartumStage", () => {
  const today = new Date(2026, 8, 21);

  it("counts the day of birth as day one", () => {
    expect(postpartumStage("2026-09-21", today)?.day).toBe(1);
    expect(postpartumStage("2026-09-21", today)?.label).toBe(
      "Day 1 postpartum",
    );
  });

  it("counts weeks from the day of birth", () => {
    expect(postpartumStage("2026-09-15", today)?.day).toBe(7);
    expect(postpartumStage("2026-09-15", today)?.week).toBe(1);
    expect(postpartumStage("2026-09-14", today)?.week).toBe(2);
  });

  it("handles a due date in the future", () => {
    const stage = postpartumStage("2026-10-01", today);
    expect(stage?.day).toBe(0);
    expect(stage?.label).toContain("until your due date");
  });

  it("returns null for an unparseable date", () => {
    expect(postpartumStage("not-a-date", today)).toBeNull();
  });

  it("never reassures, at any point in recovery", () => {
    const dates = [
      "2026-09-21",
      "2026-09-18",
      "2026-09-01",
      "2026-07-01",
      "2025-09-21",
    ];
    for (const date of dates) {
      const note = postpartumStage(date, today)?.note.toLowerCase() ?? "";
      expect(note).not.toContain("you are fine");
      expect(note).not.toContain("nothing to worry");
      expect(note).not.toContain("out of danger");
      expect(note).not.toContain("no longer at risk");
    }
  });

  it("still warns about risk a year after birth", () => {
    const stage = postpartumStage("2025-12-01", today);
    expect(stage?.note.toLowerCase()).toContain("complications");
  });
});

describe("link helpers", () => {
  it("strips formatting from phone numbers", () => {
    expect(telHref("1-833-852-6262")).toBe("tel:18338526262");
    expect(telHref("(215) 555 0199")).toBe("tel:2155550199");
    expect(telHref("+1 800 799 7233")).toBe("tel:+18007997233");
  });

  it("builds sms links with and without a body", () => {
    expect(smsHref("988")).toBe("sms:988");
    expect(smsHref("988", "help me")).toContain("body=help%20me");
  });
});

describe("misc helpers", () => {
  it("joins class names and drops falsy values", () => {
    expect(cn("a", false && "b", undefined, "c")).toBe("a c");
  });

  it("creates distinct prefixed ids", () => {
    const first = createId("entry");
    const second = createId("entry");
    expect(first.startsWith("entry_")).toBe(true);
    expect(first).not.toBe(second);
  });
});
