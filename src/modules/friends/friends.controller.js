import { asyncHandler } from "../../shared/utils/asyncHandler";
import { responseDataAggregator } from "../../shared/utils/responseDataAggregator";
import { 
    getFriendsService,
    getPendingRequestSentService,
    getPendingRequestReceivedService
} from "./friends.service";


export const getFriendsController = asyncHandler(async(req,res)=>{
    const user_id = req.user.user_id;
    const friends = await getFriendsService(user_id);
    const obj = responseDataAggregator({success:true,data:friends});
    res.status(200).json(obj);
})

export const getPendingRequestSentController = asyncHandler(async(req,res)=>{
    const user_id = req.user.user_id;
    const requestSent = await getPendingRequestSentService(user_id);
    const obj = responseDataAggregator({success:true,data:requestSent});
    res.status(200).json(obj);
});

export const getPendingRequestRecievedController = asyncHandler(async(req,res)=>{
    const user_id = req.user.user_id;
    const requestReceived = await getPendingRequestReceivedService(user_id);
    const obj = responseDataAggregator({success:true,data:requestReceived});
    res.status(200).json(obj);
})