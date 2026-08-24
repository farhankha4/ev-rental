"use client";

// ─── Feature 1 & 3: Global Application Providers ───────────────────────────
//
// Combines client-side context providers:
//   1. QueryClientProvider (TanStack Query) for data caching & state
//   2. AuthProvider (Feature 3) for user session & JWT management
//
// ────────────────────────────────────────────────────────────────────────────

import React, { useState } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AuthProvider } from "@/context/AuthContext";

export default function Providers({ children }) {
  // Create a persistent QueryClient instance for client-side caching
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            refetchOnWindowFocus: false,
          },
        },
      })
  );

  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        {children}
      </AuthProvider>
    </QueryClientProvider>
  );
}
