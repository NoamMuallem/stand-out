import { type userProfile } from "~/server/api/routers/userProfile";

export type UserProfile = Awaited<
  ReturnType<typeof userProfile.getUserProfile>
>;
