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
    getProfileService
 } from "./users.service.js";
import bcrypt from 'bcrypt';


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
    res.status(200).json({
        success:true,
        data:user_details
    });
})


export const setProfliePicController = asyncHandler(async(req,res)=>{
    if(!req.file) throw new AppError(
        "FILE_NOT_EXISTS",
        "file not found",
        404
    );

    const fileURL = await setProfliePicService(req.path,req.user.user_id);

    res.status(200).json({
        success:true,
        data:{
            fileURL
        }
    })
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
    res.status(200).json({
        success:true,
        result
    })
})

// public 
export const forgotPasswordRequestController = asyncHandler(async(req,res)=>{
    const email = req.body;
    // validate email
    const result = await forgotPasswordRequestService(email);
    res.status(200).json({
        success:true,
        message:"reset link has been sent will expire in "+result+`will recive mail if user with ${email} exsits`
    })
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
    res.status(200).json({
        success:true,
        message:"password updated successfully"
    });
})

export const loginController = asyncHandler(async(req,res)=>{
    const {email,password} = req.body;
    const result = await loginService(email,password);
    res.status(200).json({
        success:true,
        data:{
            token:result.token,
        }
    })
})

// params
export const getProfileController = asyncHandler(async(req,res)=>{
    const {user_id} = req.params;
    const user_data = getProfileService(user_id);
    res.status(200).json({
        success:true,
        data:user_data
    });
})

export const setKnowMeController = asyncHandler(async(req,res)=>{
    const user_id = req.user.user_id;
    const know_me = req.body.know_me;
    // validate know_me
    const result = await setKnowMeService(user_id,know_me);
    res.status(200).json({
        success:true,
        message:"know_me update succesfully"
    });
})