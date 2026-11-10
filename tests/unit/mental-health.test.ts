import { describe, expect, it } from "vitest";

import { EMERGENCY_LINES } from "@/content/resources";
import { WARNING_SIGNS, getWarningSign } from "@/content/warning-signs";

const sign = getWarningSign("mental-health-emergency")!;

describe("postpartum mental health content", () => {
  it("names every condition the clinical brief lists", () => {
    const text = JSON.stringify(sign).toLowerCase();
    for (const condition of [
      "postpartum depression",
      "postpartum anxiety",
      "postpartum psychosis",
      "intrusive thought",
      "panic attack",
      "sleep",
      "harming yourself",
      "hurting your baby",
    ]) {
      expect(text, `missing: ${condition}`).toContain(condition);
    }
  });

  it("separates prompt support from a psychiatric emergency", () => {
    const levels = (sign.tiers ?? []).map((t) => t.level);
    expect(levels).toEqual([
      "call-911",
      "contact-team-promptly",
      "monitor-and-contact",
    ]);
  });

  it("does not offer an appointment as an alternative to emergency care", () => {
    const emergency = sign.tiers!.find((t) => t.id === "emergency")!;
    expect(emergency.doNot?.join(" ").toLowerCase()).toContain(
      "not a substitute for emergency care",
    );
  });

  it("says plainly that asking for help does not make her a bad mother", () => {
    const heading = (sign.sections ?? []).find((s) =>
      s.heading.toLowerCase().includes("bad mother"),
    );
    expect(heading).toBeDefined();
    expect(sign.whyItMatters.toLowerCase()).toContain(
      "does not make you a bad mother",
    );
  });

  it("explains that intrusive thoughts are not intentions", () => {
    expect(JSON.stringify(sign.sections).toLowerCase()).toContain(
      "not intentions",
    );
  });

  it("does not threaten her with losing the baby", () => {
    const text = JSON.stringify(sign).toLowerCase();
    expect(text).toContain("taken away");
    expect(text).toContain("does not begin with anyone being taken away");
  });

  it("keeps the three crisis numbers reachable", () => {
    const ids = EMERGENCY_LINES.map((line) => line.id);
    for (const id of ["911", "988", "tlc-mama"]) {
      expect(ids).toContain(id);
    }
    expect(EMERGENCY_LINES.find((line) => line.id === "tlc-mama")?.number).toBe(
      "1-833-852-6262",
    );
  });

  it("cites published sources including Postpartum Support International", () => {
    const orgs = (sign.references ?? []).map((r) => r.organisation);
    expect(orgs).toContain("Postpartum Support International");
    expect(orgs).toContain("ACOG");
  });

  it("uses no language that blames her", () => {
    const text = JSON.stringify(sign).toLowerCase();
    for (const phrase of [
      "should be grateful",
      "just tired",
      "snap out",
      "pull yourself",
      "bonding failure",
    ]) {
      expect(text, `"${phrase}" must not appear`).not.toContain(phrase);
    }
  });
});

describe("mental health topics as a whole", () => {
  it("keeps thoughts of harm at the highest level", () => {
    expect(getWarningSign("thoughts-of-harm")?.urgencyHint).toBe("call-911");
  });

  it("is reachable from the warning-sign index under its own category", () => {
    const mentalHealth = WARNING_SIGNS.filter(
      (s) => s.category === "mental-health",
    );
    expect(mentalHealth.length).toBeGreaterThanOrEqual(2);
  });
});
