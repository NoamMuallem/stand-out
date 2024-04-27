import { type Review, type TimeSlot } from ".prisma/client/default.js";
import { z } from "zod";

import { createTRPCRouter, privateProcedure } from "~/server/api/trpc";

export const meetingRouter = createTRPCRouter({
  createMeeting: privateProcedure
    .input(
      z.object({
        // The user that it's time slot have been chosen
        userToMeetWithID: z.string(),
        startTime: z.date(),
        endTime: z.date(),
        timeSlotsIDArray: z.array(z.number()),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      // The user that chose the open time slot
      const user2ID = ctx.session.userId;

      const { userToMeetWithID: user1ID, startTime, endTime } = input;

      // Make sure user 1 does have all this time slots
      const timeSlots = await ctx.db.timeSlot.findMany({
        where: {
          timeSlotID: {
            in: input.timeSlotsIDArray,
          },
          isTaken: false,
        },
      });

      if (timeSlots.length !== input.timeSlotsIDArray.length) {
        throw new Error("לא כל חלונות הזמן שנבחרו פנויים");
      }

      const newMeeting = await ctx.db.meeting.create({
        data: {
          user1ID,
          user2ID,
          startTime,
          endTime,
          timeSlots: {
            connect: timeSlots.map((timeSlot) => ({
              timeSlotID: timeSlot.timeSlotID,
            })),
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

      // Update all the time slots
      const independentDBCalls = timeSlots.map((timeSlot) =>
        ctx.db.timeSlot.update({
          where: {
            timeSlotID: timeSlot.timeSlotID,
          },
          data: {
            isTaken: true,
          },
        }),
      );

      const statusArray = await Promise.allSettled(independentDBCalls);

      const promisesToTryAgain = statusArray.filter(
        (status) => status.status === "rejected",
      );
      if (promisesToTryAgain.length > 0) {
        await Promise.all(promisesToTryAgain);
      }

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
          timeSlots: true,
          reviews: true,
        },
      });

      if (!meeting) {
        throw new Error("לא ניתן היה למצוא את הפגישה המבוקשת");
      }

      if (meeting.user1ID !== user && meeting.user2ID !== user) {
        throw new Error("הבקשה בוטלה כיוון שאתה לא רשאי לבטל את הפגישה");
      }

      if (meeting.startTime < new Date()) {
        throw new Error("לא ניתן לבטל פגישה שכבר התחילה");
      }

      if (!("timeSlots" in meeting) || !Array.isArray(meeting.timeSlots))
        return;

      const independentDBCalls = [];
      independentDBCalls.push(
        ...meeting.timeSlots.map((timeSlot: TimeSlot) =>
          ctx.db.timeSlot.update({
            where: {
              timeSlotID: timeSlot.timeSlotID,
            },
            data: {
              isTaken: false,
              meetingID: undefined,
              meeting: undefined,
            },
          }),
        ),
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
