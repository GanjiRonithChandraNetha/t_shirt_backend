export const emailQueue = process.env.REDIS_URL_2
  ? new Queue('emailQueue', process.env.REDIS_URL_2)
  : new Queue('emailQueue', {
      redis: { host: "127.0.0.1", port: 6379 }
    });