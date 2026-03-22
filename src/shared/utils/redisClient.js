import Redis from 'ioredis';

export let redis = null;
export let isRedisConnected = false;

export const connectRedis = async () => {
  try {
    redis = new Redis({ host: '127.0.0.1', port: 6379 });
    await redis.ping();

    isRedisConnected = true;
    console.log("✅ Redis Connected");
  } catch (err) {
    console.log("⚠️ Redis not available");
    isRedisConnected = false;
  }
};