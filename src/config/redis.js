// config/redis.js
import 'dotenv/config'
import Redis from "ioredis";

let client = null;

export const initRedis = async () => {
    if (client) return client;

    client = process.env.REDIS_URL_1?
    new Redis(process.env.REDIS_URL_1):
    new Redis({
        host: "127.0.0.1",
        port: 6379,
        maxRetriesPerRequest: null, // important for queues when i already mention this do i have to check this again
    });

    // client.on("connect", () => console.log("🔌 Redis connected"));
    // client.on("ready", () => console.log("✅ Redis ready"));
    // client.on("error", (err) => console.error("❌ Redis error:", err));

    await client.ping(); // hard guarantee

    return client;
};

export const getRedis = () => {
    if (!client) {
        throw new Error("Redis not initialized");
    }
    return client;
};