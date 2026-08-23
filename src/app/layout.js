// ─── Imports ────────────────────────────────────────────────────────────────

import { Geist } from "next/font/google";
import "./globals.css";

// Providers wraps the app with TanStack Query's QueryClientProvider.
// Every page needs this so that useVehicles() and future hooks work.
import Providers from "./providers";

// ─── Font Setup ─────────────────────────────────────────────────────────────

const geist = Geist({
  variable: "--font-geist",  // CSS variable used by Tailwind's font-sans
  subsets: ["latin"],        // only load the Latin character set
});

// ─── Page Metadata ──────────────────────────────────────────────────────────

// Default metadata — individual pages can override this with their own
// `export const metadata` (e.g. the /vehicles page sets its own title)
export const metadata = {
  title: "EV Rental",
  description: "Electric vehicle rental platform",
};

// ─── Root Layout ────────────────────────────────────────────────────────────

// RootLayout wraps EVERY page. It provides:
//   - The <html> and <body> tags (required by Next.js)
//   - The global font
//   - The TanStack Query provider (via <Providers>)
//   - The top navigation bar
export default function RootLayout({ children }) {
  return (
    <html lang="en" className={geist.variable}>
      <body className="min-h-screen bg-gray-50 antialiased">

        {/* ── Top Navigation ──────────────────────────────────────────── */}
        {/* Appears on every page. Links will grow as we add more features. */}
        <nav className="bg-white border-b border-gray-200 sticky top-0 z-10">
          <div className="max-w-6xl mx-auto px-4 h-14 flex items-center justify-between">

            {/* Brand / Home link */}
            <a href="/" className="text-lg font-bold text-gray-900">
              ⚡ EV Rental
            </a>

            {/* Navigation links */}
            <div className="flex items-center gap-6 text-sm font-medium text-gray-600">
              <a href="/vehicles" className="hover:text-sky-600 transition-colors">
                Browse Scooters
              </a>
            </div>

          </div>
        </nav>

        {/* ── Page Content ────────────────────────────────────────────── */}
        {/*
          <Providers> gives every child page access to TanStack Query.
          {children} is replaced by whichever page the user is on.
        */}
        <Providers>
          {children}
        </Providers>

      </body>
    </html>
  );
}
