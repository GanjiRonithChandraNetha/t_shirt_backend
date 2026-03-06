import cron from 'node-cron';
import { smtpHelper } from '../shared/constants/stmpData.js';
import { finalizeClassImageForeEverySectionService } from '../modules/voting/voting.service.js';
console.log("scheduler started");

cron.schedule("0 0 * * *",()=>{
    console.log("re-starting daily counters ...");
    smtpHelper.forEach(acc => {acc.sentToday = 0;});
})

cron.schedule("0 30 * * *",async()=>{
    console.log("finalizing image votes for every section");
    const value = await finalizeClassImageForeEverySectionService();
    console.log(value);
})