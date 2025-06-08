import {
  SignedIn,
  SignedOut,
  SignInButton,
  SignUpButton,
  UserButton,
} from "@clerk/nextjs";
import Link from "next/link";

import { api as serverApi, HydrateClient } from "~/trpc/server";

export default async function Home() {
  const initialPost = await serverApi.post.getAll();
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
      </main>
    </HydrateClient>
  );
}
