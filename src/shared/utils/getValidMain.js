import { smtpHelper } from "../constants/stmpData";

export const getValidMail = ()=>smtpHelper.find(acc=>acc.sentToday<450);
