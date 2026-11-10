import { z } from "zod";

/**
 * Structured medical history, collected once during setup.
 *
 * This is the one part of Eunica Safe that is required rather than optional,
 * because the education in the safety plan is shaped by it. It is still only
 * ever stored in this browser, and it is never used to diagnose, to predict a
 * complication, or to assign a risk score. It selects which published
 * education to show, and nothing more.
 *
 * "Not sure" is a first-class answer everywhere. A mother discharged three days
 * ago often does not know whether her blood pressure was called gestational
 * hypertension, and guessing is worse than saying so.
 */

const dateOnly = z
  .string()
  .regex(/^\d{4}-\d{2}-\d{2}$/, "Use the date picker or the format YYYY-MM-DD");

const optionalText = (max: number) =>
  z
    .string()
    .trim()
    .max(max, `Please keep this under ${max} characters`)
    .optional();

export const DELIVERY_TYPES = [
  "vaginal",
  "assisted",
  "cesarean-planned",
  "cesarean-unplanned",
  "vbac",
  "not-sure",
] as const;
export const deliveryTypeSchema = z.enum(DELIVERY_TYPES);
export type DeliveryType = z.infer<typeof deliveryTypeSchema>;

export const DELIVERY_TYPE_LABELS: Record<DeliveryType, string> = {
  vaginal: "Vaginal birth",
  assisted: "Assisted vaginal birth (forceps or vacuum)",
  "cesarean-planned": "Planned cesarean",
  "cesarean-unplanned": "Unplanned or emergency cesarean",
  vbac: "Vaginal birth after a previous cesarean",
  "not-sure": "I am not sure",
};

/** Delivery types that leave an abdominal incision to care for. */
export const CESAREAN_DELIVERY_TYPES: DeliveryType[] = [
  "cesarean-planned",
  "cesarean-unplanned",
];

export const PERINEAL_OUTCOMES = [
  "laceration",
  "episiotomy",
  "both",
  "neither",
  "not-sure",
] as const;
export const perinealOutcomeSchema = z.enum(PERINEAL_OUTCOMES);
export type PerinealOutcome = z.infer<typeof perinealOutcomeSchema>;

export const PERINEAL_OUTCOME_LABELS: Record<PerinealOutcome, string> = {
  laceration: "A tear that needed stitches",
  episiotomy: "An episiotomy",
  both: "Both a tear and an episiotomy",
  neither: "Neither",
  "not-sure": "I am not sure",
};

export const PREVIOUS_PREGNANCY_COUNTS = [
  "none",
  "one",
  "two-or-more",
  "not-sure",
] as const;
export const previousPregnancySchema = z.enum(PREVIOUS_PREGNANCY_COUNTS);
export type PreviousPregnancyCount = z.infer<typeof previousPregnancySchema>;

export const PREVIOUS_PREGNANCY_LABELS: Record<PreviousPregnancyCount, string> =
  {
    none: "This was my first",
    one: "One before this one",
    "two-or-more": "Two or more before this one",
    "not-sure": "I would rather not say",
  };

export const YES_NO_UNSURE = ["yes", "no", "not-sure"] as const;
export const yesNoUnsureSchema = z.enum(YES_NO_UNSURE);
export type YesNoUnsure = z.infer<typeof yesNoUnsureSchema>;

export const YES_NO_UNSURE_LABELS: Record<YesNoUnsure, string> = {
  yes: "Yes",
  no: "No",
  "not-sure": "I am not sure",
};

/**
 * Conditions that change which education is surfaced. Each carries the plain
 * wording a mother is likely to have heard, not only the clinical term.
 */
export const HISTORY_CONDITIONS = [
  "gestational-hypertension",
  "chronic-hypertension",
  "preeclampsia",
  "eclampsia",
  "hellp",
  "gestational-diabetes",
  "diabetes",
  "clotting-disorder",
  "previous-clot",
  "cardiovascular",
  "perinatal-mood",
  "postpartum-psychosis",
  "none",
  "not-sure",
] as const;
export const historyConditionSchema = z.enum(HISTORY_CONDITIONS);
export type HistoryCondition = z.infer<typeof historyConditionSchema>;

export const HISTORY_CONDITION_LABELS: Record<HistoryCondition, string> = {
  "gestational-hypertension": "High blood pressure that started in pregnancy",
  "chronic-hypertension": "High blood pressure before pregnancy",
  preeclampsia: "Preeclampsia",
  eclampsia: "Eclampsia (a seizure with preeclampsia)",
  hellp: "HELLP syndrome",
  "gestational-diabetes": "Gestational diabetes",
  diabetes: "Type 1 or type 2 diabetes",
  "clotting-disorder": "A blood clotting disorder",
  "previous-clot": "A blood clot in the past (leg, lung, or elsewhere)",
  cardiovascular: "A heart or blood vessel condition",
  "perinatal-mood": "Depression or anxiety, in pregnancy or before",
  "postpartum-psychosis": "Postpartum psychosis after an earlier birth",
  none: "None of these",
  "not-sure": "I am not sure",
};

export const HISTORY_CONDITION_DETAILS: Partial<
  Record<HistoryCondition, string>
> = {
  "gestational-hypertension":
    "Sometimes called gestational hypertension or pregnancy-induced hypertension.",
  preeclampsia:
    "High blood pressure with protein in your urine or other organ changes.",
  hellp: "A severe form of preeclampsia affecting blood cells and the liver.",
  "perinatal-mood":
    "Including postpartum depression or anxiety after an earlier birth.",
};

export const PREGNANCY_COMPLICATIONS = [
  "high-blood-pressure",
  "preeclampsia",
  "gestational-diabetes",
  "bleeding",
  "placenta",
  "growth",
  "infection",
  "hospital-stay",
  "other",
  "none",
  "not-sure",
] as const;
export const pregnancyComplicationSchema = z.enum(PREGNANCY_COMPLICATIONS);
export type PregnancyComplication = z.infer<typeof pregnancyComplicationSchema>;

export const PREGNANCY_COMPLICATION_LABELS: Record<
  PregnancyComplication,
  string
> = {
  "high-blood-pressure": "High blood pressure during pregnancy",
  preeclampsia: "Preeclampsia during pregnancy",
  "gestational-diabetes": "Gestational diabetes",
  bleeding: "Bleeding during pregnancy",
  placenta: "A problem with the placenta",
  growth: "Concerns about the baby's growth",
  infection: "An infection during pregnancy",
  "hospital-stay": "An overnight hospital stay before delivery",
  other: "Something else",
  none: "None of these",
  "not-sure": "I am not sure",
};

export const DELIVERY_COMPLICATIONS = [
  "heavy-bleeding",
  "transfusion",
  "infection",
  "high-blood-pressure",
  "icu",
  "long-labor",
  "shoulder-or-instrument",
  "other",
  "none",
  "not-sure",
] as const;
export const deliveryComplicationSchema = z.enum(DELIVERY_COMPLICATIONS);
export type DeliveryComplication = z.infer<typeof deliveryComplicationSchema>;

export const DELIVERY_COMPLICATION_LABELS: Record<
  DeliveryComplication,
  string
> = {
  "heavy-bleeding": "Heavy bleeding after delivery",
  transfusion: "A blood transfusion",
  infection: "An infection around delivery",
  "high-blood-pressure": "High blood pressure around delivery",
  icu: "Time in intensive care",
  "long-labor": "A very long labor",
  "shoulder-or-instrument": "Forceps, vacuum, or a difficult delivery",
  other: "Something else",
  none: "None of these",
  "not-sure": "I am not sure",
};

/** Values that cannot be combined with any other answer in a multi-select. */
export const EXCLUSIVE_NONE = "none";
export const EXCLUSIVE_UNSURE = "not-sure";

export const medicalHistorySchema = z.object({
  deliveryDate: dateOnly.optional(),
  deliveryType: deliveryTypeSchema.optional(),
  perinealOutcome: perinealOutcomeSchema.optional(),
  previousPregnancies: previousPregnancySchema.optional(),
  pretermBirth: yesNoUnsureSchema.optional(),
  pregnancyComplications: z.array(pregnancyComplicationSchema).default([]),
  deliveryComplications: z.array(deliveryComplicationSchema).default([]),
  conditions: z.array(historyConditionSchema).default([]),
  otherConditions: optionalText(600),
  currentMedications: optionalText(800),
  bloodPressureMedication: yesNoUnsureSchema.optional(),
  medicationAllergies: optionalText(600),
  otherAllergies: optionalText(600),
  /** Set when the mother has read why this is collected and agreed to save it. */
  consentAcknowledgedAt: z.string().optional(),
  completedAt: z.string().optional(),
  updatedAt: z.string().optional(),
});

export type MedicalHistory = z.infer<typeof medicalHistorySchema>;
export type MedicalHistoryInput = z.input<typeof medicalHistorySchema>;

export const EMPTY_MEDICAL_HISTORY: MedicalHistory = {
  pregnancyComplications: [],
  deliveryComplications: [],
  conditions: [],
};

/**
 * The required core. Everything else in the history is genuinely optional, and
 * "I am not sure" counts as answered — pressing for certainty a mother does not
 * have would only produce worse data.
 */
export function isMedicalHistoryComplete(history: MedicalHistory): boolean {
  return Boolean(
    history.deliveryDate &&
    history.deliveryType &&
    history.conditions.length > 0 &&
    history.consentAcknowledgedAt,
  );
}

/** Which required answers are still missing, in the order they are asked. */
export function missingRequiredAnswers(history: MedicalHistory): string[] {
  const missing: string[] = [];
  if (!history.deliveryDate) missing.push("the date your baby was born");
  if (!history.deliveryType) missing.push("the type of birth you had");
  if (history.conditions.length === 0) {
    missing.push("your medical conditions, or 'none of these'");
  }
  if (!history.consentAcknowledgedAt) {
    missing.push("your agreement to save this on this device");
  }
  return missing;
}
