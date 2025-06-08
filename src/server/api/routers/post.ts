import { z } from "zod";
import { eq } from "drizzle-orm";

import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { postsTable as posts } from "~/server/db/schema";

export const postRouter = createTRPCRouter({
  getAll: publicProcedure.query(async ({ ctx }) => {
    return ctx.db.select().from(posts).orderBy(posts.createdAt);
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

  getLatest: publicProcedure.qisuery(async ({ ctx }) => {
    const post = await ctx.db.query.posts.findFirst({
      orderBy: (posts, { desc }) => [desc(posts.createdAt)],
    });

    return post ?? null;
  }),
});
