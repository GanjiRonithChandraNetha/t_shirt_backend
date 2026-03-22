import 'dotenv/config';
console.log("(inside mail.transported.js) Pass1: ",process.env.MAIL_1_PASS);
import nodemailer from 'nodemailer';
import { getValidMail } from './getValidMail.js';


export const getTransporter = ()=>{
    const account = getValidMail();
    console.log("\n\n\n Ronith");
    console.log("account:", account);
    console.log("Ronith\n\n\n ");
    if(! account) throw new AppError(
        "ALL_MAIL_EXHUSTED",
        "cannot reset password contact coustomer care",
        500
    );

    const transporter = nodemailer.createTransport({
        host:'smtp.gmail.com',
        port:587,
        secure:false,
        auth:{
            user:account.user,
            pass:account.pass
        }
    });

    return {
        transporter,
        account
    }
}