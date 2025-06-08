import {
  SignedIn,
  SignedOut,
  SignInButton,
  SignUpButton,
  UserButton,
} from "@clerk/nextjs";

import { api as serverApi, HydrateClient } from "~/trpc/server";
import PostsListClient from "./_components/PostsListClient";

export default async function page() {
  const initialPosts = await serverApi.post.getAll();
  return (
    <HydrateClient>
      <main className="container mx-auto p-4">
        <header className="flex items-center justify-between border-8 border-b py-4">
          <h1 className="text-3xl font-semibold tracking-tight sm:text-[5rem]">
            My Awesome App (App Router)
          </h1>
          <div>
            <SignedOut>
              <SignInButton mode="modal">
                <button className="mr-2 rounded px-3 py-2 hover:bg-gray-100">
                  Sign In
                </button>
              </SignInButton>
              <SignUpButton mode="modal">
                <button className="rounded bg-blue-500 px-3 py-2 text-white hover:bg-blue-600">
                  Sign Up
                </button>
              </SignUpButton>
            </SignedOut>
            <SignedIn>
              <UserButton afterSignOutUrl="/" />
            </SignedIn>
          </div>
        </header>
        <div className="mt-8">
          <SignedIn>
            {/* Pass server-fetched user ID or let client component get it */}
            {/* <CreatePostForm /> */}
          </SignedIn>
          <SignedOut>
            <p className="text-center text-gray-600">
              Please sign in to create posts.
            </p>
          </SignedOut>
        </div>

        <div className="mt-6">
          <h2 className="mb-3 text-2xl font-bold">All Posts</h2>
          {/* Pass initialPosts to a client component for display and potential client-side interactions */}
          <PostsListClient initialPosts={initialPosts} />
        </div>
      </main>
    </HydrateClient>
  );
}
