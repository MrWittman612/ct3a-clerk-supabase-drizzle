import { z } from "zod";
import { desc, eq } from "drizzle-orm";

import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { postsTable as posts } from "~/server/db/schema";
import { TRPCError } from "@trpc/server";

export const postRouter = createTRPCRouter({
  getAll: publicProcedure.query(async ({ ctx }) => {
    return ctx.db.select().from(posts).orderBy(desc(posts.createdAt));
  }),

  getById: publicProcedure
    .input(z.object({ id: z.number() }))
    .query(async ({ ctx, input }) => {
      const post = await ctx.db
        .select()
        .from(posts)
        .where(eq(posts.id, input.id))
        .limit(1);
      return post[0];
    }),

  create: publicProcedure
    .input(
      z.object({
        title: z.string().min(1),
        content: z.string().optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      if (!ctx.auth.userId) {
        throw new Error("User not authenticated");
      }
      const newPost = await ctx.db
        .insert(posts)
        .values({
          title: input.title,
          content: input.content,
          userId: ctx.auth.userId,
        })
        .returning();

      return newPost;
    }),

  delete: publicProcedure
    .input(z.object({ id: z.number() }))
    .mutation(async ({ ctx, input }) => {
      if (!ctx.auth.userId) {
        throw new Error("User not authenticated");
      }
      const post = await ctx.db
        .select({ userId: posts.id })
        .from(posts)
        .where(eq(posts.id, input.id));

      if (!post[0] || post[0].userId !== +ctx.auth.userId) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "Post not found or you do not have permission!!",
        });
      }
      await ctx.db.delete(posts).where(eq(posts.id, input.id));
      return { success: true, id: input.id };
    }),
});
