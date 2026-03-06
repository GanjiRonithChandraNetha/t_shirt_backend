import asyncHandler from "../../shared/utils/asyncHandler.js";
import AppError from '../../shared/utils/AppError.js';
import ERROR_CODES from '../../shared/constants/errorCodes.js'
import { impDates } from "../../shared/constants/dates.js";
import { 
    userRegistrationService,
    setProfliePicService,
    setPreRegistrationDetailsService,
    forgotPasswordRequestService,
    resetPasswordService,
    loginService,
    getProfileService,
    setKnowMeService,
    getAllUsersInCollegeService
 } from "./users.service.js";
import bcrypt from 'bcrypt';
import { responseDataAggregator } from "../../shared/utils/responseDataAggregator.js";
import { response } from "express";

// expected input : 
// body:{
//     payment_id,
//     {
//         name
//         section_id,
//         mobile_no,
//         email,
//         pic,
//         size,
//         password
//     }
// }
export const userRegistrationController = asyncHandler(async(req,res)=>{
    const {payment_id} = req.body;
    // validate payment_id  
    // update profile pic later
    const {
        name,
        section_id,
        mobile_no,
        email,
        size,
        password
    } = req.body.details;
    // validate details 

    const user_details = await userRegistrationService(payment_id,{ 
        name,
        section_id,
        mobile_no,
        email,
        size,
        password
    });
    
    const obj = responseDataAggregator(req,{
        success:true,
        data:user_details
    });

    res.status(200).json(obj);
})


export const setProfliePicController = asyncHandler(async(req,res)=>{
    if(!req.file) throw new AppError(
        "FILE_NOT_EXISTS",
        "file not found",
        404
    );

    const fileURL = await setProfliePicService(req.path,req.user.user_id);

    const obj = responseDataAggregator(req,{
        success:true,
        data:{
            fileURL
        }
    });

    res.status(200).json(obj);
})


export const setPreRegistrationDetailsController = asyncHandler(async(req,res)=>{

    if(Date.now() > impDates.REGISTRATION_END_DATE) throw new AppError(
        "UPDATION_NOT_PERMITED",
        "date of registratoin has passed can not change you credentials",
        400
    );
    const details = req.body.details;
    //validate user details ;
    const result = await setPreRegistrationDetailsService(details,req.user_id);
    
    const obj = responseDataAggregator(req,{
        success:true,
        result
    });

    res.status(200).json(obj)
})

// public 
export const forgotPasswordRequestController = asyncHandler(async(req,res)=>{
    const email = req.body;
    // validate email
    const result = await forgotPasswordRequestService(email);

    const obj = responseDataAggregator(req,{
        success:true,
        message:"reset link has been sent will expire in "+result+`will recive mail if user with ${email} exsits`
    });

    res.status(200).json(obj)
})

//post method
export const resetPasswordController = asyncHandler(async(req,res)=>{
    const {token,user_id} = req.query;
    const password = req.body;
    //validate password
    const result = await resetPasswordService(token,password,user_id);
    if(!result){
        throw new Error("password not updated");
    }

    const obj = responseDataAggregator(req,{
        success:true,
        message:"password updated successfully"
    });

    res.status(200).json(obj);
})

export const loginController = asyncHandler(async(req,res)=>{
    const {email,password} = req.body;
    const result = await loginService(email,password);
    
    const obj = responseDataAggregator(req,{
        success:true,
        data:{
            token:result.token,
        }
    });
    
    res.status(200).json()
})

// params
export const getProfileController = asyncHandler(async(req,res)=>{
    const {user_id} = req.params;
    const user_data = getProfileService(user_id);
    
    const obj = responseDataAggregator(req,{
        success:true,
        data:user_data
    });
    
    res.status(200).json(obj);
})

export const setKnowMeController = asyncHandler(async(req,res)=>{
    const user_id = req.user.user_id;
    const know_me = req.body.know_me;
    // validate know_me
    const result = await setKnowMeService(user_id,know_me);
    
    const obj = responseDataAggregator(req,{
        success:true,
        message:"know_me update succesfully"
    });
    
    res.status(200).json(obj);
})

// protected 
export const getAllUsersInCollegeController = asyncHandler(async(req,res)=>{
    const section_id = req.user.section_id;
    const result = await getAllUsersInCollegeService(section_id);
    
    const obj = responseDataAggregator(req,{
        success:true,
        message:"data must be stored in the device storage",
        data:result
    });
    
    res.status(200).json(obj);
})

export const setVisibilityController = asyncHandler(async(req,res)=>{
    const user_id = req.user.user_id;
    const mode = req.params.mode;
    const result = await setVisibilityService(user_id,mode);
    const obj = responseDataAggregator(req,{
        success:true,
        mode: result.mode
    });
    res.status(200).json(obj);
})