// path: app/api/trpc/[trpc]/route.ts
import { fetchRequestHandler } from "@trpc/server/adapters/fetch";
import { appRouter } from "../../../../server/trpc/router";
import { createTRPCContext } from "../../../../server/trpc/context";

// Keep tRPC on the Node.js runtime (REST public endpoints handle edge/CDN).
export const runtime = "nodejs";

const handler = (req: Request) =>
  fetchRequestHandler({
    endpoint: "/api/trpc",
    req,
    router: appRouter,
    createContext: ({ req }) => createTRPCContext({ req }),
    onError({ error, path }) {
      // Optional: basic logging hook (kept deterministic)
      // console.error("tRPC error on", path, error);
    },
  });

export { handler as GET, handler as POST };
