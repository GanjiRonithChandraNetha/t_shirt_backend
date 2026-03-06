import { asyncHandler } from "../../shared/utils/asyncHandler";
import { responseDataAggregator } from "../../shared/utils/responseDataAggregator";
import { 
    getFriendsService,
    getPendingRequestSentService,
    getPendingRequestReceivedService,
    sendRequestService,
    acceptOrRejectRequestService,
    cancelRequestService,
    unfriendService
} from "./friends.service";


export const getFriendsController = asyncHandler(async(req,res)=>{
    const user_id = req.user.user_id;
    const friends = await getFriendsService(user_id);
    const obj = responseDataAggregator(req,{success:true,data:friends});
    res.status(200).json(obj);
})

export const getPendingRequestSentController = asyncHandler(async(req,res)=>{
    const user_id = req.user.user_id;
    const requestSent = await getPendingRequestSentService(user_id);
    const obj = responseDataAggregator(req,{success:true,data:requestSent});
    res.status(200).json(obj);
});

export const getPendingRequestRecievedController = asyncHandler(async(req,res)=>{
    const user_id = req.user.user_id;
    const requestReceived = await getPendingRequestReceivedService(user_id);
    const obj = responseDataAggregator(req,{success:true,data:requestReceived});
    res.status(200).json(obj);
})

export const sendRequestController = asyncHandler(async(req,res)=>{
    const friend_id = req.params.user_id;
    const user_id = req.user.user_id;
    const message = await sendRequestService(user_id,friend_id);
    const obj = responseDataAggregator(req,{success:true,data:message});
    res.status(200).json(obj);
})

export const acceptOrRejectRequestController = asyncHandler(async(req,res)=>{
    const id = req.params.follow_id;
    const type = req.query.response;
    const user_id = req.user.user_id;
    await acceptOrRejectRequestService(id,user_id,type);
    const obj = responseDataAggregator(req,{success:true});
    res.status(200).json(obj);
})

export const cancelRequestController = asyncHandler(async(req,res)=>{
    const friend_id = req.body.friend_id;
    const user_id = req.user.user_id;
    await cancelRequestService(user_id,friend_id);
    const obj = responseDataAggregator(req,{success:true});
    res.status(200).json(obj);
});

export const unfriendController = asyncHandler(async(req,res)=>{
    const friend_id = req.body.friend_id;
    const user_id = req.user.user_id;
    await unfriendService(user_id,friend_id);
    const obj  = responseDataAggregator(req,{success:true});
    res.status(200).json(obj); 
})