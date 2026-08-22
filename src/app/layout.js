// ─── Imports ────────────────────────────────────────────────────────────────

// Geist is the font we use across the whole app (loaded from Google Fonts)
import { Geist } from "next/font/google";

// globals.css contains Tailwind's base styles — must be imported here so
// every page in the app gets them automatically
import "./globals.css";

// ─── Font Setup ─────────────────────────────────────────────────────────────

// This sets up the Geist font and makes it available as a CSS variable
// so Tailwind can use it via the `font-sans` class
const geist = Geist({
  variable: "--font-geist", // CSS variable name
  subsets: ["latin"],       // only load the Latin character set (keeps bundle small)
});

// ─── Page Metadata ──────────────────────────────────────────────────────────

// Next.js reads this object and puts it in the <head> of every page
// (this is what shows up as the browser tab title and in Google search results)
export const metadata = {
  title: "EV Rental",
  description: "Electric vehicle rental platform",
};

// ─── Root Layout ────────────────────────────────────────────────────────────

// RootLayout wraps EVERY page in the app.
// Think of it like a template — the <html> and <body> tags live here
// so you don't have to repeat them on every single page.
// {children} is replaced by whichever page the user is currently on.
export default function RootLayout({ children }) {
  return (
    <html lang="en" className={geist.variable}>
      <body className="min-h-screen bg-gray-50 antialiased">
        {children}
      </body>
    </html>
  );
}
