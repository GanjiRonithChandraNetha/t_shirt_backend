import { impDates } from "../constants/dates.js"
import AppError from "../utils/AppError.js";
import { asyncHandler } from "../utils/asyncHandler.js"

export const allowVotingMiddleware = asyncHandler(async(req,res,next)=>{
    const currentDate = Date.now();
    if(currentDate < impDates.VOTING_START_DATE)
        throw new AppError(
            "VOTING_NOT_STARTED",
            "voteing will start after "+impDates.VOTING_START_DATE.toDateString(),
            400
        )
    
    if(currentDate > impDates.VOTING_END_DATE)
        throw new AppError(
            "VOTING_ENDED",
            "voteing ended at "+impDates.VOTING_END_DATE.toDateString(),
            400
        );

    next();
});