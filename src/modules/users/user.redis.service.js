import { getRedis } from "../../config/redis.js";
import bcrypt from 'bcrypt';

const salt = Number(process.env.SALT_ROUNDS) || 10;
export const storeOTP = async (email, otp) => {
    const redis = getRedis();
    const hashedOTP = await bcrypt.hash(otp,salt);
    return await redis.set(`otp:${email}`, hashedOTP, "EX", 300); // 5 min
};

export const verifyOTP = async (email, otp) => {
    const redis = getRedis();

    const stored = await redis.get(`otp:${email}`);
    if(!stored){
        throw new AppError(
            "EMAIL_NOT_VERIFIED",
            "generate otp again",
            400
        );
    }
    return await bcrypt.compare(otp,stored);
};