"use client";
import * as React from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { TRPCProvider } from "../lib/trpc";

const queryClient = new QueryClient();

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <QueryClientProvider client={queryClient}>
      <TRPCProvider>{children}</TRPCProvider>
    </QueryClientProvider>
  );
}
