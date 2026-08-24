// ─── Feature 0, 1, 2, 3 & 4: Root Application Layout ─────────────────────────
//
// RootLayout is the topmost wrapper that surrounds every single page in Next.js.
// It defines the base HTML structure, applies global typography, wraps children
// with global providers, and renders the top navigation bar.
//
// What this file includes:
//   • Google Font (Geist) setup with CSS variable injection
//   • Global CSS import (Tailwind CSS styling)
//   • Global Metadata (Browser tab title and SEO description)
//   • Providers (TanStack Query + AuthProvider)
//   • Navbar (Dynamic navigation bar reflecting authentication state)
//
// ────────────────────────────────────────────────────────────────────────────

import { Geist } from "next/font/google";
import "./globals.css";
import Providers from "./providers";
import Navbar from "@/components/Navbar";

// ─── 1. Typography Configuration ─────────────────────────────────────────────
// Load the clean Geist font and assign it to a CSS custom variable `--font-geist`
// so Tailwind CSS utility classes (like `font-sans`) can apply it automatically.
const geist = Geist({
  variable: "--font-geist",
  subsets: ["latin"], // Only download Latin characters to keep bundle size small
});

// ─── 2. Default Application Metadata ─────────────────────────────────────────
// Next.js automatically injects these into the HTML <head> for SEO and tab titles.
// Individual pages (like /vehicles) can override these with their own metadata export.
export const metadata = {
  title: "EV Rental — SwiftVolt Electric Scooters",
  description: "Rent premium electric scooters with zero emissions and instant battery swap technology.",
};

// ─── 3. Root Layout Component ────────────────────────────────────────────────
// Parameters:
//   children -> The active page component (e.g. Home, /vehicles, /login, etc.)
export default function RootLayout({ children }) {
  return (
    <html lang="en" className={geist.variable}>
      <body className="min-h-screen bg-gray-50 antialiased flex flex-col">
        {/*
          <Providers> equips all child components with:
            1. QueryClientProvider (TanStack Query for data fetching/caching)
            2. AuthProvider (React Context for JWT tokens and active user session)
        */}
        <Providers>
          {/* Top navigation bar — stays pinned at the top on every page */}
          <Navbar />

          {/* Main page content rendered dynamically based on active route */}
          <main className="flex-1">
            {children}
          </main>
        </Providers>
      </body>
    </html>
  );
}
