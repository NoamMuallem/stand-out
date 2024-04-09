import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

// Create a new ratelimiter, that allows 10 requests per 10 seconds
export const ratelimit = new Ratelimit({
  redis: Redis.fromEnv(),
  limiter: Ratelimit.slidingWindow(10, "10 s"),
  analytics: true,
  timeout: 10000,
});

/*
Rate limit example:
const ip = req.ip ?? "127.0.0.1"
const {success, pending, limit, reset, remaining } = await ratelimit.limit(ip)

if (!success) {
  res.status(429).json({
    error: "Too many requests",
    limit,
    // the time stamp in witch the limit will be reset
    reset,
  })
  //remaining - is the amount of remaining requests before the limit is reached
  return ({remaining})
}
*/
