import {asyncHandler} from "../../shared/utils/asyncHandler.js";
import AppError from '../../shared/utils/AppError.js';
import {ERROR_CODES} from '../../shared/constants/errorCodes.js'
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
    getAllUsersInCollegeService,
    setVisibilityService
 } from "./users.service.js";
import { responseDataAggregator } from "../../shared/utils/responseDataAggregator.js";
import { 
    registrationInputValidator,
    preRegistrationDetailsValidators,
    loginValidator,
    forgotPasswordValidator,
    resetPasswordValidator
} from "./users.validator.js";


const know_meLength = process.env.KNOW_ME_LENGTH || 100;

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
    // make a t-shirt order 
    const {
        name,
        section_id,
        mobile_no,
        email,
        size,
        password
    } = req.body.details;
    // validate details 
    
    const zodResult = registrationInputValidator.safeParse({
        name,
        section_id,
        mobile_no,
        email,
        size:size.toUpperCase(),
        password
    });

    if(!zodResult.success){
        console.log(zodResult.error.flatten().fieldErrors);
        throw new AppError(
            "INVALID_REGISTRATION_CREDENTIALS",
            zodResult.error.flatten().fieldErrors,
            400
        );
    }
    // console.log(JSON.stringify(zodResult));
    const user_details = await userRegistrationService(payment_id,zodResult.data);
    
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
    const zodResult = preRegistrationDetailsValidators.safeParse(details);
    if(!zodResult.success)
        throw new AppError(
            "INVALID_PROFILE_CREDENTIALS",
            zodResult.error,
            400
        );
    //validate user details ;
    const result = await setPreRegistrationDetailsService(zodResult.data,req.user_id);
    
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
    console.log(email,typeof(email));
    const zodResult = forgotPasswordValidator.safeParse(email);
    if(!zodResult.success)
        throw new AppError(
            "INVALID_EMAIL",
            "please try again with correct email",
            400
        );
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
    const zodResult = resetPasswordValidator.safeParse({password});
    if(!zodResult.success)
        throw new AppError(
            "INVALID_PASSWORD_FORMAT",
            "please create password with valid password format",
            400
        );
    
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
    console.log(req.body);
    const {email,password} = req.body.details;
    const zodResult = loginValidator.safeParse({email,password});
    if(!zodResult)
        throw new AppError(
            "INVALID_LOGIN_CREDENTIALS",
            zodResult.error,
            400
        );
    const result = await loginService(email,password);
    const obj = responseDataAggregator(req,{
        success:true,
        data:{
            token:result.token,
        }
    });
    
    res.status(200).json(obj)
})

// params
export const getProfileController = asyncHandler(async(req,res)=>{
    const {user_id} = req.params;
    let user_data;
    if(!user_id)
        throw new AppError(
            "USER_ID_NOT_SENT",
            "please send valid user_id",
            400
        );
    else if(user_id == "self")
        user_data = await getProfileService(req.user.user_id);   
    else
        user_data = await getProfileService(user_id);
    
    // console.log(user_data);

    const obj = responseDataAggregator(req,{
        success:true,
        data:user_data
    });
    
    res.status(200).json(obj);
})

export const setKnowMeController = asyncHandler(async(req,res)=>{
    const user_id = req.user.user_id;
    const know_me = req.body.know_me;
    if(know_me.length > know_meLength)
        throw new AppError(
            "KNOW_ME_LIMIT_EXCEEDED",
            "know_me must be under 250 characters",
            400
        );
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
    // console.log(result);
    const obj = responseDataAggregator(req,{
        success:true,
        mode: result
    });
    res.status(200).json(obj);
})