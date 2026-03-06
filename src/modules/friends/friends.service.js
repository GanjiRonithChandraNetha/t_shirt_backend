import AppError from "../../shared/utils/AppError";
import { ERROR_CODES } from "../../shared/constants/errorCodes";
import { 
    getFriendsRepository,
    getPendingRequestSentRepository,
    getPendingRequestReceivedRepository,
    sendRequestRepository,
    acceptOrRejectRequestRepository,
    cancelRequestRepository,
    unfriendRepository
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
    return result.rows;
}

export const sendRequestService = async(user_id,friend_id)=>{
    if(!friend_id)
        throw new AppError(
            "INVALID_FRIEND_ID",
            "invalid friend_id sent, please try again",
            400
        );
    if(!user_id)
        throw new AppError(
            "INVALID_USER_ID",
            ERROR_CODES.INVALID_USER_ID.message,
            ERROR_CODES.INVALID_USER_ID.statusCode
        );
    const result = await sendRequestRepository(user_id,friend_id);
    if(result.rowCount == 0)
        throw new AppError(
            "ALREADY_FRIENDS",
            ERROR_CODES.ALREADY_FRIENDS.message,
            ERROR_CODES.ALREADY_FRIENDS.statusCode
        );
    return result.rows[0];
}

export const acceptOrRejectRequestService = async( id,user_id,type)=>{
    if(!["accept","reject"].includes(type))
        throw new AppError(
            "INVALID_RESPONSE",
            "illeagal response for request is sent",
            400
        );
    const result = await acceptOrRejectRequestRepository(id,user_id,type == 'accept'? "accepted" : "rejected");
    if(result.rowCount === 0)
        throw new AppError(
            "REQEST_DOEST_EXISTS",
            "reqest nolonger exits",
            404
        );
    return true;
}

export const cancelRequestService = async(user_id,friend_id)=>{
    if(!friend_id)
        throw new AppError(
            "INVALID_FRIEND_ID",
            "invalid friend_id sent, please try again",
            400
        );
    if(!user_id)
        throw new AppError(
            "INVALID_USER_ID",
            ERROR_CODES.INVALID_USER_ID.message,
            ERROR_CODES.INVALID_USER_ID.statusCode
        );
    const result = await cancelRequestRepository(user_id,friend_id);
    if(result.rowCount === 0)
        throw new AppError(
            "FRIEND_DOEST_EXISTS",
            "relationship doent exits",
            404
        );
}   

export const unfriendService = async(user_id,friend_id)=>{
    if(!friend_id)
        throw new AppError(
            "INVALID_FRIEND_ID",
            "invalid friend_id sent, please try again",
            400
        );
    if(!user_id)
        throw new AppError(
            "INVALID_USER_ID",
            ERROR_CODES.INVALID_USER_ID.message,
            ERROR_CODES.INVALID_USER_ID.statusCode
        );
    
    const result = await unfriendRepository(user_id,friend_id);
    if(result.rowCount === 0)
        throw new AppError(
            "FRIEND_DOEST_EXISTS",
            "relationship doent exits",
            404
        );
}