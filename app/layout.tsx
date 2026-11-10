import type { Metadata, Viewport } from "next";
import { Fraunces, Inter } from "next/font/google";

import { EmergencyBar } from "@/components/layout/emergency-bar";
import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";

import "./globals.css";

const fraunces = Fraunces({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-fraunces",
  axes: ["SOFT", "WONK"],
});

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: {
    default: "Eunica Safe — know the postpartum warning signs",
    template: "%s · Eunica Safe",
  },
  description:
    "Plain-language postpartum warning signs, a structured way to decide whether to seek care, and the numbers you need in a hard moment. Educational, private, and stored only on your device.",
  applicationName: "Eunica Safe",
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#f6efe4",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${fraunces.variable} ${inter.variable}`}>
      <body className="flex min-h-dvh flex-col">
        <a
          href="#main"
          className="focus:text-ink sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 focus:z-50 focus:bg-[color:var(--paper)] focus:px-4 focus:py-2 focus:font-semibold"
        >
          Skip to main content
        </a>
        <EmergencyBar />
        <SiteHeader />
        <main id="main" className="flex-1">
          {children}
        </main>
        <SiteFooter />
      </body>
    </html>
  );
}
