// import 'dotenv/config';
// // console.log("mailUser:",process.env.MAIL_1_USER);
// import { emailQueue } from "../shared/utils/queues.js";
// import { getTransporter } from "../shared/utils/mail.transporter.js";
// import { redisEmailLogger } from "../shared/utils/loggers.js";

// // console.log("worker is on the job")

// emailQueue.process('send-email',10, async (job) => {
//     // console.log(job.data);
//     const {subject , to , otp,token , user_id} = job.data;
//     const {transporter,account} = getTransporter();
//     let html = "this otp is for email verification "+ otp;
//     if(!otp)
//         html = `click <a href="http://localhost:3000/auth/reset-password?token=${token}&user_id=${user_id}>here </a> to reset your password`
//     // // console.log("subject: "+subject,"\ntoken: "+token,"\nuser_id: "+user_id,"\naccount: "+account);
//     // console.log({
//             from:account.user,
//             to:to,
//             subject:subject,
//             html
//         });
//     try{
//         await transporter.sendMail({
//             from:account.user,                           
//             to:to,
//             subject:subject,
//             html
//         });
//         redisEmailLogger.info("email sent ,from:"+account.user+" ,to"+to);
//     } catch(err){
//         // console.log("reset password not sent");
//         redisEmailLogger.fatal("from:"+account.user+" ,to"+to+",Error:"+err.message);
//         redisEmailLogger.error({
//             from: account.user,
//             to: to,
//             err
//         }, "Email sending failed");
//         throw err;
//     }
// });

// emailQueue.on("completed", (job, result) => {
//     // console.log("INSIDE SUCCESS SECTION");
//     // console.log(`Job ${job.id} completed! Result:`, result);
//     // console.log(job)
//     // console.log("Email User Used: "+job.data);


//   // Your post-job logic here
// //   updateDatabaseStatus(job.data.userId, "email_sent");
// });

// emailQueue.on('waiting', ({ jobId }) => {
//     // console.log('Job entered queue:', jobId);
// });

// // When a job fails
// emailQueue.on("failed", (job, err) => {
//     // console.log(`Job ${job.id} failed:`, err.message);
//     // console.log(job);

//   // Optional: fallback logic
// //   storeInFallbackQueue(job.data);
// });

// // console.log("email worker not working anymore");

import 'dotenv/config';
import { initRedis } from "../config/redis.js";   // ✅ ADD THIS
import { emailQueue } from "../shared/utils/queues.js";
import { getTransporter } from "../shared/utils/mail.transporter.js";
import { redisEmailLogger } from "../shared/utils/loggers.js";

// console.log("worker is on the job");

const startWorker = async () => {
    // 🔴 THIS IS THE FIX
    const redis = await initRedis();
    // console.log(await redis.hgetall("smtp:1"));
    // console.log("✅ Redis initialized in worker");

    emailQueue.process('send-email', 10, async (job) => {
        // console.log(job.data);

        const { subject, to, otp, token, user_id } = job.data;

        const { transporter, account } = await getTransporter();

        let html = "this otp is for email verification " + otp;

        if (!otp) {
            html = `click <a href="http://localhost:3000/auth/reset-password?token=${token}&user_id=${user_id}>here</a> to reset your password`;
        }

        try {
            await transporter.sendMail({
                from: account.user,
                to,
                subject,
                html
            });

            redisEmailLogger.info("email sent ,from:" + account.user + " ,to" + to);

        } catch (err) {
            // console.log("reset password not sent");

            redisEmailLogger.fatal("from:" + account.user + " ,to" + to + ",Error:" + err.message);

            redisEmailLogger.error({
                from: account.user,
                to,
                err
            }, "Email sending failed");

            throw err;
        }
    });

    // Events AFTER init
    emailQueue.on("completed", (job, result) => {
        // console.log(`Job ${job.id} completed!`);
    });

    emailQueue.on('waiting', ({ jobId }) => {
        // console.log('Job entered queue:', jobId);
    });

    emailQueue.on("failed", (job, err) => {
        // console.log(`Job ${job.id} failed:`, err.message);
    });

    // console.log("🚀 Worker fully started");
};

startWorker(); // ✅ IMPORTANT