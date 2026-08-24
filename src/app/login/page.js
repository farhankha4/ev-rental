"use client";

// ─── Feature 3: Login Page — /login ────────────────────────────────────────
//
// Authenticates existing users with email and password using Zod schema
// validation and React Hook Form.
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

const loginSchema = z.object({
  email: z.string().email("Please enter a valid email address."),
  password: z.string().min(1, "Password is required."),
});

export default function LoginPage() {
  const [serverError, setServerError] = useState("");
  const { login: loginAuth } = useAuth();
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data) => {
    setServerError("");
    try {
      await loginAuth({
        email: data.email,
        password: data.password,
      });

      // Redirect to vehicles catalog upon login
      router.push("/vehicles");
    } catch (err) {
      setServerError(err.message || "Invalid email or password.");
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <div className="bg-white p-8 sm:p-10 rounded-3xl border border-gray-200 shadow-sm max-w-md w-full space-y-6">

        {/* ── Header ──────────────────────────────────────────────────────── */}
        <div className="text-center space-y-2">
          <span className="text-4xl">🔐</span>
          <h1 className="text-2xl font-extrabold text-gray-900">Welcome back</h1>
          <p className="text-xs text-gray-500">
            Log in to manage your bookings and rentals.
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
            label="Email Address"
            type="email"
            placeholder="john@example.com"
            required
            error={errors.email?.message}
            {...register("email")}
          />

          <Input
            label="Password"
            type="password"
            placeholder="••••••••"
            required
            error={errors.password?.message}
            {...register("password")}
          />

          <Button
            type="submit"
            variant="primary"
            fullWidth
            isLoading={isSubmitting}
            className="mt-2"
          >
            Log In
          </Button>
        </form>

        {/* ── Footer ──────────────────────────────────────────────────────── */}
        <div className="text-center text-xs text-gray-500 pt-2 border-t border-gray-100">
          Don&apos;t have an account?{" "}
          <Link href="/register" className="text-sky-600 font-semibold hover:underline">
            Sign up now
          </Link>
        </div>

      </div>
    </div>
  );
}
