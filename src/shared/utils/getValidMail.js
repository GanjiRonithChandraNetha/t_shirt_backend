import 'dotenv/config';
// console.log("(inside getValidMail.js)",process.env.MAIL_1_PASS);
import { getRedis } from "../../config/redis.js";

export const getValidMail = async () => {
    const redis = getRedis();

    const smtpId = await redis.rpoplpush("smtp:available", "smtp:available");

    const account = await redis.hgetall(`smtp:${smtpId}`);
    // console.log(await redis.exists("smtp:available")); // 0 or 1
    // console.log(await redis.type("smtp:available"));   // list?
    // console.log(await redis.llen("smtp:available"));   // length?
    // console.log("validMail.js\n",account,"\n"+smtpId);
    // console.log(JSON.stringify((await redis.hgetall("smtp:1")))+"\n"+JSON.stringify((await redis.hgetall(`smtp:${smtpId}`)))+"\n+++++++++++++");

    if (parseInt(account.sentToday) >= 436) {
        throw new Error("limit reached");
    }

    await redis.hincrby(`smtp:${smtpId}`, "sentToday", 1);

    return {
        user: account.user,
        pass: account.pass
    };
};