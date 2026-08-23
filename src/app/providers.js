"use client";

// ─── What this file is ──────────────────────────────────────────────────────
//
// TanStack Query needs a "QueryClientProvider" to be set up somewhere
// above every component that uses data fetching hooks (like useVehicles).
//
// Because providers use React hooks internally, they MUST be Client
// Components — hence the "use client" directive at the top.
//
// We wrap the entire app with this provider in layout.js so that
// every page automatically has access to TanStack Query.
//
// ────────────────────────────────────────────────────────────────────────────

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState } from "react";

export default function Providers({ children }) {
  // Create a QueryClient instance.
  // useState ensures we create it only ONCE per page load — not on every render.
  // QueryClient holds the in-memory cache for all fetched data.
  const [queryClient] = useState(() => new QueryClient());

  return (
    // Wrap all children (every page) with the provider.
    // Now any component inside can call useQuery() and useVehicles().
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  );
}
