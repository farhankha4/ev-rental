"use client";

// ─── Feature 9: UI Component — VehicleReviews ────────────────────────────────
//
// What this file is:
//   An interactive component rendered on the scooter detail profile page (/vehicles/[id]).
//   Displays customer ratings, star breakdowns, review cards, and a review submission form.
//
// Which feature & part:
//   Feature 9 (Reviews & Ratings) — UI Component
//
// Props:
//   vehicleId -> UUID of the scooter currently viewed
//
// ────────────────────────────────────────────────────────────────────────────

import React, { useState } from "react";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { useReviews } from "@/hooks/useReviews";

export default function VehicleReviews({ vehicleId }) {
  const { isAuthenticated } = useAuth();
  const { summary, isLoading, isError, errorMessage, submitReview } = useReviews(vehicleId);

  const [rating, setRating] = useState(5);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState("");
  const [formSuccess, setFormSuccess] = useState(false);

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setFormError("");
    setFormSuccess(false);

    if (!comment.trim()) {
      setFormError("Please enter a comment for your review.");
      return;
    }

    setIsSubmitting(true);
    try {
      await submitReview({ rating, comment });
      setFormSuccess(true);
      setComment("");
      setRating(5);
    } catch (err) {
      setFormError(err.message || "Could not submit review.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="bg-white rounded-3xl p-8 border border-gray-200 shadow-sm animate-pulse space-y-4">
        <div className="h-8 w-48 bg-gray-200 rounded-xl" />
        <div className="h-24 bg-gray-100 rounded-2xl" />
      </div>
    );
  }

  const { average_rating, total_reviews, rating_counts, reviews } = summary;

  return (
    <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-200 shadow-sm space-y-8">
      
      {/* ── Section Header ──────────────────────────────────────────────── */}
      <div className="border-b border-gray-100 pb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-extrabold text-gray-900">
            Customer Reviews & Ratings
          </h2>
          <p className="text-xs text-gray-500 mt-1">
            Real feedback from verified SwiftVolt electric scooter riders.
          </p>
        </div>

        {/* Big Average Score Badge */}
        <div className="flex items-center gap-3 bg-amber-50 border border-amber-200 px-4 py-2.5 rounded-2xl self-start sm:self-auto">
          <span className="text-3xl font-black text-amber-600">
            {total_reviews > 0 ? average_rating.toFixed(1) : "N/A"}
          </span>
          <div>
            <div className="flex text-amber-500 text-sm">
              {"★".repeat(Math.round(average_rating)) || "★★★★★"}
            </div>
            <p className="text-[11px] text-amber-800 font-semibold mt-0.5">
              {total_reviews} {total_reviews === 1 ? "review" : "reviews"}
            </p>
          </div>
        </div>
      </div>

      {/* ── Star Breakdown Bars ───────────────────────────────────────────── */}
      {total_reviews > 0 && (
        <div className="bg-gray-50/70 p-5 rounded-2xl border border-gray-100 space-y-2 max-w-md text-xs">
          {[5, 4, 3, 2, 1].map((star) => {
            const count = rating_counts[star] || 0;
            const pct = total_reviews > 0 ? Math.round((count / total_reviews) * 100) : 0;
            return (
              <div key={star} className="flex items-center gap-3 text-gray-600">
                <span className="w-8 font-semibold text-right">{star} ★</span>
                <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-amber-400 rounded-full transition-all duration-300"
                    style={{ width: `${pct}%` }}
                  />
                </div>
                <span className="w-10 text-gray-400 text-right">{count}</span>
              </div>
            );
          })}
        </div>
      )}

      {/* ── Interactive Review Submission Form ────────────────────────────── */}
      <div className="bg-gray-50/90 rounded-2xl p-5 border border-gray-200 space-y-4">
        <h3 className="text-sm font-bold text-gray-900">
          Leave a Review for this Scooter
        </h3>

        {formSuccess && (
          <div className="bg-green-50 text-green-700 border border-green-200 text-xs p-3 rounded-xl">
            ✓ Thank you! Your review has been submitted successfully.
          </div>
        )}

        {formError && (
          <div className="bg-red-50 text-red-700 border border-red-200 text-xs p-3 rounded-xl">
            ⚠️ {formError}
          </div>
        )}

        {isAuthenticated ? (
          <form onSubmit={handleFormSubmit} className="space-y-4 text-xs">
            {/* Interactive Star Picker */}
            <div>
              <label className="block text-gray-700 font-semibold mb-1 uppercase tracking-wider text-[10px]">
                Your Rating
              </label>
              <div className="flex items-center gap-1 text-2xl cursor-pointer">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setRating(star)}
                    onMouseEnter={() => setHoverRating(star)}
                    onMouseLeave={() => setHoverRating(0)}
                    className="transition-transform hover:scale-110 focus:outline-none"
                  >
                    <span className={(hoverRating || rating) >= star ? "text-amber-400" : "text-gray-300"}>
                      ★
                    </span>
                  </button>
                ))}
                <span className="text-xs font-semibold text-gray-600 ml-2">
                  {rating} of 5 Stars
                </span>
              </div>
            </div>

            {/* Comment Box */}
            <div>
              <label className="block text-gray-700 font-semibold mb-1 uppercase tracking-wider text-[10px]">
                Your Feedback
              </label>
              <textarea
                rows={3}
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Share your experience regarding battery range, ride comfort, and acceleration..."
                className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 text-xs text-gray-900 outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500 bg-white"
                required
              />
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="bg-sky-500 hover:bg-sky-600 active:bg-sky-700 text-white font-semibold px-5 py-2.5 rounded-xl transition-colors shadow-xs disabled:opacity-50"
            >
              {isSubmitting ? "Submitting..." : "Submit Review"}
            </button>
          </form>
        ) : (
          <div className="text-xs text-gray-500 flex items-center justify-between">
            <span>Log in to share your experience with this scooter.</span>
            <Link href="/login" className="text-sky-600 font-bold hover:underline">
              Log In
            </Link>
          </div>
        )}
      </div>

      {/* ── Customer Review Cards List ────────────────────────────────────── */}
      <div className="space-y-4">
        <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider text-xs">
          Rider Reviews ({reviews.length})
        </h3>

        {reviews.length > 0 ? (
          <div className="space-y-3">
            {reviews.map((rev) => (
              <div key={rev.id} className="bg-white p-4 rounded-2xl border border-gray-100 shadow-xs space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    {/* User Avatar Initial */}
                    <div className="w-8 h-8 bg-sky-100 text-sky-800 font-bold rounded-full flex items-center justify-center text-xs">
                      {rev.user_name.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <p className="text-xs font-bold text-gray-900">{rev.user_name}</p>
                      <p className="text-[10px] text-gray-400">
                        {rev.created_at ? new Date(rev.created_at).toLocaleDateString() : "Verified Rider"}
                      </p>
                    </div>
                  </div>

                  {/* Star Rating Badge */}
                  <div className="bg-amber-50 border border-amber-200 text-amber-700 px-2.5 py-1 rounded-full text-xs font-bold flex items-center gap-1">
                    <span>{rev.rating}</span>
                    <span>★</span>
                  </div>
                </div>

                <p className="text-xs text-gray-700 leading-relaxed pt-1">
                  "{rev.comment}"
                </p>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-xs text-gray-400 italic">
            No customer reviews posted yet for this scooter model. Be the first to leave a review!
          </p>
        )}
      </div>

    </div>
  );
}
