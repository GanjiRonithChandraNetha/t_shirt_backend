import { emailQueue } from "../shared/utils/queues.js";
import { getTransporter } from "../shared/utils/mail.transporter.js";
import { redisEmailLogger } from "../shared/utils/loggers.js";

console.log("worker is on the job")

emailQueue.process(10, async (job) => {
    const {subject , email , token , user_id} = job.data;
    const {transporter,account} = getTransporter();
    const html = `click <a href="http://localhost:3000/users/reset-password?token=${token}&user_id=${user_id}>here </a> to reset your password`
    try{
        await transporter.sendMail({
            from:account.user,
            to:email,
            subject:subject,
            html
        });
        redisEmailLogger.info("email sent ,from:"+account.user+" ,to"+email);
    } catch(err){
        console.log("reset password not sent");
        redisEmailLogger.fatal("from:"+account.user+" ,to"+email+",Error:"+err.message);
        redisEmailLogger.error({
            from: account.user,
            to: email,
            err
        }, "Email sending failed");
        throw err;
    }
});

emailQueue.on("completed", (job, result) => {
    console.log(`Job ${job.id} completed! Result:`, result);
    console.log(job)

  // Your post-job logic here
//   updateDatabaseStatus(job.data.userId, "email_sent");
});

emailQueue.on('waiting', ({ jobId }) => {
    console.log('Job entered queue:', jobId);
});

// When a job fails
emailQueue.on("failed", (job, err) => {
    console.log(`Job ${job.id} failed:`, err.message);
    console.log(job);

  // Optional: fallback logic
//   storeInFallbackQueue(job.data);
});

console.log("email worker not working anymore");