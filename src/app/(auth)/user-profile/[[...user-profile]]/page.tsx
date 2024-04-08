"use client";
import { UserProfile } from "@clerk/nextjs";

const UserProfilePage = () => {
  return (
    <div className="flex h-full items-center justify-center p-9">
      <UserProfile path="/user-profile" routing="path" />
    </div>
  );
};

export default UserProfilePage;
