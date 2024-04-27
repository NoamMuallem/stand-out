import { z } from "zod";

import { createTRPCRouter, privateProcedure } from "~/server/api/trpc";

const MAX_REVIEW_TEXT_LENGTH = 250;

export const reviewRouter = createTRPCRouter({
  getReview: privateProcedure
    .input(
      z.object({
        reviewID: z.number(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const { reviewID } = input;
      const user = ctx.session.userId;
      const review = await ctx.db.review.findUnique({
        where: {
          reviewID,
        },
      });

      if (!review) {
        throw new Error("לא ניתן למצוא את הביקורת המבוקשת");
      }

      if (review.userToReview === user || review.reviewerID === user) {
        throw new Error("לא ניתן לגשת לביקורת שאינה קשורה אליך");
      }

      return review;
    }),

  updateReview: privateProcedure
    .input(
      z.object({
        ranking: z.number(),
        text: z.string().max(MAX_REVIEW_TEXT_LENGTH, {
          message: `טקסט הביקורת לא יכול להיות ארוך מ ${MAX_REVIEW_TEXT_LENGTH} תווים}`,
        }),
        reviewID: z.number(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const user = ctx.session.userId;
      const { ranking, text, reviewID } = input;
      const originalReview = await ctx.db.review.findUnique({
        where: {
          reviewID,
        },
      });
      if (!originalReview) {
        throw new Error("הביקורת המבוקשת לא נמצאה");
      }
      if (originalReview.reviewerID !== user) {
        throw new Error("העריכה נכשלה, אינך רשי לערוך ביקורת זאת");
      }
      const updatedReview = await ctx.db.review.update({
        where: {
          reviewID,
        },
        data: {
          ranking,
          text,
        },
      });

      //update the relevant user averageRanking
      const userToReviewProfile = await ctx.db.userProfile.findUnique({
        where: {
          userID: originalReview.userToReview,
        },
      });

      if (!userToReviewProfile) {
        throw new Error("עדכון הדירוג של המשתמש נכשל");
      }

      const isUpdatingNewReview = !!originalReview?.ranking;
      const originalReviewRanking = originalReview?.ranking ?? 0;
      let amountOfUserRankings = userToReviewProfile.amountOfRankings;
      let userRankingsSum =
        userToReviewProfile.averageRanking * amountOfUserRankings;

      if (isUpdatingNewReview) {
        userRankingsSum = userRankingsSum - originalReviewRanking + ranking;
        amountOfUserRankings = amountOfUserRankings + 1;
      } else {
        userRankingsSum = userRankingsSum + ranking;
      }

      const newAverageRanking = userRankingsSum / amountOfUserRankings;
      await ctx.db.userProfile.update({
        where: {
          userID: originalReview.userToReview,
        },
        data: {
          averageRanking: newAverageRanking,
          amountOfRankings: amountOfUserRankings,
        },
      });

      return updatedReview;
    }),
});
