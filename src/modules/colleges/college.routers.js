import { Router } from "express";
import { getBranchesController,
    getSectionsController,
    getCollegeStatsController,
    getCollegesController
 } from "./college.controllers.js";


const router = Router();

router.get("/branches/:college_id",getBranchesController);
router.get("/colleges",getCollegesController);
router.get("/sections/:branch_id",getSectionsController);

router.get("/engagement",getCollegeStatsController);

export default router;