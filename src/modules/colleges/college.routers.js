import { Router } from "express";
import { getBranchesController,
    getSectionsController,
    getCollegeStatsController,
    getCollegesController
} from "./college.controllers.js";
import { jwtChecker } from "../../shared/middleware/jwtChecker.js";

const router = Router();

router.get("/branches/:college_id",getBranchesController);
router.get("/colleges",getCollegesController);
router.get("/sections/:branch_id",getSectionsController);

//prottected
router.get("/engagement",jwtChecker,getCollegeStatsController);

export default router;