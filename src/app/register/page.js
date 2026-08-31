"use client";

// ─── Register Page — /register ─────────────────────────────────────────────
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
    path: ["confirm_password"],
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
      router.push("/vehicles");
    } catch (err) {
      setServerError(err.message || "Failed to create account. Please try again.");
    }
  };

  return (
    <div className="min-h-[85vh] bg-[#F0EDE5] flex items-center justify-center px-4 py-12 text-[#004643]">
      <div className="bg-white p-8 sm:p-10 rounded-3xl border border-[#004643]/20 shadow-2xl max-w-md w-full space-y-6">

        {/* Header */}
        <div className="text-center space-y-2">
          <div className="w-12 h-12 bg-[#004643] text-[#F0EDE5] rounded-2xl flex items-center justify-center text-xl font-black mx-auto shadow-md">
            <svg className="w-6 h-6 fill-current" viewBox="0 0 24 24">
              <path d="M15 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm-9-2V7H4v3H1v2h3v3h2v-3h3v-2H6zm9 4c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
            </svg>
          </div>
          <h1 className="text-2xl font-black text-[#004643]">Create Account</h1>
          <p className="text-xs text-gray-600 font-medium">
            Sign up to reserve and ride Evora electric scooters.
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
            <label className="block mb-1 text-gray-700">Full Name</label>
            <input
              type="text"
              placeholder="John Doe"
              {...register("full_name")}
              className="w-full p-3.5 rounded-2xl border border-[#004643]/20 bg-[#F0EDE5]/50 focus:outline-none focus:border-[#004643] text-xs font-medium"
            />
            {errors.full_name && <p className="text-rose-600 text-[11px] mt-1">{errors.full_name.message}</p>}
          </div>

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

          <div>
            <label className="block mb-1 text-gray-700">Confirm Password</label>
            <input
              type="password"
              placeholder="••••••••"
              {...register("confirm_password")}
              className="w-full p-3.5 rounded-2xl border border-[#004643]/20 bg-[#F0EDE5]/50 focus:outline-none focus:border-[#004643] text-xs font-medium"
            />
            {errors.confirm_password && <p className="text-rose-600 text-[11px] mt-1">{errors.confirm_password.message}</p>}
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-3.5 bg-[#004643] hover:bg-[#003633] text-[#F0EDE5] font-black rounded-2xl text-xs shadow-md transition-all mt-2"
          >
            {isSubmitting ? "Creating Account..." : "Create Free Account"}
          </button>
        </form>

        {/* Footer */}
        <div className="text-center text-xs text-gray-600 font-medium pt-2 border-t border-[#004643]/10">
          Already have an account?{" "}
          <Link href="/login" className="text-[#004643] font-black hover:underline">
            Sign in here
          </Link>
        </div>

      </div>
    </div>
  );
}
