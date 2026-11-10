/**
 * Types for the "Should I seek care?" guidance engine.
 *
 * This engine is a deterministic rule evaluator, not a diagnostic tool. It maps
 * user-reported symptoms to one of four action levels and explains the match in
 * plain language. It never produces reassurance, and it never rules anything
 * out (spec §4.4).
 */

export type ActionLevel =
  | "call-911"
  | "emergency-now"
  | "contact-team-promptly"
  | "monitor-and-contact";

/** Ascending severity. Index position is the comparison key. */
export const ACTION_LEVEL_SEVERITY: ActionLevel[] = [
  "monitor-and-contact",
  "contact-team-promptly",
  "emergency-now",
  "call-911",
];

export type ActionLevelPresentation = {
  level: ActionLevel;
  /** Imperative heading shown to the user. */
  headline: string;
  /** One-sentence explanation of the level itself. */
  meaning: string;
  /** Short label for badges and screen-reader text. */
  shortLabel: string;
};

export const ACTION_LEVELS: Record<ActionLevel, ActionLevelPresentation> = {
  "call-911": {
    level: "call-911",
    headline: "Call 911 now",
    meaning:
      "What you described can become life-threatening quickly. Emergency responders can start treatment on the way.",
    shortLabel: "Call 911",
  },
  "emergency-now": {
    level: "emergency-now",
    headline: "Seek emergency care now",
    meaning:
      "Go to the nearest emergency department now. Do not wait for an appointment, and do not drive yourself.",
    shortLabel: "Emergency care now",
  },
  "contact-team-promptly": {
    level: "contact-team-promptly",
    headline: "Contact your maternity-care team promptly",
    meaning:
      "Call your OB/GYN, midwife, or maternity unit now to be assessed today. They may ask you to be seen in person.",
    shortLabel: "Call your care team",
  },
  "monitor-and-contact": {
    level: "monitor-and-contact",
    headline:
      "Watch closely and contact your care team if this continues or worsens",
    meaning:
      "This does not match an emergency rule based on what you told us, and that is not the same as being fine. Keep track of it and reach out if anything changes.",
    shortLabel: "Watch and contact your team",
  },
};

export type QuestionKind = "single" | "multi";

export type AnswerOption = {
  value: string;
  label: string;
  /** Optional plain-language clarification under the option. */
  detail?: string;
};

export type Question = {
  id: string;
  prompt: string;
  help?: string;
  kind: QuestionKind;
  options: AnswerOption[];
  /** Value that means "none of these". Cannot be combined with others. */
  exclusiveValue?: string;
};

/** All listed values must be present in the answer for the condition to match. */
export type Condition = {
  questionId: string;
  anyOf: string[];
};

export type Rule = {
  id: string;
  /** Every condition must match (logical AND). */
  when: Condition[];
  level: ActionLevel;
  /** Plain-language reason, written to describe, never to diagnose. */
  because: string;
};

export type SymptomDefinition = {
  id: string;
  label: string;
  /** Helps the user confirm they picked the right thing. */
  detail: string;
  searchTerms: string[];
  /** Related library article, when one exists. */
  warningSignSlug: string | null;
  /** Guidance can never fall below this level for this symptom. */
  baselineLevel: ActionLevel;
  baselineReason: string;
  followUps: Question[];
  rules: Rule[];
};

export type SeekCareAnswers = {
  symptomId: string;
  /** Question id to selected values. Single-choice questions hold one value. */
  answers: Record<string, string[]>;
};

export type Guidance = {
  level: ActionLevel;
  presentation: ActionLevelPresentation;
  symptomId: string;
  symptomLabel: string;
  warningSignSlug: string | null;
  /** Why this level was chosen, highest severity first. */
  reasons: string[];
  /** Language about what to do if things change. Always populated. */
  escalation: string[];
  /** Rule ids that fired, for quality assurance. No personal details. */
  matchedRuleIds: string[];
  rulesVersion: string;
};
