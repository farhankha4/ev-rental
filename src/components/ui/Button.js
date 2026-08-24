"use client";

// ─── Feature 3: Reusable UI Component — Button ─────────────────────────────
//
// Versatile button component supporting loading spinner state, primary &
// secondary color themes, and full-width rendering.
//
// ────────────────────────────────────────────────────────────────────────────

import React from "react";

export default function Button({
  children,
  type = "button",
  variant = "primary",
  isLoading = false,
  disabled = false,
  fullWidth = false,
  className = "",
  onClick,
  ...props
}) {
  const baseStyles = "inline-flex items-center justify-center font-semibold rounded-xl text-sm transition-all duration-150 py-3 px-5 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed";

  const variants = {
    primary: "bg-sky-500 hover:bg-sky-600 active:bg-sky-700 text-white shadow-sm shadow-sky-200",
    secondary: "bg-white hover:bg-gray-50 active:bg-gray-100 text-gray-700 border border-gray-300",
    danger: "bg-red-500 hover:bg-red-600 text-white",
  };

  return (
    <button
      type={type}
      disabled={disabled || isLoading}
      onClick={onClick}
      className={`${baseStyles} ${variants[variant] || variants.primary} ${fullWidth ? "w-full" : ""} ${className}`}
      {...props}
    >
      {isLoading ? (
        <div className="flex items-center gap-2">
          <span className="w-4 h-4 border-2 border-white/60 border-t-white rounded-full animate-spin" />
          <span>Processing...</span>
        </div>
      ) : (
        children
      )}
    </button>
  );
}
