import { SignUp } from "@clerk/nextjs";

export default function SignUpPage() {
  return (
    <div className="flex min-h-screen items-center justify-center">
      <SignUp path="/sign-in" routing="path" signInUrl="/sign-in" />
    </div>
  );
}
