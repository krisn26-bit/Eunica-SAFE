import { describe, expect, it } from "vitest";

import { parseTemperatureToF, recoveryPrompts } from "@/lib/recovery/prompts";
import { SYMPTOM_IDS } from "@/lib/safety-rules";

describe("parseTemperatureToF", () => {
  it("reads Fahrenheit", () => {
    expect(parseTemperatureToF("100.4")).toBeCloseTo(100.4);
    expect(parseTemperatureToF("101 F")).toBeCloseTo(101);
    expect(parseTemperatureToF("99.1°f")).toBeCloseTo(99.1);
  });

  it("converts Celsius", () => {
    expect(parseTemperatureToF("38 C")).toBeCloseTo(100.4);
    expect(parseTemperatureToF("37c")).toBeCloseTo(98.6);
  });

  it("treats an unlabelled low number as Celsius", () => {
    expect(parseTemperatureToF("38")).toBeCloseTo(100.4);
  });

  it("returns null when there is no number", () => {
    expect(parseTemperatureToF("warm")).toBeNull();
    expect(parseTemperatureToF("")).toBeNull();
  });
});

describe("recoveryPrompts", () => {
  it("says nothing when nothing crosses a published threshold", () => {
    expect(
      recoveryPrompts({
        painLevel: 2,
        bleeding: "lighter",
        temperature: "98.6",
        mood: "tired",
      }),
    ).toHaveLength(0);
  });

  it("prompts on heavier bleeding and on clots", () => {
    expect(recoveryPrompts({ bleeding: "heavier" })[0]?.id).toBe(
      "bleeding-heavier",
    );
    expect(recoveryPrompts({ bleeding: "clots" })[0]?.id).toBe(
      "bleeding-clots",
    );
  });

  it("prompts at the fever threshold in both units", () => {
    expect(recoveryPrompts({ temperature: "100.4" })).toHaveLength(1);
    expect(recoveryPrompts({ temperature: "38 C" })).toHaveLength(1);
    expect(recoveryPrompts({ temperature: "100.3" })).toHaveLength(0);
  });

  it("prompts on severe pain", () => {
    expect(recoveryPrompts({ painLevel: 7 })).toHaveLength(1);
    expect(recoveryPrompts({ painLevel: 6 })).toHaveLength(0);
  });

  it("prompts on low or overwhelmed mood", () => {
    expect(recoveryPrompts({ mood: "low" })[0]?.id).toBe("mood");
    expect(recoveryPrompts({ mood: "overwhelmed" })[0]?.id).toBe("mood");
    expect(recoveryPrompts({ mood: "steady" })).toHaveLength(0);
  });

  it("links only to symptoms the questionnaire has", () => {
    const ids = new Set(SYMPTOM_IDS);
    const all = [
      ...recoveryPrompts({ bleeding: "heavier" }),
      ...recoveryPrompts({ bleeding: "clots" }),
      ...recoveryPrompts({ temperature: "101" }),
      ...recoveryPrompts({ painLevel: 9 }),
      ...recoveryPrompts({ mood: "low" }),
    ];
    expect(all.length).toBeGreaterThan(0);
    for (const prompt of all) {
      if (!prompt.symptomId) continue;
      expect(ids.has(prompt.symptomId), prompt.symptomId).toBe(true);
    }
  });

  it("never interprets an entry or reassures the reader", () => {
    const all = [
      ...recoveryPrompts({ bleeding: "heavier" }),
      ...recoveryPrompts({ temperature: "101" }),
      ...recoveryPrompts({ painLevel: 9 }),
      ...recoveryPrompts({ mood: "overwhelmed" }),
    ];
    for (const prompt of all) {
      const message = prompt.message.toLowerCase();
      expect(message).not.toContain("you have");
      expect(message).not.toContain("you are fine");
      expect(message).not.toContain("looks normal");
      expect(message).not.toContain("diagnos");
    }
  });
});
