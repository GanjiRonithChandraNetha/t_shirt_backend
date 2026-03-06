import AppError from '../../shared/utils/AppError.js';
import asyncHandler from '../../shared/utils/asyncHandler.js';
import { signDataValidator } from './signatures.validators.js';
import { 
    sendSignServer,
    getAllSignService,
    deleteAnonymousSignService,
    viewedSignService
 } from './signatures.service.js';
import { responseDataAggregator } from "../../shared/utils/responseDataAggregator.js";


export const sendSignController = asyncHandler(async(req,res)=>{
    const signData = req.body.signData;
    const user_id = req.user.user_id;
    const reciver_id = req.body.reciver_id;
    if(!signData.quote )
        throw new AppError(
            "INVALID_SIGN_DATA",
            "sign data is incomplete please send proper data",
            400
        );

    signData.quote = signData.quote.trim();
    signData.message = (!signData.message)?null:signData.message.trim();
    signData.sticker = (!req.file)?null:req.file.path;
    
    const zodResult = signDataValidator.safeParse(signData);
    if(!zodResult.success)
        throw new AppError(
            "VALIDATION_ERROR",
            zodResult.error.issues,
            400
        );
    
    const result = await sendSignServer(user_id,reciver_id,signData);
    const obj = responseDataAggregator(req,{
        success:true,
        message:result.message
    });
    
    res.status(200).json(obj)
})

export const getAllSignsController = asyncHandler(async(req,res)=>{
    const user_id = req.user.user_id;
    const result = await getAllSignService(user_id);
    const obj = responseDataAggregator(req,result);
    res.status(200).json(obj);
})

export const deleteAnonymousSignController = asyncHandler(async(req,res)=>{
    const user_id = req.user_id;
    const sign_id = req.params.sign_id;
    const result = await deleteAnonymousSignService(user_id,sign_id);
    const obj = responseDataAggregator(req,)
})

export const viewedSignController = asyncHandler(async(req,res)=>{
    const user_id = req.user_id;
    const sign_idArr = req.body.sign_idArr;
    const result = await viewedSignService(user_id,sign_idArr);
    const obj = responseDataAggregator(req,result);
    res.status(200).json(obj);
})