import { describe, expect, it } from "vitest";

import { SKIN_TONE_NOTE } from "@/content/meta";
import { WARNING_SIGNS, getWarningSign } from "@/content/warning-signs";
import { evaluateGuidance } from "@/lib/safety-rules/engine";
import {
  NO_RED_FLAGS,
  RED_FLAGS_QUESTION_ID,
  SYMPTOMS,
  getSymptom,
} from "@/lib/safety-rules/rules";

const wound = getWarningSign("incision-or-wound-concerns")!;

function guidance(answers: Record<string, string[]>) {
  return evaluateGuidance({
    symptomId: "incision-or-wound-concerns",
    answers: { [RED_FLAGS_QUESTION_ID]: [NO_RED_FLAGS], ...answers },
  });
}

describe("wound and incision content", () => {
  it("covers every sign the clinical brief lists", () => {
    const text = [
      ...wound.looksLike,
      ...(wound.tiers ?? []).flatMap((t) => t.looksLike),
    ]
      .join(" ")
      .toLowerCase();
    for (const sign of [
      "pain",
      "swelling",
      "warm",
      "drainage",
      "pus",
      "smell",
      "pulling apart",
      "bleeding",
      "100.4",
    ]) {
      expect(text, `missing: ${sign}`).toContain(sign);
    }
  });

  it("does not treat every incision concern as an emergency", () => {
    const levels = (wound.tiers ?? []).map((t) => t.level);
    expect(levels).toEqual([
      "emergency-now",
      "contact-team-promptly",
      "monitor-and-contact",
    ]);
  });

  it("gives routine healing a band of its own", () => {
    const routine = wound.tiers!.find((t) => t.id === "routine")!;
    expect(routine.looksLike.join(" ").toLowerCase()).toContain("itching");
    expect(routine.doNot?.join(" ").toLowerCase()).toContain(
      "feels wrong to you",
    );
  });

  it("teaches cesarean and perineal recovery separately", () => {
    const headings = (wound.sections ?? []).map((s) => s.heading);
    expect(headings).toContain("If you had a cesarean");
    expect(headings).toContain("If you had a tear or an episiotomy");
  });

  it("explains why noticing early matters", () => {
    expect(wound.whyItMatters.toLowerCase()).toContain("earl");
    expect(wound.whyItMatters.toLowerCase()).toContain("antibiotic");
  });

  it("cites published sources", () => {
    expect((wound.references ?? []).length).toBeGreaterThan(1);
  });
});

describe("skin tone representation", () => {
  it("carries the skin-tone note on every sign that depends on how skin looks", () => {
    for (const slug of [
      "incision-or-wound-concerns",
      "leg-pain-or-swelling",
      "breast-infection",
    ]) {
      expect(getWarningSign(slug)?.skinToneNote, slug).toBe(true);
    }
  });

  it("does not describe inflammation as redness alone", () => {
    for (const sign of WARNING_SIGNS) {
      const skinLines = sign.looksLike.filter((line) =>
        /\bred\b|\bredness\b/i.test(line),
      );
      for (const line of skinLines) {
        expect(
          /purple|brown|darker|discolou?r/i.test(line),
          `"${line}" in ${sign.slug} offers redness as the only colour cue`,
        ).toBe(true);
      }
    }
  });

  it("names more than one appearance in the shared note", () => {
    for (const word of ["purple", "brown", "grey", "darker", "warmth"]) {
      expect(SKIN_TONE_NOTE.toLowerCase()).toContain(word);
    }
  });

  it("does not offer redness as the only colour cue in triage options", () => {
    for (const symptom of SYMPTOMS) {
      for (const question of symptom.followUps) {
        for (const option of question.options) {
          if (!/\bred\b|\bredness\b/i.test(option.label)) continue;
          expect(
            /purple|brown|darker|discolou?r/i.test(option.label),
            `"${option.label}" in ${symptom.id}/${question.id}`,
          ).toBe(true);
        }
      }
    }
  });
});

describe("wound triage levels", () => {
  it("asks which wound is involved", () => {
    const symptom = getSymptom("incision-or-wound-concerns")!;
    const question = symptom.followUps.find((q) => q.id === "wound-type")!;
    expect(question.options.map((o) => o.value)).toEqual([
      "cesarean",
      "perineal",
      "other",
    ]);
  });

  it("keeps drainage without a fever at the prompt level", () => {
    const result = guidance({
      "wound-type": ["cesarean"],
      "wound-features": ["pus"],
      "wound-fever": ["no"],
    });
    expect(result.level).toBe("contact-team-promptly");
  });

  it("keeps increasing pain at the prompt level", () => {
    const result = guidance({
      "wound-type": ["perineal"],
      "wound-features": ["more-pain"],
      "wound-fever": ["no"],
    });
    expect(result.level).toBe("contact-team-promptly");
  });

  it("escalates drainage once a fever is present", () => {
    const result = guidance({
      "wound-type": ["cesarean"],
      "wound-features": ["pus"],
      "wound-fever": ["yes"],
    });
    expect(result.level).toBe("emergency-now");
  });

  it("escalates a wound that is opening or bleeding", () => {
    for (const feature of ["opening", "bleeding"]) {
      const result = guidance({
        "wound-type": ["cesarean"],
        "wound-features": [feature],
        "wound-fever": ["no"],
      });
      expect(result.level, feature).toBe("emergency-now");
    }
  });
});
