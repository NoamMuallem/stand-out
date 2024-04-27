import { z } from "zod";

import {
  createTRPCRouter,
  privateProcedure,
  publicProcedure,
} from "~/server/api/trpc";

export const timeSlotRouter = createTRPCRouter({
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

      return ctx.db.timeSlot.create({
        data: {
          startTime: input.startTime,
          endTime: input.endTime,
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
