import { type Review } from ".prisma/client/default.js";
import { type Meeting, type PrismaClient, type TimeSlot } from "@prisma/client";
import { z } from "zod";

import { createTRPCRouter, privateProcedure } from "~/server/api/trpc";

const MEETING_LENGTH = 90;

export const meetingRouter = createTRPCRouter({
  createMeeting: privateProcedure
    .input(
      z.object({
        // The user that it's time slot have been chosen
        userToMeetWithID: z.string(),
        startTime: z.date(),
        endTime: z.date(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      // The user that chose the open time slot
      const user2ID = ctx.session.userId;
      const { userToMeetWithID: user1ID, startTime, endTime } = input;

      const [user1TimeSlot, user2TimeSlot] = await Promise.all([
        ctx.db.timeSlot.findFirst({
          where: {
            userID: user1ID,
            startTime: { lte: startTime },
            endTime: { gte: endTime },
            isTaken: false,
          },
        }),
        ctx.db.timeSlot.findFirst({
          where: {
            userID: user2ID,
            startTime: { lte: startTime },
            endTime: { gte: endTime },
            isTaken: false,
          },
        }),
      ]);

      if (!user1TimeSlot) {
        throw new Error("לא נמצא חלון זמן פתוח עבור המשתמש המבוקש");
      }

      const { meetingTimeSlotID: user1MeetingTimeSlotID } =
        await breakUserTimeSlotsPromiseFactory({
          meetingStartTime: startTime,
          meetingEndTime: endTime,
          userID: user1ID,
          db: ctx.db,
          timeSlot: user1TimeSlot,
        });

      //if user 2 have a time slot break it and mark not free time slot as well
      const { meetingTimeSlotID: user2MeetingTimeSlotID } =
        await breakUserTimeSlotsPromiseFactory({
          meetingStartTime: startTime,
          meetingEndTime: endTime,
          userID: user2ID,
          db: ctx.db,
          timeSlot: user2TimeSlot,
        });

      if (!user1MeetingTimeSlotID)
        throw new Error("נכשל בעדכון חלונות הזמן של המשתמש");

      const meetingIDsToConnect = [
        {
          timeSlotID: user1MeetingTimeSlotID,
        },
      ];

      if (user2MeetingTimeSlotID) {
        meetingIDsToConnect.push({
          timeSlotID: user2MeetingTimeSlotID,
        });
      }

      const newMeeting = await ctx.db.meeting.create({
        data: {
          user1ID,
          user2ID,
          startTime,
          endTime,
          timeSlots: {
            connect: meetingIDsToConnect,
          },
          reviews: {
            create: [
              {
                isFiled: false,
                userToReview: user1ID,
                reviewerID: user2ID,
              },
              {
                isFiled: false,
                userToReview: user2ID,
                reviewerID: user1ID,
              },
            ],
          },
        },
      });

      return newMeeting;
    }),

  cancelMeeting: privateProcedure
    .input(
      z.object({
        meetingID: z.number(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const user = ctx.session.userId;
      const meeting = await ctx.db.meeting.findUnique({
        where: {
          meetingID: input.meetingID,
        },
        include: {
          reviews: true,
          timeSlots: true,
        },
      });

      if (!meeting) throw new Error("לא ניתן היה למצוא את הפגישה המבוקשת");

      if (meeting.user1ID !== user && meeting.user2ID !== user)
        throw new Error("הבקשה בוטלה כיוון שאתה לא רשאי לבטל את הפגישה");

      if (meeting.startTime < new Date())
        throw new Error("לא ניתן לבטל פגישה שכבר התחילה");

      if ("timeSlots" in meeting && meeting.timeSlots.length === 0)
        throw new Error("לא ניתן למצוא את חלון הזמן של הפגישה");

      // find if it has adjacent time slots to merge with i.e. the meeting ends on a start of a time slot or starts at the end of another one
      const [user1AdjacentTimeSlots, user2AdjacentTimeSlots] =
        await Promise.all(
          [meeting.user1ID, meeting.user2ID].map((userID) =>
            ctx.db.timeSlot.findMany({
              where: {
                userID,
                isTaken: false,
                OR: [
                  {
                    endTime: meeting.endTime,
                  },
                  {
                    startTime: meeting.startTime,
                  },
                ],
              },
            }),
          ),
        );

      const independentDBCalls = [];
      independentDBCalls.push(
        mergeAdjacentTimeSlots({
          db: ctx.db,
          meeting,
          user: "user1ID",
          adjacentTimeSlots: user1AdjacentTimeSlots,
        }),
      );
      independentDBCalls.push(
        mergeAdjacentTimeSlots({
          db: ctx.db,
          meeting,
          user: "user2ID",
          adjacentTimeSlots: user2AdjacentTimeSlots,
        }),
      );

      //remove the reviews
      if (!("reviews" in meeting) || !Array.isArray(meeting.reviews)) return;
      independentDBCalls.push(
        ...meeting.reviews.map((review: Review) =>
          ctx.db.review.delete({
            where: {
              reviewID: review.reviewID,
            },
          }),
        ),
      );

      const statusArray = await Promise.allSettled(independentDBCalls);

      const promisesToTryAgain = statusArray.filter(
        (status) => status.status === "rejected",
      );
      if (promisesToTryAgain.length > 0) {
        await Promise.all(promisesToTryAgain);
      }

      await ctx.db.meeting.delete({
        where: {
          meetingID: input.meetingID,
        },
      });

      return meeting;
    }),
});

const breakUserTimeSlotsPromiseFactory = async ({
  timeSlot,
  meetingStartTime,
  meetingEndTime,
  userID,
  db,
}: {
  timeSlot: TimeSlot | null;
  meetingStartTime: Date;
  meetingEndTime: Date;
  userID: string;
  db: PrismaClient;
}) => {
  if (!timeSlot)
    return {
      meetingTimeSlotID: null,
    };
  // break the time slots
  // start of the time slot -> start of the meeting
  const timeSlotsUpdatesPromiseArray = [];
  let meetingTimeSlotIndex = 0;
  if (timeSlot.startTime < meetingStartTime) {
    meetingTimeSlotIndex = 1;
    timeSlotsUpdatesPromiseArray.push(
      db.timeSlot.create({
        data: {
          userID,
          startTime: timeSlot.startTime,
          endTime: meetingStartTime,
          isTaken: false,
        },
      }),
    );
  }

  // start of the meeting -> end of the meeting (exactly MEETING_LENGTH minutes)
  timeSlotsUpdatesPromiseArray.push(
    db.timeSlot.create({
      data: {
        userID,
        startTime: meetingStartTime,
        endTime: new Date(
          meetingStartTime.getTime() + MEETING_LENGTH * 60 * 1000,
        ),
        isTaken: true,
      },
    }),
  );

  // end of the meeting -> end of the time slot
  if (timeSlot.endTime > meetingEndTime) {
    timeSlotsUpdatesPromiseArray.push(
      db.timeSlot.create({
        data: {
          userID,
          startTime: meetingEndTime,
          endTime: timeSlot.endTime,
          isTaken: false,
        },
      }),
    );
  }

  // delete the original time slot
  timeSlotsUpdatesPromiseArray.push(
    db.timeSlot.delete({
      where: {
        timeSlotID: timeSlot.timeSlotID,
      },
    }),
  );
  const timeSlots = await Promise.all(timeSlotsUpdatesPromiseArray);

  return {
    meetingTimeSlotID: timeSlots[meetingTimeSlotIndex]?.timeSlotID,
  };
};

const mergeAdjacentTimeSlots = async ({
  db,
  meeting,
  user,
  adjacentTimeSlots,
}: {
  db: PrismaClient;
  meeting: Meeting & { timeSlots: TimeSlot[] };
  user: "user1ID" | "user2ID";
  adjacentTimeSlots: TimeSlot[] | undefined;
}) => {
  if (!adjacentTimeSlots || adjacentTimeSlots.length === 0) return [];

  const { timeSlots: allMeetingTimeSlots } = meeting;
  const userID = meeting[user];

  const userTimeSlot = allMeetingTimeSlots.filter(
    (timeSlot) => timeSlot.userID === userID,
  )[0];

  if (!userTimeSlot) return [];

  //create an array of time slots sorted by the start time from the earliest to the latest
  const timeSlotsToMerge = [userTimeSlot, ...adjacentTimeSlots].sort(
    (a, b) => a.startTime.getTime() - b.startTime.getTime(),
  );

  const firstTimeSlot = timeSlotsToMerge[0];
  const lastTimeSlot = timeSlotsToMerge[timeSlotsToMerge.length - 1];

  if (!firstTimeSlot || !lastTimeSlot)
    throw new Error("לא ניתן למצוא חלון זמן פתוח עבור המשתמש המבוקש");

  const mergedTimeSlot = {
    startTime: firstTimeSlot.startTime,
    endTime: lastTimeSlot.endTime,
  };

  const promiseArray = [];

  // remove the time slots
  promiseArray.push(
    ...timeSlotsToMerge.map((timeSlot) =>
      db.timeSlot.delete({
        where: {
          timeSlotID: timeSlot.timeSlotID,
        },
      }),
    ),
  );

  //create the new time Slot
  promiseArray.push(
    db.timeSlot.create({
      data: {
        userID,
        startTime: mergedTimeSlot.startTime,
        endTime: mergedTimeSlot.endTime,
        isTaken: false,
      },
    }),
  );

  return promiseArray;
};
