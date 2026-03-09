import { smtpHelper } from "../constants/stmpData.js";

export const getValidMail = ()=>smtpHelper.find(acc=>acc.sentToday<450);
