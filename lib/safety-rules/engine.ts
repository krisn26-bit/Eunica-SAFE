import {
  RED_FLAG_QUESTION,
  RED_FLAG_RULES,
  SAFETY_RULES_VERSION,
  UNIVERSAL_RULES,
  getSymptom,
} from "./rules";
import {
  ACTION_LEVELS,
  ACTION_LEVEL_SEVERITY,
  type ActionLevel,
  type Condition,
  type Guidance,
  type Rule,
  type SeekCareAnswers,
} from "./types";

export function severityOf(level: ActionLevel): number {
  return ACTION_LEVEL_SEVERITY.indexOf(level);
}

export function isAtLeast(level: ActionLevel, minimum: ActionLevel): boolean {
  return severityOf(level) >= severityOf(minimum);
}

export function higherLevel(a: ActionLevel, b: ActionLevel): ActionLevel {
  return severityOf(a) >= severityOf(b) ? a : b;
}

function matchesCondition(
  answers: Record<string, string[]>,
  condition: Condition,
): boolean {
  const selected = answers[condition.questionId];
  if (!selected || selected.length === 0) return false;
  return condition.anyOf.some((value) => selected.includes(value));
}

function matchesRule(answers: Record<string, string[]>, rule: Rule): boolean {
  return rule.when.every((condition) => matchesCondition(answers, condition));
}

/**
 * Escalation language is always shown, at every level. The app never tells
 * someone they are fine and never closes the door on getting help (spec §4.4).
 */
export function escalationLanguage(level: ActionLevel): string[] {
  const universal = [
    "If anything gets worse, or new symptoms start, treat that as a reason to seek care again.",
    "This guidance is educational. It cannot examine you, and it cannot rule out an emergency.",
    "If something feels seriously wrong, call 911 or go to the nearest emergency department, whatever this screen says.",
  ];

  if (level === "call-911") {
    return [
      "Call 911 now. Do not drive yourself, and do not wait to see if it passes.",
      "If you cannot reach 911, ask someone to take you to the nearest emergency department immediately.",
      ...universal.slice(1),
    ];
  }

  if (level === "emergency-now") {
    return [
      "Go now. If you feel faint, are bleeding heavily, or cannot breathe comfortably, call 911 instead of travelling yourself.",
      "Do not drive yourself if you feel unwell, dizzy, or in severe pain.",
      ...universal,
    ];
  }

  if (level === "contact-team-promptly") {
    return [
      "Call your care team now rather than waiting for a scheduled visit. Most maternity units have a number staffed around the clock.",
      "If you cannot reach anyone within an hour, go to an emergency department or urgent care rather than waiting longer.",
      ...universal,
    ];
  }

  return [
    "Keep track of what you are noticing, including times and any measurements.",
    "Contact your care team if it continues, returns, or worsens — you do not need to wait for it to get bad.",
    ...universal,
  ];
}

const FALLBACK_LEVEL: ActionLevel = "contact-team-promptly";

/**
 * Deterministic evaluation: the same answers always produce the same guidance.
 * The result is the highest severity among the symptom baseline, the universal
 * red flags, the symptom's own rules, and the cross-cutting rules.
 */
export function evaluateGuidance(input: SeekCareAnswers): Guidance {
  const symptom = getSymptom(input.symptomId);
  const answers = input.answers ?? {};

  if (!symptom) {
    return {
      level: FALLBACK_LEVEL,
      presentation: ACTION_LEVELS[FALLBACK_LEVEL],
      symptomId: input.symptomId,
      symptomLabel: "Something you are noticing",
      warningSignSlug: null,
      reasons: [
        "We could not match what you selected to our reviewed guidance, so we are defaulting to the safer action: contact your care team.",
      ],
      escalation: escalationLanguage(FALLBACK_LEVEL),
      matchedRuleIds: [],
      rulesVersion: SAFETY_RULES_VERSION,
    };
  }

  const candidateRules: Rule[] = [
    ...RED_FLAG_RULES,
    ...symptom.rules,
    ...UNIVERSAL_RULES,
  ];

  const matched = candidateRules.filter((rule) => matchesRule(answers, rule));

  let level = symptom.baselineLevel;
  for (const rule of matched) {
    level = higherLevel(level, rule.level);
  }

  const reasons = [
    ...matched
      .slice()
      .sort((a, b) => severityOf(b.level) - severityOf(a.level))
      .map((rule) => rule.because),
    symptom.baselineReason,
  ];

  return {
    level,
    presentation: ACTION_LEVELS[level],
    symptomId: symptom.id,
    symptomLabel: symptom.label,
    warningSignSlug: symptom.warningSignSlug,
    reasons,
    escalation: escalationLanguage(level),
    matchedRuleIds: matched.map((rule) => rule.id),
    rulesVersion: SAFETY_RULES_VERSION,
  };
}

/** True when the user selected at least one universal red flag. */
export function hasRedFlag(answers: Record<string, string[]>): boolean {
  const selected = answers[RED_FLAG_QUESTION.id] ?? [];
  return selected.some((value) => value !== RED_FLAG_QUESTION.exclusiveValue);
}

/**
 * Plain-text summary a user can send to a support person. Contains only the
 * guidance level and reasons — no profile data, no location, no identifiers.
 */
export function guidanceShareText(guidance: Guidance): string {
  const lines = [
    "From Eunica Safe (educational guidance, not a diagnosis):",
    "",
    `What I am noticing: ${guidance.symptomLabel}`,
    `Recommended action: ${guidance.presentation.headline}`,
    "",
    "Why:",
    ...guidance.reasons.slice(0, 3).map((reason) => `- ${reason}`),
    "",
    "If this gets worse, call 911 or go to the nearest emergency department.",
  ];
  return lines.join("\n");
}
