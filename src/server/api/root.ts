import "@total-typescript/ts-reset";
import { meetingRouter } from "~/server/api/routers/meeting";
import { createCallerFactory, createTRPCRouter } from "~/server/api/trpc";
import { reviewRouter } from "./routers/review";
import { timeSlot } from "./routers/timeSlote";
import { userProfile } from "./routers/userProfile";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  meeting: meetingRouter,
  review: reviewRouter,
  userProfile: userProfile,
  timeSlotRouter: timeSlot,
});

// export type definition of API
export type AppRouter = typeof appRouter;

/**
 * Create a server-side caller for the tRPC API.
 * @example
 * const trpc = createCaller(createContext);
 * const res = await trpc.post.all();
 *       ^? Post[]
 */
export const createCaller = createCallerFactory(appRouter);
