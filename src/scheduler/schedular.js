import cron from 'node-cron';
import { smtpHelper } from '../shared/constants/stmpData.js';
import { finalizeClassImageForeEverySectionService } from '../modules/voting/voting.service.js';
import { 
    emailResetLogger,
    finalizeVoteLogger
} from '../shared/utils/loggers.js';

// console.log("scheduler started");

cron.schedule("0 0 * * *",()=>{
    // console.log("re-starting daily counters ...");
    smtpHelper.forEach(acc => {acc.sentToday = 0;});
    emailResetLogger.info("emails have been reset");
})

cron.schedule("30 0 * * *",async()=>{
    // console.log("finalizing image votes for every section");
    const value = await finalizeClassImageForeEverySectionService();
    if(value.success)
        finalizeVoteLogger.trace(value.data);
    else
        finalizeVoteLogger.info("votes where tried be finalized"+value.data);
    // console.log(value);
})