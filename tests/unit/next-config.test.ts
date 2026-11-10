import { isCsrfOriginAllowed } from "next/dist/server/app-render/csrf-protection";
import { describe, expect, it } from "vitest";

import nextConfig from "@/next.config";

/**
 * The dev server blocks its own HMR socket for any host it does not recognise,
 * and a blocked socket leaves the client un-hydrated: pages render, native
 * radios still toggle, and every button silently does nothing. The e2e suite
 * runs against a production build, so only this can catch a regression here.
 */
describe("dev origins allowed to load dev-only resources", () => {
  const allowed = [
    // Next always permits these two; the matcher needs them to judge the rest.
    "**.localhost",
    "localhost",
    ...(nextConfig.allowedDevOrigins ?? []),
  ];

  it.each([
    ["localhost", true],
    ["127.0.0.1", true],
    ["[::1]", true],
    ["10.1.2.3", true],
    ["172.30.0.2", true],
    ["192.168.1.9", true],
    ["evil.example.com", false],
    ["127.0.0.1.evil.example.com", false],
  ])("%s is allowed: %s", (hostname, expected) => {
    expect(isCsrfOriginAllowed(hostname, allowed)).toBe(expected);
  });
});
