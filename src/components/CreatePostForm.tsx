"use client";

import { useState } from "react";
import { api as clientApi } from "~/trpc/react"; // For Client Component hooks
import { useRouter } from "next/navigation"; // For App Router navigation
import { toast } from "sonner";

export function CreatePostForm() {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const router = useRouter();

  // Get tRPC utils for cache invalidation
  const utils = clientApi.useUtils();

  const createPostMutation = clientApi.post.create.useMutation({
    onSuccess: () => {
      setTitle("");
      setContent("");
      // Invalidate the query to refetch posts
      // For App Router, often better to router.refresh() or invalidate specific queries
      void utils.post.getAll.invalidate(); // This will refetch if PostsListClient uses useQuery
      // router.refresh(); // Alternative: re-runs Server Component data fetching for the current route
      toast.success("Post created!");
    },
    onError: (error) => {
      toast.error(`Error creating post: ${error.message}`);
      if (error.data?.code === "UNAUTHORIZED") {
        // Handle unauthorized, e.g. redirect to sign-in
        router.push("/sign-in");
      }
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      toast.warning("Title cannot be empty");
      return;
    }
    createPostMutation.mutate({ title, content });
  };

  return (
    <form onSubmit={handleSubmit} className="my-4 rounded border p-4">
      <h2 className="mb-2 text-xl font-semibold">Create New Post</h2>
      <div className="mb-2">
        <label htmlFor="title" className="block text-sm font-medium">
          Title:
        </label>
        <input
          type="text"
          id="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-black shadow-sm focus:border-indigo-500 focus:ring-indigo-500 focus:outline-none sm:text-sm"
          disabled={createPostMutation.isPending}
        />
      </div>
      <div className="mb-4">
        <label htmlFor="content" className="block text-sm font-medium">
          Content (Optional):
        </label>
        <textarea
          id="content"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          rows={3}
          className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-black shadow-sm focus:border-indigo-500 focus:ring-indigo-500 focus:outline-none sm:text-sm"
          disabled={createPostMutation.isPending}
        />
      </div>
      <button
        type="submit"
        className="rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-600 disabled:opacity-50"
        disabled={createPostMutation.isPending}
      >
        {createPostMutation.isPending ? "Submitting..." : "Submit Post"}
      </button>
    </form>
  );
}
