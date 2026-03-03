import nodemailer from 'nodemailer';
import { getValidMail } from './getValidMain';


export const getTransporter = ()=>{
    const account = getValidMail();
    if(! account) throw new AppError(
        "ALL_MAIL_EXHUSTED",
        "cannot reset password contact coustomer care",
        500
    );

    const transporter = nodemailer.createTransport({
        host:'gmail',
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