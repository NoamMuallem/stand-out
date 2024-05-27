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
  return await api.timeSlotRouter.getAllTimeSlotsInRange({
    startTime,
    endTime,
    userID,
  });
};

export const createMeeting = async ({
  startTime,
  endTime,
  userToMeetWithID,
}: {
  startTime: Date;
  endTime: Date;
  userToMeetWithID: string;
}) => {
  return api.meeting.createMeeting({
    startTime,
    endTime,
    userToMeetWithID,
  });
};
