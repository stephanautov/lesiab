// path: nodes/auth.setup.ts
/**
 * NODE: auth.setup
 * Phase: execute
 *
 * Purpose:
 *  - Provide minimal auth helpers and a protective middleware for /app/(protected)/**.
 *  - Uses Supabase JS on the server (service role) to verify an access token when needed.
 *
 * Outputs:
 *  - artifacts/${orc}/repo/lib/auth.ts
 *  - artifacts/${orc}/repo/middleware.ts   (sole owner)
 *
 * Notes:
 *  - Middleware performs a lightweight cookie presence check (`sb-access-token`) to gate protected pages.
 *    (Network verification in middleware is avoided for latency reasons.)
 *  - Server helpers can verify tokens against Supabase Auth using the service role key.
 *  - Do NOT import lib/auth.ts on the client.
 */

export type NodeId = string;
export type OrchestrationId = string;

export interface ExecutionContext {
  orchestrationId: OrchestrationId;
  correlationId: string;
  logger: { info(m: any): void; warn(m: any): void; error(m: any): void };
  storage: {
    saveArtifact: (path: string, content: string | Uint8Array) => Promise<void>;
  };
}
export interface NodeSpec<I = unknown, O = unknown> {
  id: NodeId;
  phase:
    | "processResponses"
    | "analyze"
    | "validate"
    | "plan"
    | "execute"
    | "codeGeneration"
    | "integrate"
    | "finalize";
  estimate?: (input: I) => { tokens?: number; usd?: number };
  run: (input: I, ctx: ExecutionContext) => Promise<O>;
}

const lf = (s: string) => s.replace(/\r\n/g, "\n");

export const AuthSetupNode: NodeSpec<unknown, { files: string[] }> = {
  id: "auth.setup",
  phase: "execute",
  estimate: () => ({ tokens: 500, usd: 0.002 }),
  async run(_input, ctx) {
    const root = `artifacts/${ctx.orchestrationId}/repo`;

    const libAuth = lf(`// path: lib/auth.ts
// Only import this file on the server (route handlers, server components, tRPC context).
import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import { env } from "../env.mjs";

/** Server-only client using the service role key. */
export function getServiceSupabase(): SupabaseClient {
  return createClient(env.SUPABASE_URL, env.SUPABASE_SERVICE_ROLE, {
    auth: { persistSession: false },
  });
}

/** Extracts access token from a Next.js Request (cookies), if present. */
export function getAccessTokenFromRequest(req: Request): string | undefined {
  // Next Request exposes cookies via req.headers.get("cookie")
  const cookieHeader = req.headers.get("cookie") ?? "";
  // Convention when using Supabase helpers: 'sb-access-token'
  const match = cookieHeader.split(/;\\s*/).find((c) => c.startsWith("sb-access-token="));
  if (!match) return undefined;
  return decodeURIComponent(match.split("=")[1] ?? "");
}

/** Optional token verification round-trip to Supabase Auth. */
export async function getUserServer(accessToken: string | undefined) {
  if (!accessToken) return null;
  const supabase = getServiceSupabase();
  const { data, error } = await supabase.auth.getUser(accessToken);
  if (error) return null;
  return data.user ?? null;
}
`);

    const middleware = lf(`// path: middleware.ts
import { NextResponse, type NextRequest } from "next/server";

/**
 * Minimal protection for /app/(protected)/** routes.
 * For performance, we check for the presence of 'sb-access-token' cookie.
 * Real verification happens server-side in tRPC context using service role.
 */
export function middleware(req: NextRequest) {
  const url = req.nextUrl;
  const pathname = url.pathname || "/";
  const isProtected = pathname.startsWith("/app/(protected)");

  if (!isProtected) return NextResponse.next();

  const token = req.cookies.get("sb-access-token")?.value;
  if (!token) {
    const login = new URL("/login", url.origin);
    login.searchParams.set("redirect", pathname);
    return NextResponse.redirect(login);
  }
  return NextResponse.next();
}

export const config = {
  matcher: ["/app/(protected)/(.*)"]
};
`);

    const files = [
      { path: `${root}/lib/auth.ts`, content: libAuth },
      { path: `${root}/middleware.ts`, content: middleware },
    ];
    for (const f of files) {
      await ctx.storage.saveArtifact(f.path, f.content);
    }
    ctx.logger.info({
      msg: "auth.setup:written",
      files: files.map((f) => f.path),
      correlationId: ctx.correlationId,
    });
    return { files: files.map((f) => f.path) };
  },
};

export default AuthSetupNode;
