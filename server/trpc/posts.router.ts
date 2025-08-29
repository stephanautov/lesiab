// path: server/trpc/posts.router.ts
import { z } from "zod";
import { createTRPCRouter, protectedProcedure, publicProcedure } from "./_trpc";

/**
 * Audience toggle (requirements.json hint):
 * If your app is for public visitors, you can switch to `publicProcedure`.
 * Default here: protected.
 */
const PROC = protectedProcedure;

export const postsRouter = createTRPCRouter({
  list: PROC.query(async ({ ctx }) => {
    const { data, error } = await ctx.supabase
      .from("posts")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) throw new Error(error.message);
    return data;
  }),

  byId: PROC.input(z.object({ id: z.string().uuid() })).query(
    async ({ ctx, input }) => {
      const { data, error } = await ctx.supabase
        .from("posts")
        .select("*")
        .eq("id", input.id)
        .maybeSingle();

      if (error) throw new Error(error.message);
      return data;
    },
  ),

  create: PROC.input(
    z.object({ title: z.string().min(1), content: z.string().optional() }),
  ).mutation(async ({ ctx, input }) => {
    const { error, data } = await ctx.supabase
      .from("posts")
      .insert({ title: input.title, content: input.content ?? null })
      .select("*")
      .single();

    if (error) throw new Error(error.message);
    return data;
  }),
});
