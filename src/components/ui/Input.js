"use client";

// ─── Feature 3: Reusable UI Component — Input ──────────────────────────────
//
// Form input component compatible with standard inputs and React Hook Form.
// Includes styled label, error message display, and focus ring transitions.
//
// ────────────────────────────────────────────────────────────────────────────

import React, { forwardRef } from "react";

const Input = forwardRef(function Input(
  { label, error, type = "text", placeholder, required = false, className = "", ...props },
  ref
) {
  return (
    <div className="w-full space-y-1.5">
      {label && (
        <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider">
          {label} {required && <span className="text-red-500">*</span>}
        </label>
      )}

      <input
        ref={ref}
        type={type}
        placeholder={placeholder}
        className={`w-full px-4 py-3 rounded-xl border bg-white text-sm text-gray-900 transition-all outline-none placeholder:text-gray-400 ${
          error
            ? "border-red-400 focus:border-red-500 focus:ring-2 focus:ring-red-100"
            : "border-gray-300 focus:border-sky-500 focus:ring-2 focus:ring-sky-100"
        } ${className}`}
        {...props}
      />

      {error && (
        <p className="text-xs text-red-500 font-medium flex items-center gap-1 mt-1">
          <span>⚠️</span> {error}
        </p>
      )}
    </div>
  );
});

export default Input;
