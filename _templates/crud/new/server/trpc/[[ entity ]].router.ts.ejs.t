---
to: server/trpc/<%= entity %>.router.ts
---
import { z } from 'zod';
import { createTRPCRouter, protectedProcedure } from './_trpc';
const CreateSchema = z.object({});
export const <%= entity %>Router = createTRPCRouter({
  list: protectedProcedure.query(async ({ ctx }) => {
    const { data, error } = await ctx.supabase.from('<%= table %>').select('*').order('created_at',{ascending:false});
    if (error) throw new Error(error.message);
    return data;
  }),
});
