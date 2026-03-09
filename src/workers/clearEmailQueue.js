import { emailQueue } from "../shared/utils/queues.js";

const clearEmailQueue = async()=>{
    await emailQueue.obliterate({force:true});
    console.log("queue cleared");
    process.exit();
}

clearEmailQueue();