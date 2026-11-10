/**
 * Single source of truth for privacy and scope copy, so the same promises
 * appear identically on every screen (spec §9, §10).
 */

export const DATA_HANDLING = {
  headline: "Your information stays on this device",
  points: [
    "There is no account, no sign-in, and no server storing your health details in this build.",
    "Anything you save — your medical history, safety plan, recovery notes, and preferences — is stored in this browser on this device only.",
    "Location is used only when you tap a button that asks for it, and it is never sent to us.",
    "There is no analytics, advertising, or session recording in this build.",
    "Clearing your browser data, or using the delete button in the app, removes everything.",
  ],
  caveats: [
    "Because data lives in this browser, anyone who can unlock this device can read it. Use a device passcode, and skip fields you would rather not save.",
    "If you share a device with someone who is hurting you, use a private browsing window and delete your data when you are done.",
    "Eunica Safe is not a covered entity and does not claim HIPAA compliance. HIPAA governs clinicians, health plans, and their business associates, and this app is none of those. Your information is protected by staying on your device, not by a compliance programme.",
  ],
} as const;

/**
 * Why the one required section exists, shown wherever medical history is asked
 * for. Collection is limited to answers that change which education appears.
 */
export const MEDICAL_HISTORY_NOTICE = {
  purpose:
    "Your medical history decides which published education your safety plan shows you — incision care after a cesarean, blood-pressure follow-up after preeclampsia, healing guidance after stitches.",
  limits:
    "It is never used to diagnose you, to predict a complication, to score your risk, or to decide that you are safe.",
  storage:
    "It is saved in this browser on this device. There is no account, nothing is transmitted, and no one at Eunica Safe can read it.",
  control:
    "You can change any answer or delete all of it at any time from Privacy and your data.",
} as const;

export const SCOPE_STATEMENT = {
  can: [
    "Explain postpartum warning signs in plain language.",
    "Ask structured questions and point you to the level of care that matches published red flags.",
    "Help you reach 911, your own care team, or a crisis line quickly.",
    "Hold the details you would struggle to remember in a hard moment.",
    "Keep a record of how recovery is going in your own words.",
  ],
  cannot: [
    "Diagnose you or tell you what is causing a symptom.",
    "Examine you, read your chart, or know your history.",
    "Tell you that you are fine, or rule out an emergency.",
    "Prescribe or adjust medication.",
    "Replace 911, your clinician, or an emergency department.",
    "Contact anyone on your behalf or monitor you in the background.",
  ],
} as const;

export const MEDICAL_DISCLAIMER =
  "Eunica Safe is educational. It does not diagnose, treat, or replace care from a clinician or emergency services. If something feels wrong, seek help.";

export const EMERGENCY_DISCLAIMER =
  "In an emergency, call 911 or go to the nearest emergency department. Do not wait for guidance from this app, and do not drive yourself if you feel unwell.";

export const LOCATION_EXPLAINER =
  "If you allow it, your browser shares your approximate coordinates with this page to build a map search. Eunica Safe does not store or transmit them unless you save a location, and you can type a city or ZIP code instead.";

export const DATA_RETENTION = {
  summary:
    "Data is kept until you delete it, because it is kept on your device and nowhere else.",
  export:
    "Export writes a JSON file to your device. Nothing is uploaded, and you choose where it goes.",
  deletion:
    "Delete removes every Eunica Safe record from this browser immediately. It cannot be undone.",
} as const;
