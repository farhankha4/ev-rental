// ─── Feature 0, 1, 2 & 3: Root Layout ───────────────────────────────────────
//
// RootLayout wraps EVERY page in the application.
//
// Components included:
//   - HTML and body tags with global font configuration
//   - <Providers> (TanStack Query + AuthProvider)
//   - <Navbar> with dynamic authentication state
//
// ────────────────────────────────────────────────────────────────────────────

import { Geist } from "next/font/google";
import "./globals.css";
import Providers from "./providers";
import Navbar from "@/components/Navbar";

const geist = Geist({
  variable: "--font-geist",
  subsets: ["latin"],
});

export const metadata = {
  title: "EV Rental — SwiftVolt Electric Scooters",
  description: "Rent premium electric scooters with zero emissions and instant battery swap technology.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={geist.variable}>
      <body className="min-h-screen bg-gray-50 antialiased flex flex-col">
        <Providers>
          {/* Top navigation bar */}
          <Navbar />

          {/* Main page view */}
          <main className="flex-1">
            {children}
          </main>
        </Providers>
      </body>
    </html>
  );
}
