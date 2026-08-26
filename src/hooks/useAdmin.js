"use client";

// ─── Feature 8: Custom Admin Hook — useAdmin ─────────────────────────────────
//
// What this file is:
//   Custom React hook utilizing TanStack Query for administrative actions:
//     • Fetching all fleet vehicles (including disabled models).
//     • Fetching platform-wide user bookings.
//     • Helper functions for creating, updating, toggling maintenance, and deleting vehicles.
//
// Which feature & part:
//   Feature 8 (Admin Dashboard) — Data Hook
//
// ────────────────────────────────────────────────────────────────────────────

import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/context/AuthContext";

async function fetchAdminVehicles(token) {
  if (!token) return [];
  const res = await fetch("/api/admin/vehicles", {
    headers: { "Authorization": `Bearer ${token}` },
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error || `Failed to load fleet vehicles (${res.status})`);
  }
  return res.json();
}

async function fetchAdminBookings(token) {
  if (!token) return [];
  const res = await fetch("/api/admin/bookings", {
    headers: { "Authorization": `Bearer ${token}` },
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error || `Failed to load platform bookings (${res.status})`);
  }
  return res.json();
}

export function useAdmin() {
  const { token, isAuthenticated } = useAuth();

  // Fleet Vehicles Query
  const vehiclesQuery = useQuery({
    queryKey: ["admin-vehicles"],
    queryFn: () => fetchAdminVehicles(token),
    enabled: Boolean(isAuthenticated && token),
    staleTime: 1000 * 30, // 30 seconds
  });

  // Platform Bookings Query
  const bookingsQuery = useQuery({
    queryKey: ["admin-bookings"],
    queryFn: () => fetchAdminBookings(token),
    enabled: Boolean(isAuthenticated && token),
    staleTime: 1000 * 30,
  });

  // Action: Create Vehicle
  const createVehicle = async (vehicleData) => {
    const res = await fetch("/api/admin/vehicles", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(vehicleData),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || "Failed to create vehicle.");
    vehiclesQuery.refetch();
    return data;
  };

  // Action: Update Vehicle
  const updateVehicle = async (vehicleId, vehicleData) => {
    const res = await fetch(`/api/admin/vehicles/${vehicleId}`, {
      method: "PUT",
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(vehicleData),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || "Failed to update vehicle.");
    vehiclesQuery.refetch();
    return data;
  };

  // Action: Toggle Maintenance Availability
  const toggleAvailability = async (vehicleId) => {
    const res = await fetch(`/api/admin/vehicles/${vehicleId}/toggle-availability`, {
      method: "PATCH",
      headers: { "Authorization": `Bearer ${token}` },
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || "Failed to toggle availability.");
    vehiclesQuery.refetch();
    return data;
  };

  // Action: Delete Vehicle
  const deleteVehicle = async (vehicleId) => {
    const res = await fetch(`/api/admin/vehicles/${vehicleId}`, {
      method: "DELETE",
      headers: { "Authorization": `Bearer ${token}` },
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || "Failed to delete vehicle.");
    vehiclesQuery.refetch();
    return data;
  };

  return {
    vehicles: vehiclesQuery.data ?? [],
    vehiclesLoading: vehiclesQuery.isLoading,
    vehiclesError: vehiclesQuery.isError,
    vehiclesErrorMessage: vehiclesQuery.error?.message,

    bookings: bookingsQuery.data ?? [],
    bookingsLoading: bookingsQuery.isLoading,
    bookingsError: bookingsQuery.isError,
    bookingsErrorMessage: bookingsQuery.error?.message,

    refetchVehicles: vehiclesQuery.refetch,
    refetchBookings: bookingsQuery.refetch,

    createVehicle,
    updateVehicle,
    toggleAvailability,
    deleteVehicle,
  };
}
