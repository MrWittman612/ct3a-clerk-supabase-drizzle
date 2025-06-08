import { SignIn } from "@clerk/nextjs";

export default function SignInPage() {
  return (
    <>
      {/* You can add a Head component here if needed, or set metadata in layout/page */}
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "100vh",
        }}
      >
        <SignIn path="/sign-in" routing="path" signUpUrl="/sign-up" />
      </div>
    </>
  );
}
