import { auth } from "@clerk/nextjs";
import { api } from "~/trpc/server";
import { NavBar as NavBarClient } from "./Navbar";

export default async function NavBar() {
  const { userId: userID } = auth();

  let userProfile = null;
  try {
    if (userID) {
      userProfile = await api.userProfile.getUserProfile({ userID });
      if (!userProfile) {
        userProfile = await api.userProfile.createProfile({
          userID,
        });
      }
    }
  } catch (e) {}

  return <NavBarClient userProfile={userProfile} />;
}
