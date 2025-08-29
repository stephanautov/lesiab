// path: app/api/trpc/[trpc]/route.ts
import { fetchRequestHandler } from "@trpc/server/adapters/fetch";
import { appRouter } from "../../../../server/trpc/router";
import { createTRPCContext } from "../../../../server/trpc/context";

export const runtime = "nodejs"; // or "edge" is also fine

const handler = (req: Request) =>
  fetchRequestHandler({
    endpoint: "/api/trpc",
    req,
    router: appRouter,
    createContext: async () => createTRPCContext({ req } as any),
  });

export { handler as GET, handler as POST };
