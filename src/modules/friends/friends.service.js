import AppError from "../../shared/utils/AppError";
import { ERROR_CODES } from "../../shared/constants/errorCodes";
import { 
    getFriendsRepository,
    getPendingRequestSentRepository,
    getPendingRequestReceivedRepository 
} from "./friends.repository";


export const getFriendsService = async(user_id)=>{
    if(!user_id)
        throw new AppError(
            "INVALID_USER_ID",
            ERROR_CODES.INVALID_USER_ID.message,
            ERROR_CODES.INVALID_USER_ID.statusCode
        );
    const friends = await getFriendsRepository(user_id);
    const data = friends.rows.map(ele=>ele.friend_id);
    return data;
}


export const getPendingRequestSentService = async(user_id)=>{
    if(!user_id)
        throw new AppError(
            "INVALID_USER_ID",
            ERROR_CODES.INVALID_USER_ID.message,
            ERROR_CODES.INVALID_USER_ID.statusCode
        );
    const result = await getPendingRequestSentRepository(user_id);
    return result.rows;
}

export const getPendingRequestReceivedService = async(user_id)=>{
    if(!user_id)
        throw new AppError(
            "INVALID_USER_ID",
            ERROR_CODES.INVALID_USER_ID.message,
            ERROR_CODES.INVALID_USER_ID.statusCode
        );
    const result = await getPendingRequestReceivedRepository(user_id);
}