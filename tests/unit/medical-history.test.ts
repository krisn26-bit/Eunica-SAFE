import { describe, expect, it } from "vitest";

import {
  emphasisesBloodPressure,
  historyInsights,
} from "@/lib/medical-history/insights";
import {
  EMPTY_MEDICAL_HISTORY,
  isMedicalHistoryComplete,
  medicalHistorySchema,
  missingRequiredAnswers,
  type MedicalHistory,
} from "@/lib/medical-history/schema";

function history(overrides: Partial<MedicalHistory> = {}): MedicalHistory {
  return { ...EMPTY_MEDICAL_HISTORY, ...overrides };
}

const COMPLETE: Partial<MedicalHistory> = {
  deliveryDate: "2026-11-01",
  deliveryType: "vaginal",
  conditions: ["none"],
  consentAcknowledgedAt: "2026-11-02T10:00:00.000Z",
};

const FORBIDDEN_REASSURANCE = [
  "you are fine",
  "nothing to worry about",
  "low risk",
  "you are safe",
  "no need to worry",
  "unlikely to",
];

describe("medical history completeness", () => {
  it("is incomplete until every required answer is given", () => {
    expect(isMedicalHistoryComplete(history())).toBe(false);
    expect(missingRequiredAnswers(history())).toHaveLength(4);
  });

  it("is complete once the required answers are given", () => {
    expect(isMedicalHistoryComplete(history(COMPLETE))).toBe(true);
    expect(missingRequiredAnswers(history(COMPLETE))).toHaveLength(0);
  });

  it('accepts "not sure" as a real answer', () => {
    const unsure = history({
      ...COMPLETE,
      deliveryType: "not-sure",
      conditions: ["not-sure"],
    });
    expect(isMedicalHistoryComplete(unsure)).toBe(true);
  });

  it("requires consent before it counts as complete", () => {
    const withoutConsent = history({
      ...COMPLETE,
      consentAcknowledgedAt: undefined,
    });
    expect(isMedicalHistoryComplete(withoutConsent)).toBe(false);
    expect(missingRequiredAnswers(withoutConsent)).toContain(
      "your agreement to save this on this device",
    );
  });

  it("round-trips through the schema", () => {
    const parsed = medicalHistorySchema.parse({
      ...COMPLETE,
      conditions: ["preeclampsia", "gestational-diabetes"],
    });
    expect(parsed.conditions).toEqual(["preeclampsia", "gestational-diabetes"]);
    expect(parsed.pregnancyComplications).toEqual([]);
  });

  it("rejects an unknown condition rather than storing it", () => {
    const parsed = medicalHistorySchema.safeParse({
      conditions: ["not-a-real-condition"],
    });
    expect(parsed.success).toBe(false);
  });
});

describe("education selected from history", () => {
  it("adds nothing when nothing was reported", () => {
    expect(historyInsights(history({ ...COMPLETE }))).toHaveLength(0);
  });

  it("surfaces blood-pressure follow-up for each hypertensive history", () => {
    for (const condition of [
      "gestational-hypertension",
      "chronic-hypertension",
      "preeclampsia",
      "eclampsia",
      "hellp",
    ] as const) {
      const result = historyInsights(
        history({ ...COMPLETE, conditions: [condition] }),
      );
      expect(
        result.map((insight) => insight.id),
        `expected blood-pressure education for ${condition}`,
      ).toContain("blood-pressure");
      expect(
        emphasisesBloodPressure(history({ conditions: [condition] })),
      ).toBe(true);
    }
  });

  it("surfaces blood-pressure follow-up from a pregnancy complication alone", () => {
    const result = historyInsights(
      history({ ...COMPLETE, pregnancyComplications: ["preeclampsia"] }),
    );
    expect(result.map((i) => i.id)).toContain("blood-pressure");
  });

  it("surfaces incision care only for a cesarean", () => {
    const cesarean = historyInsights(
      history({ ...COMPLETE, deliveryType: "cesarean-unplanned" }),
    );
    expect(cesarean.map((i) => i.id)).toContain("cesarean-incision");

    const vaginal = historyInsights(
      history({ ...COMPLETE, deliveryType: "vaginal" }),
    );
    expect(vaginal.map((i) => i.id)).not.toContain("cesarean-incision");
  });

  it("surfaces perineal healing for a tear or episiotomy, not for neither", () => {
    for (const outcome of ["laceration", "episiotomy", "both"] as const) {
      const result = historyInsights(
        history({ ...COMPLETE, perinealOutcome: outcome }),
      );
      expect(result.map((i) => i.id)).toContain("perineal-recovery");
    }
    const none = historyInsights(
      history({ ...COMPLETE, perinealOutcome: "neither" }),
    );
    expect(none.map((i) => i.id)).not.toContain("perineal-recovery");
  });

  it("surfaces clot signs for a clotting history", () => {
    const result = historyInsights(
      history({ ...COMPLETE, conditions: ["previous-clot"] }),
    );
    expect(result.map((i) => i.id)).toContain("clots");
  });

  it("surfaces urgent wording for previous postpartum psychosis", () => {
    const result = historyInsights(
      history({ ...COMPLETE, conditions: ["postpartum-psychosis"] }),
    );
    const mentalHealth = result.find((i) => i.id === "mental-health");
    expect(mentalHealth).toBeDefined();
    expect(mentalHealth?.body).toMatch(/urgent|911/i);
  });

  it("surfaces glucose follow-up after gestational diabetes", () => {
    const result = historyInsights(
      history({ ...COMPLETE, conditions: ["gestational-diabetes"] }),
    );
    expect(result.map((i) => i.id)).toContain("glucose-follow-up");
  });

  it("surfaces bleeding education after a postpartum haemorrhage", () => {
    const result = historyInsights(
      history({ ...COMPLETE, deliveryComplications: ["transfusion"] }),
    );
    expect(result.map((i) => i.id)).toContain("bleeding");
  });

  it("always says which answer produced each insight", () => {
    const result = historyInsights(
      history({
        ...COMPLETE,
        deliveryType: "cesarean-planned",
        conditions: ["preeclampsia", "previous-clot"],
      }),
    );
    expect(result.length).toBeGreaterThan(2);
    for (const insight of result) {
      expect(insight.becauseYouTold).toMatch(/^You told us/);
      expect(insight.becauseYouTold.length).toBeGreaterThan(20);
    }
  });

  it("never reassures, in any combination of answers", () => {
    const combinations: Partial<MedicalHistory>[] = [
      { conditions: ["none"] },
      { conditions: ["not-sure"] },
      { conditions: ["preeclampsia"] },
      { conditions: ["chronic-hypertension", "diabetes"] },
      { conditions: ["previous-clot", "clotting-disorder"] },
      { conditions: ["postpartum-psychosis"] },
      { conditions: ["perinatal-mood"] },
      { deliveryType: "cesarean-planned", conditions: ["none"] },
      { perinealOutcome: "both", conditions: ["none"] },
      { deliveryComplications: ["heavy-bleeding"], conditions: ["none"] },
      {
        pregnancyComplications: ["gestational-diabetes"],
        conditions: ["none"],
      },
    ];

    for (const overrides of combinations) {
      for (const insight of historyInsights(
        history({ ...COMPLETE, ...overrides }),
      )) {
        const text = `${insight.title} ${insight.body}`.toLowerCase();
        for (const phrase of FORBIDDEN_REASSURANCE) {
          expect(
            text,
            `"${phrase}" must not appear in the ${insight.id} insight`,
          ).not.toContain(phrase);
        }
      }
    }
  });

  it("never claims to diagnose, predict, or score risk", () => {
    const result = historyInsights(
      history({
        ...COMPLETE,
        conditions: ["preeclampsia", "previous-clot", "perinatal-mood"],
        deliveryType: "cesarean-planned",
        perinealOutcome: "both",
        deliveryComplications: ["heavy-bleeding"],
      }),
    );
    expect(result.length).toBeGreaterThan(3);

    for (const insight of result) {
      const text = `${insight.title} ${insight.body}`.toLowerCase();
      for (const phrase of [
        "you will develop",
        "you are likely to",
        "your risk is",
        "high risk",
        "increased risk",
        "diagnos",
        "we think you",
      ]) {
        expect(
          text,
          `"${phrase}" must not appear in the ${insight.id} insight`,
        ).not.toContain(phrase);
      }
    }
  });

  it("states plainly that a hypertensive history is not a current diagnosis", () => {
    const [insight] = historyInsights(
      history({ ...COMPLETE, conditions: ["preeclampsia"] }),
    );
    expect(insight.id).toBe("blood-pressure");
    expect(insight.body).toMatch(
      /not a sign that you have high blood pressure now/i,
    );
  });
});
