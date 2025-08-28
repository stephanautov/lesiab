// path: lib/realtime/client.ts
"use client";

import { createClient } from "@supabase/supabase-js";
import * as React from "react";
import { useQueryClient, type QueryKey } from "@tanstack/react-query";

let _client: ReturnType<typeof createClient> | null = null;

function getClient() {
  if (_client) return _client;

  // Use NEXT_PUBLIC_* directly on the client; Next.js inlines these at build time.
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
  _client = createClient(url, anon);
  return _client;
}

/**
 * Subscribe to 'lesiab:<entity>' and update a TanStack cache key on events.
 * - `cacheKey` must be a TanStack QueryKey (readonly unknown[])
 * - `updater` takes the previous data (or undefined) and the realtime payload,
 *    and must return the new data value.
 */
export function useRealtimeChannel<TData>(
  entity: string,
  event: string,
  cacheKey: QueryKey,
  updater: (old: TData | undefined, payload: any) => TData,
) {
  const qc = useQueryClient();

  // Keep latest updater without re-subscribing every render
  const updaterRef = React.useRef(updater);
  React.useEffect(() => {
    updaterRef.current = updater;
  }, [updater]);

  // Stabilize deps without changing the actual QueryKey type expected by TanStack.
  // We stringify ONLY for the effect dependency; we still pass the real QueryKey to setQueryData.
  const stableKeySig = React.useMemo(
    () => JSON.stringify(cacheKey),
    [cacheKey],
  );

  React.useEffect(() => {
    const supa = getClient();
    const ch = supa
      .channel(`lesiab:${entity}`)
      .on("broadcast", { event }, (msg) => {
        qc.setQueryData<TData>(cacheKey, (old) =>
          updaterRef.current(old as TData | undefined, msg.payload),
        );
      });

    ch.subscribe();
    return () => {
      try {
        ch.unsubscribe();
      } catch {
        /* noop */
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [entity, event, stableKeySig, qc]);
}
