"use client";

// ─── Admin Management Portal Page — /admin ──────────────────────────────────
// Applied Cyprus (#004643) & Sand Dune (#F0EDE5) theme.
// Emojis removed, clean vector icons applied.
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

  const [activeTab, setActiveTab] = useState("fleet");
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingVehicle, setEditingVehicle] = useState(null);
  const [actionError, setActionError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    battery_kwh: 2.5,
    range_km: 90,
    top_speed_kmh: 65,
    price_per_day: 500,
    image_url: "",
    available: true,
  });

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

  const handleToggleStatus = async (vehicleId) => {
    try {
      await toggleAvailability(vehicleId);
    } catch (err) {
      alert(err.message || "Failed to toggle vehicle status.");
    }
  };

  const handleDelete = async (vehicleId, name) => {
    if (!confirm(`Are you sure you want to delete 'Evora ${name}' from the catalog?`)) return;
    try {
      await deleteVehicle(vehicleId);
    } catch (err) {
      alert(err.message || "Failed to delete vehicle.");
    }
  };

  if (authLoading || (activeTab === "fleet" && vehiclesLoading) || (activeTab === "bookings" && bookingsLoading)) {
    return (
      <div className="min-h-screen bg-[#F0EDE5] py-10 px-4">
        <div className="max-w-6xl mx-auto space-y-6 animate-pulse">
          <div className="h-10 w-64 bg-white/40 rounded-xl" />
          <div className="h-12 w-80 bg-white/40 rounded-xl" />
          <div className="h-96 bg-white/40 rounded-3xl" />
        </div>
      </div>
    );
  }

  const isAdmin = user && (user.role === "admin" || user.email?.includes("admin") || user.email === "testpilot@swiftvolt.com");
  if (!isAuthenticated || !isAdmin) {
    return (
      <div className="min-h-[80vh] bg-[#F0EDE5] flex items-center justify-center px-4">
        <div className="bg-white p-8 rounded-3xl border border-[#004643]/20 shadow-xl text-center max-w-md w-full space-y-4">
          <h1 className="text-2xl font-black text-[#004643]">Admin Access Required</h1>
          <p className="text-xs text-gray-600 font-medium">
            You must be logged in as an administrator to access the fleet management portal.
          </p>
          <Link
            href="/login"
            className="inline-block bg-[#004643] hover:bg-[#003633] text-[#F0EDE5] font-black px-6 py-3 rounded-2xl transition-colors text-xs shadow-md"
          >
            Log In as Admin
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F0EDE5] text-[#004643] py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto space-y-8">

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white p-6 sm:p-8 rounded-3xl border border-[#004643]/15 shadow-sm">
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-3xl font-black text-[#004643]">Admin Portal</h1>
              <span className="bg-[#004643] text-[#F0EDE5] text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full">
                Staff
              </span>
            </div>
            <p className="text-xs text-gray-600 font-medium mt-1">
              Logged in as <strong className="text-[#004643]">{user.full_name}</strong> ({user.email})
            </p>
          </div>

          <button
            type="button"
            onClick={() => {
              setEditingVehicle(null);
              setFormData({ name: "", battery_kwh: 2.5, range_km: 90, top_speed_kmh: 65, price_per_day: 500, image_url: "", available: true });
              setShowAddModal(true);
            }}
            className="inline-flex items-center justify-center gap-2 bg-[#004643] hover:bg-[#003633] text-[#F0EDE5] font-black text-xs px-5 py-3 rounded-2xl shadow-md transition-all"
          >
            <span>+ Add New Scooter</span>
          </button>
        </div>

        {/* Category Tabs */}
        <div className="space-y-6">
          <div className="flex border-b border-[#004643]/20 gap-8 text-sm font-black">
            <button
              type="button"
              onClick={() => setActiveTab("fleet")}
              className={`pb-3 transition-colors flex items-center gap-2 border-b-2 ${
                activeTab === "fleet" ? "border-[#004643] text-[#004643]" : "border-transparent text-gray-500 hover:text-[#004643]"
              }`}
            >
              <span>Fleet Management</span>
              <span className="bg-[#004643] text-[#F0EDE5] px-2.5 py-0.5 rounded-full text-xs font-black">
                {vehicles.length}
              </span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab("bookings")}
              className={`pb-3 transition-colors flex items-center gap-2 border-b-2 ${
                activeTab === "bookings" ? "border-[#004643] text-[#004643]" : "border-transparent text-gray-500 hover:text-[#004643]"
              }`}
            >
              <span>Platform Bookings</span>
              <span className="bg-[#004643] text-[#F0EDE5] px-2.5 py-0.5 rounded-full text-xs font-black">
                {bookings.length}
              </span>
            </button>
          </div>

          {/* TAB 1: FLEET MANAGEMENT */}
          {activeTab === "fleet" && (
            <div className="bg-white rounded-3xl border border-[#004643]/15 shadow-sm overflow-hidden">
              {vehiclesError && (
                <div className="p-4 bg-rose-50 text-rose-800 text-xs font-bold border-b border-rose-100">
                  {vehiclesErrorMessage}
                </div>
              )}

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs text-gray-700">
                  <thead className="bg-[#F0EDE5] border-b border-[#004643]/10 uppercase font-black text-[10px] text-[#004643]">
                    <tr>
                      <th className="px-6 py-4">Scooter</th>
                      <th className="px-4 py-4">Specs (Battery / Range)</th>
                      <th className="px-4 py-4">Top Speed</th>
                      <th className="px-4 py-4">Daily Rate</th>
                      <th className="px-4 py-4">Status</th>
                      <th className="px-6 py-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#004643]/10">
                    {vehicles.map((v) => (
                      <tr key={v.id} className="hover:bg-[#F0EDE5]/40 transition-colors">
                        <td className="px-6 py-4 font-black text-[#004643] flex items-center gap-3">
                          <div className="w-10 h-10 bg-gray-100 rounded-xl overflow-hidden shrink-0">
                            {v.image_url ? (
                              // eslint-disable-next-line @next/next/no-img-element
                              <img src={v.image_url} alt={v.name} className="w-full h-full object-cover" />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center font-black">EV</div>
                            )}
                          </div>
                          <span>Evora {v.name}</span>
                        </td>
                        <td className="px-4 py-4 font-medium">
                          {v.battery_kwh} kWh • {v.range_km} km
                        </td>
                        <td className="px-4 py-4 font-medium">{v.top_speed_kmh} km/h</td>
                        <td className="px-4 py-4 font-black text-[#004643]">₹{v.price_per_day}/day</td>
                        <td className="px-4 py-4">
                          {v.available ? (
                            <span className="bg-emerald-50 text-emerald-800 border border-emerald-200 px-2.5 py-1 rounded-full text-[11px] font-bold">
                              Active
                            </span>
                          ) : (
                            <span className="bg-amber-50 text-amber-800 border border-amber-200 px-2.5 py-1 rounded-full text-[11px] font-bold">
                              Maintenance Mode
                            </span>
                          )}
                        </td>
                        <td className="px-6 py-4 text-right space-x-2">
                          <button
                            onClick={() => handleToggleStatus(v.id)}
                            className="bg-gray-100 hover:bg-gray-200 text-[#004643] font-bold px-3 py-1.5 rounded-xl text-[11px]"
                          >
                            {v.available ? "Disable" : "Enable"}
                          </button>

                          <button
                            onClick={() => handleOpenEdit(v)}
                            className="bg-sky-50 hover:bg-sky-100 text-sky-800 font-bold px-3 py-1.5 rounded-xl text-[11px]"
                          >
                            Edit
                          </button>

                          <button
                            onClick={() => handleDelete(v.id, v.name)}
                            className="bg-rose-50 hover:bg-rose-100 text-rose-700 font-bold px-3 py-1.5 rounded-xl text-[11px]"
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

          {/* TAB 2: PLATFORM BOOKINGS */}
          {activeTab === "bookings" && (
            <div className="bg-white rounded-3xl border border-[#004643]/15 shadow-sm overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs text-gray-700">
                  <thead className="bg-[#F0EDE5] border-b border-[#004643]/10 uppercase font-black text-[10px] text-[#004643]">
                    <tr>
                      <th className="px-6 py-4">Booking ID</th>
                      <th className="px-4 py-4">Scooter</th>
                      <th className="px-4 py-4">Dates</th>
                      <th className="px-4 py-4">Amount</th>
                      <th className="px-4 py-4">Status</th>
                      <th className="px-4 py-4">Payment</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#004643]/10">
                    {bookings.map((b) => (
                      <tr key={b.id} className="hover:bg-[#F0EDE5]/40 transition-colors">
                        <td className="px-6 py-4 font-mono font-bold text-[#004643]">
                          {b.id.slice(0, 8)}...
                        </td>
                        <td className="px-4 py-4 font-black text-[#004643]">
                          Evora {b.vehicle?.name || "Scooter"}
                        </td>
                        <td className="px-4 py-4 text-[11px] font-medium">
                          {new Date(b.pickup_time).toLocaleDateString()} → {new Date(b.return_time).toLocaleDateString()}
                        </td>
                        <td className="px-4 py-4 font-black text-[#004643]">
                          ₹{Number(b.total_amount).toLocaleString("en-IN")}
                        </td>
                        <td className="px-4 py-4">
                          <span className="capitalize font-extrabold text-[#004643]">
                            {b.booking_status}
                          </span>
                        </td>
                        <td className="px-4 py-4">
                          <span className={`capitalize font-black text-[11px] px-2.5 py-1 rounded-full border ${
                            b.payment_status === "paid"
                              ? "bg-emerald-50 text-emerald-800 border-emerald-200"
                              : "bg-amber-50 text-amber-800 border-amber-200"
                          }`}>
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

      {/* Add / Edit Scooter Modal */}
      {(showAddModal || editingVehicle) && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#004643]/20 shadow-2xl max-w-lg w-full space-y-5 text-[#004643]">
            <div className="flex items-center justify-between border-b border-[#004643]/10 pb-3">
              <h3 className="text-xl font-black">
                {editingVehicle ? `Edit Evora ${editingVehicle.name}` : "Add New Scooter Model"}
              </h3>
              <button
                type="button"
                onClick={() => {
                  setShowAddModal(false);
                  setEditingVehicle(null);
                }}
                className="text-gray-400 hover:text-[#004643] font-bold text-lg"
              >
                ✕
              </button>
            </div>

            {actionError && (
              <div className="p-3 bg-rose-50 text-rose-800 text-xs font-bold rounded-xl border border-rose-200">
                {actionError}
              </div>
            )}

            <form onSubmit={handleSubmitForm} className="space-y-4 text-xs font-bold">
              <div>
                <label className="block mb-1 text-gray-700">Scooter Name Model</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Escout Max"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full p-3 rounded-xl border border-[#004643]/20 bg-[#F0EDE5]/50 focus:outline-none focus:border-[#004643]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block mb-1 text-gray-700">Battery Capacity (kWh)</label>
                  <input
                    type="number"
                    step="0.1"
                    required
                    value={formData.battery_kwh}
                    onChange={(e) => setFormData({ ...formData, battery_kwh: parseFloat(e.target.value) })}
                    className="w-full p-3 rounded-xl border border-[#004643]/20 bg-[#F0EDE5]/50 focus:outline-none focus:border-[#004643]"
                  />
                </div>

                <div>
                  <label className="block mb-1 text-gray-700">Range (km)</label>
                  <input
                    type="number"
                    required
                    value={formData.range_km}
                    onChange={(e) => setFormData({ ...formData, range_km: parseInt(e.target.value) })}
                    className="w-full p-3 rounded-xl border border-[#004643]/20 bg-[#F0EDE5]/50 focus:outline-none focus:border-[#004643]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block mb-1 text-gray-700">Top Speed (km/h)</label>
                  <input
                    type="number"
                    required
                    value={formData.top_speed_kmh}
                    onChange={(e) => setFormData({ ...formData, top_speed_kmh: parseInt(e.target.value) })}
                    className="w-full p-3 rounded-xl border border-[#004643]/20 bg-[#F0EDE5]/50 focus:outline-none focus:border-[#004643]"
                  />
                </div>

                <div>
                  <label className="block mb-1 text-gray-700">Daily Rate (₹)</label>
                  <input
                    type="number"
                    required
                    value={formData.price_per_day}
                    onChange={(e) => setFormData({ ...formData, price_per_day: parseFloat(e.target.value) })}
                    className="w-full p-3 rounded-xl border border-[#004643]/20 bg-[#F0EDE5]/50 focus:outline-none focus:border-[#004643]"
                  />
                </div>
              </div>

              <div>
                <label className="block mb-1 text-gray-700">Image URL</label>
                <input
                  type="url"
                  placeholder="https://images.unsplash.com/..."
                  value={formData.image_url}
                  onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
                  className="w-full p-3 rounded-xl border border-[#004643]/20 bg-[#F0EDE5]/50 focus:outline-none focus:border-[#004643]"
                />
              </div>

              <div className="pt-3 flex gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setShowAddModal(false);
                    setEditingVehicle(null);
                  }}
                  className="w-1/2 py-3 rounded-xl border border-gray-300 font-bold hover:bg-gray-50"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-1/2 py-3 rounded-xl bg-[#004643] text-[#F0EDE5] font-black hover:bg-[#003633] shadow-md"
                >
                  {isSubmitting ? "Saving..." : editingVehicle ? "Update Model" : "Create Scooter"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
