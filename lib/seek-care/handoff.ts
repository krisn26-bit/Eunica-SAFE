"use client";

/**
 * Carries a preselected symptom from the warning-sign library into the
 * questionnaire. It uses `sessionStorage` rather than a query parameter so a
 * symptom never appears in a URL, browser history, or a shared link
 * (spec §9, §11.10).
 */

const HANDOFF_KEY = "eunica-safe.v1.seek-care.symptom";

export function setSeekCareHandoff(symptomId: string): void {
  try {
    window.sessionStorage.setItem(HANDOFF_KEY, symptomId);
  } catch {
    // A blocked session store only means the user picks the symptom again.
  }
}

export function takeSeekCareHandoff(): string | null {
  try {
    const value = window.sessionStorage.getItem(HANDOFF_KEY);
    if (value) window.sessionStorage.removeItem(HANDOFF_KEY);
    return value;
  } catch {
    return null;
  }
}

export { HANDOFF_KEY as SEEK_CARE_HANDOFF_KEY };
