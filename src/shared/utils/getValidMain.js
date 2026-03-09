import { smtpHelper } from "../constants/stmpData.js";
import 'dotenv/config';
console.log(process.env.MAIL_1_PASS);

export const getValidMail = ()=>{
    // smtpHelper.forEach( ele =>{console.log(ele)})
    const mailer = smtpHelper.find(acc=>{
        // console.log( acc.sentToday<450+"-><-"+acc);
        return acc.sentToday<450
    })
    // console.log("mailer: "+mailer);
    return mailer;
};