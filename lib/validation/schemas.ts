import { z } from "zod";

/**
 * Runtime schemas for everything the app persists.
 *
 * Every field here is optional by design: the app must be useful without
 * collecting anything, and a user can skip any part of their safety plan
 * (spec §4.6, §9). Schemas also guard against corrupted or tampered local data.
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

const phone = z
  .string()
  .trim()
  .max(32, "Please keep phone numbers under 32 characters")
  .refine((value) => value === "" || /[\d]/.test(value), {
    message: "Include at least one digit, or leave the field empty",
  })
  .optional();

export const USER_ROLES = [
  "recently-postpartum",
  "preparing",
  "support-person",
  "professional",
] as const;

export const userRoleSchema = z.enum(USER_ROLES);
export type UserRole = z.infer<typeof userRoleSchema>;

export const USER_ROLE_LABELS: Record<UserRole, string> = {
  "recently-postpartum": "I gave birth recently",
  preparing: "I am pregnant and preparing",
  "support-person": "I am supporting someone postpartum",
  professional: "I work in healthcare or community support",
};

export const USER_ROLE_DETAILS: Record<UserRole, string> = {
  "recently-postpartum":
    "Guidance is written for you, with day-by-day recovery context.",
  preparing: "Set up your safety plan now so it is ready before you need it.",
  "support-person":
    "Learn the warning signs so you can act if she cannot speak for herself.",
  professional:
    "Use the library and resource directory with the people you serve.",
};

export const preferencesSchema = z.object({
  role: userRoleSchema.optional(),
  onboardedAt: z.string().optional(),
  /** Explicit, revocable consent for a one-time browser location lookup. */
  locationConsent: z.boolean().default(false),
  reduceMotion: z.boolean().default(false),
});
export type Preferences = z.infer<typeof preferencesSchema>;

export const BIRTH_TYPES = [
  "vaginal",
  "cesarean",
  "assisted",
  "vbac",
  "other",
  "prefer-not-to-say",
] as const;
export const birthTypeSchema = z.enum(BIRTH_TYPES);
export type BirthType = z.infer<typeof birthTypeSchema>;

export const BIRTH_TYPE_LABELS: Record<BirthType, string> = {
  vaginal: "Vaginal birth",
  cesarean: "Cesarean birth",
  assisted: "Assisted birth (forceps or vacuum)",
  vbac: "Vaginal birth after cesarean",
  other: "Other",
  "prefer-not-to-say": "Prefer not to say",
};

export const contactSchema = z.object({
  name: optionalText(120),
  relationship: optionalText(80),
  phone,
  notes: optionalText(280),
});
export type Contact = z.infer<typeof contactSchema>;

export const providerSchema = z.object({
  name: optionalText(120),
  role: optionalText(80),
  phone,
  afterHoursPhone: phone,
  notes: optionalText(280),
});
export type Provider = z.infer<typeof providerSchema>;

export const hospitalSchema = z.object({
  name: optionalText(160),
  address: optionalText(240),
  phone,
  /** Notes such as "labor and delivery is on the third floor, north entrance". */
  notes: optionalText(280),
});
export type Hospital = z.infer<typeof hospitalSchema>;

export const safetyPlanSchema = z.object({
  deliveryDate: dateOnly.optional(),
  birthType: birthTypeSchema.optional(),
  hospital: hospitalSchema.default({}),
  provider: providerSchema.default({}),
  emergencyContact: contactSchema.default({}),
  backupContact: contactSchema.default({}),
  medicalHistory: optionalText(2000),
  allergies: optionalText(600),
  medications: optionalText(600),
  milestones: optionalText(600),
  questionsForClinician: z.array(z.string().trim().max(400)).default([]),
  updatedAt: z.string().optional(),
});
export type SafetyPlan = z.infer<typeof safetyPlanSchema>;
/** Pre-validation shape, used by forms where defaults are not filled in yet. */
export type SafetyPlanInput = z.input<typeof safetyPlanSchema>;

export const EMPTY_SAFETY_PLAN: SafetyPlan = {
  hospital: {},
  provider: {},
  emergencyContact: {},
  backupContact: {},
  questionsForClinician: [],
};

export const MOODS = [
  "steady",
  "tired",
  "tearful",
  "anxious",
  "low",
  "overwhelmed",
] as const;
export const moodSchema = z.enum(MOODS);
export type Mood = z.infer<typeof moodSchema>;

export const MOOD_LABELS: Record<Mood, string> = {
  steady: "Mostly steady",
  tired: "Very tired",
  tearful: "Tearful",
  anxious: "Anxious",
  low: "Low",
  overwhelmed: "Overwhelmed",
};

export const BLEEDING_OBSERVATIONS = [
  "lighter",
  "unchanged",
  "heavier",
  "clots",
  "not-tracking",
] as const;
export const bleedingSchema = z.enum(BLEEDING_OBSERVATIONS);
export type BleedingObservation = z.infer<typeof bleedingSchema>;

export const BLEEDING_LABELS: Record<BleedingObservation, string> = {
  lighter: "Lighter than yesterday",
  unchanged: "About the same",
  heavier: "Heavier than yesterday",
  clots: "Passing clots",
  "not-tracking": "Not tracking today",
};

export const recoveryEntrySchema = z.object({
  id: z.string(),
  createdAt: z.string(),
  /** Self-reported only. Never interpreted as a clinical score. */
  painLevel: z.number().int().min(0).max(10).optional(),
  bleeding: bleedingSchema.optional(),
  temperature: optionalText(12),
  mood: moodSchema.optional(),
  notes: optionalText(1200),
  questionsForCareTeam: optionalText(600),
});
export type RecoveryEntry = z.infer<typeof recoveryEntrySchema>;

export const appointmentSchema = z.object({
  id: z.string(),
  title: z.string().trim().min(1, "Give the appointment a short name").max(140),
  date: dateOnly,
  time: optionalText(16),
  location: optionalText(200),
  notes: optionalText(600),
});
export type Appointment = z.infer<typeof appointmentSchema>;

export const recoveryLogSchema = z.object({
  entries: z.array(recoveryEntrySchema).default([]),
  appointments: z.array(appointmentSchema).default([]),
});
export type RecoveryLog = z.infer<typeof recoveryLogSchema>;

export const EMPTY_RECOVERY_LOG: RecoveryLog = {
  entries: [],
  appointments: [],
};

/** Coarse location the user typed or approved. Never sent to a server. */
export const savedLocationSchema = z.object({
  label: z.string().trim().max(160),
  source: z.enum(["manual", "device"]),
  latitude: z.number().min(-90).max(90).optional(),
  longitude: z.number().min(-180).max(180).optional(),
  savedAt: z.string(),
});
export type SavedLocation = z.infer<typeof savedLocationSchema>;

export const EXPORT_FORMAT_VERSION = 1;

export const exportBundleSchema = z.object({
  app: z.literal("eunica-safe"),
  formatVersion: z.literal(EXPORT_FORMAT_VERSION),
  exportedAt: z.string(),
  preferences: preferencesSchema.partial().optional(),
  safetyPlan: safetyPlanSchema.partial().optional(),
  recovery: recoveryLogSchema.partial().optional(),
});
export type ExportBundle = z.infer<typeof exportBundleSchema>;
