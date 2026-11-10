import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // No external data sources, no images, no analytics in this build.
  poweredByHeader: false,
};

export default nextConfig;
