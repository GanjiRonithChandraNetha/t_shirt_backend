import AppError from "../../shared/utils/AppError.js";
import { ERROR_CODES } from "../../shared/constants/errorCodes.js";

import { 
    sendSignAnoymousRepository,
    sendSignRepository,
    getAllSignRepository,
    deleteAnonymousSignRepository,
    viewedSignRepository
} from "./signatures.repository.js";

const anonymousLimit = process.env.ANONYMOUS_LIMIT;
export const sendSignServer = async(user_id,reciver_id,signData)=>{
    const type = signData.type;
    if(type == 'anonymous'){
        const result = await sendSignAnoymousRepository(reciver_id,user_id,signData,anonymousLimit);
        if(result.error == "error")
            throw new AppError(
                result.code,
                result.message,
                400
            );
        if(result.rowCount === 0){
            throw new AppError(
                "ANONYMOUS_LIMIT_REACHED",
                "please delete anonymous signatures to restore the limit",
                400
            );
        }
        return {
            message:"anonymous message sent successfully"
        };
    }else{
        const result = await sendSignRepository(user_id,reciver_id,signData);
        if(result.rowCount === 0){
            throw new AppError(
                "NOT_FRIENDS",
                ERROR_CODES.NOT_FRIENDS.message,
                ERROR_CODES.NOT_FRIENDS.statusCode
            );
        }
        if(result.command === "UPDATE")
            return {
                message:"signature was resend and updated successfully"
            }
        return {
            message:"signature sent successfully"
        }
    }
}


export const getAllSignService = async(user_id)=>{
    const result = await getAllSignRepository(user_id);
    if(result.rowCount === 0) return {message:"no signs found"};
    return result.rows[0];
}


export const deleteAnonymousSignService = async(user_id,sign_id)=>{
    if(!sign_id)
        throw new AppError(
            "INVALID_SIGN",
            "no sign is sent",
            404
        );
    const result = await deleteAnonymousSignRepository(user_id,sign_id);
    if(result.rowCount === 0)
          if(!sign_id)
        throw new AppError(
            "INVALID_SIGN",
            "no sign is sent",
            404
        );
    return true;
}

export const viewedSignService = async(user_id,sign_idArr)=>{
    const result = await viewedSignRepository(user_id,sign_idArr);
    return {
        rowCount:result.rowCount,
        sing_ids:result.rows[0]
    };
}