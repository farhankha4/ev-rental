"use client";

// ─── Feature 7: Custom Hook — useRazorpay ────────────────────────────────────
//
// What this file is:
//   Custom React hook for dynamically loading the official Razorpay Checkout SDK script
//   (`https://checkout.razorpay.com/v1/checkout.js`) into the DOM and opening the payment modal.
//
// Which feature & part:
//   Feature 7 (Razorpay Payments Integration) — Frontend SDK Loader Hook
//
// Usage:
//   const { isLoaded, openCheckout } = useRazorpay();
//   openCheckout({
//     orderId, amount, keyId, scooterName, userEmail, userPhone, onSuccess, onError
//   });
//
// ────────────────────────────────────────────────────────────────────────────

import { useState, useEffect, useCallback } from "react";

const RAZORPAY_SCRIPT_URL = "https://checkout.razorpay.com/v1/checkout.js";

export function useRazorpay() {
  const [isLoaded, setIsLoaded] = useState(false);

  // Dynamically load Razorpay SDK script tag into document body
  useEffect(() => {
    if (window.Razorpay) {
      setIsLoaded(true);
      return;
    }

    const script = document.createElement("script");
    script.src = RAZORPAY_SCRIPT_URL;
    script.async = true;
    script.onload = () => setIsLoaded(true);
    script.onerror = () => console.error("[useRazorpay] Failed to load Razorpay SDK script.");

    document.body.appendChild(script);

    return () => {
      // Keep script cached in DOM
    };
  }, []);

  /**
   * Opens the Razorpay Checkout popup modal.
   */
  const openCheckout = useCallback(({
    orderId,
    amount,
    keyId,
    scooterName = "SwiftVolt Electric Scooter",
    userEmail = "",
    userName = "",
    onSuccess,
    onDismiss
  }) => {
    if (!window.Razorpay) {
      alert("Razorpay SDK is loading... Please try again in a moment.");
      return;
    }

    const options = {
      key: keyId,
      amount: amount, // in paise (e.g. 150000 = ₹1500)
      currency: "INR",
      name: "SwiftVolt EV Rentals",
      description: `Rental Payment for ${scooterName}`,
      image: "https://cdn-icons-png.flaticon.com/512/2972/2972531.png", // EV Scooter icon
      order_id: orderId,
      prefill: {
        name: userName,
        email: userEmail,
      },
      theme: {
        color: "#0284c7", // Sky-600 brand accent
      },
      handler: function (response) {
        // Response contains: razorpay_payment_id, razorpay_order_id, razorpay_signature
        if (onSuccess) {
          onSuccess(response);
        }
      },
      modal: {
        ondismiss: function () {
          if (onDismiss) {
            onDismiss();
          }
        },
      },
    };

    const paymentObject = new window.Razorpay(options);
    paymentObject.open();
  }, []);

  return {
    isLoaded,
    openCheckout,
  };
}
