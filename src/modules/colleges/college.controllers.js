import {
    getCollegesService,
    getBranchesService,
    getSectionsService
} from "./college.service.js";

import { asyncHandler } from "../../shared/utils/asyncHandler.js";

export const getCollegesController = asyncHandler(async (req, res) => {
    const colleges = await getCollegesService();
    res.status(200).json({ success: true, data: colleges });
});

export const getBranchesController = asyncHandler(async (req, res) => {
    // console.log(req.params);
    // console.log(req.query);
    console.log(req.params);
    const data = req.params;
    console.log(data);
    console.log(req.params);
    const { college_id } = req.params;
    console.log(college_id);
    const branches = await getBranchesService(college_id);
    res.status(200).json({ success: true, data: branches });
});

export const getSectionsController = asyncHandler(async (req, res) => {
    const { branch_id } = req.params;
    const sections = await getSectionsService(branch_id);
    res.status(200).json({ success: true, data: sections });
});

// protected route
export const getCollegeStatsController = asyncHandler(async (req,res)=>{
    const {user_id} = req.user //req shoudl have user section which will store data derived from token
    const stats = await getCollegeStatsService(user_id);
    res.status(200).json({success:true,data:stats});
})