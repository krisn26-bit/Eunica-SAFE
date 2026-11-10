import { describe, expect, it } from "vitest";

import {
  ACTION_LEVELS,
  ACTION_LEVEL_SEVERITY,
  NO_RED_FLAGS,
  RED_FLAG_QUESTION,
  RED_FLAG_RULES,
  SYMPTOMS,
  SYMPTOM_IDS,
  escalationLanguage,
  evaluateGuidance,
  getSymptom,
  guidanceShareText,
  hasRedFlag,
  higherLevel,
  isAtLeast,
  severityOf,
  type ActionLevel,
} from "@/lib/safety-rules";

const NO_FLAGS = { [RED_FLAG_QUESTION.id]: [NO_RED_FLAGS] };

describe("severity ordering", () => {
  it("ranks call-911 above every other level", () => {
    for (const level of ACTION_LEVEL_SEVERITY) {
      if (level === "call-911") continue;
      expect(severityOf("call-911")).toBeGreaterThan(severityOf(level));
    }
  });

  it("never lowers a level when combining", () => {
    for (const a of ACTION_LEVEL_SEVERITY) {
      for (const b of ACTION_LEVEL_SEVERITY) {
        const combined = higherLevel(a, b);
        expect(isAtLeast(combined, a)).toBe(true);
        expect(isAtLeast(combined, b)).toBe(true);
      }
    }
  });
});

describe("universal red flags", () => {
  const flagValues = RED_FLAG_QUESTION.options
    .map((option) => option.value)
    .filter((value) => value !== NO_RED_FLAGS);

  it("covers every red-flag option with a rule", () => {
    for (const value of flagValues) {
      const rule = RED_FLAG_RULES.find((candidate) =>
        candidate.when.some((condition) => condition.anyOf.includes(value)),
      );
      expect(rule, `no rule for red flag ${value}`).toBeDefined();
      expect(rule?.level).toBe("call-911");
    }
  });

  it("escalates to 911 for every symptom when a red flag is selected", () => {
    for (const value of flagValues) {
      for (const symptomId of SYMPTOM_IDS) {
        const guidance = evaluateGuidance({
          symptomId,
          answers: { [RED_FLAG_QUESTION.id]: [value] },
        });
        expect(guidance.level, `${symptomId} with red flag ${value}`).toBe(
          "call-911",
        );
      }
    }
  });

  it("detects red flags only when something other than none is selected", () => {
    expect(hasRedFlag({ [RED_FLAG_QUESTION.id]: [NO_RED_FLAGS] })).toBe(false);
    expect(hasRedFlag({})).toBe(false);
    expect(hasRedFlag({ [RED_FLAG_QUESTION.id]: ["chest-pain"] })).toBe(true);
  });
});

describe("symptom baselines", () => {
  it("never returns a level below the symptom baseline", () => {
    for (const symptom of SYMPTOMS) {
      const guidance = evaluateGuidance({
        symptomId: symptom.id,
        answers: NO_FLAGS,
      });
      expect(
        isAtLeast(guidance.level, symptom.baselineLevel),
        `${symptom.id} fell below its baseline`,
      ).toBe(true);
    }
  });

  it("always explains itself and always offers escalation language", () => {
    for (const symptom of SYMPTOMS) {
      const guidance = evaluateGuidance({
        symptomId: symptom.id,
        answers: NO_FLAGS,
      });
      expect(guidance.reasons.length).toBeGreaterThan(0);
      expect(guidance.escalation.length).toBeGreaterThan(0);
      expect(guidance.rulesVersion).toMatch(/^\d{4}\.\d{2}\.\d{2}/);
    }
  });

  it("is deterministic for identical answers", () => {
    const input = {
      symptomId: "heavy-bleeding",
      answers: {
        ...NO_FLAGS,
        "pad-rate": ["two-hours"],
        clots: ["small"],
      },
    };
    expect(evaluateGuidance(input)).toEqual(evaluateGuidance(input));
  });

  it("falls back to contacting the care team for an unknown symptom", () => {
    const guidance = evaluateGuidance({
      symptomId: "not-a-real-symptom",
      answers: NO_FLAGS,
    });
    expect(guidance.level).toBe("contact-team-promptly");
    expect(guidance.escalation.length).toBeGreaterThan(0);
  });

  it("escalates heavy bleeding that soaks a pad within an hour", () => {
    const guidance = evaluateGuidance({
      symptomId: "heavy-bleeding",
      answers: { ...NO_FLAGS, "pad-rate": ["hour-or-less"] },
    });
    expect(guidance.level).toBe("call-911");
  });

  it("escalates large clots", () => {
    const guidance = evaluateGuidance({
      symptomId: "heavy-bleeding",
      answers: { ...NO_FLAGS, clots: ["large"] },
    });
    expect(guidance.level).toBe("call-911");
  });
});

describe("reassurance is impossible", () => {
  const forbidden = [
    "you are fine",
    "you're fine",
    "nothing to worry about",
    "no need to worry",
    "this is normal",
    "probably nothing",
    "it is nothing",
    "don't worry",
    "do not worry",
    "no emergency",
    "not an emergency",
    "rule out",
  ];

  function assertNoReassurance(text: string, where: string) {
    const lower = text.toLowerCase();
    for (const phrase of forbidden) {
      // "cannot rule out" is the one allowed use of the phrase.
      if (phrase === "rule out" && lower.includes("cannot rule out")) continue;
      expect(lower.includes(phrase), `${where}: "${phrase}"`).toBe(false);
    }
  }

  it("never appears in action level copy", () => {
    for (const level of Object.values(ACTION_LEVELS)) {
      assertNoReassurance(level.headline, `${level.level} headline`);
      assertNoReassurance(level.meaning, `${level.level} meaning`);
    }
  });

  it("never appears in any produced guidance", () => {
    for (const symptom of SYMPTOMS) {
      const guidance = evaluateGuidance({
        symptomId: symptom.id,
        answers: NO_FLAGS,
      });
      for (const reason of guidance.reasons) {
        assertNoReassurance(reason, `${symptom.id} reason`);
      }
      for (const line of guidance.escalation) {
        assertNoReassurance(line, `${symptom.id} escalation`);
      }
    }
  });

  it("offers a way to seek emergency help at every level", () => {
    for (const level of ACTION_LEVEL_SEVERITY) {
      const lines = escalationLanguage(level).join(" ").toLowerCase();
      expect(lines, level).toContain("911");
    }
  });
});

describe("rule integrity", () => {
  it("has unique symptom ids", () => {
    expect(new Set(SYMPTOM_IDS).size).toBe(SYMPTOM_IDS.length);
  });

  it("has unique rule ids across the whole rule set", () => {
    const ids = [
      ...RED_FLAG_RULES.map((rule) => rule.id),
      ...SYMPTOMS.flatMap((symptom) => symptom.rules.map((rule) => rule.id)),
    ];
    expect(new Set(ids).size).toBe(ids.length);
  });

  it("only references questions that exist on the symptom", () => {
    for (const symptom of SYMPTOMS) {
      const questionIds = new Set([
        RED_FLAG_QUESTION.id,
        "onset",
        "trend",
        ...symptom.followUps.map((question) => question.id),
      ]);
      for (const rule of symptom.rules) {
        for (const condition of rule.when) {
          expect(
            questionIds.has(condition.questionId),
            `${symptom.id} rule ${rule.id} asks about ${condition.questionId}`,
          ).toBe(true);
        }
      }
    }
  });

  it("only references answer values that exist on the question", () => {
    for (const symptom of SYMPTOMS) {
      const byId = new Map(
        [RED_FLAG_QUESTION, ...symptom.followUps].map((question) => [
          question.id,
          new Set(question.options.map((option) => option.value)),
        ]),
      );
      for (const rule of symptom.rules) {
        for (const condition of rule.when) {
          const values = byId.get(condition.questionId);
          if (!values) continue;
          for (const value of condition.anyOf) {
            expect(
              values.has(value),
              `${symptom.id} rule ${rule.id} uses unknown value ${value}`,
            ).toBe(true);
          }
        }
      }
    }
  });

  it("only skips follow-up questions when the answer is already 911", () => {
    for (const symptom of SYMPTOMS) {
      if (symptom.followUps.length > 0) continue;
      expect(
        symptom.baselineLevel,
        `${symptom.id} asks nothing but does not go straight to 911`,
      ).toBe("call-911");
    }
  });

  it("gives every symptom a baseline reason", () => {
    for (const symptom of SYMPTOMS) {
      expect(symptom.baselineReason.length, symptom.id).toBeGreaterThan(20);
    }
  });

  it("points every warning-sign link at a real level", () => {
    const levels = new Set<ActionLevel>(ACTION_LEVEL_SEVERITY);
    for (const symptom of SYMPTOMS) {
      expect(levels.has(symptom.baselineLevel)).toBe(true);
      for (const rule of symptom.rules) {
        expect(levels.has(rule.level), `${rule.id}`).toBe(true);
      }
    }
  });

  it("resolves symptoms by id", () => {
    expect(getSymptom("heavy-bleeding")?.label).toBeTruthy();
    expect(getSymptom("nope")).toBeUndefined();
  });
});

describe("share text", () => {
  it("contains the action but no profile data", () => {
    const guidance = evaluateGuidance({
      symptomId: "severe-headache",
      answers: { ...NO_FLAGS },
    });
    const text = guidanceShareText(guidance);
    expect(text).toContain(guidance.presentation.headline);
    expect(text).toContain("911");
    expect(text.toLowerCase()).not.toContain("hospital:");
    expect(text.toLowerCase()).not.toContain("phone");
  });
});
