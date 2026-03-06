import AppError from '../../shared/utils/AppError.js';
import crypto from 'crypto';
import {
    findUserRepository,
    userRegistrationRepository,
    setProfliePicRepository,
    setPreRegistrationDetailsRepository,
    forgotPasswordRequestRepository,
    getUserResetToken,
    updateUserPassword,
    loginRespository,
    getProfileRepository,
    setKnowMeRepository,
    getAllUsersInCollegeRepository
} from './users.repository.js'

import bcrypt from 'bcrypt';
import { emailQueue } from '../../shared/utils/queues.js';
import { ERROR_CODES } from '../../shared/constants/errorCodes.js';
import jwt from 'jsonwebtoken';

const salt = Number(process.env.SALT_ROUNDS) || 10;
const SECRET = process.env.JWT_SECRET;

export const userRegistrationService = async(payment_id,details)=>{

    const {email,mobile_no} = details;
    const result = await findUserRepository(mobile_no,email);
    if(result.rowCount >= 1)
        throw new AppError(
            "USER_ALREADY EXISTS",
            "email or mobile nuber already exits please use diffrent email/mobile number",
            400
        );
    
    const hashedPassword = await bcrypt.hash(details.password,salt);
    const userData = { ...details, password: hashedPassword };
    const user_details_obtained  = await userRegistrationRepository(userData);
    if(!user_details_obtained){
        throw AppError(
            'USER_NOT_CREATED',
            'user not created check with coutomer care',
            '500'
        );
    }
}

export const setProfliePicService = async(filePath,user_id)=>{
    const fileURL = await setProfliePicRepository(filePath,user_id);
    if(!fileURL) throw new AppError(
        "FILE_NOT_SAVED",
        "could not save the file in db",
        500
    );
}

export const setPreRegistrationDetailsService = async(details,user_id)=>{
    const result = await setPreRegistrationDetailsRepository(details,user_id);
    if(!result)
        throw new AppError(
            "USER_NOT_UPDATED",
            "could not update the user try again",
            500
        );
    return result;
}

export const forgotPasswordRequestService = async(email)=>{
    const token = crypto.randomBytes(32).toString('hex');
    const expires = Date.now() + (1000 * 60 * 60 * 3); // expires in 3hrs
    const result = await forgotPasswordRequestRepository({token,expires,email});
    await emailQueue.add({
            to:email,
            subject:"reset password",
            token:result.token,
            user_id:result.user_id
        },
        {
            attempts: 5,
            backoff: {
                type:"exponential",
                delay:5000,
            }
        }
    );

    return result.expires;
}

export const resetPasswordService = async(token,password,user_id)=>{
    const result1 = await getUserResetToken(user_id);
    const {reset_token,resent_token_expires} = result1.rows[0];
    const expires = new Date(resent_token_expires);
    
    if(Date.now() > expires){
        throw new AppError(
            "TOKEN_EXPIRED",
            "please try again",
            400
        );
    }
    
    if( token !== reset_token){
        throw new AppError(
            "INVALID_RESET_TOKEN",
            "cannot reset password try again",
            400
        );
    } 

    const hash = await bcrypt.hash(password,salt);

    const result2 = await updateUserPassword(user_id,hash);
    
    if(result2.rowCount == 0){
        throw new Error("Internal Server Error");
    };

    return true;
}

export const loginService = async(email,password)=>{
    const result = await loginRespository(email);
    // const {user_id,password_obtained} = result.rows[0];
    if(!result.rows.length ||!result.rows[0].user_id || !result.rows[0].password){
        throw new AppError(
            "INVALID_USER_ID",
            ERROR_CODES.INVALID_USER_ID.message,
            ERROR_CODES.INVALID_USER_ID.statusCode
        );
    }
    const {user_id,section_id} = result.rows[0];
    const isMatch = await bcrypt.compare(password,result.rows[0].password);
    if(!isMatch){
        throw new AppError(
            "INVALID_PASSWORD",
            "please type correct password",
            400
        );
    }
    const token = jwt.sign({user_id,email,section_id,role:"user"},SECRET,{expiresIn:"1d"});    
    return {user_id,email,token}
}


export const getProfileService = async(user_id)=>{
    const result = await getProfileRepository(user_id);
    if(! result.rows.length)
        throw new AppError(
            "INVALID_USER_ID",
            ERROR_CODES.INVALID_USER_ID.message,
            ERROR_CODES.INVALID_USER_ID.statusCode
        );      
    return result.rows[0];
}

export const setKnowMeService = async(user_id,know_me)=>{
    const result = await setKnowMeRepository(user_id,know_me);
    if(! result.rowCount == 0)
        throw new AppError(
            "CREDENTIALS_NOT_UPDATED",
            "could not update know me",
            500
        );
}

export const getAllUsersInCollegeService = async(section_id)=>{  
    const result = await getAllUsersInCollegeRepository(college_id);
     if(!result)
        throw new AppError(
            "INVALID_USER_ID",
            ERROR_CODES.INVALID_USER_ID.message,
            ERROR_CODES.INVALID_USER_ID.statusCode
        );
    return result;
}

export const setVisibilityService = async(user_id,mode)=>{
    if(!['anonymous','non_anonymous','friends_only'].includes(mode))
        throw new AppError(
            "INVALID_MODE_TYPE",
            "invalid mode has been sent any of these should be sent 'anonymous','non_anonymous','friends_only'",
            400
        );
    
    const result = await setVisibilityRepository(user_id,mode);
    if(result.rowCount === 0)
        throw new AppError(
            "MODE_NOT_SET",
            "unable to set mode please try again",
            500
        );
}