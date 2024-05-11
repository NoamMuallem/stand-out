import { z } from "zod";

import {
  createTRPCRouter,
  privateProcedure,
  publicProcedure,
} from "~/server/api/trpc";

export const timeSlot = createTRPCRouter({
  createTimeSlot: privateProcedure
    .input(
      z.object({
        startTime: z.date(),
        endTime: z.date(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      // The user that chose the open time slot
      const user = ctx.session.userId;
      const { startTime, endTime } = input;
      if (endTime < startTime)
        throw new Error("זמן התחלה לא יכול להיות אחרי זמן סיום");
      // make sure the user does not have another time slot that uses this time
      const conflictingTimeSlots = await ctx.db.timeSlot.findMany({
        where: {
          OR: [
            {
              startTime: { lte: startTime },
              endTime: { lte: endTime, gte: startTime },
            },
            {
              startTime: { gte: startTime, lte: endTime },
              endTime: { gte: endTime },
            },
            { startTime: { lte: startTime }, endTime: { gte: endTime } },
            { startTime: { gte: startTime }, endTime: { lte: endTime } },
          ],
        },
      });

      if (conflictingTimeSlots.length > 0)
        throw new Error("חלון הזמן המבוקש תפוס");

      return ctx.db.timeSlot.create({
        data: {
          startTime,
          endTime,
          isTaken: false,
          user: {
            connect: {
              userID: user,
            },
          },
        },
      });
    }),

  getAllTimeSlotsInRange: publicProcedure
    .input(
      z.object({
        startTime: z.date(),
        endTime: z.date(),
        userID: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const { endTime, startTime, userID } = input;

      return ctx.db.timeSlot.findMany({
        where: {
          userID,
          startTime: {
            gte: startTime,
            lte: endTime,
          },
        },
      });
    }),
});
