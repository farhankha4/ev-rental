"use client";

// ─── Navbar Component (Cyprus #004643 & Sand Dune #F0EDE5 Theme + Dark Mode) ─
//
// Global header navbar for SwiftVolt EV Rentals.
// Features:
//   - Icon-only Theme Toggle button (Bigger Sun / Moon SVG icons)
//   - User Profile Avatar & Interactive Dropdown Menu
//
// ────────────────────────────────────────────────────────────────────────────

import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { useTheme } from "@/context/ThemeContext";

export default function Navbar() {
  const { user, isAuthenticated, isLoading, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const pathname = usePathname();
  const router = useRouter();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  const isAdmin =
    user &&
    (user.role === "admin" ||
      user.email?.includes("admin") ||
      user.email === "testpilot@swiftvolt.com");

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setUserDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const scrollToSection = (sectionId) => {
    setMobileMenuOpen(false);

    if (pathname === "/") {
      const element = document.getElementById(sectionId);
      if (element) {
        element.scrollIntoView({ behavior: "smooth" });
      }
    } else {
      router.push(`/#${sectionId}`);
    }
  };

  const getUserInitials = () => {
    if (!user || !user.full_name) return "U";
    const parts = user.full_name.trim().split(" ");
    if (parts.length >= 2) {
      return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
    }
    return parts[0][0].toUpperCase();
  };

  return (
    <header className="sticky top-0 z-50 bg-[#004643] text-[#F0EDE5] border-b border-[#004643]/20 shadow-md backdrop-blur-md">
      <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between">
        
        {/* Brand Logo */}
        <Link href="/" className="flex items-center gap-3 group">
          <div className="w-10 h-10 rounded-xl bg-[#F0EDE5] text-[#004643] flex items-center justify-center font-black text-xl shadow-md group-hover:scale-105 transition-transform">
            <svg className="w-6 h-6 text-[#004643] fill-current" viewBox="0 0 24 24">
              <path d="M13 2L3 14h7v8l10-12h-7V2z" />
            </svg>
          </div>
          <div className="flex flex-col">
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-xl text-white tracking-tight">
                Evora
              </span>
              <span className="text-[10px] font-extrabold uppercase tracking-wider bg-[#F0EDE5]/20 text-[#F0EDE5] px-2 py-0.5 rounded-full border border-[#F0EDE5]/30">
                EV Rentals
              </span>
            </div>
            <span className="text-[11px] text-[#F0EDE5]/80 font-medium tracking-wide">
              Urban Scooter Mobility
            </span>
          </div>
        </Link>

        {/* Desktop Navigation Links */}
        <nav className="hidden lg:flex items-center gap-1 text-sm font-semibold text-[#F0EDE5]">
          <button
            onClick={() => scrollToSection("services")}
            className="px-3.5 py-2 rounded-lg hover:bg-white/10 transition-colors"
          >
            Services
          </button>
          <button
            onClick={() => scrollToSection("fleet")}
            className="px-3.5 py-2 rounded-lg hover:bg-white/10 transition-colors"
          >
            Our Fleet
          </button>
          <button
            onClick={() => scrollToSection("why-us")}
            className="px-3.5 py-2 rounded-lg hover:bg-white/10 transition-colors"
          >
            Why Us
          </button>
          <button
            onClick={() => scrollToSection("how-it-works")}
            className="px-3.5 py-2 rounded-lg hover:bg-white/10 transition-colors"
          >
            How It Works
          </button>
          <button
            onClick={() => scrollToSection("reviews")}
            className="px-3.5 py-2 rounded-lg hover:bg-white/10 transition-colors"
          >
            Reviews
          </button>

          <Link
            href="/vehicles"
            className="px-3.5 py-2 rounded-lg text-white font-extrabold hover:underline underline-offset-4 transition-colors"
          >
            Browse Catalog
          </Link>
        </nav>

        {/* Right Action Bar: Icon-Only Theme Toggle & Auth / User Profile Avatar */}
        <div className="hidden sm:flex items-center gap-4">

          {/* Icon-Only Theme Toggle Button */}
          <button
            type="button"
            onClick={toggleTheme}
            className="p-2.5 rounded-2xl bg-white/10 hover:bg-white/20 text-[#F0EDE5] border border-white/20 transition-all flex items-center justify-center hover:scale-105 active:scale-95 focus:outline-none"
            title={`Switch to ${theme === "light" ? "Dark" : "Light"} Mode`}
          >
            {theme === "dark" ? (
              <svg className="w-6 h-6 text-amber-300 fill-current" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 100 2h1z" clipRule="evenodd" />
              </svg>
            ) : (
              <svg className="w-6 h-6 text-slate-200 fill-current" viewBox="0 0 20 20">
                <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
              </svg>
            )}
          </button>
          
          {isLoading ? (
            <div className="h-10 w-10 bg-white/20 animate-pulse rounded-full" />
          ) : isAuthenticated && user ? (
            /* User Avatar Icon & Dropdown Menu */
            <div className="relative" ref={dropdownRef}>
              <button
                type="button"
                onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                className="w-10 h-10 rounded-full bg-[#F0EDE5] text-[#004643] font-black text-sm flex items-center justify-center border-2 border-white/40 shadow-md hover:scale-105 active:scale-95 transition-all focus:outline-none"
                title={user.full_name}
              >
                {getUserInitials()}
              </button>

              {/* User Account Dropdown Modal Card */}
              {userDropdownOpen && (
                <div className="absolute right-0 mt-3 w-64 rounded-2xl shadow-2xl bg-white dark:bg-[#002A28] text-[#004643] dark:text-[#F0EDE5] border border-[#004643]/15 dark:border-emerald-500/20 overflow-hidden z-50 animate-in fade-in slide-in-from-top-2 duration-200">
                  
                  {/* User Profile Header */}
                  <div className="p-4 bg-[#F0EDE5] dark:bg-[#001F1D] border-b border-[#004643]/10 dark:border-emerald-500/20 space-y-1">
                    <div className="flex items-center justify-between">
                      <p className="font-extrabold text-sm text-[#004643] dark:text-white truncate">
                        {user.full_name}
                      </p>
                      <span className="text-[9px] font-black uppercase px-2 py-0.5 rounded-full bg-[#004643] dark:bg-emerald-600 text-[#F0EDE5]">
                        {isAdmin ? "Admin" : "Customer"}
                      </span>
                    </div>
                    <p className="text-xs text-gray-600 dark:text-gray-300 truncate font-medium">
                      {user.email}
                    </p>
                  </div>

                  {/* Dropdown Menu Options */}
                  <div className="py-2 px-2 space-y-1 text-xs font-bold">
                    <Link
                      href="/dashboard"
                      onClick={() => setUserDropdownOpen(false)}
                      className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl hover:bg-[#F0EDE5] dark:hover:bg-emerald-950/60 text-[#004643] dark:text-[#F0EDE5] transition-colors"
                    >
                      <svg className="w-4 h-4 fill-current text-[#004643] dark:text-emerald-400" viewBox="0 0 20 20">
                        <path d="M5 3a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2V5a2 2 0 00-2-2H5zM5 11a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2v-2a2 2 0 00-2-2H5zM11 5a2 2 0 002-2h2a2 2 0 002 2v2a2 2 0 00-2 2h-2a2 2 0 00-2-2V5zM11 13a2 2 0 002-2h2a2 2 0 002 2v2a2 2 0 00-2 2h-2a2 2 0 00-2-2v-2z" />
                      </svg>
                      <span>My Bookings</span>
                    </Link>

                    {isAdmin && (
                      <Link
                        href="/admin"
                        onClick={() => setUserDropdownOpen(false)}
                        className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl hover:bg-[#F0EDE5] dark:hover:bg-emerald-950/60 text-[#004643] dark:text-[#F0EDE5] transition-colors"
                      >
                        <svg className="w-4 h-4 fill-current text-[#004643] dark:text-emerald-400" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 1.944A11.954 11.954 0 012.166 5C2.056 5.649 2 6.319 2 7c0 5.225 3.34 9.67 8 11.317C14.66 16.67 18 12.225 18 7c0-.682-.057-1.35-.166-2A11.954 11.954 0 0110 1.944z" clipRule="evenodd" />
                        </svg>
                        <span>Admin Management Portal</span>
                      </Link>
                    )}

                    <button
                      type="button"
                      onClick={() => {
                        setUserDropdownOpen(false);
                        logout();
                      }}
                      className="w-full text-left flex items-center gap-2.5 px-3 py-2.5 rounded-xl hover:bg-rose-50 dark:hover:bg-rose-950/40 text-rose-600 dark:text-rose-400 transition-colors"
                    >
                      <svg className="w-4 h-4 fill-current text-rose-600 dark:text-rose-400" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M3 3a1 1 0 00-1 1v12a1 1 0 001 1h12a1 1 0 001-1V4a1 1 0 00-1-1H3zm11 4.414l-4.293 4.293a1 1 0 01-1.414-1.414L11.586 7H7a1 1 0 110-2h4.586L8.293 1.707a1 1 0 011.414-1.414L14 4.586v2.828z" clipRule="evenodd" />
                      </svg>
                      <span>Log Out Session</span>
                    </button>
                  </div>

                </div>
              )}
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Link
                href="/login"
                className="text-xs font-bold text-[#F0EDE5] hover:text-white px-3 py-2 transition-colors"
              >
                Sign In
              </Link>
              <Link
                href="/register"
                className="bg-[#F0EDE5] text-[#004643] hover:bg-white font-black px-4 py-2.5 rounded-xl text-xs shadow-md transition-all"
              >
                Book EV Now
              </Link>
            </div>
          )}
        </div>

        {/* Mobile Menu Button & Icon-Only Theme Toggle */}
        <div className="flex items-center gap-2 lg:hidden">
          <button
            type="button"
            onClick={toggleTheme}
            className="p-2.5 rounded-xl bg-white/10 text-[#F0EDE5] border border-white/20 flex items-center justify-center"
          >
            {theme === "dark" ? (
              <svg className="w-5 h-5 text-amber-300 fill-current" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 100 2h1z" clipRule="evenodd" />
              </svg>
            ) : (
              <svg className="w-5 h-5 text-slate-200 fill-current" viewBox="0 0 20 20">
                <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
              </svg>
            )}
          </button>

          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="text-[#F0EDE5] hover:text-white p-2 rounded-lg"
          >
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              {mobileMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>

      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-[#004643] border-t border-white/10 px-4 pt-2 pb-6 space-y-2 text-sm font-semibold text-[#F0EDE5]">
          <button
            onClick={() => scrollToSection("services")}
            className="block w-full text-left py-2 hover:text-white"
          >
            Services
          </button>
          <button
            onClick={() => scrollToSection("fleet")}
            className="block w-full text-left py-2 hover:text-white"
          >
            Our Fleet
          </button>
          <button
            onClick={() => scrollToSection("why-us")}
            className="block w-full text-left py-2 hover:text-white"
          >
            Why Choose Us
          </button>
          <button
            onClick={() => scrollToSection("how-it-works")}
            className="block w-full text-left py-2 hover:text-white"
          >
            How It Works
          </button>
          <button
            onClick={() => scrollToSection("reviews")}
            className="block w-full text-left py-2 hover:text-white"
          >
            Customer Reviews
          </button>
          <Link
            href="/vehicles"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-2 text-white font-extrabold underline"
          >
            Browse All Vehicles
          </Link>

          <div className="pt-4 border-t border-white/10 flex flex-col gap-2">
            {isAuthenticated && user ? (
              <>
                <div className="py-2 text-[#F0EDE5] font-bold border-b border-white/10 pb-2">
                  Account: {user.full_name} ({user.email})
                </div>
                <Link
                  href="/dashboard"
                  onClick={() => setMobileMenuOpen(false)}
                  className="py-2 text-[#F0EDE5]"
                >
                  My Bookings
                </Link>
                {isAdmin && (
                  <Link
                    href="/admin"
                    onClick={() => setMobileMenuOpen(false)}
                    className="py-2 text-white font-bold"
                  >
                    Admin Management Portal
                  </Link>
                )}
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    logout();
                  }}
                  className="text-left py-2 text-rose-300 font-bold"
                >
                  Log Out
                </button>
              </>
            ) : (
              <div className="flex flex-col gap-2 pt-2">
                <Link
                  href="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full text-center py-2.5 bg-white/10 text-white rounded-xl text-xs font-bold"
                >
                  Sign In
                </Link>
                <Link
                  href="/register"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full text-center py-2.5 bg-[#F0EDE5] text-[#004643] font-black rounded-xl text-xs"
                >
                  Book EV Now
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
