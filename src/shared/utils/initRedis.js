import { redis, isRedisConnected } from './redisClient.js';

export const initializeSMTP = async () => {
  if (!isRedisConnected) return;

  const initialized = await redis.get('smtp_initialized');

  if (initialized) {
    console.log("SMTP already initialized");
    return;
  }

  console.log("Initializing SMTP...");

  for (let i = 1; i <= 5; i++) {
    await redis.hset(`smtp:${i}`, {
      user: process.env[`MAIL_${i}_USER`],
      pass: process.env[`MAIL_${i}_PASS`],
      sentToday: 0
    });
  }

  await redis.set('smtp_initialized', 'true');
};

export const SMTPIsLive = isRedisConnected;