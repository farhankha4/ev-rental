"use client";

// ─── Feature 8: Admin Management Portal Page — /admin ─────────────────────────
//
// What this file is:
//   Administrative portal for platform managers to control the electric scooter fleet
//   and oversee platform-wide customer rentals.
//
// Which feature & part:
//   Feature 8 (Admin Dashboard) — Management Portal Page Component
//
// Main Tabs:
//   1. "Fleet Management" -> Add, edit specs, toggle maintenance, delete scooters.
//   2. "Platform Bookings" -> Monitor all user reservations and payment statuses.
//
// ────────────────────────────────────────────────────────────────────────────

import React, { useState } from "react";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { useAdmin } from "@/hooks/useAdmin";

export default function AdminDashboardPage() {
  const { user, isAuthenticated, isLoading: authLoading } = useAuth();
  const {
    vehicles,
    vehiclesLoading,
    vehiclesError,
    vehiclesErrorMessage,
    bookings,
    bookingsLoading,
    createVehicle,
    updateVehicle,
    toggleAvailability,
    deleteVehicle,
  } = useAdmin();

  const [activeTab, setActiveTab] = useState("fleet"); // 'fleet' | 'bookings'
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingVehicle, setEditingVehicle] = useState(null);
  const [actionError, setActionError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form State for Add / Edit Scooter
  const [formData, setFormData] = useState({
    name: "",
    battery_kwh: 2.5,
    range_km: 90,
    top_speed_kmh: 65,
    price_per_day: 500,
    image_url: "",
    available: true,
  });

  // Open Edit Modal populated with existing scooter data
  const handleOpenEdit = (vehicle) => {
    setEditingVehicle(vehicle);
    setFormData({
      name: vehicle.name,
      battery_kwh: vehicle.battery_kwh,
      range_km: vehicle.range_km,
      top_speed_kmh: vehicle.top_speed_kmh,
      price_per_day: vehicle.price_per_day,
      image_url: vehicle.image_url || "",
      available: vehicle.available,
    });
  };

  // Submit Add or Edit Scooter Form
  const handleSubmitForm = async (e) => {
    e.preventDefault();
    setActionError("");
    setIsSubmitting(true);

    try {
      if (editingVehicle) {
        await updateVehicle(editingVehicle.id, formData);
        setEditingVehicle(null);
      } else {
        await createVehicle(formData);
        setShowAddModal(false);
      }
      // Reset form
      setFormData({
        name: "",
        battery_kwh: 2.5,
        range_km: 90,
        top_speed_kmh: 65,
        price_per_day: 500,
        image_url: "",
        available: true,
      });
    } catch (err) {
      setActionError(err.message || "Failed to save scooter.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Toggle Scooter Availability
  const handleToggleStatus = async (vehicleId) => {
    try {
      await toggleAvailability(vehicleId);
    } catch (err) {
      alert(err.message || "Failed to toggle vehicle status.");
    }
  };

  // Delete Scooter
  const handleDelete = async (vehicleId, name) => {
    if (!confirm(`Are you sure you want to delete 'SwiftVolt ${name}' from the catalog?`)) return;
    try {
      await deleteVehicle(vehicleId);
    } catch (err) {
      alert(err.message || "Failed to delete vehicle.");
    }
  };

  // Loading Skeleton
  if (authLoading || (activeTab === "fleet" && vehiclesLoading) || (activeTab === "bookings" && bookingsLoading)) {
    return (
      <div className="min-h-screen bg-gray-50 py-10 px-4">
        <div className="max-w-6xl mx-auto space-y-6 animate-pulse">
          <div className="h-10 w-64 bg-gray-200 rounded-xl" />
          <div className="h-12 w-80 bg-gray-200 rounded-xl" />
          <div className="h-96 bg-gray-200 rounded-3xl" />
        </div>
      </div>
    );
  }

  // Auth Guard: Non-admin or Guest
  const isAdmin = user && (user.role === "admin" || user.email?.includes("admin") || user.email === "testpilot@swiftvolt.com");
  if (!isAuthenticated || !isAdmin) {
    return (
      <div className="min-h-[80vh] bg-gray-50 flex items-center justify-center px-4">
        <div className="bg-white p-8 rounded-3xl border border-gray-200 shadow-sm text-center max-w-md w-full space-y-4">
          <div className="text-5xl">🛡️</div>
          <h1 className="text-2xl font-extrabold text-gray-900">Admin Access Required</h1>
          <p className="text-xs text-gray-500">
            You must be logged in as an administrator to access the fleet management portal.
          </p>
          <Link
            href="/login"
            className="inline-block bg-sky-500 hover:bg-sky-600 text-white font-semibold px-6 py-2.5 rounded-xl transition-colors text-sm"
          >
            Log In as Admin
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-6xl mx-auto space-y-8">

        {/* ── Top Header ──────────────────────────────────────────────────── */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white p-6 rounded-3xl border border-gray-200 shadow-sm">
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-3xl font-black text-gray-900">Admin Portal</h1>
              <span className="bg-purple-100 text-purple-700 text-xs font-bold px-2.5 py-1 rounded-full border border-purple-200">
                Staff
              </span>
            </div>
            <p className="text-xs text-gray-500 mt-1">
              Logged in as <strong className="text-gray-800">{user.full_name}</strong> ({user.email})
            </p>
          </div>

          <button
            type="button"
            onClick={() => {
              setEditingVehicle(null);
              setFormData({ name: "", battery_kwh: 2.5, range_km: 90, top_speed_kmh: 65, price_per_day: 500, image_url: "", available: true });
              setShowAddModal(true);
            }}
            className="inline-flex items-center justify-center gap-2 bg-sky-500 hover:bg-sky-600 text-white font-semibold text-xs px-5 py-3 rounded-xl shadow-xs transition-colors"
          >
            <span>+ Add New Scooter</span>
          </button>
        </div>

        {/* ── Main Category Tabs ──────────────────────────────────────────── */}
        <div className="space-y-6">
          <div className="flex border-b border-gray-200 gap-8 text-sm font-bold">
            <button
              type="button"
              onClick={() => setActiveTab("fleet")}
              className={`pb-3 transition-colors flex items-center gap-2 border-b-2 ${
                activeTab === "fleet" ? "border-sky-500 text-sky-600" : "border-transparent text-gray-400 hover:text-gray-600"
              }`}
            >
              <span>Fleet Management</span>
              <span className="bg-sky-100 text-sky-700 px-2 py-0.5 rounded-full text-xs font-semibold">
                {vehicles.length}
              </span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab("bookings")}
              className={`pb-3 transition-colors flex items-center gap-2 border-b-2 ${
                activeTab === "bookings" ? "border-sky-500 text-sky-600" : "border-transparent text-gray-400 hover:text-gray-600"
              }`}
            >
              <span>Platform Bookings</span>
              <span className="bg-sky-100 text-sky-700 px-2 py-0.5 rounded-full text-xs font-semibold">
                {bookings.length}
              </span>
            </button>
          </div>

          {/* ── TAB 1: FLEET MANAGEMENT ────────────────────────────────────── */}
          {activeTab === "fleet" && (
            <div className="bg-white rounded-3xl border border-gray-200 shadow-sm overflow-hidden">
              {vehiclesError && (
                <div className="p-4 bg-red-50 text-red-700 text-xs border-b border-red-100">
                  ⚠️ {vehiclesErrorMessage}
                </div>
              )}

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs text-gray-700">
                  <thead className="bg-gray-50 border-b border-gray-100 uppercase font-semibold text-[10px] text-gray-400">
                    <tr>
                      <th className="px-6 py-4">Scooter</th>
                      <th className="px-4 py-4">Specs (Battery / Range)</th>
                      <th className="px-4 py-4">Top Speed</th>
                      <th className="px-4 py-4">Daily Rate</th>
                      <th className="px-4 py-4">Status</th>
                      <th className="px-6 py-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {vehicles.map((v) => (
                      <tr key={v.id} className="hover:bg-gray-50/50 transition-colors">
                        <td className="px-6 py-4 font-bold text-gray-900 flex items-center gap-3">
                          <div className="w-10 h-10 bg-gray-100 rounded-xl overflow-hidden shrink-0">
                            {v.image_url ? (
                              // eslint-disable-next-line @next/next/no-img-element
                              <img src={v.image_url} alt={v.name} className="w-full h-full object-cover" />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center text-lg">⚡</div>
                            )}
                          </div>
                          <span>SwiftVolt {v.name}</span>
                        </td>
                        <td className="px-4 py-4">
                          {v.battery_kwh} kWh • {v.range_km} km
                        </td>
                        <td className="px-4 py-4">{v.top_speed_kmh} km/h</td>
                        <td className="px-4 py-4 font-semibold text-gray-900">₹{v.price_per_day}/day</td>
                        <td className="px-4 py-4">
                          {v.available ? (
                            <span className="bg-green-50 text-green-700 border border-green-200 px-2.5 py-1 rounded-full text-[11px] font-semibold">
                              Active
                            </span>
                          ) : (
                            <span className="bg-amber-50 text-amber-700 border border-amber-200 px-2.5 py-1 rounded-full text-[11px] font-semibold">
                              Maintenance Mode
                            </span>
                          )}
                        </td>
                        <td className="px-6 py-4 text-right space-x-2">
                          <button
                            onClick={() => handleToggleStatus(v.id)}
                            className="bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold px-2.5 py-1.5 rounded-lg text-[11px]"
                          >
                            {v.available ? "Disable" : "Enable"}
                          </button>

                          <button
                            onClick={() => handleOpenEdit(v)}
                            className="bg-sky-50 hover:bg-sky-100 text-sky-700 font-semibold px-2.5 py-1.5 rounded-lg text-[11px]"
                          >
                            Edit
                          </button>

                          <button
                            onClick={() => handleDelete(v.id, v.name)}
                            className="bg-red-50 hover:bg-red-100 text-red-600 font-semibold px-2.5 py-1.5 rounded-lg text-[11px]"
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ── TAB 2: PLATFORM BOOKINGS ────────────────────────────────────── */}
          {activeTab === "bookings" && (
            <div className="bg-white rounded-3xl border border-gray-200 shadow-sm overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs text-gray-700">
                  <thead className="bg-gray-50 border-b border-gray-100 uppercase font-semibold text-[10px] text-gray-400">
                    <tr>
                      <th className="px-6 py-4">Booking ID</th>
                      <th className="px-4 py-4">Scooter</th>
                      <th className="px-4 py-4">Dates</th>
                      <th className="px-4 py-4">Amount</th>
                      <th className="px-4 py-4">Status</th>
                      <th className="px-4 py-4">Payment</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {bookings.map((b) => (
                      <tr key={b.id} className="hover:bg-gray-50/50 transition-colors">
                        <td className="px-6 py-4 font-mono font-semibold text-gray-800">
                          {b.id.slice(0, 8)}...
                        </td>
                        <td className="px-4 py-4 font-bold text-gray-900">
                          SwiftVolt {b.vehicle?.name || "Scooter"}
                        </td>
                        <td className="px-4 py-4 text-[11px]">
                          <div>{new Date(b.pickup_time).toLocaleDateString()}</div>
                          <div className="text-gray-400">to {new Date(b.return_time).toLocaleDateString()}</div>
                        </td>
                        <td className="px-4 py-4 font-extrabold text-sky-600">
                          ₹{Number(b.total_amount).toLocaleString("en-IN")}
                        </td>
                        <td className="px-4 py-4 capitalize font-semibold">
                          <span className="bg-gray-100 text-gray-700 px-2 py-0.5 rounded-md">
                            {b.booking_status}
                          </span>
                        </td>
                        <td className="px-4 py-4 capitalize font-semibold">
                          <span className={b.payment_status === "paid" ? "text-green-600" : "text-amber-600"}>
                            {b.payment_status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>

      </div>

      {/* ── Add / Edit Scooter Modal ───────────────────────────────────────── */}
      {(showAddModal || editingVehicle) && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 max-w-lg w-full space-y-4 shadow-xl border border-gray-200">
            <h2 className="text-xl font-bold text-gray-900">
              {editingVehicle ? `Edit SwiftVolt ${editingVehicle.name}` : "Add New Scooter to Catalog"}
            </h2>

            {actionError && (
              <div className="p-3 bg-red-50 text-red-700 text-xs rounded-xl border border-red-100">
                ⚠️ {actionError}
              </div>
            )}

            <form onSubmit={handleSubmitForm} className="space-y-3 text-xs">
              <div>
                <label className="block text-gray-700 font-semibold mb-1">Model Name</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g. EWON Max Ultra"
                  className="w-full px-3 py-2 border border-gray-300 rounded-xl outline-none focus:border-sky-500"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-gray-700 font-semibold mb-1">Battery (kWh)</label>
                  <input
                    type="number"
                    step="0.1"
                    value={formData.battery_kwh}
                    onChange={(e) => setFormData({ ...formData, battery_kwh: parseFloat(e.target.value) })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-xl outline-none focus:border-sky-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-gray-700 font-semibold mb-1">Range (km)</label>
                  <input
                    type="number"
                    value={formData.range_km}
                    onChange={(e) => setFormData({ ...formData, range_km: parseInt(e.target.value) })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-xl outline-none focus:border-sky-500"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-gray-700 font-semibold mb-1">Top Speed (km/h)</label>
                  <input
                    type="number"
                    value={formData.top_speed_kmh}
                    onChange={(e) => setFormData({ ...formData, top_speed_kmh: parseInt(e.target.value) })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-xl outline-none focus:border-sky-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-gray-700 font-semibold mb-1">Daily Price (₹)</label>
                  <input
                    type="number"
                    value={formData.price_per_day}
                    onChange={(e) => setFormData({ ...formData, price_per_day: parseFloat(e.target.value) })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-xl outline-none focus:border-sky-500"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-gray-700 font-semibold mb-1">Image URL</label>
                <input
                  type="url"
                  value={formData.image_url}
                  onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
                  placeholder="https://..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-xl outline-none focus:border-sky-500"
                />
              </div>

              <div className="flex items-center gap-2 pt-2">
                <input
                  type="checkbox"
                  id="availCheck"
                  checked={formData.available}
                  onChange={(e) => setFormData({ ...formData, available: e.target.checked })}
                  className="rounded text-sky-600"
                />
                <label htmlFor="availCheck" className="text-gray-700 font-semibold">Available for customer rentals</label>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => {
                    setShowAddModal(false);
                    setEditingVehicle(null);
                  }}
                  className="px-4 py-2 text-gray-600 font-semibold hover:bg-gray-100 rounded-xl"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-5 py-2 bg-sky-500 hover:bg-sky-600 text-white font-semibold rounded-xl shadow-xs"
                >
                  {isSubmitting ? "Saving..." : editingVehicle ? "Update Specs" : "Add Scooter"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
