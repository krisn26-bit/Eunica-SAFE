import { describe, expect, it } from "vitest";

import { getWarningSign } from "@/content/warning-signs";
import { evaluateGuidance } from "@/lib/safety-rules/engine";
import {
  NO_RED_FLAGS,
  RED_FLAGS_QUESTION_ID,
  getSymptom,
} from "@/lib/safety-rules/rules";

const sign = getWarningSign("high-blood-pressure");

function guidance(answers: Record<string, string[]>) {
  return evaluateGuidance({
    symptomId: "high-blood-pressure",
    answers: { [RED_FLAGS_QUESTION_ID]: [NO_RED_FLAGS], ...answers },
  });
}

describe("blood-pressure warning sign content", () => {
  it("separates the elevated and severe-range bands", () => {
    expect(sign).toBeDefined();
    const tiers = sign!.tiers ?? [];
    expect(tiers.map((t) => t.id)).toEqual(["elevated", "severe-range"]);
  });

  it("does not put an elevated reading at an emergency level", () => {
    const elevated = sign!.tiers!.find((t) => t.id === "elevated")!;
    expect(elevated.level).toBe("contact-team-promptly");
    const text = JSON.stringify(elevated).toLowerCase();
    expect(text).not.toContain("911");
    expect(text).not.toContain("emergency department");
  });

  it("tells an elevated reading to be repeated and then reported promptly", () => {
    const elevated = sign!.tiers!.find((t) => t.id === "elevated")!;
    const steps = elevated.whatToDo.join(" ").toLowerCase();
    expect(steps).toContain("repeat");
    expect(steps).toContain("promptly");
    expect(elevated.doNot?.join(" ").toLowerCase()).toContain(
      "before you call",
    );
  });

  it("sends a severe-range reading for immediate evaluation without a repeat", () => {
    const severe = sign!.tiers!.find((t) => t.id === "severe-range")!;
    expect(severe.level).toBe("emergency-now");
    expect(severe.whatToDo.join(" ").toLowerCase()).toContain("immediately");
    expect(severe.doNot?.join(" ").toLowerCase()).toContain(
      "do not wait and take another reading",
    );
  });

  it("treats either number on its own as severe range", () => {
    const severe = sign!.tiers!.find((t) => t.id === "severe-range")!;
    const looks = severe.looksLike.join(" ").toLowerCase();
    expect(looks).toContain("160");
    expect(looks).toContain("110");
    expect(looks).toContain("on its own");
  });

  it("reserves 911 for severe symptoms and unreachable emergency care", () => {
    const when = sign!.call911When.join(" ").toLowerCase();
    for (const symptom of ["seizure", "chest pain", "breathing", "speaking"]) {
      expect(when).toContain(symptom);
    }
    expect(when).toContain("safely and immediately");
  });

  it("cites published sources for its thresholds", () => {
    const orgs = (sign!.references ?? []).map((r) => r.organisation);
    expect(orgs).toContain("ACOG");
    expect(orgs.length).toBeGreaterThan(2);
    for (const reference of sign!.references ?? []) {
      expect(reference.url).toMatch(/^https:\/\//);
    }
  });
});

describe("blood-pressure triage levels", () => {
  it("asks about the reading before deciding anything", () => {
    const symptom = getSymptom("high-blood-pressure")!;
    const reading = symptom.followUps.find((q) => q.id === "bp-reading")!;
    expect(reading.options.map((o) => o.value)).toContain("160-110");
    expect(reading.help?.toLowerCase()).toContain("rest");
  });

  it("does not escalate an elevated reading with no symptoms to an emergency", () => {
    const result = guidance({
      "bp-reading": ["140-90"],
      "bp-symptoms": ["none"],
    });
    expect(result.level).toBe("contact-team-promptly");
  });

  it("escalates a severe-range reading with no symptoms", () => {
    const result = guidance({
      "bp-reading": ["160-110"],
      "bp-symptoms": ["none"],
    });
    expect(result.level).toBe("emergency-now");
  });

  it("escalates an elevated reading once symptoms are present", () => {
    for (const symptom of ["headache", "vision", "rib-pain", "swelling"]) {
      const result = guidance({
        "bp-reading": ["140-90"],
        "bp-symptoms": [symptom],
      });
      expect(result.level, `symptom: ${symptom}`).toBe("emergency-now");
    }
  });

  it("escalates symptoms even when no reading is available", () => {
    const result = guidance({
      "bp-reading": ["unknown"],
      "bp-symptoms": ["headache"],
    });
    expect(result.level).toBe("emergency-now");
  });

  it("calls 911 for breathing difficulty with a high reading", () => {
    const result = guidance({
      "bp-reading": ["160-110"],
      "bp-symptoms": ["breathless"],
    });
    expect(result.level).toBe("call-911");
  });

  it("calls 911 for a seizure regardless of the reading", () => {
    const result = evaluateGuidance({
      symptomId: "high-blood-pressure",
      answers: {
        [RED_FLAGS_QUESTION_ID]: ["seizure"],
        "bp-reading": ["below-140"],
      },
    });
    expect(result.level).toBe("call-911");
  });

  it("never reads a normal number as proof of safety", () => {
    const result = guidance({
      "bp-reading": ["below-140"],
      "bp-symptoms": ["none"],
    });
    const text = JSON.stringify(result).toLowerCase();
    for (const phrase of [
      "you are safe",
      "you are fine",
      "no need",
      "normal",
    ]) {
      expect(text, `"${phrase}" must not appear`).not.toContain(phrase);
    }
  });
});
