import type { Question, Rule, SymptomDefinition } from "./types";

/**
 * Version this file on every change to rules or copy. The version is recorded
 * with each guidance result so that a reviewer can reproduce what the app said
 * (spec §4.4, §10). Bump the date and the counter together.
 */
export const SAFETY_RULES_VERSION = "2026.09.21-draft.1";

export const RULES_REVIEW = {
  version: SAFETY_RULES_VERSION,
  status: "draft" as const,
  reviewedBy: null as string | null,
  reviewedOn: null as string | null,
  changeLog: [
    {
      version: "2026.09.21-draft.1",
      date: "2026-09-21",
      summary:
        "Initial draft rule set for pilot build. Not clinician reviewed. Covers postpartum red flags, blood-pressure symptoms, infection, clots, wounds, feeding, and mental-health and personal-safety escalation.",
    },
  ],
};

/** Question ids shared by every symptom path. */
export const RED_FLAGS_QUESTION_ID = "red-flags";
export const ONSET_QUESTION_ID = "onset";
export const TREND_QUESTION_ID = "trend";

export const NO_RED_FLAGS = "none-right-now";

/**
 * Asked before anything else. Any selection other than "none" escalates
 * immediately, regardless of the symptom chosen.
 */
export const RED_FLAG_QUESTION: Question = {
  id: RED_FLAGS_QUESTION_ID,
  prompt: "Is any of this happening right now?",
  help: "Select everything that applies. If you are not sure, select it.",
  kind: "multi",
  exclusiveValue: NO_RED_FLAGS,
  options: [
    {
      value: "soaking-pad",
      label:
        "Soaking through a pad in an hour or less, or passing clots bigger than a golf ball",
    },
    { value: "chest-pain", label: "Chest pain, pressure, or tightness" },
    {
      value: "trouble-breathing",
      label: "Trouble breathing, or breathless while sitting still",
    },
    { value: "seizure", label: "A seizure, or shaking you could not control" },
    {
      value: "fainting",
      label: "Fainting, or feeling like you are about to pass out",
    },
    {
      value: "confusion",
      label: "Confusion, slurred speech, or weakness on one side of your body",
    },
    {
      value: "self-harm",
      label: "Thoughts of harming yourself or your baby that you might act on",
    },
    {
      value: "unsafe",
      label: "Someone is hurting or threatening you right now",
    },
    { value: NO_RED_FLAGS, label: "None of these are happening right now" },
  ],
};

export const RED_FLAG_RULES: Rule[] = [
  {
    id: "red-flag.soaking-pad",
    when: [{ questionId: RED_FLAGS_QUESTION_ID, anyOf: ["soaking-pad"] }],
    level: "call-911",
    because:
      "You told us you are bleeding heavily. Blood loss at that rate can become dangerous quickly and needs to be treated right away.",
  },
  {
    id: "red-flag.chest-pain",
    when: [{ questionId: RED_FLAGS_QUESTION_ID, anyOf: ["chest-pain"] }],
    level: "call-911",
    because:
      "Chest pain or pressure after birth is treated as an emergency because of the higher risk of blood clots and heart problems in the weeks after delivery.",
  },
  {
    id: "red-flag.trouble-breathing",
    when: [{ questionId: RED_FLAGS_QUESTION_ID, anyOf: ["trouble-breathing"] }],
    level: "call-911",
    because:
      "Trouble breathing needs emergency assessment now. Responders can give you oxygen and begin care on the way to the hospital.",
  },
  {
    id: "red-flag.seizure",
    when: [{ questionId: RED_FLAGS_QUESTION_ID, anyOf: ["seizure"] }],
    level: "call-911",
    because:
      "A seizure after birth is always an emergency and needs treatment immediately.",
  },
  {
    id: "red-flag.fainting",
    when: [{ questionId: RED_FLAGS_QUESTION_ID, anyOf: ["fainting"] }],
    level: "call-911",
    because:
      "Fainting or nearly fainting can be a sign of blood loss, a clot, or infection. It also puts you at risk of a fall while holding your baby.",
  },
  {
    id: "red-flag.confusion",
    when: [{ questionId: RED_FLAGS_QUESTION_ID, anyOf: ["confusion"] }],
    level: "call-911",
    because:
      "Confusion, slurred speech, or one-sided weakness are stroke warning signs and need emergency care within minutes.",
  },
  {
    id: "red-flag.self-harm",
    when: [{ questionId: RED_FLAGS_QUESTION_ID, anyOf: ["self-harm"] }],
    level: "call-911",
    because:
      "You told us you have thoughts of harming yourself or your baby that you might act on. That deserves immediate help, and it does not mean you have done anything wrong.",
  },
  {
    id: "red-flag.unsafe",
    when: [{ questionId: RED_FLAGS_QUESTION_ID, anyOf: ["unsafe"] }],
    level: "call-911",
    because:
      "You told us someone is hurting or threatening you right now. Your safety comes first.",
  },
];

export const ONSET_QUESTION: Question = {
  id: ONSET_QUESTION_ID,
  prompt: "When did it start?",
  kind: "single",
  options: [
    { value: "minutes", label: "In the last hour" },
    { value: "today", label: "Earlier today" },
    { value: "days", label: "One to seven days ago" },
    { value: "weeks", label: "More than a week ago" },
  ],
};

export const TREND_QUESTION: Question = {
  id: TREND_QUESTION_ID,
  prompt: "Is it getting worse?",
  kind: "single",
  options: [
    { value: "worse", label: "Yes, it is getting worse" },
    { value: "same", label: "It is staying about the same" },
    { value: "comes-and-goes", label: "It comes and goes" },
    { value: "better", label: "It is slowly getting better" },
  ],
};

const yesNoUnsure = (
  yesLabel: string,
  noLabel = "No",
): { value: string; label: string }[] => [
  { value: "yes", label: yesLabel },
  { value: "no", label: noLabel },
  { value: "unsure", label: "I am not sure" },
];

export const SYMPTOMS: SymptomDefinition[] = [
  {
    id: "heavy-bleeding",
    label: "Bleeding that worries me",
    detail: "Heavier bleeding, clots, or bleeding that changed",
    searchTerms: ["blood", "bleeding", "clots", "pads", "hemorrhage", "lochia"],
    warningSignSlug: "heavy-bleeding",
    baselineLevel: "contact-team-promptly",
    baselineReason:
      "Bleeding changes after birth always deserve a conversation with your care team, even when they turn out to be expected.",
    followUps: [
      {
        id: "pad-rate",
        prompt: "How fast are you soaking pads?",
        kind: "single",
        options: [
          { value: "hour-or-less", label: "A pad in an hour or less" },
          { value: "two-hours", label: "A pad every one to two hours" },
          { value: "few-hours", label: "A pad every few hours" },
          { value: "light", label: "Lighter than that" },
        ],
      },
      {
        id: "clots",
        prompt: "Are you passing clots?",
        kind: "single",
        options: [
          { value: "large", label: "Yes, larger than a golf ball" },
          { value: "small", label: "Yes, smaller than a golf ball" },
          { value: "no", label: "No clots" },
        ],
      },
      {
        id: "bleeding-symptoms",
        prompt: "Do you have any of these along with the bleeding?",
        kind: "multi",
        exclusiveValue: "none",
        options: [
          {
            value: "dizzy",
            label: "Dizziness, or feeling faint when you stand",
          },
          { value: "racing-heart", label: "A racing or pounding heart" },
          { value: "cold-clammy", label: "Feeling cold, clammy, or shaky" },
          { value: "smell", label: "Bad-smelling discharge" },
          {
            value: "fever",
            label: "A temperature of 100.4°F (38°C) or higher",
          },
          { value: "none", label: "None of these" },
        ],
      },
    ],
    rules: [
      {
        id: "bleeding.pad-hour",
        when: [{ questionId: "pad-rate", anyOf: ["hour-or-less"] }],
        level: "call-911",
        because:
          "Soaking a pad in an hour or less is the threshold maternity teams use for emergency bleeding.",
      },
      {
        id: "bleeding.large-clots",
        when: [{ questionId: "clots", anyOf: ["large"] }],
        level: "call-911",
        because:
          "Clots larger than a golf ball can mean your uterus is not contracting down the way it needs to.",
      },
      {
        id: "bleeding.blood-loss-symptoms",
        when: [
          {
            questionId: "bleeding-symptoms",
            anyOf: ["dizzy", "racing-heart", "cold-clammy"],
          },
        ],
        level: "call-911",
        because:
          "Dizziness, a racing heart, or feeling cold and clammy with bleeding can be signs your body is struggling to keep up with blood loss.",
      },
      {
        id: "bleeding.two-hour-rate",
        when: [{ questionId: "pad-rate", anyOf: ["two-hours"] }],
        level: "emergency-now",
        because:
          "Soaking a pad every one to two hours is more bleeding than expected at any point after birth and should be assessed now.",
      },
      {
        id: "bleeding.infection-signs",
        when: [{ questionId: "bleeding-symptoms", anyOf: ["smell", "fever"] }],
        level: "emergency-now",
        because:
          "A fever or bad-smelling discharge with bleeding can point to an infection in the uterus, which needs prompt treatment.",
      },
      {
        id: "bleeding.worsening",
        when: [{ questionId: TREND_QUESTION_ID, anyOf: ["worse"] }],
        level: "emergency-now",
        because:
          "Bleeding should gradually lessen after birth. Bleeding that is increasing is a change that needs to be checked now.",
      },
    ],
  },
  {
    id: "severe-headache",
    label: "A bad headache",
    detail: "A headache that will not go away or is unusually severe",
    searchTerms: ["headache", "migraine", "head", "pressure", "preeclampsia"],
    warningSignSlug: "severe-headache",
    baselineLevel: "contact-team-promptly",
    baselineReason:
      "Headaches after birth are checked carefully because they can be the first sign of a blood-pressure problem.",
    followUps: [
      {
        id: "headache-severity",
        prompt: "How bad is the headache?",
        kind: "single",
        options: [
          {
            value: "worst-ever",
            label:
              "The worst headache of my life, or it started suddenly and severely",
          },
          {
            value: "not-relieved",
            label: "Severe, and not helped by rest, water, or my usual medicine",
          },
          { value: "moderate", label: "Uncomfortable but it eases with rest" },
        ],
      },
      {
        id: "headache-companions",
        prompt: "Is anything else happening with it?",
        kind: "multi",
        exclusiveValue: "none",
        options: [
          {
            value: "vision",
            label: "Blurry vision, spots, or flashing lights",
          },
          {
            value: "rib-pain",
            label: "Pain in my upper belly or under my right ribs",
          },
          { value: "swelling", label: "New swelling in my face or hands" },
          { value: "neuro", label: "Weakness, numbness, or trouble speaking" },
          {
            value: "bp-high",
            label: "A blood-pressure reading of 140/90 or higher",
          },
          { value: "none", label: "None of these" },
        ],
      },
    ],
    rules: [
      {
        id: "headache.thunderclap",
        when: [{ questionId: "headache-severity", anyOf: ["worst-ever"] }],
        level: "call-911",
        because:
          "A sudden, extremely severe headache needs emergency assessment to rule out bleeding or a clot in the brain.",
      },
      {
        id: "headache.neuro",
        when: [{ questionId: "headache-companions", anyOf: ["neuro"] }],
        level: "call-911",
        because:
          "Weakness, numbness, or trouble speaking with a headache are stroke warning signs.",
      },
      {
        id: "headache.preeclampsia-cluster",
        when: [
          {
            questionId: "headache-companions",
            anyOf: ["vision", "rib-pain", "swelling", "bp-high"],
          },
        ],
        level: "emergency-now",
        because:
          "A headache together with vision changes, upper-belly pain, new swelling, or a high reading is the pattern care teams watch for in postpartum preeclampsia.",
      },
      {
        id: "headache.unrelieved",
        when: [{ questionId: "headache-severity", anyOf: ["not-relieved"] }],
        level: "emergency-now",
        because:
          "A severe headache that does not respond to rest and usual medicine should be evaluated now, including a blood-pressure check.",
      },
    ],
  },
  {
    id: "vision-changes",
    label: "Vision changes",
    detail:
      "Blurry vision, spots, flashing lights, or losing part of your sight",
    searchTerms: ["vision", "eyes", "blurry", "spots", "seeing", "light"],
    warningSignSlug: "vision-changes",
    baselineLevel: "emergency-now",
    baselineReason:
      "New vision changes after birth are treated as a possible blood-pressure emergency until they are checked.",
    followUps: [
      {
        id: "vision-type",
        prompt: "What are you noticing?",
        kind: "multi",
        exclusiveValue: "none",
        options: [
          { value: "loss", label: "Losing vision, or a shadow across my sight" },
          { value: "double", label: "Double vision" },
          { value: "spots", label: "Spots, sparkles, or flashing lights" },
          { value: "blurry", label: "Blurry vision" },
          { value: "none", label: "None of these exactly" },
        ],
      },
      {
        id: "vision-companions",
        prompt: "Anything else with it?",
        kind: "multi",
        exclusiveValue: "none",
        options: [
          { value: "headache", label: "A bad headache" },
          { value: "neuro", label: "Weakness, numbness, or trouble speaking" },
          {
            value: "bp-high",
            label: "A blood-pressure reading of 140/90 or higher",
          },
          { value: "none", label: "None of these" },
        ],
      },
    ],
    rules: [
      {
        id: "vision.loss",
        when: [{ questionId: "vision-type", anyOf: ["loss"] }],
        level: "call-911",
        because:
          "Losing part of your vision can be a sign of a stroke or severe high blood pressure and needs emergency responders now.",
      },
      {
        id: "vision.neuro",
        when: [{ questionId: "vision-companions", anyOf: ["neuro"] }],
        level: "call-911",
        because:
          "Vision changes with weakness, numbness, or trouble speaking are stroke warning signs.",
      },
    ],
  },
  {
    id: "high-blood-pressure",
    label: "A high blood-pressure reading",
    detail: "A reading of 140/90 or higher, or symptoms you associate with it",
    searchTerms: [
      "blood pressure",
      "bp",
      "preeclampsia",
      "cuff",
      "hypertension",
    ],
    warningSignSlug: "high-blood-pressure",
    baselineLevel: "contact-team-promptly",
    baselineReason:
      "Blood pressure can rise for the first time after birth, so any elevated reading needs to be reviewed by your care team.",
    followUps: [
      {
        id: "bp-reading",
        prompt: "What is the highest reading you have taken?",
        help: "Rest five minutes first, feet flat, arm supported at heart level.",
        kind: "single",
        options: [
          { value: "160-110", label: "160/110 or higher" },
          { value: "140-90", label: "140/90 up to 159/109" },
          { value: "below-140", label: "Below 140/90" },
          { value: "unknown", label: "I do not have a reading" },
        ],
      },
      {
        id: "bp-symptoms",
        prompt: "Do you have any of these symptoms?",
        kind: "multi",
        exclusiveValue: "none",
        options: [
          { value: "headache", label: "Headache that will not go away" },
          { value: "vision", label: "Vision changes" },
          {
            value: "rib-pain",
            label: "Pain in my upper belly or under my right ribs",
          },
          { value: "breathless", label: "Shortness of breath" },
          { value: "swelling", label: "New swelling in my face or hands" },
          { value: "none", label: "None of these" },
        ],
      },
    ],
    rules: [
      {
        id: "bp.severe-range",
        when: [{ questionId: "bp-reading", anyOf: ["160-110"] }],
        level: "emergency-now",
        because:
          "A reading of 160/110 or higher is in the severe range and is treated urgently to prevent seizures and stroke.",
      },
      {
        id: "bp.breathless",
        when: [{ questionId: "bp-symptoms", anyOf: ["breathless"] }],
        level: "call-911",
        because:
          "Shortness of breath with high blood pressure can mean fluid is building up in your lungs.",
      },
      {
        id: "bp.symptomatic",
        when: [
          { questionId: "bp-reading", anyOf: ["160-110", "140-90", "unknown"] },
          {
            questionId: "bp-symptoms",
            anyOf: ["headache", "vision", "rib-pain", "swelling"],
          },
        ],
        level: "emergency-now",
        because:
          "High blood pressure together with symptoms is the combination care teams treat as preeclampsia until proven otherwise.",
      },
    ],
  },
  {
    id: "chest-pain",
    label: "Chest pain or pressure",
    detail: "Pain, tightness, or heaviness in your chest",
    searchTerms: ["chest", "heart", "pressure", "tight", "palpitations"],
    warningSignSlug: "chest-pain",
    baselineLevel: "call-911",
    baselineReason:
      "Chest pain in the weeks after birth is always treated as an emergency.",
    followUps: [
      {
        id: "chest-companions",
        prompt: "Is any of this happening too?",
        kind: "multi",
        exclusiveValue: "none",
        options: [
          { value: "breathless", label: "Shortness of breath" },
          { value: "sweaty", label: "Sweating, nausea, or feeling faint" },
          {
            value: "spreading",
            label: "Pain spreading to my arm, jaw, neck, or back",
          },
          { value: "cough-blood", label: "Coughing up blood" },
          { value: "none", label: "None of these" },
        ],
      },
    ],
    rules: [],
  },
  {
    id: "trouble-breathing",
    label: "Trouble breathing",
    detail: "Breathlessness at rest, gasping, or needing to sit up to breathe",
    searchTerms: ["breathing", "breath", "breathless", "clot", "lungs"],
    warningSignSlug: "trouble-breathing",
    baselineLevel: "call-911",
    baselineReason:
      "New trouble breathing after birth is always treated as an emergency.",
    followUps: [
      {
        id: "breathing-companions",
        prompt: "Is any of this happening too?",
        kind: "multi",
        exclusiveValue: "none",
        options: [
          { value: "chest-pain", label: "Chest pain" },
          { value: "leg", label: "Pain or swelling in one leg" },
          { value: "cough-blood", label: "Coughing up blood" },
          { value: "blue", label: "Lips or fingertips looking blue or gray" },
          { value: "none", label: "None of these" },
        ],
      },
    ],
    rules: [],
  },
  {
    id: "seizure",
    label: "A seizure",
    detail:
      "Shaking you could not control, stiffening, or an unresponsive episode",
    searchTerms: ["seizure", "convulsion", "eclampsia", "shaking", "fit"],
    warningSignSlug: "seizure",
    baselineLevel: "call-911",
    baselineReason: "Any seizure after birth is a medical emergency.",
    followUps: [],
    rules: [],
  },
  {
    id: "fainting",
    label: "Fainting or feeling like I might pass out",
    detail: "Passing out, near-fainting, or repeated dizziness",
    searchTerms: ["faint", "dizzy", "passed out", "lightheaded", "collapse"],
    warningSignSlug: "fainting",
    baselineLevel: "emergency-now",
    baselineReason:
      "Fainting or near-fainting after birth needs to be evaluated for blood loss, clots, infection, and heart rhythm problems.",
    followUps: [
      {
        id: "faint-happened",
        prompt: "Did you actually lose consciousness?",
        kind: "single",
        options: [
          { value: "yes", label: "Yes, I passed out" },
          { value: "almost", label: "No, but I felt like I would" },
          { value: "unsure", label: "I am not sure" },
        ],
      },
      {
        id: "faint-companions",
        prompt: "Is any of this happening too?",
        kind: "multi",
        exclusiveValue: "none",
        options: [
          { value: "bleeding", label: "Heavy bleeding" },
          { value: "chest-pain", label: "Chest pain or trouble breathing" },
          { value: "head-injury", label: "I fell and hit my head" },
          {
            value: "holding-baby",
            label: "It happened while I was holding my baby",
          },
          { value: "none", label: "None of these" },
        ],
      },
    ],
    rules: [
      {
        id: "faint.lost-consciousness",
        when: [{ questionId: "faint-happened", anyOf: ["yes", "unsure"] }],
        level: "call-911",
        because:
          "Losing consciousness after birth needs emergency assessment, and responders can monitor you on the way.",
      },
      {
        id: "faint.with-red-flags",
        when: [
          {
            questionId: "faint-companions",
            anyOf: ["bleeding", "chest-pain", "head-injury"],
          },
        ],
        level: "call-911",
        because:
          "Feeling faint along with bleeding, chest symptoms, or a head injury needs emergency care now.",
      },
    ],
  },
  {
    id: "severe-abdominal-pain",
    label: "Belly pain",
    detail: "Pain in your belly that is severe, new, or getting worse",
    searchTerms: ["belly", "abdomen", "stomach", "cramps", "ribs", "liver"],
    warningSignSlug: "severe-abdominal-pain",
    baselineLevel: "contact-team-promptly",
    baselineReason:
      "Cramping is expected after birth, but pain that stands out from it should be described to your care team.",
    followUps: [
      {
        id: "belly-severity",
        prompt: "How severe is the pain?",
        kind: "single",
        options: [
          {
            value: "severe",
            label: "Severe — I cannot stand straight, sleep, or care for my baby",
          },
          { value: "moderate", label: "Moderate — noticeable but I can manage" },
          { value: "mild", label: "Mild, like period cramps" },
        ],
      },
      {
        id: "belly-location",
        prompt: "Where is it?",
        kind: "multi",
        exclusiveValue: "none",
        options: [
          { value: "upper-right", label: "Upper belly or under my right ribs" },
          { value: "lower", label: "Lower belly" },
          { value: "all-over", label: "All over" },
          { value: "none", label: "Hard to say" },
        ],
      },
      {
        id: "belly-companions",
        prompt: "Is any of this happening too?",
        kind: "multi",
        exclusiveValue: "none",
        options: [
          {
            value: "fever",
            label: "A temperature of 100.4°F (38°C) or higher",
          },
          { value: "vomiting", label: "Vomiting, or unable to keep fluids down" },
          { value: "rigid", label: "A hard, very tender belly" },
          { value: "bleeding", label: "Heavy bleeding" },
          { value: "none", label: "None of these" },
        ],
      },
    ],
    rules: [
      {
        id: "belly.severe-with-bleeding",
        when: [
          { questionId: "belly-severity", anyOf: ["severe"] },
          { questionId: "belly-companions", anyOf: ["bleeding"] },
        ],
        level: "call-911",
        because:
          "Severe belly pain with heavy bleeding can mean bleeding inside the belly and needs emergency responders.",
      },
      {
        id: "belly.upper-right",
        when: [{ questionId: "belly-location", anyOf: ["upper-right"] }],
        level: "emergency-now",
        because:
          "Pain in the upper belly or under the right ribs can be a sign of a blood-pressure complication affecting the liver.",
      },
      {
        id: "belly.severe",
        when: [{ questionId: "belly-severity", anyOf: ["severe"] }],
        level: "emergency-now",
        because:
          "Pain severe enough to stop you functioning needs to be examined now rather than at a routine visit.",
      },
      {
        id: "belly.infection-or-obstruction",
        when: [
          {
            questionId: "belly-companions",
            anyOf: ["fever", "vomiting", "rigid"],
          },
        ],
        level: "emergency-now",
        because:
          "Belly pain with fever, vomiting, or a rigid belly can mean an infection or a bowel problem that needs urgent assessment.",
      },
    ],
  },
  {
    id: "severe-pelvic-pain",
    label: "Pelvic, vaginal, or stitches pain",
    detail: "Pain, pressure, or swelling near a tear, stitches, or your pelvis",
    searchTerms: ["pelvic", "perineum", "stitches", "tear", "vagina", "sitting"],
    warningSignSlug: "severe-pelvic-pain",
    baselineLevel: "contact-team-promptly",
    baselineReason:
      "Healing pain should ease day by day. Pain that does not follow that pattern should be looked at.",
    followUps: [
      {
        id: "pelvic-companions",
        prompt: "Is any of this happening too?",
        kind: "multi",
        exclusiveValue: "none",
        options: [
          {
            value: "cannot-urinate",
            label: "I cannot urinate, or my bladder feels painfully full",
          },
          {
            value: "swelling",
            label: "Swelling or a bulge that is getting bigger",
          },
          {
            value: "fever",
            label: "A temperature of 100.4°F (38°C) or higher",
          },
          { value: "smell", label: "Bad-smelling discharge" },
          { value: "none", label: "None of these" },
        ],
      },
    ],
    rules: [
      {
        id: "pelvic.retention",
        when: [{ questionId: "pelvic-companions", anyOf: ["cannot-urinate"] }],
        level: "emergency-now",
        because:
          "Not being able to empty your bladder needs care now to protect the bladder and relieve the pressure.",
      },
      {
        id: "pelvic.growing-swelling",
        when: [{ questionId: "pelvic-companions", anyOf: ["swelling"] }],
        level: "emergency-now",
        because:
          "Swelling that is growing near a repair can be a collection of blood that needs to be assessed now.",
      },
      {
        id: "pelvic.infection",
        when: [{ questionId: "pelvic-companions", anyOf: ["fever", "smell"] }],
        level: "emergency-now",
        because:
          "Fever or bad-smelling discharge with pelvic pain suggests infection, which is treated more easily the earlier it is found.",
      },
    ],
  },
  {
    id: "fever-or-infection",
    label: "Fever, chills, or signs of infection",
    detail: "A temperature of 100.4°F (38°C) or higher, chills, or bad smell",
    searchTerms: [
      "fever",
      "temperature",
      "chills",
      "infection",
      "sepsis",
      "smell",
    ],
    warningSignSlug: "fever-or-infection",
    baselineLevel: "contact-team-promptly",
    baselineReason:
      "Infection after birth is common and very treatable, and it moves faster than most people expect.",
    followUps: [
      {
        id: "temp-reading",
        prompt: "What is your temperature?",
        kind: "single",
        options: [
          { value: "103", label: "103°F (39.4°C) or higher" },
          { value: "1004", label: "100.4°F (38°C) up to 102.9°F" },
          { value: "below", label: "Below 100.4°F (38°C)" },
          { value: "unknown", label: "I have not measured it" },
        ],
      },
      {
        id: "infection-companions",
        prompt: "Is any of this happening too?",
        kind: "multi",
        exclusiveValue: "none",
        options: [
          {
            value: "very-unwell",
            label: "Feeling confused, very weak, or hard to wake",
          },
          { value: "fast-breathing", label: "Breathing fast, or a racing heart" },
          { value: "chills", label: "Shaking chills" },
          { value: "smell", label: "Bad-smelling discharge" },
          {
            value: "wound",
            label: "Redness or drainage from an incision or tear",
          },
          { value: "urine", label: "Burning when I urinate, or back pain" },
          { value: "none", label: "None of these" },
        ],
      },
    ],
    rules: [
      {
        id: "infection.sepsis-signs",
        when: [
          {
            questionId: "infection-companions",
            anyOf: ["very-unwell", "fast-breathing"],
          },
        ],
        level: "call-911",
        because:
          "Feeling confused or very weak, or breathing fast, with a possible infection can be early sepsis. That needs emergency care immediately.",
      },
      {
        id: "infection.high-fever",
        when: [{ questionId: "temp-reading", anyOf: ["103"] }],
        level: "emergency-now",
        because:
          "A temperature of 103°F or higher after birth should be assessed in person now.",
      },
      {
        id: "infection.fever-threshold",
        when: [{ questionId: "temp-reading", anyOf: ["1004"] }],
        level: "contact-team-promptly",
        because:
          "100.4°F is the threshold maternity teams use for postpartum fever. They will want to hear from you today.",
      },
      {
        id: "infection.source-signs",
        when: [
          {
            questionId: "infection-companions",
            anyOf: ["smell", "wound", "urine", "chills"],
          },
        ],
        level: "contact-team-promptly",
        because:
          "You described a possible source of infection. Care teams can usually treat this quickly with the right antibiotic.",
      },
    ],
  },
  {
    id: "leg-pain-or-swelling",
    label: "Leg pain, swelling, or redness",
    detail: "One leg that hurts, is swollen, warm, or discolored",
    searchTerms: ["leg", "calf", "clot", "dvt", "swollen", "red"],
    warningSignSlug: "leg-pain-or-swelling",
    baselineLevel: "contact-team-promptly",
    baselineReason:
      "Clot risk stays higher for several weeks after birth, so leg symptoms are always worth reporting.",
    followUps: [
      {
        id: "leg-sides",
        prompt: "Is it one leg or both?",
        kind: "single",
        options: [
          { value: "one", label: "One leg" },
          { value: "both", label: "Both legs" },
        ],
      },
      {
        id: "leg-features",
        prompt: "What do you notice in the leg?",
        kind: "multi",
        exclusiveValue: "none",
        options: [
          { value: "pain", label: "Pain, tenderness, or a cramping ache" },
          { value: "swelling", label: "Swelling" },
          { value: "warm-red", label: "Skin that is warm, red, or discolored" },
          { value: "none", label: "None of these exactly" },
        ],
      },
      {
        id: "leg-companions",
        prompt: "Is any of this happening too?",
        kind: "multi",
        exclusiveValue: "none",
        options: [
          { value: "chest", label: "Chest pain or trouble breathing" },
          { value: "cough-blood", label: "Coughing up blood" },
          {
            value: "fever",
            label: "A temperature of 100.4°F (38°C) or higher",
          },
          { value: "none", label: "None of these" },
        ],
      },
    ],
    rules: [
      {
        id: "leg.pe-signs",
        when: [{ questionId: "leg-companions", anyOf: ["chest", "cough-blood"] }],
        level: "call-911",
        because:
          "Leg symptoms with chest pain, breathlessness, or coughing blood can mean a clot has travelled to your lungs.",
      },
      {
        id: "leg.unilateral",
        when: [
          { questionId: "leg-sides", anyOf: ["one"] },
          { questionId: "leg-features", anyOf: ["pain", "swelling", "warm-red"] },
        ],
        level: "emergency-now",
        because:
          "Pain, swelling, or redness in one leg is how a blood clot usually presents, and it is checked with a scan the same day.",
      },
      {
        id: "leg.infection",
        when: [{ questionId: "leg-companions", anyOf: ["fever"] }],
        level: "emergency-now",
        because:
          "A fever with a red, painful leg can mean either a clot or a skin infection. Both need same-day assessment.",
      },
    ],
  },
  {
    id: "sudden-swelling",
    label: "Sudden swelling",
    detail: "New puffiness in your face or hands, or swelling appearing quickly",
    searchTerms: ["swelling", "puffy", "face", "hands", "edema", "rings"],
    warningSignSlug: "sudden-swelling",
    baselineLevel: "contact-team-promptly",
    baselineReason:
      "Swelling after birth is common, and new swelling in the face and hands is the pattern that needs a blood-pressure check.",
    followUps: [
      {
        id: "swelling-where",
        prompt: "Where is the swelling?",
        kind: "multi",
        exclusiveValue: "none",
        options: [
          { value: "face-hands", label: "Face, eyelids, or hands" },
          { value: "one-leg", label: "One leg only" },
          { value: "both-legs", label: "Both legs or feet" },
          { value: "none", label: "Somewhere else" },
        ],
      },
      {
        id: "swelling-companions",
        prompt: "Is any of this happening too?",
        kind: "multi",
        exclusiveValue: "none",
        options: [
          { value: "headache", label: "Headache that will not go away" },
          { value: "vision", label: "Vision changes" },
          { value: "breathless", label: "Shortness of breath" },
          { value: "bp-high", label: "A reading of 140/90 or higher" },
          { value: "none", label: "None of these" },
        ],
      },
    ],
    rules: [
      {
        id: "swelling.breathless",
        when: [{ questionId: "swelling-companions", anyOf: ["breathless"] }],
        level: "call-911",
        because:
          "Swelling with shortness of breath can mean fluid in your lungs and needs emergency care.",
      },
      {
        id: "swelling.preeclampsia-cluster",
        when: [
          {
            questionId: "swelling-companions",
            anyOf: ["headache", "vision", "bp-high"],
          },
        ],
        level: "emergency-now",
        because:
          "Swelling together with a headache, vision changes, or a high reading is the pattern watched for in postpartum preeclampsia.",
      },
      {
        id: "swelling.one-leg",
        when: [{ questionId: "swelling-where", anyOf: ["one-leg"] }],
        level: "emergency-now",
        because:
          "Swelling in one leg only is assessed for a blood clot, usually with a same-day ultrasound.",
      },
    ],
  },
  {
    id: "incision-or-wound-concerns",
    label: "Incision or wound concern",
    detail:
      "A cesarean incision or repair that is draining, opening, or worsening",
    searchTerms: [
      "incision",
      "c-section",
      "cesarean",
      "wound",
      "stitches",
      "pus",
    ],
    warningSignSlug: "incision-or-wound-concerns",
    baselineLevel: "contact-team-promptly",
    baselineReason:
      "Wound problems are easier to treat early, so care teams would rather hear about them sooner.",
    followUps: [
      {
        id: "wound-features",
        prompt: "What do you see?",
        kind: "multi",
        exclusiveValue: "none",
        options: [
          { value: "opening", label: "The wound is opening or pulling apart" },
          { value: "bleeding", label: "It is bleeding" },
          { value: "pus", label: "Pus, cloudy fluid, or a bad smell" },
          { value: "spreading-red", label: "Redness spreading outward" },
          { value: "more-pain", label: "Pain that is increasing" },
          { value: "none", label: "None of these exactly" },
        ],
      },
      {
        id: "wound-fever",
        prompt: "Do you have a temperature of 100.4°F (38°C) or higher?",
        kind: "single",
        options: yesNoUnsure("Yes"),
      },
    ],
    rules: [
      {
        id: "wound.heavy-bleeding",
        when: [{ questionId: "wound-features", anyOf: ["bleeding"] }],
        level: "emergency-now",
        because:
          "A bleeding incision needs to be examined now, and pressure alone may not be enough to close it.",
      },
      {
        id: "wound.open",
        when: [{ questionId: "wound-features", anyOf: ["opening"] }],
        level: "emergency-now",
        because:
          "A wound that is opening needs in-person assessment so it can be cleaned, packed, or repaired.",
      },
      {
        id: "wound.infection-with-fever",
        when: [
          { questionId: "wound-features", anyOf: ["pus", "spreading-red"] },
          { questionId: "wound-fever", anyOf: ["yes", "unsure"] },
        ],
        level: "emergency-now",
        because:
          "Spreading redness or drainage with a fever suggests the infection is moving beyond the wound edge.",
      },
    ],
  },
  {
    id: "breast-infection",
    label: "Breast pain, redness, or a lump",
    detail: "A hard or red area, cracked nipples, or pain with feeding",
    searchTerms: ["breast", "mastitis", "nipple", "lump", "engorged", "feeding"],
    warningSignSlug: "breast-infection",
    baselineLevel: "monitor-and-contact",
    baselineReason:
      "Breast pain has many causes, and most improve with feeding support. It still deserves attention if it does not settle.",
    followUps: [
      {
        id: "breast-features",
        prompt: "What are you noticing?",
        kind: "multi",
        exclusiveValue: "none",
        options: [
          { value: "red-hot", label: "A red, hot, or hard area on one breast" },
          { value: "lump", label: "A lump that does not soften after feeding" },
          { value: "cracked", label: "Cracked or bleeding nipples" },
          { value: "full", label: "Both breasts feel overly full" },
          { value: "none", label: "None of these exactly" },
        ],
      },
      {
        id: "breast-systemic",
        prompt: "Do you feel unwell with it?",
        kind: "multi",
        exclusiveValue: "none",
        options: [
          {
            value: "fever",
            label: "A temperature of 100.4°F (38°C) or higher",
          },
          {
            value: "flu",
            label: "Chills, body aches, or feeling like I have the flu",
          },
          {
            value: "very-unwell",
            label: "Feeling confused, very weak, or breathing fast",
          },
          { value: "none", label: "No, I feel otherwise well" },
        ],
      },
    ],
    rules: [
      {
        id: "breast.sepsis-signs",
        when: [{ questionId: "breast-systemic", anyOf: ["very-unwell"] }],
        level: "call-911",
        because:
          "Feeling confused, very weak, or breathing fast with a breast infection can be a sign the infection is spreading.",
      },
      {
        id: "breast.mastitis",
        when: [
          { questionId: "breast-features", anyOf: ["red-hot", "lump"] },
          { questionId: "breast-systemic", anyOf: ["fever", "flu"] },
        ],
        level: "contact-team-promptly",
        because:
          "A red or hard area with a fever or flu-like feeling is the usual picture of mastitis, which often needs antibiotics.",
      },
      {
        id: "breast.local-signs",
        when: [
          {
            questionId: "breast-features",
            anyOf: ["red-hot", "lump", "cracked"],
          },
        ],
        level: "contact-team-promptly",
        because:
          "Your care team or a lactation consultant can usually resolve this quickly, and untreated pain tends to get worse.",
      },
    ],
  },
  {
    id: "mental-health-crisis",
    label: "I am struggling to cope",
    detail: "Overwhelmed, panicked, not sleeping, or not feeling like myself",
    searchTerms: [
      "mental health",
      "depression",
      "anxiety",
      "panic",
      "sleep",
      "psychosis",
      "coping",
    ],
    warningSignSlug: "mental-health-emergency",
    baselineLevel: "contact-team-promptly",
    baselineReason:
      "Postpartum mental-health conditions are common and treatable, and telling someone is the step that starts treatment.",
    followUps: [
      {
        id: "mh-features",
        prompt: "What feels true right now?",
        kind: "multi",
        exclusiveValue: "none",
        options: [
          {
            value: "psychosis",
            label: "I am seeing or hearing things other people do not",
          },
          {
            value: "confused",
            label: "I feel confused, agitated, or detached from reality",
          },
          {
            value: "no-sleep",
            label: "I have not slept at all, even when my baby sleeps",
          },
          {
            value: "cannot-cope",
            label: "I do not think I can get through another hour",
          },
          {
            value: "cannot-care",
            label: "I cannot care for myself or my baby right now",
          },
          { value: "low-anxious", label: "I feel low, anxious, or tearful most days" },
          { value: "none", label: "None of these exactly" },
        ],
      },
      {
        id: "mh-support",
        prompt: "Is someone with you?",
        kind: "single",
        options: [
          { value: "yes", label: "Yes, someone is here" },
          { value: "reachable", label: "No, but I can reach someone" },
          { value: "alone", label: "No, and I have no one to call" },
        ],
      },
    ],
    rules: [
      {
        id: "mh.psychosis",
        when: [{ questionId: "mh-features", anyOf: ["psychosis", "confused"] }],
        level: "call-911",
        because:
          "Seeing or hearing things others do not, or feeling detached from reality, can be postpartum psychosis. It is a medical emergency and it responds to treatment.",
      },
      {
        id: "mh.cannot-cope",
        when: [
          { questionId: "mh-features", anyOf: ["cannot-cope", "cannot-care"] },
        ],
        level: "emergency-now",
        because:
          "You told us you cannot get through this on your own right now. That is enough reason to be seen today.",
      },
      {
        id: "mh.no-sleep",
        when: [{ questionId: "mh-features", anyOf: ["no-sleep"] }],
        level: "emergency-now",
        because:
          "Being completely unable to sleep after birth, even when your baby sleeps, is an early warning sign that needs urgent attention.",
      },
      {
        id: "mh.alone",
        when: [{ questionId: "mh-support", anyOf: ["alone"] }],
        level: "contact-team-promptly",
        because:
          "You should not have to hold this alone. Crisis lines are staffed around the clock and you can call them just to talk it through.",
      },
    ],
  },
  {
    id: "thoughts-of-harm",
    label: "Thoughts of harming myself or my baby",
    detail: "Any thoughts of suicide, self-harm, or harm coming to your baby",
    searchTerms: ["suicide", "self harm", "harm", "intrusive", "988", "safe"],
    warningSignSlug: "thoughts-of-harm",
    baselineLevel: "emergency-now",
    baselineReason:
      "These thoughts are more common after birth than people are told, and they are a reason to get help now rather than to wait.",
    followUps: [
      {
        id: "harm-intent",
        prompt: "How close does it feel right now?",
        help: "Answering honestly helps you get the right kind of help. You will not be judged.",
        kind: "single",
        options: [
          { value: "acting", label: "I might act on it, or I already have" },
          { value: "plan", label: "I have thought about how I would do it" },
          {
            value: "thoughts",
            label: "The thoughts are there but I do not want to act on them",
          },
        ],
      },
      {
        id: "harm-safety",
        prompt: "Are you somewhere you can be safe right now?",
        kind: "single",
        options: [
          { value: "safe-with-someone", label: "Yes, and someone is with me" },
          { value: "safe-alone", label: "I think so, but I am alone" },
          { value: "not-safe", label: "No" },
        ],
      },
    ],
    rules: [
      {
        id: "harm.acting",
        when: [{ questionId: "harm-intent", anyOf: ["acting"] }],
        level: "call-911",
        because:
          "You told us you might act on these thoughts or already have. Emergency help needs to come to you now.",
      },
      {
        id: "harm.plan",
        when: [{ questionId: "harm-intent", anyOf: ["plan"] }],
        level: "call-911",
        because:
          "Having thought through how you would act raises the risk enough that you should not wait for an appointment.",
      },
      {
        id: "harm.not-safe",
        when: [{ questionId: "harm-safety", anyOf: ["not-safe"] }],
        level: "call-911",
        because:
          "You told us you are not somewhere you can be safe right now. That comes before everything else.",
      },
    ],
  },
  {
    id: "feeling-unsafe",
    label: "Someone is hurting or frightening me",
    detail: "Being hurt, threatened, controlled, or afraid of someone",
    searchTerms: ["abuse", "domestic", "violence", "partner", "unsafe", "threat"],
    warningSignSlug: "feeling-unsafe",
    baselineLevel: "contact-team-promptly",
    baselineReason:
      "Advocates can help you plan for safety confidentially, whether or not you are ready to leave.",
    followUps: [
      {
        id: "safety-now",
        prompt: "What is happening?",
        kind: "multi",
        exclusiveValue: "none",
        options: [
          { value: "immediate", label: "I am being hurt or threatened right now" },
          { value: "injury", label: "I have been hit, choked, or injured" },
          {
            value: "afraid-tonight",
            label: "I am afraid to stay where I am tonight",
          },
          {
            value: "controlled",
            label: "Someone controls my money, phone, medicine, or movement",
          },
          { value: "none", label: "None of these exactly" },
        ],
      },
    ],
    rules: [
      {
        id: "safety.immediate",
        when: [{ questionId: "safety-now", anyOf: ["immediate"] }],
        level: "call-911",
        because:
          "You told us you are being hurt or threatened right now. Call 911 if you can do so safely.",
      },
      {
        id: "safety.injury",
        when: [{ questionId: "safety-now", anyOf: ["injury"] }],
        level: "emergency-now",
        because:
          "Injuries from being hit or choked need to be examined, including injuries that do not look serious from outside.",
      },
      {
        id: "safety.tonight",
        when: [{ questionId: "safety-now", anyOf: ["afraid-tonight"] }],
        level: "emergency-now",
        because:
          "If you are afraid to stay where you are tonight, an advocate can help you find somewhere safe today.",
      },
    ],
  },
  {
    id: "trouble-urinating",
    label: "Trouble or burning when urinating",
    detail: "Unable to urinate, burning, urgency, or back pain",
    searchTerms: ["urine", "pee", "bladder", "uti", "burning", "catheter"],
    warningSignSlug: "trouble-urinating",
    baselineLevel: "contact-team-promptly",
    baselineReason:
      "Bladder infections after birth are common and easy to treat, and a blocked bladder needs attention quickly.",
    followUps: [
      {
        id: "urine-features",
        prompt: "What is happening?",
        kind: "multi",
        exclusiveValue: "none",
        options: [
          { value: "cannot-go", label: "I cannot urinate, or only small amounts" },
          { value: "burning", label: "Burning or stinging" },
          { value: "urgency", label: "Needing to go constantly" },
          { value: "back-pain", label: "Back or side pain" },
          { value: "blood", label: "Blood in my urine" },
          { value: "none", label: "None of these exactly" },
        ],
      },
      {
        id: "urine-fever",
        prompt: "Do you have a temperature of 100.4°F (38°C) or higher?",
        kind: "single",
        options: yesNoUnsure("Yes"),
      },
    ],
    rules: [
      {
        id: "urine.retention",
        when: [{ questionId: "urine-features", anyOf: ["cannot-go"] }],
        level: "emergency-now",
        because:
          "Not being able to empty your bladder needs same-day care so it can be drained and checked.",
      },
      {
        id: "urine.kidney",
        when: [
          { questionId: "urine-features", anyOf: ["back-pain"] },
          { questionId: "urine-fever", anyOf: ["yes", "unsure"] },
        ],
        level: "emergency-now",
        because:
          "Back or side pain with a fever can mean the infection has reached a kidney, which needs prompt treatment.",
      },
    ],
  },
  {
    id: "something-else",
    label: "Something else — I do not see it listed",
    detail: "Anything that feels wrong, even if you cannot name it",
    searchTerms: ["other", "not listed", "something", "unsure", "feels wrong"],
    warningSignSlug: null,
    baselineLevel: "monitor-and-contact",
    baselineReason:
      "Your instinct counts. If something feels wrong, your care team would rather hear about it than have you wait.",
    followUps: [
      {
        id: "other-severity",
        prompt: "How much is it affecting you?",
        kind: "single",
        options: [
          {
            value: "severe",
            label: "A lot — I cannot do my usual things or care for my baby",
          },
          { value: "moderate", label: "Some — it is uncomfortable or worrying" },
          { value: "mild", label: "A little — I mostly want to understand it" },
        ],
      },
      {
        id: "other-instinct",
        prompt: "Does something feel seriously wrong to you?",
        help: "Your own sense of alarm is a legitimate reason to seek care.",
        kind: "single",
        options: yesNoUnsure(
          "Yes, something feels very wrong",
          "No, I am mainly unsure",
        ),
      },
    ],
    rules: [
      {
        id: "other.instinct",
        when: [{ questionId: "other-instinct", anyOf: ["yes"] }],
        level: "emergency-now",
        because:
          "You told us something feels seriously wrong. That is reason enough to be assessed in person now.",
      },
      {
        id: "other.severe",
        when: [{ questionId: "other-severity", anyOf: ["severe"] }],
        level: "contact-team-promptly",
        because:
          "Anything that stops you doing your usual things or caring for your baby should be reviewed by your care team today.",
      },
      {
        id: "other.worsening",
        when: [{ questionId: TREND_QUESTION_ID, anyOf: ["worse"] }],
        level: "contact-team-promptly",
        because:
          "Symptoms that are getting worse rather than easing should be reported rather than watched.",
      },
    ],
  },
];

/** Rules applied to every symptom path after the symptom's own rules. */
export const UNIVERSAL_RULES: Rule[] = [
  {
    id: "universal.sudden-onset-worsening",
    when: [
      { questionId: ONSET_QUESTION_ID, anyOf: ["minutes"] },
      { questionId: TREND_QUESTION_ID, anyOf: ["worse"] },
    ],
    level: "contact-team-promptly",
    because:
      "Something that started within the hour and is already worsening should be reported now rather than watched.",
  },
];

export function getSymptom(id: string) {
  return SYMPTOMS.find((symptom) => symptom.id === id);
}

export const SYMPTOM_IDS = SYMPTOMS.map((symptom) => symptom.id);
