import { EMERGENCY_LINES } from "@/content/resources";
import { Callout } from "@/components/ui/callout";

const MENTAL_HEALTH_LINE_IDS = ["911", "988", "tlc-mama"];

/**
 * Shown on every mental-health topic so the three numbers are reachable
 * without navigating away. They are ordered by urgency and labelled with what
 * each one is for, because the difference between a crisis line and an
 * emergency service is exactly what is hardest to judge in the moment.
 */
export function CrisisLines() {
  const lines = MENTAL_HEALTH_LINE_IDS.map((id) =>
    EMERGENCY_LINES.find((line) => line.id === id)!,
  );

  return (
    <Callout tone="serious" title="Numbers you can use right now">
      <ul className="mt-1 space-y-4">
        {lines.map((line) => (
          <li key={line.id}>
            <a
              href={`tel:${line.number.replace(/[^0-9]/g, "")}`}
              className="font-semibold underline underline-offset-4"
            >
              {line.number}
            </a>{" "}
            — {line.label}
            <span className="text-ink-soft block text-[0.92rem]">
              {line.description}
            </span>
          </li>
        ))}
      </ul>
      <p className="text-ink-soft mt-4 text-[0.92rem]">
        988 and 1-833-TLC-MAMA can be texted as well as called. Both are free,
        and neither requires you to be in crisis to call.
      </p>
    </Callout>
  );
}
