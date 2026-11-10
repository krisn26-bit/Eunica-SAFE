import { RESOURCE_CONTENT, type ContentProvenance } from "./meta";

export type ResourceCategory =
  | "crisis"
  | "mental-health"
  | "safety"
  | "lactation"
  | "community"
  | "transportation"
  | "benefits"
  | "peer-support"
  | "grief";

export type Resource = {
  id: string;
  name: string;
  description: string;
  /** Who the resource is for, when it is not obvious. */
  audience: string;
  category: ResourceCategory;
  /** Human-readable coverage area. Never implied beyond what is published. */
  availability: string;
  phone?: string;
  phoneLabel?: string;
  sms?: string;
  smsLabel?: string;
  website?: string;
  hours: string;
  cost: string;
  /** Shown verbatim next to the listing. */
  emergencyNote?: string;
  lastReviewed: string;
  provenance: ContentProvenance;
};

export const RESOURCE_CATEGORIES: { id: ResourceCategory; label: string }[] = [
  { id: "crisis", label: "Crisis support" },
  { id: "mental-health", label: "Postpartum mental health" },
  { id: "safety", label: "Domestic violence and safety" },
  { id: "lactation", label: "Lactation support" },
  { id: "community", label: "Community maternal health" },
  { id: "transportation", label: "Transportation help" },
  { id: "benefits", label: "Insurance and benefits" },
  { id: "peer-support", label: "New-parent support" },
  { id: "grief", label: "Grief and loss" },
];

const r = RESOURCE_CONTENT;

/**
 * Nationally published United States services. Numbers are reproduced from each
 * organization's public materials and must be re-verified on the review cadence
 * in `RESOURCE_CONTENT`. No local facility data is invented here.
 */
export const RESOURCES: Resource[] = [
  {
    id: "988",
    name: "988 Suicide and Crisis Lifeline",
    description:
      "Free, confidential support from a trained counselor for anyone in emotional distress, including thoughts of suicide or self-harm.",
    audience: "Anyone in the United States, including support people",
    category: "crisis",
    availability: "United States, nationwide",
    phone: "988",
    phoneLabel: "Call or text 988",
    sms: "988",
    smsLabel: "Text 988",
    website: "https://988lifeline.org",
    hours: "24 hours a day, every day",
    cost: "Free",
    emergencyNote:
      "If you are in immediate physical danger, call 911 instead or go to the nearest emergency department.",
    lastReviewed: "2026-09-21",
    provenance: r,
  },
  {
    id: "tlc-mama",
    name: "National Maternal Mental Health Hotline",
    description:
      "Counseling and referrals for pregnancy-related and postpartum mental-health concerns, in English and Spanish, with interpretation available.",
    audience: "Pregnant and postpartum people and their families",
    category: "mental-health",
    availability: "United States, nationwide",
    phone: "1-833-852-6262",
    phoneLabel: "Call or text 1-833-TLC-MAMA (1-833-852-6262)",
    sms: "1-833-852-6262",
    smsLabel: "Text 1-833-852-6262",
    website: "https://mchb.hrsa.gov/national-maternal-mental-health-hotline",
    hours: "24 hours a day, every day",
    cost: "Free",
    lastReviewed: "2026-09-21",
    provenance: r,
  },
  {
    id: "psi",
    name: "Postpartum Support International Helpline",
    description:
      "Trained volunteers provide information and connect you with local perinatal mental-health providers and free support groups. Not a crisis line.",
    audience: "Parents, partners, and family members",
    category: "mental-health",
    availability: "United States, with international resource referrals",
    phone: "1-800-944-4773",
    phoneLabel: "Call 1-800-944-4773",
    sms: "800-944-4773",
    smsLabel: "Text 800-944-4773 (English) or 971-203-7773 (Spanish)",
    website: "https://www.postpartum.net",
    hours: "Messages returned during business hours",
    cost: "Free",
    emergencyNote:
      "This helpline does not handle emergencies. For urgent help, call or text 988, or call 911.",
    lastReviewed: "2026-09-21",
    provenance: r,
  },
  {
    id: "ndvh",
    name: "National Domestic Violence Hotline",
    description:
      "Confidential advocates help with safety planning, local shelter and legal referrals, and understanding your options. You do not have to be leaving to call.",
    audience: "Anyone experiencing or worried about abuse",
    category: "safety",
    availability: "United States, nationwide",
    phone: "1-800-799-7233",
    phoneLabel: "Call 1-800-799-7233",
    sms: "88788",
    smsLabel: 'Text "START" to 88788',
    website: "https://www.thehotline.org",
    hours: "24 hours a day, every day",
    cost: "Free",
    emergencyNote:
      "If you are in immediate danger, call 911. If you share a device, use a private browsing window.",
    lastReviewed: "2026-09-21",
    provenance: r,
  },
  {
    id: "211",
    name: "211 community help line",
    description:
      "Connects you with local services: food, housing, utility assistance, childcare, transportation to appointments, and more.",
    audience: "Anyone needing local assistance",
    category: "transportation",
    availability: "Most United States communities",
    phone: "211",
    phoneLabel: "Dial 211",
    website: "https://www.211.org",
    hours: "Varies by region; many centers are 24 hours",
    cost: "Free",
    lastReviewed: "2026-09-21",
    provenance: r,
  },
  {
    id: "wic",
    name: "WIC (Women, Infants, and Children)",
    description:
      "Nutrition support, breastfeeding counseling, and food benefits for eligible pregnant and postpartum people and young children.",
    audience: "Income-eligible pregnant, postpartum, and breastfeeding people",
    category: "benefits",
    availability: "United States, administered by state and tribal agencies",
    website: "https://www.fns.usda.gov/wic",
    hours: "Local agency business hours",
    cost: "Free if eligible",
    lastReviewed: "2026-09-21",
    provenance: r,
  },
  {
    id: "medicaid-postpartum",
    name: "Medicaid and CHIP coverage help",
    description:
      "Many states extend Medicaid coverage for 12 months after birth. This is the starting point for checking eligibility and applying.",
    audience: "People needing insurance coverage after birth",
    category: "benefits",
    availability: "United States, coverage rules vary by state",
    website: "https://www.medicaid.gov",
    hours: "Online; state offices keep business hours",
    cost: "Free to apply",
    lastReviewed: "2026-09-21",
    provenance: r,
  },
  {
    id: "lll",
    name: "La Leche League USA",
    description:
      "Peer-to-peer breastfeeding support through local leaders and free meetings, plus practical guidance on latch, supply, and pumping.",
    audience: "Anyone breastfeeding, pumping, or mixed feeding",
    category: "lactation",
    availability: "United States, local groups vary",
    website: "https://lllusa.org",
    hours: "Varies by local leader",
    cost: "Free",
    lastReviewed: "2026-09-21",
    provenance: r,
  },
  {
    id: "psi-groups",
    name: "Free perinatal support groups (PSI)",
    description:
      "Online groups for new parents, including groups for dads, partners, NICU families, birth trauma, and parents of color.",
    audience: "New and expecting parents and partners",
    category: "peer-support",
    availability: "Online, many groups open internationally",
    website: "https://www.postpartum.net/get-help/psi-online-support-meetings",
    hours: "Scheduled weekly sessions",
    cost: "Free",
    lastReviewed: "2026-09-21",
    provenance: r,
  },
  {
    id: "black-mamas-matter",
    name: "Black Mamas Matter Alliance",
    description:
      "Advocacy organization with directories of Black-led maternal health and birth-justice programs, including community doula support.",
    audience: "Black birthing people and community organizations",
    category: "community",
    availability: "United States",
    website: "https://blackmamasmatter.org",
    hours: "Online",
    cost: "Free",
    lastReviewed: "2026-09-21",
    provenance: r,
  },
  {
    id: "march-of-dimes",
    name: "March of Dimes",
    description:
      "Maternal and infant health education, including postpartum recovery information and local program finders.",
    audience: "Parents and families",
    category: "community",
    availability: "United States",
    website: "https://www.marchofdimes.org",
    hours: "Online",
    cost: "Free",
    lastReviewed: "2026-09-21",
    provenance: r,
  },
  {
    id: "share-loss",
    name: "Share Pregnancy and Infant Loss Support",
    description:
      "Companionship and counseling referrals after miscarriage, stillbirth, or infant death, including support for partners and grandparents.",
    audience: "Families grieving a pregnancy or infant loss",
    category: "grief",
    availability: "United States",
    phone: "1-800-821-6819",
    phoneLabel: "Call 1-800-821-6819",
    website: "https://nationalshare.org",
    hours: "Business hours, with online groups at other times",
    cost: "Free",
    lastReviewed: "2026-09-21",
    provenance: r,
  },
];

/** Numbers surfaced on the emergency screen. Order matters: 911 is first. */
export const EMERGENCY_LINES = [
  {
    id: "911",
    label: "Emergency services",
    number: "911",
    description:
      "Heavy bleeding, chest pain, trouble breathing, a seizure, fainting, or immediate danger.",
    tone: "emergency" as const,
  },
  {
    id: "988",
    label: "Suicide and Crisis Lifeline",
    number: "988",
    description:
      "Thoughts of self-harm, harming your baby, or feeling unable to cope. Call or text.",
    tone: "serious" as const,
  },
  {
    id: "tlc-mama",
    label: "National Maternal Mental Health Hotline",
    number: "1-833-852-6262",
    description: "Postpartum mental-health counseling and referrals, 24/7.",
    tone: "supportive" as const,
  },
  {
    id: "ndvh",
    label: "National Domestic Violence Hotline",
    number: "1-800-799-7233",
    description: "Confidential help if someone is hurting or threatening you.",
    tone: "supportive" as const,
  },
];

export function getResource(id: string): Resource | undefined {
  return RESOURCES.find((resource) => resource.id === id);
}
