import {
    getCollegesService,
    getBranchesService,
    getSectionsService,
    getCollegeStatsService
} from "./college.service.js";

import { asyncHandler } from "../../shared/utils/asyncHandler.js";
import { responseDataAggregator } from "../../shared/utils/responseDataAggregator.js";


export const getCollegesController = asyncHandler(async (req, res) => {
    const colleges = await getCollegesService();
    const obj = responseDataAggregator(req,{ success: true, data: colleges });
    res.status(200).json(obj);
});

export const getBranchesController = asyncHandler(async (req, res) => {
    // console.log(req.params);
    // console.log(req.query);
    const data = req.params;
    const { college_id } = req.params;
    const branches = await getBranchesService(college_id);

    const obj = responseDataAggregator(req,{ success: true, data: branches });

    res.status(200).json(obj);
});

export const getSectionsController = asyncHandler(async (req, res) => {
    const { branch_id } = req.params;
    const sections = await getSectionsService(branch_id);
    
    const obj = responseDataAggregator(req,{ success: true, data: sections });

    res.status(200).json(obj);
});

// protected route
export const getCollegeStatsController = asyncHandler(async (req,res)=>{
    const {user_id} = req.user //req shoudl have user section which will store data derived from token
    const stats = await getCollegeStatsService(user_id);
    const obj = decoderesponseDataAggregator(req,{success:true,data:stats});
    res.status(200).json(obj);
})