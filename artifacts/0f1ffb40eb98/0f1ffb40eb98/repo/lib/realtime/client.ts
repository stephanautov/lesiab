"use client";
// path: lib/realtime/client.ts
import { createClient } from "@supabase/supabase-js";
import { env } from "../env.mjs";
import { useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";

let _client: ReturnType<typeof createClient> | null = null;

function getClient() {
  if (_client) return _client;
  _client = createClient(
    env.NEXT_PUBLIC_SUPABASE_URL,
    env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  );
  return _client;
}

/**
 * Subscribe to 'lesiab:<entity>' and update a TanStack cache key when an event arrives.
 * updater(old, payload) should return the new cache value.
 */
export function useRealtimeChannel<T>(
  entity: string,
  event: string,
  cacheKey: unknown[],
  updater: (old: T | undefined, payload: any) => T,
) {
  const qc = useQueryClient();
  useEffect(() => {
    const supa = getClient();
    const ch = supa
      .channel(`lesiab:${entity}`)
      .on("broadcast", { event }, (msg) => {
        qc.setQueryData<T>(cacheKey, (old) => updater(old, msg.payload));
      });
    ch.subscribe();
    return () => {
      ch.unsubscribe();
    };
  }, [entity, event, qc, JSON.stringify(cacheKey)]);
}
