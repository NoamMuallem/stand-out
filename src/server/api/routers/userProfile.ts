import { z } from "zod";

import {
  createTRPCRouter,
  privateProcedure,
  publicProcedure,
} from "~/server/api/trpc";

import { clerkClient } from "@clerk/nextjs/server";

const MAX_BACKGROUND_LENGTH = 250;
const MAX_LOOKING_TO_IMPROVE_LENGTH = 250;

export const userProfile = createTRPCRouter({
  getUserProfile: publicProcedure
    .input(
      z.object({
        userID: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const { userID } = input;

      return ctx.db.userProfile.findUnique({
        where: {
          userID,
        },
      });
    }),

  editProfile: privateProcedure
    .input(
      z.object({
        userID: z.string(),
        background: z
          .string()
          .max(MAX_BACKGROUND_LENGTH, {
            message: `לא ניתן להזין טקסט שארוך מ ${MAX_BACKGROUND_LENGTH}}`,
          })
          .optional(),
        lookingToImprove: z
          .string()
          .max(MAX_LOOKING_TO_IMPROVE_LENGTH, {
            message: `לא ניתן להזין טקסט שארוך מ ${MAX_LOOKING_TO_IMPROVE_LENGTH}}`,
          })
          .optional(),
        firstName: z.string().optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const user = ctx.session.userId;
      const userProfile = await ctx.db.userProfile.findUnique({
        where: {
          userID: input.userID,
        },
      });

      if (!userProfile) {
        throw new Error("לא נמצא הפרופיל המבוקש");
      }

      if (userProfile.userID !== user) {
        throw new Error("לא ניתן לערוך פרופיל של משתמש אחר");
      }

      return ctx.db.userProfile.update({
        where: {
          userID: input.userID,
        },
        data: {
          background: input.background,
          lookingToImprove: input.lookingToImprove,
          firstName: input.firstName,
        },
      });
    }),

  createProfile: privateProcedure
    .input(
      z.object({
        userID: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const userFromRequest = ctx.session.userId;
      const { userID } = input;
      if (!(userID !== userFromRequest)) {
        throw new Error("לא ניתן ליצור פרופיל למשתמש אחר");
      }

      const clerkUser = await clerkClient.users.getUser(userID);

      return ctx.db.userProfile.create({
        data: {
          userID,
          firstName: clerkUser.firstName ?? "",
          background: "",
          lookingToImprove: "",
          averageRanking: 0,
          amountOfRankings: 0,
          timeSlots: { create: [] },
        },
      });
    }),

  getAllUsersWithTimeSlotsInRange: publicProcedure
    .input(
      z.object({
        startTime: z.date(),
        endTime: z.date(),
        orderBy: z.string().optional(),
      }),
    )
    .query(async ({ ctx, input }) => {
      const { startTime, endTime } = input;
      return ctx.db.userProfile.findMany({
        where: {
          timeSlots: {
            some: {
              startTime: {
                gte: startTime,
                lte: endTime,
              },
            },
          },
        },
        orderBy: {
          averageRanking: "desc",
        },
      });
    }),
});
