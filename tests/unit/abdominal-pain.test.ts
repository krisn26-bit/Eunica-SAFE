import { describe, expect, it } from "vitest";

import { getWarningSign } from "@/content/warning-signs";
import { evaluateGuidance } from "@/lib/safety-rules/engine";
import { NO_RED_FLAGS, RED_FLAGS_QUESTION_ID } from "@/lib/safety-rules/rules";

const sign = getWarningSign("severe-abdominal-pain")!;

function guidance(answers: Record<string, string[]>) {
  return evaluateGuidance({
    symptomId: "severe-abdominal-pain",
    answers: { [RED_FLAGS_QUESTION_ID]: [NO_RED_FLAGS], ...answers },
  });
}

describe("severe abdominal pain content", () => {
  it("covers each presentation the clinical brief lists", () => {
    const text = sign.looksLike.join(" ").toLowerCase();
    for (const presentation of [
      "severe",
      "persist",
      "right ribs",
      "tenderness that is increasing",
      "100.4",
      "vomiting",
      "dizziness",
    ]) {
      expect(text, `missing: ${presentation}`).toContain(presentation);
    }
  });

  it("explains why right-rib pain in particular matters", () => {
    const why = sign.whyItMatters.toLowerCase();
    expect(why).toContain("right ribs");
    expect(why).toContain("hellp");
  });

  it("tells her to say how recently she gave birth", () => {
    expect(sign.whatToDo.join(" ").toLowerCase()).toContain(
      "gave birth recently",
    );
  });
});

describe("abdominal pain triage levels", () => {
  it("calls 911 for pain with dizziness or fainting", () => {
    const result = guidance({
      "belly-severity": ["moderate"],
      "belly-companions": ["dizzy"],
    });
    expect(result.level).toBe("call-911");
  });

  it("escalates constant pain that is not cramping in waves", () => {
    const result = guidance({
      "belly-severity": ["persistent"],
      "belly-companions": ["none"],
    });
    expect(result.level).toBe("emergency-now");
  });

  it("escalates pain under the right ribs", () => {
    const result = guidance({
      "belly-severity": ["moderate"],
      "belly-location": ["upper-right"],
      "belly-companions": ["none"],
    });
    expect(result.level).toBe("emergency-now");
  });

  it("escalates pain with increasing tenderness", () => {
    const result = guidance({
      "belly-severity": ["moderate"],
      "belly-companions": ["more-tender"],
    });
    expect(result.level).toBe("emergency-now");
  });

  it("escalates pain with fever or vomiting", () => {
    for (const companion of ["fever", "vomiting"]) {
      const result = guidance({
        "belly-severity": ["moderate"],
        "belly-companions": [companion],
      });
      expect(result.level, companion).toBe("emergency-now");
    }
  });

  it("leaves mild easing cramping at the prompt level", () => {
    const result = guidance({
      "belly-severity": ["mild"],
      "belly-location": ["lower"],
      "belly-companions": ["none"],
      trend: ["better"],
    });
    expect(result.level).toBe("contact-team-promptly");
  });
});
