"use client";

// ─── Login Page — /login ───────────────────────────────────────────────────
// Applied Cyprus (#004643) & Sand Dune (#F0EDE5) theme.
// Emojis removed.
//
// ────────────────────────────────────────────────────────────────────────────

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useAuth } from "@/context/AuthContext";

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
      router.push("/vehicles");
    } catch (err) {
      setServerError(err.message || "Invalid email or password.");
    }
  };

  return (
    <div className="min-h-[85vh] bg-[#F0EDE5] flex items-center justify-center px-4 py-12 text-[#004643]">
      <div className="bg-white p-8 sm:p-10 rounded-3xl border border-[#004643]/20 shadow-2xl max-w-md w-full space-y-6">

        {/* Header */}
        <div className="text-center space-y-2">
          <div className="w-12 h-12 bg-[#004643] text-[#F0EDE5] rounded-2xl flex items-center justify-center text-xl font-black mx-auto shadow-md">
            <svg className="w-6 h-6 fill-current" viewBox="0 0 24 24">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm0 14.2c-2.5 0-4.71-1.28-6-3.22.03-1.99 4-3.08 6-3.08 1.99 0 5.97 1.09 6 3.08-1.29 1.94-3.5 3.22-6 3.22z" />
            </svg>
          </div>
          <h1 className="text-2xl font-black text-[#004643]">Welcome Back</h1>
          <p className="text-xs text-gray-600 font-medium">
            Sign in to manage your rentals and bookings.
          </p>
        </div>

        {/* Error Alert */}
        {serverError && (
          <div className="bg-rose-50 border border-rose-200 text-rose-800 text-xs p-3.5 rounded-2xl font-bold">
            {serverError}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 text-xs font-bold">
          <div>
            <label className="block mb-1 text-gray-700">Email Address</label>
            <input
              type="email"
              placeholder="john@example.com"
              {...register("email")}
              className="w-full p-3.5 rounded-2xl border border-[#004643]/20 bg-[#F0EDE5]/50 focus:outline-none focus:border-[#004643] text-xs font-medium"
            />
            {errors.email && <p className="text-rose-600 text-[11px] mt-1">{errors.email.message}</p>}
          </div>

          <div>
            <label className="block mb-1 text-gray-700">Password</label>
            <input
              type="password"
              placeholder="••••••••"
              {...register("password")}
              className="w-full p-3.5 rounded-2xl border border-[#004643]/20 bg-[#F0EDE5]/50 focus:outline-none focus:border-[#004643] text-xs font-medium"
            />
            {errors.password && <p className="text-rose-600 text-[11px] mt-1">{errors.password.message}</p>}
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-3.5 bg-[#004643] hover:bg-[#003633] text-[#F0EDE5] font-black rounded-2xl text-xs shadow-md transition-all mt-2"
          >
            {isSubmitting ? "Signing in..." : "Sign In to Account"}
          </button>
        </form>

        {/* Footer */}
        <div className="text-center text-xs text-gray-600 font-medium pt-2 border-t border-[#004643]/10">
          Don&apos;t have an account?{" "}
          <Link href="/register" className="text-[#004643] font-black hover:underline">
            Sign up now
          </Link>
        </div>

      </div>
    </div>
  );
}
