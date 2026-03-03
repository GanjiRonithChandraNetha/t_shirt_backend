import { emailQueue } from "../shared/utils/queues";
import { getTransporter } from "../shared/utils/mail.transporter";
import AppError from '../shared/utils/AppError.js'

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
    } catch(err){
        console.log("reset password not sent");
        throw err;
    }
});

emailQueue.on("completed", (job, result) => {
    console.log(`Job ${job.id} completed! Result:`, result);
    console.log(job)

  // Your post-job logic here
//   updateDatabaseStatus(job.data.userId, "email_sent");
});

// When a job fails
emailQueue.on("failed", (job, err) => {
    console.log(`Job ${job.id} failed:`, err.message);
    console.log(job);

  // Optional: fallback logic
//   storeInFallbackQueue(job.data);
});
