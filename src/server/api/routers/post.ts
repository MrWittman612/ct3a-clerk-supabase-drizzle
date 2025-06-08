import { z } from "zod";
import { desc, eq } from "drizzle-orm";

import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "~/server/api/trpc";
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

  create: protectedProcedure
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

  delete: protectedProcedure
    .input(z.object({ id: z.number() }))
    .mutation(async ({ ctx, input }) => {
      if (!ctx.auth.userId) {
        throw new Error("User not authenticated");
      }
      const post = await ctx.db
        .select({ userId: posts.userId })
        .from(posts)
        .where(eq(posts.id, input.id));

      const noPost = !post[0];
      const postUserId = post[0]?.userId;
      const userId = ctx.auth.userId;

      const userOwnsThePost = postUserId !== userId;

      if (noPost || userOwnsThePost) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "Post not found or you do not have permission!!",
        });
      }
      await ctx.db.delete(posts).where(eq(posts.id, input.id));
      return { success: true, id: input.id };
    }),
});
