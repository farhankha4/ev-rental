"use client";

// ─── Feature 3: Register Page — /register ──────────────────────────────────
//
// Allows new users to create an account with full schema validation powered
// by Zod and React Hook Form.
//
// Validation rules:
//   - Full Name: At least 2 characters
//   - Email: Valid email format
//   - Password: Minimum 6 characters
//   - Confirm Password: Must match password exactly
//   - Phone: Optional phone number
//
// ────────────────────────────────────────────────────────────────────────────

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useAuth } from "@/context/AuthContext";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";

// ─── Zod Schema for Client-Side Validation ──────────────────────────────────
const registerSchema = z
  .object({
    full_name: z.string().min(2, "Full name must be at least 2 characters."),
    email: z.string().email("Please enter a valid email address."),
    phone: z.string().optional(),
    password: z.string().min(6, "Password must be at least 6 characters long."),
    confirm_password: z.string(),
  })
  .refine((data) => data.password === data.confirm_password, {
    message: "Passwords do not match.",
    path: ["confirm_password"], // Error applies to confirm_password input
  });

export default function RegisterPage() {
  const [serverError, setServerError] = useState("");
  const { register: registerAuth } = useAuth();
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      full_name: "",
      email: "",
      phone: "",
      password: "",
      confirm_password: "",
    },
  });

  const onSubmit = async (data) => {
    setServerError("");
    try {
      await registerAuth({
        full_name: data.full_name,
        email: data.email,
        phone: data.phone,
        password: data.password,
      });

      // Redirect to vehicles catalog upon successful registration
      router.push("/vehicles");
    } catch (err) {
      setServerError(err.message || "Failed to create account. Please try again.");
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center px-4 py-12">
      <div className="bg-white p-8 sm:p-10 rounded-3xl border border-gray-200 shadow-sm max-w-md w-full space-y-6">

        {/* ── Header ──────────────────────────────────────────────────────── */}
        <div className="text-center space-y-2">
          <span className="text-4xl">⚡</span>
          <h1 className="text-2xl font-extrabold text-gray-900">Create your account</h1>
          <p className="text-xs text-gray-500">
            Sign up to reserve and ride SwiftVolt electric scooters.
          </p>
        </div>

        {/* ── Server Error Alert ──────────────────────────────────────────── */}
        {serverError && (
          <div className="bg-red-50 border border-red-200 text-red-700 text-xs p-3.5 rounded-xl flex items-start gap-2">
            <span>⚠️</span>
            <span>{serverError}</span>
          </div>
        )}

        {/* ── Form ────────────────────────────────────────────────────────── */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <Input
            label="Full Name"
            placeholder="John Doe"
            required
            error={errors.full_name?.message}
            {...register("full_name")}
          />

          <Input
            label="Email Address"
            type="email"
            placeholder="john@example.com"
            required
            error={errors.email?.message}
            {...register("email")}
          />

          <Input
            label="Phone Number (Optional)"
            type="tel"
            placeholder="+91 98765 43210"
            error={errors.phone?.message}
            {...register("phone")}
          />

          <Input
            label="Password"
            type="password"
            placeholder="••••••••"
            required
            error={errors.password?.message}
            {...register("password")}
          />

          <Input
            label="Confirm Password"
            type="password"
            placeholder="••••••••"
            required
            error={errors.confirm_password?.message}
            {...register("confirm_password")}
          />

          <Button
            type="submit"
            variant="primary"
            fullWidth
            isLoading={isSubmitting}
            className="mt-2"
          >
            Create Account
          </Button>
        </form>

        {/* ── Footer ──────────────────────────────────────────────────────── */}
        <div className="text-center text-xs text-gray-500 pt-2 border-t border-gray-100">
          Already have an account?{" "}
          <Link href="/login" className="text-sky-600 font-semibold hover:underline">
            Log in here
          </Link>
        </div>

      </div>
    </div>
  );
}
