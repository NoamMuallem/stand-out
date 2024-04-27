import { type Review } from ".prisma/client/default.js";
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

      // Make sure user 1 have a time slot
      const timeSlot = await ctx.db.timeSlot.findFirst({
        where: {
          userID: user1ID,
          startTime: { gte: startTime },
          endTime: { lte: endTime },
          isTaken: false,
        },
      });

      if (!timeSlot) {
        throw new Error("לא נמצא חלון זמן פתוח עבור המשתמש המבוקש");
      }

      // break the time slots
      // start of the time slot -> start of the meeting
      const timeSlotsUpdatesPromiseArray = [];
      let meetingTimeSlotIndex = 0;
      if (timeSlot.startTime < startTime) {
        meetingTimeSlotIndex = 1;
        timeSlotsUpdatesPromiseArray.push(
          ctx.db.timeSlot.create({
            data: {
              userID: user1ID,
              startTime: timeSlot.startTime,
              endTime: startTime,
              isTaken: false,
            },
          }),
        );
      }

      // start of the meeting -> end of the meeting (exactly MEETING_LENGTH minutes)
      timeSlotsUpdatesPromiseArray.push(
        ctx.db.timeSlot.create({
          data: {
            userID: user1ID,
            startTime,
            endTime: new Date(startTime.getTime() + MEETING_LENGTH * 60 * 1000),
            isTaken: true,
          },
        }),
      );

      // end of the meeting -> end of the time slot
      if (timeSlot.endTime > endTime) {
        timeSlotsUpdatesPromiseArray.push(
          ctx.db.timeSlot.create({
            data: {
              userID: user1ID,
              startTime: endTime,
              endTime: timeSlot.endTime,
              isTaken: false,
            },
          }),
        );
      }

      // delete the original time slot
      timeSlotsUpdatesPromiseArray.push(
        ctx.db.timeSlot.delete({
          where: {
            timeSlotID: timeSlot.timeSlotID,
          },
        }),
      );

      const timeSlots = await Promise.all(timeSlotsUpdatesPromiseArray);

      // we don't need the last time slot
      timeSlots.pop();

      const newMeeting = await ctx.db.meeting.create({
        data: {
          user1ID,
          user2ID,
          startTime,
          endTime,
          timeSlot: {
            connect: {
              timeSlotID: timeSlots[meetingTimeSlotIndex]?.timeSlotID,
            },
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
        },
      });

      if (!meeting) throw new Error("לא ניתן היה למצוא את הפגישה המבוקשת");

      if (meeting.user1ID !== user && meeting.user2ID !== user)
        throw new Error("הבקשה בוטלה כיוון שאתה לא רשאי לבטל את הפגישה");

      if (meeting.startTime < new Date())
        throw new Error("לא ניתן לבטל פגישה שכבר התחילה");

      if (
        !("timeSlotID" in meeting) ||
        !(typeof meeting.timeSlotID === "number")
      )
        throw new Error("לא ניתן למצוא את חלון הזמן של הפגישה");

      const independentDBCalls = [];

      // fined the meeting time slot
      const timeSlots = await ctx.db.timeSlot.findUnique({
        where: {
          timeSlotID: meeting.timeSlotID,
        },
      });

      if (!timeSlots) throw new Error("לא ניתן למצוא את חלון הזמן של הפגישה");

      // find if it has adjacent time slots to merge with i.e. the meeting ends on a start of a time slot or starts at the end of another one
      const adjacentTimeSlots = await ctx.db.timeSlot.findMany({
        where: {
          userID: meeting.user1ID,
          isTaken: false,
          OR: [
            {
              endTime: meeting.startTime,
            },
            {
              startTime: meeting.endTime,
            },
          ],
        },
      });

      //create an array of time slots sorted by the start time from the earliest to the latest
      const timeSlotsToMerge = [timeSlots, ...adjacentTimeSlots].sort(
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

      // remove the time slots
      independentDBCalls.push(
        ...timeSlotsToMerge.map((timeSlot) =>
          ctx.db.timeSlot.delete({
            where: {
              timeSlotID: timeSlot.timeSlotID,
            },
          }),
        ),
      );

      //create the new time Slot
      independentDBCalls.push(
        ctx.db.timeSlot.create({
          data: {
            userID: meeting.user1ID,
            startTime: mergedTimeSlot.startTime,
            endTime: mergedTimeSlot.endTime,
            isTaken: false,
          },
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
