import 'dotenv/config';
console.log(process.env.MAIL_1_PASS);
import nodemailer from 'nodemailer';
import { getValidMail } from './getValidMain.js';


export const getTransporter = ()=>{
    const account = getValidMail();
    console.log("\n\n\n Ronith");
    console.log(account);
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