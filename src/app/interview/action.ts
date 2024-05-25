"use server";
import { clerkClient } from "@clerk/nextjs/server";
import { api } from "~/trpc/server";

export const getAllUsersWithFreeTimeSlotsInRange = async ({
  startTime,
  endTime,
}: {
  startTime: Date;
  endTime: Date;
}) => {
  return await api.userProfile.getAllUsersWithTimeSlotsInRange({
    startTime,
    endTime,
  });
};

export const fetchClerkUserImage = async ({ userID }: { userID: string }) => {
  const clerkRes = await clerkClient.users.getUser(userID);
  console.log({ clerkRes: clerkRes });
  return clerkRes.imageUrl;
};
