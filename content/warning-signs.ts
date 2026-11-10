import { WARNING_SIGN_CONTENT, type ContentProvenance } from "./meta";

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
      "Readings at or above 140/90, or symptoms like headache, swelling, and pain under your ribs.",
    category: "blood-pressure",
    urgencyHint: "emergency-now",
    searchTerms: ["preeclampsia", "bp", "hypertension", "cuff", "140/90"],
    looksLike: [
      "A home reading of 140/90 or higher, especially twice a few minutes apart.",
      "A reading of 160/110 or higher at any time.",
      "Headache, vision changes, sudden swelling, nausea, or pain in your upper belly or under your right ribs.",
    ],
    whyItMatters:
      "Blood pressure can rise for the first time after birth, most often in the first week or two. High blood pressure after delivery can lead to seizures and stroke, and it is treatable when it is found early.",
    whatToDo: [
      "Go to the emergency department now for a reading of 160/110 or higher, or for any high reading with symptoms.",
      "Contact your care team today for readings of 140/90 or higher without symptoms.",
      "Measure again after resting five minutes, feet flat, arm supported at heart level, and write down both readings.",
      "Keep taking any blood-pressure medicine you were prescribed unless your care team tells you otherwise.",
    ],
    call911When: [
      "You have a seizure, chest pain, trouble breathing, or you cannot stay awake.",
      "You have weakness on one side or trouble speaking.",
    ],
    contactCareTeamWhen: [
      "Your readings are creeping up but you feel well.",
      "You do not have a cuff and need help getting a blood-pressure check.",
    ],
    symptomId: "high-blood-pressure",
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
    searchTerms: ["stomach", "abdominal", "cramps", "liver", "ribs"],
    looksLike: [
      "Pain that stops you from standing straight, sleeping, or caring for your baby.",
      "Pain high in your belly or under your right ribs.",
      "Pain with fever, vomiting, or a hard, tender belly.",
      "Pain that keeps getting worse over hours.",
    ],
    whyItMatters:
      "Afterbirth cramping is normal and usually eases. Severe pain can signal infection, a blood-pressure complication affecting the liver, a bowel problem, or bleeding inside the belly.",
    whatToDo: [
      "Seek emergency care now for severe pain, pain under your right ribs, or pain with fever or vomiting.",
      "Do not eat or drink on the way in case you need a procedure.",
      "Bring a list of your medicines and your delivery details.",
    ],
    call911When: [
      "The pain is sudden and severe, or you feel faint, cold, and clammy.",
      "You have chest pain, trouble breathing, or heavy bleeding with it.",
    ],
    contactCareTeamWhen: [
      "Your cramping is uncomfortable but eases with rest and medicine.",
      "You have constipation, gas pain, or soreness you want checked.",
    ],
    symptomId: "severe-abdominal-pain",
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
    title: "Leg swelling, redness, or pain",
    standfirst:
      "One leg that is swollen, warm, red, or painful, especially in the calf.",
    category: "swelling-and-clots",
    urgencyHint: "emergency-now",
    searchTerms: ["dvt", "blood clot", "calf", "thigh", "one leg"],
    looksLike: [
      "One leg noticeably more swollen than the other.",
      "Calf pain, tenderness, or a cramping ache that will not ease.",
      "Skin that is red, purple, or warm over the sore area.",
      "Leg symptoms with chest pain or shortness of breath.",
    ],
    whyItMatters:
      "Blood clots are more likely during pregnancy and for several weeks after birth. A clot in the leg can travel to the lungs, so it needs to be checked quickly even when the leg pain seems mild.",
    whatToDo: [
      "Seek emergency care now for new swelling, redness, or pain in one leg.",
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
      "A cesarean incision or repair that is opening, draining, or becoming more painful.",
    category: "healing",
    urgencyHint: "same-day",
    searchTerms: [
      "c-section",
      "cesarean",
      "stitches",
      "staples",
      "pus",
      "wound",
    ],
    looksLike: [
      "Redness spreading out from the incision.",
      "Pus, cloudy fluid, or a bad smell.",
      "Edges that are pulling apart or an opening in the wound.",
      "Pain that is increasing instead of easing, or a fever.",
    ],
    whyItMatters:
      "Wound infections and separations are common enough to expect and easy to treat early. Waiting can turn a simple course of antibiotics into a longer, more painful problem.",
    whatToDo: [
      "Contact your care team today. Send a photo if your practice allows it.",
      "Seek emergency care if the wound opens widely, bleeds heavily, or you have a fever with spreading redness.",
      "Keep the area clean and dry and avoid ointments unless your care team recommends one.",
    ],
    call911When: [
      "The wound is bleeding heavily and does not slow with pressure.",
      "You feel faint, confused, or very unwell.",
    ],
    contactCareTeamWhen: [
      "Normal-looking healing with itching or tugging that you want reassurance about.",
      "Questions about lifting, showering, or scar care.",
    ],
    symptomId: "incision-or-wound-concerns",
    provenance: p,
  },
  {
    slug: "breast-infection",
    title: "Breast pain, redness, or infection concerns",
    standfirst:
      "A hard, red, painful area in one breast, often with fever or feeling unwell.",
    category: "feeding",
    urgencyHint: "same-day",
    searchTerms: ["mastitis", "clogged duct", "engorged", "nursing", "pumping"],
    looksLike: [
      "A wedge-shaped red, hot, or hard area on one breast.",
      "Breast pain with fever, chills, or body aches.",
      "A lump that does not soften after feeding or pumping.",
      "Cracked, bleeding nipples that are getting worse.",
    ],
    whyItMatters:
      "Mastitis is an infection of the breast tissue and is treatable. Left alone it can turn into an abscess, and pain often makes feeding harder at a time when you need it to be easier.",
    whatToDo: [
      "Contact your care team today if you have breast redness with fever or feel unwell.",
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
    title: "Mental-health emergency",
    standfirst:
      "Feeling unable to cope, unable to sleep at all, panicked, or not yourself.",
    category: "mental-health",
    urgencyHint: "emergency-now",
    searchTerms: [
      "postpartum depression",
      "anxiety",
      "psychosis",
      "panic",
      "crisis",
      "988",
    ],
    looksLike: [
      "Feeling like you cannot cope with another hour.",
      "Being unable to sleep at all even when your baby sleeps.",
      "Seeing or hearing things other people do not.",
      "Feeling confused, agitated, suspicious, or detached from reality.",
      "Panic that will not settle.",
    ],
    whyItMatters:
      "Postpartum mental-health conditions are common and treatable, and some — especially postpartum psychosis — are emergencies. You are not failing, and asking for help is a way of protecting yourself and your baby.",
    whatToDo: [
      "Call or text 988 to reach the Suicide and Crisis Lifeline, any time, for free.",
      "Call 1-833-852-6262 for the National Maternal Mental Health Hotline (1-833-TLC-MAMA).",
      "Go to the emergency department if you are seeing or hearing things others do not, feel confused, or cannot keep yourself safe.",
      "Tell one trusted person what is happening and ask them to stay with you.",
      "Ask someone to care for your baby while you get help.",
    ],
    call911When: [
      "You feel you may act on thoughts of harming yourself or your baby.",
      "You are confused or disconnected from reality.",
      "You cannot keep yourself or your baby safe right now.",
    ],
    contactCareTeamWhen: [
      "You feel low, anxious, or tearful most days for more than two weeks.",
      "You want to talk about treatment, therapy, or medication options.",
    ],
    symptomId: "mental-health-crisis",
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
