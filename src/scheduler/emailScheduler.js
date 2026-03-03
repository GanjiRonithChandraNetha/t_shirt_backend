import cron from 'node-cron';
import { smtpHelper } from '../shared/constants/stmpData.js';


console.log("email scheduler started");

cron.schedule("0 0 * * *",()=>{
    console.log("re-starting daily counters ...");
    smtpHelper.forEach(acc => {acc.sentToday = 0;});
})