import { authMiddleware } from "@clerk/nextjs";

// This example protects all routes including api/trpc routes
// Please edit this to allow other routes to be public as needed.
// See https://clerk.com/docs/references/nextjs/auth-middleware for more information about configuring your middleware

export default authMiddleware({
  publicRoutes: ["/", "/contact", "about", "/blog"],
});

//TODO: understand what this thing does and if I need it
// this is why I did it: https://stackoverflow.com/questions/77108110/clerk-authmiddleware-is-not-being-used-even-though-it-is-in-my-middleware-ts-f
// export const config = {
//   matcher: ["/", "/(api|trpc)(.*)"],
// };
