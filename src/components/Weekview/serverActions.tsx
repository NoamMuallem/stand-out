"use server";

import { api } from "~/trpc/server";

export const fetchTimeSlots = async ({
  startTime,
  endTime,
  userID,
}: {
  startTime: Date;
  endTime: Date;
  userID: string;
}) => {
  console.log({
    startTime,
    endTime,
  });
  return await api.timeSlotRouter.getAllTimeSlotsInRange({
    startTime,
    endTime,
    userID,
  });
};
