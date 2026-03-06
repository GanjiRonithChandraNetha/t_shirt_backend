import AppError from '../../shared/utils/AppError.js';
import {asyncHandler} from '../../shared/utils/asyncHandler.js'
import {responseDataAggregator,} from '../../shared/utils/responseDataAggregator.js'
import { 
    voteService,
    submitClassImageService,
    classImagesService,
    finalClassImageService
} from './voting.service.js';
import { impDates } from '../../shared/constants/dates.js';

export const voteController = asyncHandler(async(req,res)=>{
    const user_id = req.user.user_id;
    const candidate_id = req.params.candidate_id;
    const result = await voteService(user_id,candidate_id);
    const obj = responseDataAggregator(req,{success:"true",message:"voted successfully"});
    res.status(200).json(obj);
})

export const submitClassImageController = asyncHandler(async(req,res)=>{
    const user_id = req.user.user_id;
    const file_url = req.file.path;
    const result = await submitClassImageService(user_id,file_url);
    const obj = responseDataAggregator(req,result);
    res.status(200).json(obj);
})

export const classImagesController = asyncHandler(async(req,res)=>{
    const section_id = req.user.section_id;
    const result = await classImagesService(section_id);
    const obj = responseDataAggregator(req,result);
    res.status(200).json(obj);
})

export const finalClassImageController = asyncHandler(async(req,res)=>{
    if(Date.now() < impDates.VOTING_START_DATE)
        throw new AppError(
            "VOTING_STILL_GOING_ON",
            "voting has not been completed yet",
            400
        );
    const section_id = req.user.section_id;
    const result = await finalClassImageService(section_id);
    const obj = responseDataAggregator(req,result);
    res.status(200).json(obj);
})