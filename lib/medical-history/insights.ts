import {
  CESAREAN_DELIVERY_TYPES,
  type MedicalHistory,
} from "@/lib/medical-history/schema";

/**
 * Turns a stored medical history into the education to surface in the safety
 * plan and on relevant warning-sign pages.
 *
 * Hard rules, enforced by tests in tests/unit/medical-history.test.ts:
 *
 * - Nothing here diagnoses, predicts, or scores risk. An insight selects
 *   published education; it never tells a mother she has a condition now or
 *   that she is likely to develop one.
 * - Nothing here is reassuring. An empty insight list means "we have no extra
 *   education to add", never "you are low risk" or "you are fine".
 * - Every insight says plainly which answer produced it, so a mother can see
 *   why she is reading it and correct her history if it is wrong.
 */

export type InsightTopic =
  | "blood-pressure"
  | "cesarean-incision"
  | "perineal-recovery"
  | "clots"
  | "mental-health"
  | "glucose-follow-up"
  | "bleeding";

export type HistoryInsight = {
  id: InsightTopic;
  title: string;
  /** Education, written to inform rather than to assess. */
  body: string;
  /** What the mother told us that surfaced this. Shown verbatim. */
  becauseYouTold: string;
  /** Related library article. */
  warningSignSlug: string | null;
  /** Where to act on it in the app. */
  actionHref: string | null;
  actionLabel: string | null;
};

const BP_CONDITIONS = [
  "gestational-hypertension",
  "chronic-hypertension",
  "preeclampsia",
  "eclampsia",
  "hellp",
] as const;

const BP_CONDITION_PHRASES: Record<(typeof BP_CONDITIONS)[number], string> = {
  "gestational-hypertension": "high blood pressure that started in pregnancy",
  "chronic-hypertension": "high blood pressure before pregnancy",
  preeclampsia: "preeclampsia",
  eclampsia: "eclampsia",
  hellp: "HELLP syndrome",
};

function listPhrases(phrases: string[]): string {
  if (phrases.length === 0) return "";
  if (phrases.length === 1) return phrases[0];
  if (phrases.length === 2) return `${phrases[0]} and ${phrases[1]}`;
  return `${phrases.slice(0, -1).join(", ")}, and ${phrases[phrases.length - 1]}`;
}

function bloodPressureInsight(history: MedicalHistory): HistoryInsight | null {
  const phrases = BP_CONDITIONS.filter((condition) =>
    history.conditions.includes(condition),
  ).map((condition) => BP_CONDITION_PHRASES[condition]);

  if (
    history.pregnancyComplications.includes("preeclampsia") &&
    !history.conditions.includes("preeclampsia")
  ) {
    phrases.push("preeclampsia during pregnancy");
  }
  if (
    history.pregnancyComplications.includes("high-blood-pressure") &&
    !history.conditions.includes("gestational-hypertension")
  ) {
    phrases.push("high blood pressure during pregnancy");
  }
  if (history.deliveryComplications.includes("high-blood-pressure")) {
    phrases.push("high blood pressure around delivery");
  }

  if (phrases.length === 0) return null;

  return {
    id: "blood-pressure",
    title: "Blood pressure is worth watching closely",
    body: "Blood pressure can rise after birth, including for the first time, and it most often does so in the first week or two. A history like yours is a reason to take postpartum readings seriously and to keep your follow-up appointments, not a sign that you have high blood pressure now. Ask your care team when they want you checked, what readings they want to hear about, and how to reach them after hours.",
    becauseYouTold: `You told us about ${listPhrases(phrases)}.`,
    warningSignSlug: "high-blood-pressure",
    actionHref: "/recovery",
    actionLabel: "Log a blood-pressure reading",
  };
}

function cesareanInsight(history: MedicalHistory): HistoryInsight | null {
  if (
    !history.deliveryType ||
    !CESAREAN_DELIVERY_TYPES.includes(history.deliveryType)
  ) {
    return null;
  }

  return {
    id: "cesarean-incision",
    title: "Caring for your cesarean incision",
    body: "A cesarean is abdominal surgery, and the incision needs watching while it heals. Soreness that slowly improves is expected. Pain that increases instead of easing, spreading discoloration, swelling, warmth, cloudy or bad-smelling drainage, edges coming apart, or a fever of 100.4°F (38°C) or higher are the changes to report. Checking the incision once a day, in good light and with a mirror if you need one, makes a change easy to notice early.",
    becauseYouTold: "You told us you had a cesarean birth.",
    warningSignSlug: "incision-or-wound-concerns",
    actionHref: "/recovery",
    actionLabel: "Track how the incision is healing",
  };
}

function perinealInsight(history: MedicalHistory): HistoryInsight | null {
  const outcome = history.perinealOutcome;
  if (!outcome || outcome === "neither") return null;

  const phrase =
    outcome === "laceration"
      ? "you had a tear that needed stitches"
      : outcome === "episiotomy"
        ? "you had an episiotomy"
        : outcome === "both"
          ? "you had both a tear and an episiotomy"
          : "you were not sure whether you had a tear or an episiotomy";

  return {
    id: "perineal-recovery",
    title: "Caring for stitches and perineal healing",
    body: "Stitches are usually most sore in the first week and then ease. Pain that grows rather than settles, swelling that increases, drainage that turns cloudy or smells bad, stitches that give way, or a fever of 100.4°F (38°C) or higher are reasons to be seen. Trouble passing urine, or a feeling of heavy pressure, also needs a call rather than a wait.",
    becauseYouTold: `You told us ${phrase}.`,
    warningSignSlug: "incision-or-wound-concerns",
    actionHref: "/recovery",
    actionLabel: "Track how your stitches are healing",
  };
}

function clotInsight(history: MedicalHistory): HistoryInsight | null {
  const reported: string[] = [];
  if (history.conditions.includes("clotting-disorder")) {
    reported.push("a blood clotting disorder");
  }
  if (history.conditions.includes("previous-clot")) {
    reported.push("a blood clot in the past");
  }
  if (reported.length === 0) return null;

  return {
    id: "clots",
    title: "Know the signs of a clot",
    body: "Pain, tenderness, swelling, or warmth in one leg — especially in the calf, and especially on one side only — is worth a call the same day. Sudden shortness of breath, chest pain, or coughing up blood is an emergency: call 911. On deeper skin tones a clot may not look red at all, so compare one leg against the other for swelling, warmth, and tenderness rather than watching for color.",
    becauseYouTold: `You told us about ${listPhrases(reported)}.`,
    warningSignSlug: "leg-pain-or-swelling",
    actionHref: "/warning-signs/leg-pain-or-swelling",
    actionLabel: "Read the warning signs for clots",
  };
}

function mentalHealthInsight(history: MedicalHistory): HistoryInsight | null {
  const priorPsychosis = history.conditions.includes("postpartum-psychosis");
  const priorMood = history.conditions.includes("perinatal-mood");
  if (!priorPsychosis && !priorMood) return null;

  return {
    id: "mental-health",
    title: "Support for how you are feeling",
    body: priorPsychosis
      ? "You told us about postpartum psychosis after an earlier birth, and that is something your care team will want to know about now, early rather than late. Confusion, not sleeping even when there is a chance to, hearing or seeing things others do not, or thoughts that feel unlike you need urgent assessment — call your care team now, or 911 if you or your baby could be in danger. Arranging support before you need it is reasonable and sensible."
      : "Depression or anxiety before or during pregnancy is a reason to keep an eye on how you are doing now, and to say something early rather than waiting to see. Help works better the sooner it starts. Asking for it does not make you a bad mother, and it does not put your baby at risk of being taken from you.",
    becauseYouTold: priorPsychosis
      ? "You told us about postpartum psychosis after an earlier birth."
      : "You told us about depression or anxiety before or during pregnancy.",
    warningSignSlug: priorPsychosis
      ? "mental-health-crisis"
      : "mental-health-crisis",
    actionHref: "/resources",
    actionLabel: "Find maternal mental health support",
  };
}

function glucoseInsight(history: MedicalHistory): HistoryInsight | null {
  const gestational =
    history.conditions.includes("gestational-diabetes") ||
    history.pregnancyComplications.includes("gestational-diabetes");
  const existing = history.conditions.includes("diabetes");
  if (!gestational && !existing) return null;

  return {
    id: "glucose-follow-up",
    title: "Follow-up after diabetes in pregnancy",
    body: gestational
      ? "Gestational diabetes usually resolves after birth, and a follow-up glucose test some weeks later is the normal way to confirm it has. It is an easy appointment to lose track of in the newborn weeks, so it is worth asking who is booking it and when, before you leave your next visit."
      : "Blood sugar needs can change quickly after birth, and the dose that was right in pregnancy is often not right now. Ask your care team how to adjust, what readings they want to hear about, and who to call if you cannot keep food down.",
    becauseYouTold: gestational
      ? "You told us about gestational diabetes."
      : "You told us about type 1 or type 2 diabetes.",
    warningSignSlug: null,
    actionHref: "/recovery",
    actionLabel: "Add the appointment to your tracker",
  };
}

function bleedingInsight(history: MedicalHistory): HistoryInsight | null {
  const reported: string[] = [];
  if (history.deliveryComplications.includes("heavy-bleeding")) {
    reported.push("heavy bleeding after delivery");
  }
  if (history.deliveryComplications.includes("transfusion")) {
    reported.push("a blood transfusion");
  }
  if (reported.length === 0) return null;

  return {
    id: "bleeding",
    title: "What your bleeding should be doing now",
    body: "Bleeding after birth should slowly taper. Bleeding that becomes heavier again after it had settled, soaking a pad in an hour, or clots larger than a golf ball need help straight away. Keeping a rough count of pads and how long they took is the single most useful thing you can hand a care team.",
    becauseYouTold: `You told us about ${listPhrases(reported)}.`,
    warningSignSlug: "heavy-bleeding",
    actionHref: "/warning-signs/heavy-bleeding",
    actionLabel: "Read the warning signs for bleeding",
  };
}

const BUILDERS = [
  bloodPressureInsight,
  cesareanInsight,
  perinealInsight,
  bleedingInsight,
  clotInsight,
  mentalHealthInsight,
  glucoseInsight,
];

/**
 * Education selected by the mother's own answers. An empty list means there is
 * nothing extra to add — never that she is low risk, and never that she is
 * safe. Callers must not phrase it that way.
 */
export function historyInsights(history: MedicalHistory): HistoryInsight[] {
  return BUILDERS.map((build) => build(history)).filter(
    (insight): insight is HistoryInsight => insight !== null,
  );
}

/** True when the history gives a reason to emphasise blood-pressure follow-up. */
export function emphasisesBloodPressure(history: MedicalHistory): boolean {
  return bloodPressureInsight(history) !== null;
}
