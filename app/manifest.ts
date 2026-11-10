import type { MetadataRoute } from "next";

import { BRAND_TAGLINE } from "@/components/brand/logo";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Eunica Safe",
    short_name: "Eunica Safe",
    description: BRAND_TAGLINE,
    start_url: "/dashboard",
    display: "standalone",
    background_color: "#FFF8F3",
    theme_color: "#48123F",
    categories: ["health", "medical", "education"],
    icons: [
      {
        src: "/brand/icon-192.png",
        sizes: "192x192",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/brand/icon-512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "any",
      },
      {
        // The mark sits inside the inner 80%, so the same art masks safely.
        src: "/brand/icon-512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "maskable",
      },
    ],
  };
}
