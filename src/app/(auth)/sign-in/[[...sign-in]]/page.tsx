"use client";
import { SignIn } from "@clerk/nextjs";

export default function SignInPage() {
  return (
    <div className="min-w-screen my-[5rem] flex justify-center">
      <SignIn />
    </div>
  );
}
