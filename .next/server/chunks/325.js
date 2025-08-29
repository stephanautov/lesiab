"use strict";exports.id=325,exports.ids=[325],exports.modules={14325:(a,b,c)=>{c.r(b),c.d(b,{RealtimeClientNode:()=>g,default:()=>h});let d=a=>a.replace(/\r\n/g,"\n"),e=d(`"use client";
// path: lib/realtime/client.ts
import { createClient } from "@supabase/supabase-js";
import { env } from "../env.mjs";
import { useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";

let _client: ReturnType<typeof createClient> | null = null;

function getClient() {
  if (_client) return _client;
  _client = createClient(env.NEXT_PUBLIC_SUPABASE_URL, env.NEXT_PUBLIC_SUPABASE_ANON_KEY);
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
  updater: (old: T | undefined, payload: any) => T
) {
  const qc = useQueryClient();
  useEffect(() => {
    const supa = getClient();
    const ch = supa.channel(\`lesiab:\${entity}\`).on("broadcast", { event }, (msg) => {
      qc.setQueryData<T>(cacheKey, (old) => updater(old, msg.payload));
    });
    ch.subscribe();
    return () => { ch.unsubscribe(); };
  }, [entity, event, qc, JSON.stringify(cacheKey)]);
}
`),f=d(`// path: lib/realtime/index.ts
export * from "./server";
export * from "./client";
`),g={id:"realtime.client",phase:"execute",estimate:()=>({tokens:380,usd:.0015}),async run(a,b){let c=`artifacts/${b.orchestrationId}/repo/lib/realtime`,d=`${c}/client.ts`,g=`${c}/index.ts`;return await b.storage.saveArtifact(d,e),await b.storage.saveArtifact(g,f),b.logger.info({msg:"realtime.client:written",files:[d,g],correlationId:b.correlationId}),{files:[d,g]}}},h=g}};