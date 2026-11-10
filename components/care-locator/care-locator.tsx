"use client";

import {
  Compass,
  ExternalLink,
  MapPin,
  Navigation,
  Trash2,
} from "lucide-react";
import { useState } from "react";

import { Call911Button } from "@/components/safety/call-911";
import { SavedContacts } from "@/components/safety/saved-contacts";
import { ActionLink, Button } from "@/components/ui/button";
import { Callout } from "@/components/ui/callout";
import { Disclosure } from "@/components/ui/disclosure";
import { TextField } from "@/components/ui/field";
import { Section } from "@/components/ui/section";
import { notConfiguredFacilitySource } from "@/lib/location/facility-source";
import { requestDeviceLocation } from "@/lib/location/geo";
import {
  CARE_SEARCH_PRESETS,
  appleMapsSearchUrl,
  googleMapsSearchUrl,
  type Coordinates,
} from "@/lib/location/maps";
import { LOCATION_EXPLAINER } from "@/lib/privacy/notices";
import { STORAGE_KEYS } from "@/lib/storage/local-store";
import { useStoredRecord } from "@/lib/storage/use-stored-record";
import {
  savedLocationSchema,
  type SavedLocation,
} from "@/lib/validation/schemas";

const NO_LOCATION: SavedLocation = {
  label: "",
  source: "manual",
  savedAt: "",
};

export function CareLocator() {
  const saved = useStoredRecord(
    STORAGE_KEYS.location,
    savedLocationSchema,
    NO_LOCATION,
  );
  const [locationText, setLocationText] = useState("");
  const [coordinates, setCoordinates] = useState<Coordinates | null>(null);
  const [status, setStatus] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const activeCoordinates =
    coordinates ??
    (saved.value.latitude !== undefined && saved.value.longitude !== undefined
      ? { latitude: saved.value.latitude, longitude: saved.value.longitude }
      : null);
  const activeText = locationText || saved.value.label;

  async function useMyLocation() {
    setBusy(true);
    setStatus("Asking your browser for your location…");
    const outcome = await requestDeviceLocation();
    setBusy(false);
    if (outcome.status === "ok") {
      setCoordinates(outcome.coordinates);
      setStatus(
        "Using your current location for the map search. It stays on this device.",
      );
      return;
    }
    setStatus(outcome.message);
  }

  function saveLocation() {
    if (!activeText && !activeCoordinates) return;
    saved.save({
      label: activeText || "Current location",
      source: activeCoordinates && !locationText ? "device" : "manual",
      latitude: activeCoordinates?.latitude,
      longitude: activeCoordinates?.longitude,
      savedAt: new Date().toISOString(),
    });
    setStatus("Location saved on this device.");
  }

  return (
    <div className="space-y-10">
      <Callout tone="emergency" title="If this is an emergency">
        <p className="mb-4">
          Call 911 rather than searching. Responders can begin treatment on the
          way, and they will take you to a hospital that can treat you.
        </p>
        <Call911Button />
      </Callout>

      <Section ruled={false} eyebrow="Step one" title="Where are you?">
        <div className="space-y-5">
          <TextField
            label="City, neighborhood, or ZIP code"
            placeholder="For example 19104 or West Philadelphia"
            value={locationText}
            onChange={(event) => setLocationText(event.target.value)}
            purpose="Typed here only to build a map search. It is not sent to us."
          />
          <div className="flex flex-wrap gap-3">
            <Button variant="secondary" onClick={useMyLocation} disabled={busy}>
              <Compass aria-hidden="true" className="size-4" />
              {busy ? "Checking…" : "Use my current location"}
            </Button>
            <Button
              variant="quiet"
              onClick={saveLocation}
              disabled={!activeText && !activeCoordinates}
            >
              Save this location for next time
            </Button>
            {saved.value.savedAt ? (
              <Button
                variant="quiet"
                onClick={() => {
                  saved.clear();
                  setStatus("Saved location deleted from this device.");
                }}
              >
                <Trash2 aria-hidden="true" className="size-4" />
                Delete saved location
              </Button>
            ) : null}
          </div>
          <p aria-live="polite" className="text-ink-muted text-[0.9rem]">
            {status ?? LOCATION_EXPLAINER}
          </p>
          {saved.value.savedAt && !locationText ? (
            <p className="text-ink-soft text-[0.9rem]">
              Using your saved location: {saved.value.label}
            </p>
          ) : null}
        </div>
      </Section>

      <Section eyebrow="Step two" title="What kind of care do you need?">
        <ul className="index-list">
          {CARE_SEARCH_PRESETS.map((preset) => (
            <li key={preset.id} className="py-4">
              <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
                <h3 className="font-serif text-[1.15rem] font-semibold">
                  {preset.label}
                </h3>
                {preset.kind === "emergency" ? (
                  <span className="border-emergency bg-emergency inline-flex items-center gap-1.5 rounded-[var(--radius-editorial)] border px-2.5 py-1 text-[0.72rem] font-semibold tracking-[0.08em] text-white uppercase">
                    <MapPin aria-hidden="true" className="size-3.5" />
                    24 hours
                  </span>
                ) : null}
                {preset.kind === "urgent-care" ? (
                  <span className="border-rule-strong text-ink-muted inline-flex items-center gap-1.5 rounded-[var(--radius-editorial)] border px-2.5 py-1 text-[0.72rem] font-semibold tracking-[0.08em] uppercase">
                    Not for emergencies
                  </span>
                ) : null}
              </div>
              <p className="text-ink-soft mt-1.5 max-w-[62ch] text-[0.95rem]">
                {preset.description}
              </p>
              <div className="mt-3 flex flex-wrap gap-2">
                <ActionLink
                  href={googleMapsSearchUrl(preset.query, {
                    location: activeText || undefined,
                    coordinates: activeCoordinates ?? undefined,
                  })}
                  target="_blank"
                  rel="noreferrer"
                  variant={
                    preset.kind === "emergency" ? "serious" : "secondary"
                  }
                  size="sm"
                >
                  <Navigation aria-hidden="true" className="size-4" />
                  Search in Google Maps
                  <ExternalLink aria-hidden="true" className="size-3.5" />
                </ActionLink>
                <ActionLink
                  href={appleMapsSearchUrl(preset.query, {
                    location: activeText || undefined,
                    coordinates: activeCoordinates ?? undefined,
                  })}
                  target="_blank"
                  rel="noreferrer"
                  variant="secondary"
                  size="sm"
                >
                  Apple Maps
                  <ExternalLink aria-hidden="true" className="size-3.5" />
                </ActionLink>
              </div>
            </li>
          ))}
        </ul>
      </Section>

      <SavedContacts heading="Your hospital and care team" />

      <Disclosure summary="Why there is no list of hospitals here">
        <p>
          Eunica Safe does not have a verified source of facility data in this
          build, and listing hospitals we cannot verify would be worse than
          listing none — a wrong address or a closed maternity unit costs time
          in an emergency.
        </p>
        <p className="mt-2">
          {notConfiguredFacilitySource.name === "none configured"
            ? "Searches are handed to your map application, which has current data and already knows where you are."
            : null}
        </p>
        <p className="mt-2">
          A future release can show listings once a named source with a
          documented update cadence is connected, every listing shows the date
          its source last confirmed it, and service claims such as
          &ldquo;obstetric unit&rdquo; come from the source rather than from a
          facility&rsquo;s name.
        </p>
      </Disclosure>
    </div>
  );
}
