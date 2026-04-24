import AppError from '../../shared/utils/AppError.js';
import {asyncHandler} from '../../shared/utils/asyncHandler.js';
import { signDataValidator } from './signatures.validators.js';
import { 
    sendSignServer,
    getAllSignService,
    deleteAnonymousSignService,
    viewedSignService,
    deleteNonAnonymousSignServer
 } from './signatures.service.js';
import { responseDataAggregator } from "../../shared/utils/responseDataAggregator.js";
import { success } from 'zod';

// version 1: donest use Object Storage
// export const sendSignControllerV1 = asyncHandler(async(req,res)=>{
//     // console.log("HELLO");
//     // console.log(req.file);
//     // console.log(req.body);
//     const signData = req.body;
//     const user_id = req.user.user_id;
//     const receiver_id = req.body.receiver_id;
//     if(!signData.quote )
//         throw new AppError(
//             "INVALID_SIGN_DATA",
//             "sign data is incomplete please send proper data",
//             400
//         );
//     // console.log(signData);
//     // console.log(process.cwd());
//     signData.quote = signData.quote.trim();
//     signData.message = (!signData.message)?null:signData.message.trim();
//     signData.sticker = (!req.file)?null:req.file.path;
    
//     // console.log(signData);
//     const zodResult = signDataValidator.safeParse(signData);
//     if(!zodResult.success)
//         throw new AppError(
//             "VALIDATION_ERROR",
//             zodResult.error.issues,
//             400
//         );

//     // console.log(user_id,receiver_id);
    
//     const result = await sendSignServer(user_id,receiver_id,signData);
//     const obj = responseDataAggregator(req,{
//         success:true,
//         message:result.message
//     });
    
//     res.status(200).json(obj)
// })

// version 2: uees Object Storage
export const sendSignControllerV2 = asyncHandler(async(req,res)=>{
    const {quote , message, sticker,type} = req.body;
    const user_id = req.user.user_id;
    const receiver_id = req.body.receiver_id;
    // console.log(req.body);
    // console.log("\nquote: "+quote,"\nmessage: "+message,"\nsticker: "+sticker);
    if(!quote || !message || !sticker ){
        throw new AppError(
            "INVALID_SIGN_DATA",
            "sign data is incomplete please send proper data",
            400
        );
    }
    const signData = {quote,message,sticker,type};
    
    const zodResult = signDataValidator.safeParse(signData);
    if(!zodResult.success){
        throw new AppError(
            "VALIDATION_ERROR",
            zodResult.error.issues,
            400
        );
    }
    
    const result = await sendSignServer(user_id,receiver_id,signData);
    const obj = responseDataAggregator(req,{
        success:true,
        message:result.message
    });
    
    res.status(200).json(obj)
})

export const getAllSignsController = asyncHandler(async(req,res)=>{
    const user_id = req.user.user_id;
    const result = await getAllSignService(user_id);
    const obj = responseDataAggregator(req,{
        success:true,
        data:result
    });
    res.status(200).json(obj);
})

export const deleteAnonymousSignController = asyncHandler(async(req,res)=>{
    const user_id = req.user.user_id;
    const sign_id = req.params.sign_id;
    // console.log("inside DeleteAnonymousSignController");
    // console.log("user_id: "+user_id,"  sign_id: "+sign_id);
    const result = await deleteAnonymousSignService(user_id,sign_id);
    const obj = responseDataAggregator(req,{success:result});
    res.status(200).json(obj);
})

export const viewedSignController = asyncHandler(async(req,res)=>{
    const user_id = req.user_id;
    const sign_idArr = req.body.sign_idArr;
    const result = await viewedSignService(user_id,sign_idArr);
    const obj = responseDataAggregator(req,result);
    res.status(200).json(obj);
})

export const deleteNonAnonymousSignController = asyncHandler(async(req,res)=>{
    const user_id = req.user.user_id;
    const sign_id = req.query.sign_id;
    const author_id = req.query.author_id
    // console.log("inside DeleteNonAnonymousSignController");
    // console.log("user_id: "+user_id,"  sign_id: "+sign_id);
    const result = await deleteNonAnonymousSignServer(user_id,sign_id,author_id);
    const obj = responseDataAggregator(req,{success:result});
    res.status(200).json(obj);
})