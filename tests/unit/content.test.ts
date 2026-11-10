import { describe, expect, it } from "vitest";

import { RESOURCE_CONTENT, WARNING_SIGN_CONTENT } from "@/content/meta";
import {
  EMERGENCY_LINES,
  RESOURCES,
  RESOURCE_CATEGORIES,
  getResource,
} from "@/content/resources";
import {
  WARNING_SIGNS,
  WARNING_SIGN_CATEGORIES,
  getWarningSign,
  getWarningSignBySymptomId,
} from "@/content/warning-signs";
import { SYMPTOM_IDS } from "@/lib/safety-rules";

describe("warning sign library", () => {
  it("has unique slugs", () => {
    const slugs = WARNING_SIGNS.map((sign) => sign.slug);
    expect(new Set(slugs).size).toBe(slugs.length);
  });

  it("uses url-safe slugs", () => {
    for (const sign of WARNING_SIGNS) {
      expect(sign.slug).toMatch(/^[a-z0-9-]+$/);
    }
  });

  it("tells the reader what to do, when to call 911, and when to call their team", () => {
    for (const sign of WARNING_SIGNS) {
      expect(sign.looksLike.length, sign.slug).toBeGreaterThan(0);
      expect(sign.whatToDo.length, sign.slug).toBeGreaterThan(0);
      expect(sign.call911When.length, sign.slug).toBeGreaterThan(0);
      expect(sign.contactCareTeamWhen.length, sign.slug).toBeGreaterThan(0);
      expect(sign.whyItMatters.length, sign.slug).toBeGreaterThan(40);
    }
  });

  it("uses a known category and carries provenance", () => {
    const categories = new Set(WARNING_SIGN_CATEGORIES.map((item) => item.id));
    for (const sign of WARNING_SIGNS) {
      expect(categories.has(sign.category), sign.slug).toBe(true);
      expect(sign.provenance.version, sign.slug).toBeTruthy();
    }
  });

  it("links only to symptoms the questionnaire actually has", () => {
    const ids = new Set(SYMPTOM_IDS);
    for (const sign of WARNING_SIGNS) {
      if (sign.symptomId === null) continue;
      expect(ids.has(sign.symptomId), `${sign.slug} -> ${sign.symptomId}`).toBe(
        true,
      );
    }
  });

  it("resolves by slug and by symptom id", () => {
    expect(getWarningSign("heavy-bleeding")?.title).toBeTruthy();
    expect(getWarningSign("nope")).toBeUndefined();
    expect(getWarningSignBySymptomId("heavy-bleeding")?.slug).toBe(
      "heavy-bleeding",
    );
  });

  it("is labelled as draft until a clinician reviews it", () => {
    for (const sign of WARNING_SIGNS) {
      if (sign.provenance.status !== "clinician-reviewed") {
        expect(sign.provenance.reviewer, sign.slug).toBeNull();
      }
    }
    expect(WARNING_SIGN_CONTENT.status).toBe("draft");
    expect(WARNING_SIGN_CONTENT.reviewCadence.length).toBeGreaterThan(0);
  });
});

describe("resource directory", () => {
  it("has unique ids and a known category", () => {
    const ids = RESOURCES.map((resource) => resource.id);
    expect(new Set(ids).size).toBe(ids.length);
    const categories = new Set(RESOURCE_CATEGORIES.map((item) => item.id));
    for (const resource of RESOURCES) {
      expect(categories.has(resource.category), resource.id).toBe(true);
    }
  });

  it("states hours, cost, coverage, and a review date for every listing", () => {
    for (const resource of RESOURCES) {
      expect(resource.hours.length, resource.id).toBeGreaterThan(0);
      expect(resource.cost.length, resource.id).toBeGreaterThan(0);
      expect(resource.availability.length, resource.id).toBeGreaterThan(0);
      expect(resource.lastReviewed, resource.id).toMatch(/^\d{4}-\d{2}-\d{2}$/);
    }
  });

  it("gives a way to make contact", () => {
    for (const resource of RESOURCES) {
      expect(
        Boolean(resource.phone || resource.sms || resource.website),
        resource.id,
      ).toBe(true);
    }
  });

  it("uses https for every website", () => {
    for (const resource of RESOURCES) {
      if (!resource.website) continue;
      expect(resource.website.startsWith("https://"), resource.id).toBe(true);
    }
  });

  it("keeps the crisis lines in the emergency list", () => {
    const numbers = EMERGENCY_LINES.map((line) => line.number);
    expect(numbers).toContain("911");
    expect(numbers).toContain("988");
  });

  it("resolves by id", () => {
    expect(getResource("988")?.name).toBeTruthy();
    expect(getResource("nope")).toBeUndefined();
  });

  it("is labelled as draft until the listings are re-verified", () => {
    expect(RESOURCE_CONTENT.status).toBe("draft");
  });
});
