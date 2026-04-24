import { getRedis } from "./redis.js";

export const initializeSMTP = async () => {
  try {
    const redis = getRedis();

    const exists2 = await redis.exists("smtp:available");
    if (!exists2) {
        await redis.rpush("smtp:available", "1", "2", "3","4","5");
    }

    const exists = await redis.get("smtp_initialized");
    if (exists) return;

    for (let i = 1; i <= 5; i++) {
      await redis.hset(`smtp:${i}`, {
        user: process.env[`MAIL_${i}_USER`],
        pass: process.env[`MAIL_${i}_PASS`],
        sentToday: 0,
      });
    }

    await redis.set("smtp_initialized", "true");  
  } catch (error) {
    // // // console.log("Redis is not live forgot password and registration will not work");  
  }
  
};