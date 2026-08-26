"use client";

// ─── Feature 9: Custom Hook — useReviews ─────────────────────────────────────
//
// What this file is:
//   Custom React hook utilizing TanStack Query to fetch customer reviews, rating scores,
//   and submit new reviews for a scooter.
//
// Which feature & part:
//   Feature 9 (Reviews & Ratings) — Data Hook
//
// Usage:
//   const { summary, isLoading, isError, submitReview } = useReviews(vehicleId);
//
// ────────────────────────────────────────────────────────────────────────────

import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/context/AuthContext";

async function fetchVehicleReviews(vehicleId) {
  if (!vehicleId) return null;

  const res = await fetch(`/api/vehicles/${vehicleId}/reviews`);
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error || `Failed to fetch reviews (${res.status})`);
  }

  return res.json();
}

export function useReviews(vehicleId) {
  const { token, isAuthenticated } = useAuth();

  const { data, isLoading, isError, error, refetch } = useQuery({
    queryKey: ["reviews", vehicleId],
    queryFn: () => fetchVehicleReviews(vehicleId),
    enabled: Boolean(vehicleId),
    staleTime: 1000 * 60 * 2, // 2 minutes
  });

  const submitReview = async ({ rating, comment }) => {
    if (!isAuthenticated || !token) {
      throw new Error("Please log in to submit a review.");
    }

    const res = await fetch(`/api/vehicles/${vehicleId}/reviews`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`,
      },
      body: JSON.stringify({ rating, comment }),
    });

    const resultData = await res.json();
    if (!res.ok) {
      throw new Error(resultData.error || "Failed to submit review.");
    }

    // Refetch reviews automatically after posting
    refetch();
    return resultData;
  };

  return {
    summary: data ?? { average_rating: 0, total_reviews: 0, rating_counts: { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 }, reviews: [] },
    isLoading,
    isError,
    errorMessage: error?.message,
    refetch,
    submitReview,
  };
}
