import type { ActionLevel } from "@/lib/safety-rules/types";

import {
  WARNING_SIGN_CONTENT,
  type ContentProvenance,
  type Reference,
} from "./meta";

export type WarningSignCategory =
  | "bleeding"
  | "blood-pressure"
  | "heart-and-breathing"
  | "pain"
  | "infection"
  | "swelling-and-clots"
  | "healing"
  | "feeding"
  | "mental-health"
  | "personal-safety";

/** How urgently this topic usually needs attention. Never a diagnosis. */
export type UrgencyHint = "call-911" | "emergency-now" | "same-day" | "prompt";

/**
 * Some topics span more than one action level, and collapsing them into a
 * single instruction is actively harmful: a mother told to call 911 for an
 * elevated blood-pressure reading learns to discount the instruction by the
 * time she has a severe-range one. Tiers keep the bands apart, each with the
 * response that band actually calls for.
 */
export type WarningSignTier = {
  id: string;
  label: string;
  /** The measurable boundary, where the topic has one. */
  threshold?: string;
  level: ActionLevel;
  looksLike: string[];
  whatToDo: string[];
  /** Instructions that sound sensible here and are wrong. */
  doNot?: string[];
};

export type WarningSign = {
  slug: string;
  title: string;
  /** Short line used in the index list. */
  standfirst: string;
  category: WarningSignCategory;
  urgencyHint: UrgencyHint;
  searchTerms: string[];
  looksLike: string[];
  whyItMatters: string;
  whatToDo: string[];
  call911When: string[];
  contactCareTeamWhen: string[];
  /** Symptom id in the seek-care questionnaire, when one exists. */
  symptomId: string | null;
  /**
   * Present when the topic covers bands that need different responses. When
   * set, the page shows the bands instead of one blanket urgency instruction.
   */
  tiers?: WarningSignTier[];
  /** Education that belongs to the topic but is not part of deciding what to do. */
  sections?: { heading: string; body: string; points?: string[] }[];
  /**
   * Shown wherever a sign depends on how skin looks, so that the guidance does
   * not quietly assume light skin.
   */
  skinToneNote?: boolean;
  references?: Reference[];
  provenance: ContentProvenance;
};

export const WARNING_SIGN_CATEGORIES: {
  id: WarningSignCategory;
  label: string;
}[] = [
  { id: "bleeding", label: "Bleeding" },
  { id: "blood-pressure", label: "Blood pressure" },
  { id: "heart-and-breathing", label: "Heart and breathing" },
  { id: "pain", label: "Pain" },
  { id: "infection", label: "Fever and infection" },
  { id: "swelling-and-clots", label: "Swelling and clots" },
  { id: "healing", label: "Healing and incisions" },
  { id: "feeding", label: "Breasts and feeding" },
  { id: "mental-health", label: "Mental health" },
  { id: "personal-safety", label: "Personal safety" },
];

export const URGENCY_HINT_LABELS: Record<UrgencyHint, string> = {
  "call-911": "Call 911",
  "emergency-now": "Emergency care now",
  "same-day": "Care team today",
  prompt: "Contact care team",
};

const p = WARNING_SIGN_CONTENT;

export const WARNING_SIGNS: WarningSign[] = [
  {
    slug: "heavy-bleeding",
    title: "Heavy bleeding",
    standfirst:
      "Soaking a pad in an hour, passing large clots, or bleeding that gets heavier instead of lighter.",
    category: "bleeding",
    urgencyHint: "call-911",
    searchTerms: [
      "hemorrhage",
      "clots",
      "postpartum bleeding",
      "pads",
      "blood",
    ],
    looksLike: [
      "Soaking through more than one pad in an hour.",
      "Passing clots larger than a golf ball.",
      "Bleeding that becomes heavier again after it had slowed down.",
      "Feeling dizzy, cold, shaky, or short of breath along with bleeding.",
    ],
    whyItMatters:
      "Bleeding is expected after birth, and it should slowly taper. Bleeding that soaks pads quickly can become dangerous fast, and heavy blood loss can affect your blood pressure and your heart before you feel very sick.",
    whatToDo: [
      "Call 911 or go to the emergency department now if you are soaking a pad in an hour or passing very large clots.",
      "Do not drive yourself. Ask someone to drive, or call an ambulance.",
      "Lie down, keep your feet up, and stay warm while you wait for help.",
      "If you can, note how many pads you have soaked and how long it took. That helps the care team act quickly.",
    ],
    call911When: [
      "You are soaking a pad in an hour or less.",
      "You feel faint, confused, or cannot stay awake.",
      "Your heart is racing or you are struggling to breathe.",
      "You are alone and unsure you can get to the hospital safely.",
    ],
    contactCareTeamWhen: [
      "Your bleeding is lighter but heavier than it was yesterday.",
      "You are passing small clots and want to know what is expected.",
      "You have a bad smell with the bleeding or a fever.",
    ],
    symptomId: "heavy-bleeding",
    provenance: p,
  },
  {
    slug: "severe-headache",
    title: "Severe headache that will not go away",
    standfirst:
      "A headache that is the worst you have had, does not ease with rest or usual medicine, or comes with vision changes.",
    category: "blood-pressure",
    urgencyHint: "emergency-now",
    searchTerms: ["migraine", "head pain", "preeclampsia", "pressure"],
    looksLike: [
      "A headache that does not improve after rest, water, or the medicine your care team said you could take.",
      "Pain that feels different or worse than headaches you have had before.",
      "Headache with blurry vision, spots, swelling, or pain under your ribs.",
      "A sudden, severe headache that starts like a thunderclap.",
    ],
    whyItMatters:
      "After birth, a severe headache can be a sign of dangerously high blood pressure, including preeclampsia, which can develop or worsen after delivery. It can also point to other conditions that need imaging and treatment quickly.",
    whatToDo: [
      "Seek emergency care now for a severe headache that will not go away, especially with vision changes.",
      "Call 911 for a sudden, extremely severe headache, weakness on one side, trouble speaking, or a seizure.",
      "Bring any blood-pressure readings you have taken at home.",
      "Ask someone else to drive you.",
    ],
    call911When: [
      "The headache came on suddenly and is the worst of your life.",
      "You have weakness, numbness, trouble speaking, or a seizure.",
      "You lose consciousness or cannot stay awake.",
    ],
    contactCareTeamWhen: [
      "You have a mild headache that eases with rest and fluids but keeps returning.",
      "You are unsure which pain medicine is safe for you.",
    ],
    symptomId: "severe-headache",
    provenance: p,
  },
  {
    slug: "vision-changes",
    title: "Vision changes",
    standfirst:
      "Blurry vision, double vision, flashing spots, or losing part of your sight.",
    category: "blood-pressure",
    urgencyHint: "emergency-now",
    searchTerms: ["blurry", "spots", "flashing", "eyes", "seeing"],
    looksLike: [
      "Blurred or double vision.",
      "Flashing lights, sparkles, or dark spots in your sight.",
      "A curtain or shadow over part of your vision.",
      "Sudden sensitivity to light with a headache.",
    ],
    whyItMatters:
      "New vision changes after birth can be a sign of severe high blood pressure or preeclampsia. Your eyes can show a blood-pressure problem before you feel anything else.",
    whatToDo: [
      "Seek emergency care now for new vision changes after birth.",
      "Have your blood pressure checked as soon as possible.",
      "Do not drive yourself if your vision is affected.",
    ],
    call911When: [
      "You suddenly lose vision in one or both eyes.",
      "Vision changes come with a severe headache, confusion, weakness, or a seizure.",
    ],
    contactCareTeamWhen: [
      "You had brief vision changes that have fully resolved — your care team still needs to know today.",
    ],
    symptomId: "vision-changes",
    provenance: p,
  },
  {
    slug: "high-blood-pressure",
    title: "High blood-pressure warning signs",
    standfirst:
      "Two different readings that need two different responses: elevated, from 140/90, and severe-range, from 160/110.",
    category: "blood-pressure",
    urgencyHint: "emergency-now",
    searchTerms: [
      "preeclampsia",
      "bp",
      "hypertension",
      "cuff",
      "140/90",
      "160/110",
      "severe range",
    ],
    looksLike: [
      "A home reading of 140/90 or higher.",
      "A reading of 160/110 or higher — either number on its own is enough.",
      "Headache, vision changes, sudden swelling, nausea, or pain in your upper belly or under your right ribs.",
      "A reading that is normal, taken while you feel unwell. Symptoms matter even when the number does not look alarming.",
    ],
    whyItMatters:
      "Blood pressure can rise for the first time after birth, most often in the first week or two, and it can rise in someone whose pressure was normal all through pregnancy. Untreated, it can lead to seizures and stroke. Treated, it usually settles. The reason the two bands are separated here is that they need different speeds of response, and an app that tells you to call 911 for every reading teaches you to ignore it by the time it matters.",
    whatToDo: [
      "Rest five minutes first. Sit with your back supported, feet flat on the floor, legs uncrossed, arm supported at heart level, cuff on bare skin.",
      "Write down the numbers and the time. Your care team will ask for both.",
      "Use the two bands below to decide what to do next.",
      "Keep taking any blood-pressure medicine you were prescribed unless your care team tells you otherwise.",
    ],
    tiers: [
      {
        id: "elevated",
        label: "Elevated range",
        threshold: "140/90 up to 159/109",
        level: "contact-team-promptly",
        looksLike: [
          "Systolic (top number) 140 to 159, or diastolic (bottom number) 90 to 109.",
          "You feel well, or you have only mild symptoms.",
        ],
        whatToDo: [
          "Rest five minutes and repeat the reading with proper technique.",
          "If it is still 140/90 or higher, contact your obstetric provider promptly — the same day where you can.",
          "Describe both readings, how many days postpartum you are, and anything else you are noticing.",
          "Keep measuring at the times your care team asked for, and write every reading down.",
        ],
        doNot: [
          "Do not wait until you have symptoms before you call. A persistent elevated reading is reason enough on its own.",
          "Do not assume a single normal reading afterwards cancels it out. Tell your care team about the high one.",
        ],
      },
      {
        id: "severe-range",
        label: "Severe range",
        threshold: "160 or higher on top, or 110 or higher on the bottom",
        level: "emergency-now",
        looksLike: [
          "Systolic (top number) 160 or higher, on its own.",
          "Diastolic (bottom number) 110 or higher, on its own.",
          "Either number in that range, whether or not you feel unwell.",
        ],
        whatToDo: [
          "Seek medical evaluation immediately. Contact your maternity team now, or go to the nearest emergency department.",
          "Say the words: “I am postpartum and my blood pressure is in the severe range.” That phrase gets you triaged correctly.",
          "Call 911 if you also have any of the emergency symptoms listed below, or if you cannot arrange safe immediate transport.",
        ],
        doNot: [
          "Do not wait and take another reading first. A severe-range reading is acted on, not confirmed.",
          "Do not wait for a callback, for morning, or for a scheduled appointment.",
        ],
      },
    ],
    call911When: [
      "You have a seizure, or shaking you cannot control.",
      "You have chest pain, or significant difficulty breathing.",
      "You have weakness or numbness on one side, trouble speaking, or a sudden change in how alert you are.",
      "Your blood pressure is in the severe range and you cannot get to an emergency department safely and immediately.",
    ],
    contactCareTeamWhen: [
      "A repeated reading is 140/90 or higher and you feel well.",
      "Your readings are creeping up over several days.",
      "You have a severe or persistent headache, blurred vision or seeing spots, sudden swelling of your face or hands, pain in your upper belly or under your right ribs, or nausea and vomiting alongside any of these — contact them straight away, whatever the reading says.",
      "You do not have a cuff and need help getting a blood-pressure check.",
    ],
    symptomId: "high-blood-pressure",
    references: [
      {
        organisation: "ACOG",
        title:
          "Gestational Hypertension and Preeclampsia (Practice Bulletin 222)",
        url: "https://www.acog.org/clinical/clinical-guidance/practice-bulletin/articles/2020/06/gestational-hypertension-and-preeclampsia",
      },
      {
        organisation: "ACOG",
        title:
          "Emergent Therapy for Acute-Onset, Severe Hypertension During Pregnancy and the Postpartum Period (Committee Opinion 767)",
        url: "https://www.acog.org/clinical/clinical-guidance/committee-opinion/articles/2019/02/emergent-therapy-for-acute-onset-severe-hypertension-during-pregnancy-and-the-postpartum-period",
      },
      {
        organisation: "CDC",
        title: "Urgent Maternal Warning Signs (Hear Her campaign)",
        url: "https://www.cdc.gov/hearher/maternal-warning-signs/index.html",
      },
      {
        organisation: "American Heart Association",
        title: "Monitoring Your Blood Pressure at Home",
        url: "https://www.heart.org/en/health-topics/high-blood-pressure/understanding-blood-pressure-readings/monitoring-your-blood-pressure-at-home",
      },
    ],
    provenance: p,
  },
  {
    slug: "chest-pain",
    title: "Chest pain",
    standfirst:
      "Pressure, tightness, or pain in your chest, with or without shortness of breath.",
    category: "heart-and-breathing",
    urgencyHint: "call-911",
    searchTerms: ["heart", "pressure", "tightness", "palpitations"],
    looksLike: [
      "Pressure, squeezing, or heaviness in your chest.",
      "Pain spreading to your arm, jaw, neck, or back.",
      "Chest pain with sweating, nausea, or shortness of breath.",
      "A racing or pounding heartbeat that will not settle.",
    ],
    whyItMatters:
      "Pregnancy and the weeks after birth raise the risk of blood clots and heart problems. Chest pain is one of the most important symptoms not to wait on, even if you are young and healthy.",
    whatToDo: [
      "Call 911 now. Do not drive yourself.",
      "Unlock your door and stay where responders can reach you.",
      "Tell the dispatcher how many weeks ago you gave birth.",
    ],
    call911When: [
      "You have any chest pain, pressure, or tightness.",
      "You feel faint, sweaty, or short of breath with chest discomfort.",
    ],
    contactCareTeamWhen: [
      "Your chest discomfort has fully passed — you still need to be evaluated, so call your care team right away to be told where to go.",
    ],
    symptomId: "chest-pain",
    provenance: p,
  },
  {
    slug: "trouble-breathing",
    title: "Trouble breathing",
    standfirst:
      "Shortness of breath at rest, gasping, or needing to sit up to breathe.",
    category: "heart-and-breathing",
    urgencyHint: "call-911",
    searchTerms: ["breath", "breathless", "gasping", "blood clot", "pulmonary"],
    looksLike: [
      "Feeling short of breath while sitting or lying still.",
      "Needing to prop yourself up to breathe or waking up gasping.",
      "Breathing that feels fast or shallow.",
      "Shortness of breath with chest pain, a cough, or leg swelling.",
    ],
    whyItMatters:
      "New trouble breathing after birth can be caused by a blood clot in the lungs, fluid in the lungs, or a heart problem. These are emergencies, and treatment works best when it starts early.",
    whatToDo: [
      "Call 911 now if you are struggling to breathe.",
      "Sit upright and try to stay calm while help is on the way.",
      "Do not drive yourself.",
    ],
    call911When: [
      "You are short of breath at rest, gasping, or cannot speak in full sentences.",
      "Your lips or fingertips look blue or gray.",
      "Breathing trouble comes with chest pain or fainting.",
    ],
    contactCareTeamWhen: [
      "You get winded more easily than before but breathe comfortably at rest — tell your care team today.",
    ],
    symptomId: "trouble-breathing",
    provenance: p,
  },
  {
    slug: "seizure",
    title: "Seizure",
    standfirst:
      "Shaking or convulsions, sudden stiffening, or a period of unresponsiveness.",
    category: "blood-pressure",
    urgencyHint: "call-911",
    searchTerms: ["convulsion", "fit", "eclampsia", "shaking"],
    looksLike: [
      "Jerking or shaking movements you cannot control.",
      "Sudden stiffening followed by shaking.",
      "Staring, unresponsiveness, or confusion afterward.",
      "Losing control of your bladder during the episode.",
    ],
    whyItMatters:
      "A seizure after birth is a medical emergency. It can be caused by eclampsia, a severe form of high blood pressure, and it needs treatment immediately.",
    whatToDo: [
      "Call 911 immediately.",
      "If someone else is having a seizure, move objects away, cushion their head, and turn them onto their side once the shaking stops.",
      "Do not put anything in their mouth.",
      "Stay with them and note how long the seizure lasted.",
    ],
    call911When: ["Any seizure after birth. Always call 911."],
    contactCareTeamWhen: [
      "After emergency care, your care team needs to know so your blood pressure and medicines can be reviewed.",
    ],
    symptomId: "seizure",
    provenance: p,
  },
  {
    slug: "fainting",
    title: "Fainting or loss of consciousness",
    standfirst:
      "Passing out, nearly passing out, or feeling like the room is going dark.",
    category: "heart-and-breathing",
    urgencyHint: "call-911",
    searchTerms: ["passed out", "blackout", "dizzy", "lightheaded", "collapse"],
    looksLike: [
      "Losing consciousness, even briefly.",
      "Feeling like you are about to pass out when you stand.",
      "Dizziness with heavy bleeding, chest pain, or trouble breathing.",
      "Confusion after coming to.",
    ],
    whyItMatters:
      "Fainting after birth can be a sign of blood loss, a blood clot, infection, or a heart rhythm problem. It also puts you and your baby at risk of injury from a fall.",
    whatToDo: [
      "Call 911 if you fainted, especially while holding your baby or if you are bleeding heavily.",
      "Lie down and raise your legs if you feel faint.",
      "Do not hold your baby until the feeling passes and someone else is nearby.",
      "Do not drive.",
    ],
    call911When: [
      "You lost consciousness.",
      "You feel faint along with heavy bleeding, chest pain, or trouble breathing.",
      "You fell and hit your head.",
    ],
    contactCareTeamWhen: [
      "You get lightheaded when standing up quickly but have not fainted — mention it to your care team today.",
    ],
    symptomId: "fainting",
    provenance: p,
  },
  {
    slug: "severe-abdominal-pain",
    title: "Severe belly pain",
    standfirst:
      "Belly pain that is severe, constant, or different from normal cramping.",
    category: "pain",
    urgencyHint: "emergency-now",
    searchTerms: [
      "stomach",
      "abdominal",
      "cramps",
      "liver",
      "ribs",
      "hellp",
      "tenderness",
    ],
    looksLike: [
      "Pain that is severe, or that stops you from standing straight, sleeping, or caring for your baby.",
      "Pain that persists rather than coming in waves the way afterbirth cramping does.",
      "Pain high in your belly, or under your right ribs, or going through to your right shoulder.",
      "Tenderness that is increasing — your belly hurting more to touch today than yesterday.",
      "Pain together with a temperature of 100.4°F (38°C) or higher.",
      "Pain together with vomiting, or being unable to keep fluids down.",
      "Pain together with dizziness, feeling faint, or fainting.",
      "Pain that keeps getting worse over hours.",
      "A belly that is hard, rigid, or distended.",
    ],
    whyItMatters:
      "Afterbirth cramping is normal, comes in waves, and eases over the first days. Pain that does not behave that way is different. Severe or persistent belly pain after birth can mean an infection in the uterus, a blood-pressure complication affecting the liver, bleeding inside the abdomen, or a bowel problem after surgery. Pain under the right ribs in particular is one of the symptoms care teams associate with severe preeclampsia and HELLP syndrome, and it is often missed because it gets mistaken for heartburn or gas.",
    whatToDo: [
      "Seek emergency care now for severe or persistent pain, pain under your right ribs, or pain with fever, vomiting, or dizziness.",
      "Call 911 if the pain came on suddenly and severely, or if you feel faint, cold, and clammy.",
      "Do not eat or drink on the way in case you need a procedure.",
      "Take your temperature and your blood pressure if you can, and bring both numbers.",
      "Bring a list of your medicines and the details of your delivery, including whether you had a cesarean.",
      "Say that you gave birth recently and how long ago. Postpartum belly pain is assessed differently.",
    ],
    call911When: [
      "The pain came on suddenly and is severe.",
      "You feel faint, cold, and clammy, or you have fainted.",
      "You have chest pain, trouble breathing, or heavy bleeding with it.",
      "Your belly is rigid and very tender to touch.",
    ],
    contactCareTeamWhen: [
      "Your cramping is uncomfortable but eases with rest and medicine, and it is lessening over the days.",
      "You have constipation, trapped gas, or soreness you want checked.",
      "Pain around a cesarean incision rather than deep in your belly — see the wound and incision guidance as well.",
    ],
    symptomId: "severe-abdominal-pain",
    references: [
      {
        organisation: "CDC",
        title: "Urgent Maternal Warning Signs (Hear Her campaign)",
        url: "https://www.cdc.gov/hearher/maternal-warning-signs/index.html",
      },
      {
        organisation: "ACOG",
        title:
          "Gestational Hypertension and Preeclampsia (Practice Bulletin 222)",
        url: "https://www.acog.org/clinical/clinical-guidance/practice-bulletin/articles/2020/06/gestational-hypertension-and-preeclampsia",
      },
    ],
    provenance: p,
  },
  {
    slug: "severe-pelvic-pain",
    title: "Severe pelvic or perineal pain",
    standfirst:
      "Pain, pressure, or swelling in your pelvis, vagina, or perineum that is getting worse.",
    category: "pain",
    urgencyHint: "same-day",
    searchTerms: ["perineum", "stitches", "tear", "vaginal pain", "hematoma"],
    looksLike: [
      "Pain in your perineum or vagina that is worse than yesterday.",
      "A tight, swollen, or bulging area near a tear or stitches.",
      "Pain with fever, bad-smelling discharge, or trouble urinating.",
      "Feeling unable to sit, walk, or empty your bladder.",
    ],
    whyItMatters:
      "Worsening pelvic pain can mean a collection of blood, an infection at a repair site, or a healing problem. These are treatable, and earlier care usually means a simpler fix.",
    whatToDo: [
      "Contact your care team today for worsening pelvic pain, swelling, or bad-smelling discharge.",
      "Seek emergency care if you cannot urinate, the swelling is growing quickly, or you have a fever with severe pain.",
      "Note your temperature and any changes in discharge before you call.",
    ],
    call911When: [
      "You have severe pain with heavy bleeding, fainting, or a racing heart.",
    ],
    contactCareTeamWhen: [
      "Soreness that is slowly improving but still uncomfortable.",
      "Questions about stitches, ice, sitz baths, or pain medicine.",
    ],
    symptomId: "severe-pelvic-pain",
    provenance: p,
  },
  {
    slug: "fever-or-infection",
    title: "Fever or signs of infection",
    standfirst:
      "A temperature of 100.4°F (38°C) or higher, chills, or bad-smelling discharge.",
    category: "infection",
    urgencyHint: "same-day",
    searchTerms: ["temperature", "chills", "sepsis", "smell", "infection"],
    looksLike: [
      "A temperature of 100.4°F (38°C) or higher.",
      "Shaking chills, even without a measured fever.",
      "Vaginal discharge with a bad smell.",
      "Burning when you urinate, or pain in your lower back or side.",
    ],
    whyItMatters:
      "Infection after birth can move quickly. Treated early it usually responds well to antibiotics; untreated it can become sepsis, which is life-threatening.",
    whatToDo: [
      "Contact your care team today for a temperature of 100.4°F or higher.",
      "Seek emergency care now if you also feel confused, very weak, short of breath, or your heart is racing.",
      "Take your temperature again before you call and write down the reading and time.",
      "Keep drinking fluids.",
    ],
    call911When: [
      "You are confused, very hard to wake, or breathing fast.",
      "Your skin is mottled, clammy, or gray, or your lips look blue.",
    ],
    contactCareTeamWhen: [
      "You have a low-grade temperature under 100.4°F and feel generally well.",
      "You are unsure whether your discharge smell is normal.",
    ],
    symptomId: "fever-or-infection",
    provenance: p,
  },
  {
    slug: "leg-pain-or-swelling",
    title: "Leg swelling, discolouration, or pain",
    standfirst:
      "One leg that is swollen, warm, discoloured, or painful, especially in the calf.",
    category: "swelling-and-clots",
    urgencyHint: "emergency-now",
    searchTerms: ["dvt", "blood clot", "calf", "thigh", "one leg"],
    looksLike: [
      "One leg noticeably more swollen than the other.",
      "Calf pain, tenderness, or a cramping ache that will not ease.",
      "Skin over the sore area that is discoloured — red, purple, brown, or darker than the other leg — or that feels warm.",
      "Leg symptoms with chest pain or shortness of breath.",
    ],
    skinToneNote: true,
    whyItMatters:
      "Blood clots are more likely during pregnancy and for several weeks after birth. A clot in the leg can travel to the lungs, so it needs to be checked quickly even when the leg pain seems mild.",
    whatToDo: [
      "Seek emergency care now for new swelling, discolouration, or pain in one leg.",
      "Call 911 if you also have chest pain or trouble breathing.",
      "Do not massage or rub the leg.",
    ],
    call911When: [
      "You have leg symptoms with chest pain, trouble breathing, coughing blood, or fainting.",
    ],
    contactCareTeamWhen: [
      "Both of your legs and feet are puffy but not painful, and the swelling is slowly improving.",
    ],
    symptomId: "leg-pain-or-swelling",
    provenance: p,
  },
  {
    slug: "sudden-swelling",
    title: "Sudden or worsening swelling",
    standfirst:
      "New puffiness in your face or hands, or swelling that appears quickly.",
    category: "swelling-and-clots",
    urgencyHint: "same-day",
    searchTerms: ["puffy", "face", "hands", "edema", "rings"],
    looksLike: [
      "A puffy face or swollen eyelids.",
      "Hands so swollen your rings no longer fit.",
      "Swelling that appears over a day or two rather than slowly easing.",
      "Swelling with headache, vision changes, or rapid weight gain.",
    ],
    whyItMatters:
      "Some swelling is expected after birth and usually improves. Swelling that comes on suddenly, especially in the face and hands, can be a sign of a blood-pressure problem such as preeclampsia.",
    whatToDo: [
      "Contact your care team today about new or worsening swelling.",
      "Seek emergency care now if swelling comes with a severe headache, vision changes, or trouble breathing.",
      "Have your blood pressure checked.",
    ],
    call911When: [
      "You have trouble breathing, chest pain, or a seizure along with swelling.",
    ],
    contactCareTeamWhen: [
      "Your ankles are puffy at the end of the day but better in the morning.",
    ],
    symptomId: "sudden-swelling",
    provenance: p,
  },
  {
    slug: "incision-or-wound-concerns",
    title: "Wound or incision concerns",
    standfirst:
      "A cesarean incision, a tear, or an episiotomy that is changing — in pain, colour, drainage, or how it is holding together.",
    category: "healing",
    urgencyHint: "same-day",
    searchTerms: [
      "c-section",
      "cesarean",
      "stitches",
      "staples",
      "pus",
      "wound",
      "episiotomy",
      "tear",
      "laceration",
      "perineum",
      "dehiscence",
    ],
    looksLike: [
      "Pain at the wound that is increasing, or that stops easing day by day.",
      "A change in the kind of pain — throbbing, burning, or a deep ache that is new.",
      "Discolouration spreading outward from the wound edge.",
      "Swelling, firmness, or a lump under the wound.",
      "Skin around the wound that feels warm or hot compared with the other side of your body.",
      "Drainage of any kind: clear fluid, cloudy fluid, pus, or blood.",
      "An unusual or foul smell.",
      "Edges pulling apart, a gap opening, or a stitch or staple giving way.",
      "Bleeding from the wound.",
      "A temperature of 100.4°F (38°C) or higher.",
      "Healing that stalls or reverses — a wound that looked better last week and looks worse now.",
    ],
    skinToneNote: true,
    whyItMatters:
      "Most wound problems after birth are treatable, and almost all of them are easier to treat early. A wound infection caught in the first days is often a course of antibiotics; the same infection left for a week can mean the wound being opened, cleaned, and packed, and weeks of extra healing. The point of watching your wound is not to worry about it. It is to notice a change early enough that the fix stays small.",
    whatToDo: [
      "Look at the wound once a day in good light, with a mirror or your phone camera if you cannot see it easily.",
      "Compare it with the skin on the other side of your body rather than with a picture of someone else's healing.",
      "Take a photo each day. A change is far easier to see across two photos than from memory, and your care team will want to see it.",
      "Take your temperature if anything about the wound has changed.",
      "Use the bands below to decide how fast to act.",
    ],
    tiers: [
      {
        id: "emergency",
        label: "Go to emergency care now",
        level: "emergency-now",
        looksLike: [
          "The wound has opened widely, or you can see tissue underneath.",
          "It is bleeding and the bleeding does not slow with firm pressure.",
          "A swelling near the wound is growing while you watch it.",
          "You have a fever together with spreading discolouration, or you feel very unwell, confused, weak, or are breathing fast.",
        ],
        whatToDo: [
          "Go to the nearest emergency department now, or call 911 if you feel faint, confused, or cannot get there safely.",
          "Tell them how you gave birth and how many days ago. Say that this is a postpartum wound.",
          "Do not drive yourself if you feel faint or unwell.",
        ],
      },
      {
        id: "prompt",
        label: "Contact your care team promptly",
        level: "contact-team-promptly",
        looksLike: [
          "Pus or cloudy drainage, or any unusual smell.",
          "Discolouration spreading outward from the wound edge.",
          "Pain that is increasing day by day instead of easing.",
          "A small separation, or one stitch or staple that has given way.",
          "A temperature of 100.4°F (38°C) or higher.",
          "Warmth, firmness, or a lump that is new.",
        ],
        whatToDo: [
          "Call your obstetric provider today and describe what changed and when.",
          "Send a photo if your practice accepts them.",
          "Keep the area clean and dry, and do not put ointments, powders, or home remedies on it unless your care team asked you to.",
        ],
        doNot: [
          "Do not wait for the next scheduled visit to mention it.",
          "Do not wait to see whether a fever comes. Drainage and spreading discolouration are reason enough on their own.",
        ],
      },
      {
        id: "routine",
        label: "Mention it at your next visit",
        level: "monitor-and-contact",
        looksLike: [
          "Itching, tightness, or a pulling feeling as the wound knits.",
          "Numbness or odd sensation along a cesarean scar.",
          "A small amount of clear fluid in the first days.",
          "Soreness that is slowly and steadily improving.",
          "Questions about lifting, showering, sitz baths, or scar care.",
        ],
        whatToDo: [
          "Keep watching it daily and keep taking photos.",
          "Raise it at your next postpartum appointment.",
          "Call sooner if any of it changes direction and starts getting worse.",
        ],
        doNot: [
          "Do not take this band as a reason to wait if something feels wrong to you. Your own sense that something has changed is a reason to call.",
        ],
      },
    ],
    sections: [
      {
        heading: "If you had a cesarean",
        body: "A cesarean incision is a surgical wound in a body that is also recovering from birth, feeding a newborn, and usually not sleeping. It is normally a horizontal line low on your abdomen, closed with stitches, staples, or glue, and it is often numb along the scar for months.",
        points: [
          "A small amount of clear or lightly blood-tinged fluid in the first days is common. Cloudy fluid, pus, or a smell is not, and needs a call.",
          "The fold of skin above the incision traps moisture and sweat. Keeping it clean and dry — patting, not rubbing — matters more than any product.",
          "Support the incision with a hand or a rolled towel when you cough, laugh, or stand up.",
          "A hard ridge along the scar as it heals is usual. A soft, growing swelling under the scar is not, and should be looked at.",
          "Follow the lifting limit your surgical team gave you. If you were not given one, ask for it rather than guessing.",
        ],
      },
      {
        heading: "If you had a tear or an episiotomy",
        body: "Perineal repairs heal in a place that is warm, moist, and impossible to keep still, which makes it normal for them to be uncomfortable and important to watch them. Pain should ease gradually, day by day.",
        points: [
          "Rinse with warm water from a bottle while you urinate, and pat dry from front to back.",
          "Change pads frequently. A wet pad against a repair slows healing.",
          "Pain that increases, a bulge or swelling that grows, or a feeling of heavy pressure can mean a collection of blood under the repair. That needs to be assessed the same day.",
          "Not being able to urinate, or not being able to control stool or gas, needs to be reported straight away. These are treatable and they are not something to live with quietly.",
          "Stitches dissolve on their own. You do not need to count them or look for them to come out.",
        ],
      },
    ],
    call911When: [
      "The wound is bleeding heavily and does not slow with firm pressure.",
      "You feel faint, confused, or very unwell, or you are breathing fast.",
      "The wound has opened widely and you cannot get to an emergency department safely.",
    ],
    contactCareTeamWhen: [
      "Anything about the wound has changed and you are not sure which band it falls in.",
      "Healing has stalled, or the wound looked better last week and looks worse now.",
      "You want reassurance about normal-looking healing, itching, or scar care.",
    ],
    symptomId: "incision-or-wound-concerns",
    references: [
      {
        organisation: "ACOG",
        title: "Optimizing Postpartum Care (Committee Opinion 736)",
        url: "https://www.acog.org/clinical/clinical-guidance/committee-opinion/articles/2018/05/optimizing-postpartum-care",
      },
      {
        organisation: "CDC",
        title: "Urgent Maternal Warning Signs (Hear Her campaign)",
        url: "https://www.cdc.gov/hearher/maternal-warning-signs/index.html",
      },
      {
        organisation: "CDC",
        title:
          "Surgical Site Infection Event (NHSN) — definitions of wound infection",
        url: "https://www.cdc.gov/nhsn/psc/ssi/index.html",
      },
    ],
    provenance: p,
  },
  {
    slug: "breast-infection",
    title: "Breast pain, discolouration, or infection concerns",
    standfirst:
      "A hard, hot, painful area in one breast, often with fever or feeling unwell.",
    category: "feeding",
    urgencyHint: "same-day",
    searchTerms: ["mastitis", "clogged duct", "engorged", "nursing", "pumping"],
    looksLike: [
      "A wedge-shaped area on one breast that is hot, hard, and tender.",
      "Skin over that area that is discoloured — red, purple, or darker and shinier than the rest of the breast.",
      "Breast pain with fever, chills, or body aches.",
      "A lump that does not soften after feeding or pumping.",
      "Cracked, bleeding nipples that are getting worse.",
    ],
    skinToneNote: true,
    whyItMatters:
      "Mastitis is an infection of the breast tissue and is treatable. Left alone it can turn into an abscess, and pain often makes feeding harder at a time when you need it to be easier.",
    whatToDo: [
      "Contact your care team today if a hot, hard, tender area comes with a fever or you feel unwell.",
      "Keep feeding or pumping on that side unless you are told otherwise. Emptying the breast is part of treatment.",
      "Use cool compresses and ask which pain medicine is right for you.",
      "Ask for a lactation consultant referral — pain usually has a fixable cause.",
    ],
    call911When: [
      "You are confused, breathing fast, or feel severely unwell with a high fever.",
    ],
    contactCareTeamWhen: [
      "Sore nipples or engorgement without fever.",
      "Questions about supply, latch, or weaning.",
    ],
    symptomId: "breast-infection",
    provenance: p,
  },
  {
    slug: "mental-health-emergency",
    title: "Postpartum mental health",
    standfirst:
      "Depression, anxiety, panic, intrusive thoughts, sleeplessness, and the rarer emergencies — and which of them needs help today rather than right now.",
    category: "mental-health",
    urgencyHint: "emergency-now",
    searchTerms: [
      "postpartum depression",
      "ppd",
      "anxiety",
      "psychosis",
      "panic",
      "intrusive thoughts",
      "sleep",
      "crisis",
      "988",
      "tlc mama",
    ],
    looksLike: [
      "Feeling low, flat, tearful, numb, or irritable most days.",
      "Anxiety that will not switch off, or checking on your baby far past the point of reassurance.",
      "Panic attacks — a racing heart, breathlessness, or a sense of dread that comes in waves.",
      "Intrusive thoughts: sudden, unwanted, frightening images of something happening to your baby.",
      "Being unable to sleep at all, even when your baby sleeps and someone else is watching them.",
      "Feeling like you cannot cope with another hour.",
      "Seeing or hearing things other people do not, feeling confused, suspicious, or detached from reality.",
      "Thoughts of ending your life, hurting yourself, or hurting your baby.",
    ],
    whyItMatters:
      "Postpartum mental-health conditions are among the most common complications of childbirth, and they are treatable. Most of them need prompt professional support, not an emergency room. A few — postpartum psychosis, and thoughts you feel you might act on — are genuine emergencies, and they respond to treatment when they are reached quickly. Asking for help does not make you a bad mother. It is the same act as calling about a fever or a blood-pressure reading: you noticed something and you told someone. Seeking care is not evidence that you cannot look after your baby, and treatment does not begin with anyone being taken away from you.",
    whatToDo: [
      "Decide which band below matches what is happening. The response is different for each.",
      "Tell one person. Saying it out loud to someone who knows you is often the hardest and most useful step.",
      "Keep the three numbers somewhere you can reach them without thinking: 988, 1-833-TLC-MAMA, and 911.",
    ],
    tiers: [
      {
        id: "emergency",
        label: "Psychiatric emergency — act now",
        level: "call-911",
        looksLike: [
          "You feel you might act on thoughts of harming yourself or your baby.",
          "You have a plan, or you have already hurt yourself.",
          "You are seeing or hearing things other people do not.",
          "You feel confused, agitated, suspicious, or detached from reality.",
          "You cannot keep yourself or your baby safe where you are right now.",
        ],
        whatToDo: [
          "Call 911, or go to the nearest emergency department.",
          "Call or text 988 — the Suicide and Crisis Lifeline — if you want to talk to someone while you decide or while you wait.",
          "Ask someone you trust to come now and to care for your baby.",
          "Move anything you could use to hurt yourself out of reach, or ask someone else to.",
        ],
        doNot: [
          "Do not wait for a therapy appointment. An appointment, however soon, is not a substitute for emergency care.",
          "Do not wait to see whether it passes. Postpartum psychosis can change quickly, and it is treatable.",
          "Do not stay alone while you wait.",
        ],
      },
      {
        id: "prompt",
        label: "Get professional support promptly",
        level: "contact-team-promptly",
        looksLike: [
          "You have felt low, anxious, numb, or irritable most days for more than two weeks.",
          "You are having panic attacks.",
          "Intrusive thoughts are frightening you, and you do not want to act on them.",
          "You are struggling to sleep even when there is an opportunity to.",
          "You are not enjoying things you used to, or you feel disconnected from your baby.",
          "Anyone close to you has said they are worried about you.",
        ],
        whatToDo: [
          "Call your obstetric provider, midwife, or primary care doctor and say you want to be screened for a postpartum mood or anxiety condition. Those words get you to the right place.",
          "Call or text 1-833-TLC-MAMA (1-833-852-6262), the National Maternal Mental Health Hotline, free and staffed around the clock.",
          "Ask for a referral to a perinatal mental-health specialist, and look for support groups near you.",
          "Tell someone at home what you need this week, as specifically as you can.",
        ],
        doNot: [
          "Do not wait for your six-week visit if that is weeks away. This is a reason to call sooner.",
          "Do not wait until you feel worse to qualify for help.",
        ],
      },
      {
        id: "watch",
        label: "Keep an eye on it",
        level: "monitor-and-contact",
        looksLike: [
          "Tearfulness, mood swings, and feeling overwhelmed in the first two weeks — often called the baby blues.",
          "Exhaustion and short temper that lift when you get a stretch of sleep.",
          "Occasional worry that settles when you are reassured.",
        ],
        whatToDo: [
          "Give it the first two weeks, and take the rest and help you are offered.",
          "Tell your care team at your next appointment, even if it has eased by then.",
          "Call sooner if it deepens, lasts beyond two weeks, or stops lifting at all.",
        ],
        doNot: [
          "Do not use this band to talk yourself out of calling. If you are not sure which band you are in, call and let someone else decide.",
        ],
      },
    ],
    sections: [
      {
        heading: "What these conditions actually are",
        body: "Knowing the names helps, because each of these has a treatment and because recognising your own experience in a description is often what makes it possible to say out loud.",
        points: [
          "Postpartum depression: low mood, numbness, hopelessness, guilt, or irritability most days for more than two weeks. It can start any time in the first year, not only in the first weeks, and it does not always involve crying.",
          "Postpartum anxiety: persistent worry, racing thoughts, physical tension, or an inability to rest even when you have the chance. It often travels with depression and is just as treatable.",
          "Panic attacks: sudden waves of fear with a pounding heart, breathlessness, sweating, or a feeling that something terrible is about to happen. They peak within minutes and they are not dangerous, though they are frightening.",
          "Intrusive thoughts: unwanted, graphic thoughts or images of harm coming to your baby, which horrify you. They are extremely common after birth, they are a symptom of anxiety rather than an intention, and having them does not mean you will act. They are worth telling someone about precisely because they are so distressing.",
          "Severe sleep disturbance: being unable to sleep at all, even when your baby is asleep and someone else is watching them. This is different from being woken, and it is an early warning sign that needs urgent attention.",
          "Postpartum psychosis: a rare emergency — roughly one or two births in a thousand — usually starting in the first two weeks. It can involve seeing or hearing things others do not, beliefs that are out of character, severe confusion, or rapid mood swings. It is treatable, and it needs immediate help.",
        ],
      },
      {
        heading: "Asking for help does not make you a bad mother",
        body: "It is the part that stops people calling, so it is worth saying directly. Postpartum mental-health conditions are illnesses, not failures of character or of love. They happen to mothers who wanted their babies desperately and to mothers who are doing everything right.",
        points: [
          "Telling someone is an act of care for your baby, not evidence against you.",
          "Intrusive thoughts are not intentions, and clinicians who work with new mothers know the difference.",
          "Treatment usually means talking therapy, practical support, and sometimes medication — including options compatible with breastfeeding. Ask; do not assume you have to choose.",
          "You are allowed to say that you are not enjoying this. It does not mean you do not love your baby.",
        ],
      },
    ],
    call911When: [
      "You feel you may act on thoughts of harming yourself or your baby.",
      "You are seeing or hearing things others do not, or you feel confused or detached from reality.",
      "You cannot keep yourself or your baby safe right now.",
    ],
    contactCareTeamWhen: [
      "You have felt low, anxious, or not yourself most days for more than two weeks.",
      "You are having panic attacks or frightening intrusive thoughts.",
      "You want to talk about therapy or medication, including what is compatible with breastfeeding.",
      "Someone close to you has told you they are worried.",
    ],
    symptomId: "mental-health-crisis",
    references: [
      {
        organisation: "ACOG",
        title:
          "Screening and Diagnosis of Mental Health Conditions During Pregnancy and Postpartum (Clinical Practice Guideline 4)",
        url: "https://www.acog.org/clinical/clinical-guidance/clinical-practice-guideline/articles/2023/06/screening-and-diagnosis-of-mental-health-conditions-during-pregnancy-and-postpartum",
      },
      {
        organisation: "Postpartum Support International",
        title: "Perinatal Mental Health Conditions",
        url: "https://www.postpartum.net/learn-more/",
      },
      {
        organisation: "HRSA",
        title: "National Maternal Mental Health Hotline",
        url: "https://mchb.hrsa.gov/national-maternal-mental-health-hotline",
      },
      {
        organisation: "CDC",
        title: "Depression Among Women",
        url: "https://www.cdc.gov/reproductive-health/depression/index.html",
      },
    ],
    provenance: p,
  },
  {
    slug: "thoughts-of-harm",
    title: "Thoughts of self-harm or harming your baby",
    standfirst:
      "Any thoughts of ending your life, hurting yourself, or hurting your baby.",
    category: "mental-health",
    urgencyHint: "call-911",
    searchTerms: [
      "suicide",
      "self harm",
      "harm baby",
      "intrusive thoughts",
      "988",
    ],
    looksLike: [
      "Thoughts of ending your life or that your family would be better off without you.",
      "Thoughts of hurting yourself.",
      "Frightening thoughts about your baby being harmed.",
      "Feeling like you might act on these thoughts.",
    ],
    whyItMatters:
      "These thoughts are more common after birth than most people are told, and they are a reason to get support immediately rather than a reason for shame. Help exists, it works, and it does not begin with taking your baby away.",
    whatToDo: [
      "Call or text 988 now to reach the Suicide and Crisis Lifeline.",
      "Call 911 or go to the nearest emergency department if you feel you may act on these thoughts.",
      "Ask someone you trust to stay with you and take care of your baby right now.",
      "Move anything you could use to hurt yourself out of reach, or ask someone to do it.",
      "Keep telling people until someone helps. You deserve to be heard.",
    ],
    call911When: [
      "You feel you may act on thoughts of harming yourself or your baby.",
      "You have a plan or have already hurt yourself.",
      "You cannot stay safe where you are.",
    ],
    contactCareTeamWhen: [
      "You have frightening thoughts that you do not want to act on — tell your care team or call 988 so you can get support quickly.",
    ],
    symptomId: "thoughts-of-harm",
    provenance: p,
  },
  {
    slug: "feeling-unsafe",
    title: "Feeling unsafe or experiencing abuse",
    standfirst:
      "Being hurt, threatened, controlled, or frightened by someone in your life.",
    category: "personal-safety",
    urgencyHint: "emergency-now",
    searchTerms: [
      "domestic violence",
      "abuse",
      "partner",
      "threatened",
      "hotline",
      "safety",
    ],
    looksLike: [
      "Someone hits, pushes, chokes, or physically hurts you.",
      "Someone threatens you, your baby, or your other children.",
      "Someone controls your money, medicine, phone, or ability to leave.",
      "You change what you do to avoid making someone angry.",
    ],
    whyItMatters:
      "Violence often begins or intensifies during pregnancy and after birth. None of it is your fault, and there are confidential people whose whole job is to help you plan for safety.",
    whatToDo: [
      "Call 911 if you are in immediate danger.",
      "Call the National Domestic Violence Hotline at 1-800-799-7233, or text START to 88788.",
      "Tell a clinician privately — you can ask for a moment alone during any visit.",
      "If you share a device, use a browser private window and clear your history afterward.",
    ],
    call911When: [
      "You are being hurt or threatened right now.",
      "You have been choked or hit in the belly, head, or chest.",
      "You are afraid to stay where you are tonight.",
    ],
    contactCareTeamWhen: [
      "You are not in immediate danger but want help making a safety plan.",
      "You need documentation of injuries or a referral to an advocate.",
    ],
    symptomId: "feeling-unsafe",
    provenance: p,
  },
  {
    slug: "trouble-urinating",
    title: "Trouble urinating or burning when you urinate",
    standfirst:
      "Not being able to pass urine, burning, or needing to go constantly.",
    category: "infection",
    urgencyHint: "same-day",
    searchTerms: ["uti", "bladder", "pee", "urine", "catheter"],
    looksLike: [
      "Being unable to urinate, or passing only small amounts.",
      "Burning or stinging when you urinate.",
      "Needing to urinate urgently and often.",
      "Cloudy or foul-smelling urine, back pain, or fever.",
    ],
    whyItMatters:
      "Bladder infections are common after birth and treated easily. Being unable to empty your bladder can damage it, and a kidney infection can make you seriously unwell.",
    whatToDo: [
      "Seek care now if you cannot urinate at all or your bladder feels painfully full.",
      "Contact your care team today for burning, urgency, or fever.",
      "Keep drinking fluids while you wait to be seen.",
    ],
    call911When: [
      "You have a fever with shaking chills and feel confused or very weak.",
    ],
    contactCareTeamWhen: [
      "Mild stinging as a tear heals, with no fever.",
      "Leaking urine when you cough or laugh — common, and treatable with pelvic-floor therapy.",
    ],
    symptomId: "trouble-urinating",
    provenance: p,
  },
];

export const WARNING_SIGN_SLUGS = WARNING_SIGNS.map((sign) => sign.slug);

export function getWarningSign(slug: string): WarningSign | undefined {
  return WARNING_SIGNS.find((sign) => sign.slug === slug);
}

export function getWarningSignBySymptomId(
  symptomId: string,
): WarningSign | undefined {
  return WARNING_SIGNS.find((sign) => sign.symptomId === symptomId);
}
