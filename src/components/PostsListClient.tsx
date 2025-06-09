"use client";
import { api as clientApi } from "~/trpc/react";
import { SignedIn, useAuth } from "@clerk/nextjs";
import { type postsTable } from "~/server/db/schema";

import React from "react";
import type { InferSelectModel } from "drizzle-orm";
import { toast } from "sonner";

type Post = InferSelectModel<typeof postsTable>;

export default function PostsListClient({
  initialPosts,
}: {
  initialPosts: Post[];
}) {
  const { userId: currentUserId } = useAuth();

  const utils = clientApi.useUtils();

  const {
    data: posts,
    isLoading,
    error,
  } = clientApi.post.getAll.useQuery(undefined, {
    initialData: initialPosts,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
  });

  const deletePostMutation = clientApi.post.delete.useMutation({
    onSuccess: (data) => {
      toast.success(`Post ${data.id} deleted`);
      void utils.post.getAll.invalidate();
    },
    onError: (err) => {
      toast.error(`Error deleting post: ${err.message}`);
    },
  });

  const handleDelete = (postId: number) => {
    if (window.confirm("Are you sure you want to delete this post?")) {
      deletePostMutation.mutate({ id: postId });
    }
  };

  if (isLoading && !initialPosts) return <p>Loading posts...</p>; // Show loading only if no initial data
  if (error) return <p>Error loading posts: {error.message}</p>;
  if (!posts || posts.length === 0) return <p>No posts yet.</p>;

  return (
    <ul className="space-y-3">
      {posts.map((post) => (
        <li key={post.id} className="rounded border p-3 shadow-sm">
          <h3 className="text-lg font-semibold">{post.title}</h3>
          <p className="text-sm text-gray-700">{post.content}</p>
          <p className="mt-1 text-xs text-gray-500">
            By User ID: {post.userId} - Created:{" "}
            {new Date(post.createdAt).toLocaleDateString()}
          </p>
          <SignedIn>
            {/* Only show delete if the post belongs to the current user */}
            {post.userId === currentUserId && (
              <button
                onClick={() => handleDelete(post.id)}
                className="mt-2 text-xs text-red-500 hover:text-red-700"
                disabled={
                  deletePostMutation.isPending &&
                  deletePostMutation.variables?.id === post.id
                }
              >
                Delete
              </button>
            )}
          </SignedIn>
        </li>
      ))}
    </ul>
  );
}
