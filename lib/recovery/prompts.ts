import type { RecoveryEntry } from "@/lib/validation/schemas";

export type RecoveryPrompt = {
  id: string;
  message: string;
  /** Symptom id in the questionnaire, when the prompt maps to one. */
  symptomId?: string;
};

const FEVER_THRESHOLD_F = 100.4;

const TEMPERATURE_PATTERN = /(-?\d+(?:\.\d+)?)\s*°?\s*([cCfF])?/;

/** Accepts "100.4", "100.4 F", "38 C", "38.1c". Returns degrees Fahrenheit. */
export function parseTemperatureToF(input: string): number | null {
  const match = TEMPERATURE_PATTERN.exec(input.trim());
  if (!match) return null;
  const value = Number(match[1]);
  if (Number.isNaN(value)) return null;
  const unit = match[2]?.toLowerCase();
  if (unit === "c") return value * (9 / 5) + 32;
  if (unit === "f") return value;
  // No unit given: values in the 30s are almost certainly Celsius.
  return value < 60 ? value * (9 / 5) + 32 : value;
}

/**
 * Non-diagnostic nudges. These never interpret an entry as a condition and
 * never score recovery — they only repeat the published thresholds at which a
 * care team wants to hear from you (spec §4.7).
 */
export function recoveryPrompts(
  entry: Pick<RecoveryEntry, "painLevel" | "bleeding" | "temperature" | "mood">,
): RecoveryPrompt[] {
  const prompts: RecoveryPrompt[] = [];

  if (entry.bleeding === "heavier") {
    prompts.push({
      id: "bleeding-heavier",
      message:
        "You noted heavier bleeding than yesterday. Bleeding should taper after birth, so this is worth a call to your care team today.",
      symptomId: "heavy-bleeding",
    });
  }

  if (entry.bleeding === "clots") {
    prompts.push({
      id: "bleeding-clots",
      message:
        "You noted clots. Anything larger than a golf ball, or soaking a pad in an hour, means calling 911 rather than waiting.",
      symptomId: "heavy-bleeding",
    });
  }

  const temperatureF = entry.temperature
    ? parseTemperatureToF(entry.temperature)
    : null;
  if (temperatureF !== null && temperatureF >= FEVER_THRESHOLD_F) {
    prompts.push({
      id: "fever",
      message:
        "The temperature you recorded is at or above 100.4°F (38°C), which is the threshold maternity teams use for postpartum fever. Contact them today.",
      symptomId: "fever-or-infection",
    });
  }

  if (typeof entry.painLevel === "number" && entry.painLevel >= 7) {
    prompts.push({
      id: "pain-high",
      message:
        "You reported pain at 7 or above. Pain that severe, or pain that is increasing, should be described to your care team rather than managed alone.",
      symptomId: "severe-abdominal-pain",
    });
  }

  if (entry.mood === "overwhelmed" || entry.mood === "low") {
    prompts.push({
      id: "mood",
      message:
        "You said you are feeling low or overwhelmed. That is common, it is treatable, and you can talk to someone right now by calling or texting 988.",
      symptomId: "mental-health-crisis",
    });
  }

  return prompts;
}
