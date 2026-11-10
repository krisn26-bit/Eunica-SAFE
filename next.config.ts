import type { NextConfig } from "next";

/**
 * Hosts allowed to request dev-only resources. Next allows `localhost` and the
 * hostname it was started with, and blocks everything else, including the HMR
 * socket. A blocked socket stops the client from hydrating at all, so the page
 * renders and native inputs still toggle, but no button responds. Reaching the
 * dev server by IP or through a forwarded port needs the host listed here.
 * Set `ALLOWED_DEV_ORIGINS` (comma separated) to add a tunnel hostname.
 * Development only: this has no effect on a production build.
 */
const allowedDevOrigins = [
  "127.0.0.1",
  "[::1]",
  "10.*.*.*",
  "172.*.*.*",
  "192.168.*.*",
  ...(process.env.ALLOWED_DEV_ORIGINS?.split(",") ?? []),
]
  .map((host) => host.trim())
  .filter(Boolean);

const nextConfig: NextConfig = {
  // No external data sources, no images, no analytics in this build.
  poweredByHeader: false,
  allowedDevOrigins,
};

export default nextConfig;
