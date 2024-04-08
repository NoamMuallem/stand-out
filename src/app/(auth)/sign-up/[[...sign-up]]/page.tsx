"use client";
import { SignUp } from "@clerk/nextjs";

export default function SignUpPage() {
  return (
    <div className="min-w-screen my-[5rem] flex justify-center">
      <SignUp />
    </div>
  );
}
