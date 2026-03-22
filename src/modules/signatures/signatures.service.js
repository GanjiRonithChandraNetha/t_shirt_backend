import AppError from "../../shared/utils/AppError.js";
import { ERROR_CODES } from "../../shared/constants/errorCodes.js";

import { 
    sendSignAnonymousRepository,
    sendSignRepository,
    getAllSignRepository,
    deleteAnonymousSignRepository,
    viewedSignRepository
} from "./signatures.repository.js";

const anonymousLimit = process.env.ANONYMOUS_LIMIT || 20;
export const sendSignServer = async(user_id,receiver_id,signData)=>{
    const type = signData.type;
    if(receiver_id === user_id){
        throw new AppError(
            "SIGN_CANT_BE_SENT_TO_YOURSELF",
            "u attempetd to send sign to your self go get somefriends",
            400
        );
    }
    if(!receiver_id)
        throw new AppError(
            "INVALID_REQEST",
            "reciver id not sent ",
            400
        );
    if(type == 'anonymous'){
        const result = await sendSignAnonymousRepository(receiver_id,user_id,signData,anonymousLimit);
        if(!result.success)
            throw new AppError(
                "ANONYMOUS_LIMIT_REACHED",
                "cannot send anonymous sign as limit reached ("+anonymousLimit + ")",
                400
            )

        if(result.data.error == "error")
            throw new AppError(
                result.code,
                result.message,
                400
            );

        if(result.data.rowCount === 0){
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
        const result = await sendSignRepository(receiver_id,user_id,signData);
        console.log("receiver_id: "+receiver_id,"  user_id:"+user_id);
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
    if(result.rowCount === 0) return [];
    return result.rows;
}


export const deleteAnonymousSignService = async(user_id,sign_id)=>{
    if(!sign_id)
        throw new AppError(
            "INVALID_SIGN",
            "no sign is sent",
            404
        );
    const result = await deleteAnonymousSignRepository(user_id,sign_id);
    console.log(user_id,sign_id);
    console.log(result.rowCount);
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
        sign_ids:result.rows[0]
    };
}