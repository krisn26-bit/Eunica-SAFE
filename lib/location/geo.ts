import type { Coordinates } from "./maps";

export type GeolocationOutcome =
  | { status: "ok"; coordinates: Coordinates }
  | {
      status: "unsupported" | "denied" | "unavailable" | "timeout";
      message: string;
    };

/**
 * One-time coordinate lookup, only ever called after the user taps a button
 * that explains what will happen. Coordinates stay in memory or in local
 * storage on the device and are never sent to a server (spec §4.5, §9).
 */
export function requestDeviceLocation(
  timeoutMs = 10_000,
): Promise<GeolocationOutcome> {
  if (typeof navigator === "undefined" || !("geolocation" in navigator)) {
    return Promise.resolve({
      status: "unsupported",
      message:
        "This device or browser cannot share location. You can type a city or ZIP code instead.",
    });
  }

  return new Promise((resolve) => {
    navigator.geolocation.getCurrentPosition(
      (position) =>
        resolve({
          status: "ok",
          coordinates: {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          },
        }),
      (error) => {
        if (error.code === error.PERMISSION_DENIED) {
          resolve({
            status: "denied",
            message:
              "Location permission was declined. You can type a city or ZIP code instead — nothing is lost.",
          });
          return;
        }
        if (error.code === error.TIMEOUT) {
          resolve({
            status: "timeout",
            message:
              "Finding your location took too long. Type a city or ZIP code so you are not waiting.",
          });
          return;
        }
        resolve({
          status: "unavailable",
          message:
            "Your location could not be determined. Type a city or ZIP code instead.",
        });
      },
      { enableHighAccuracy: false, timeout: timeoutMs, maximumAge: 60_000 },
    );
  });
}
