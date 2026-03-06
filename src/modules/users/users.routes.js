import { Route } from "express";
import { forgotPasswordLimiter } from "../../shared/middleware/forgotPasswordLimiter";
import {
    userRegistrationController,
    setProfliePicController,
    setPreRegistrationDetailsController,
    forgotPasswordRequestController,
    resetPasswordController,
    loginController,
    getProfileController,
    setKnowMeController,
    getAllUsersInCollegeController,
    setVisibilityController
} from './users.controllers.js'
import { profilePicUpload } from "../../shared/middleware/multer.middleware.js";
import { jwtChecker } from "../../shared/middleware/jwtChecker.js";

const router = Route();

router.post('/auth/register',userRegistrationController);
//file name should be same from the frontend
router.post('/auth/forgot-password',forgotPasswordLimiter,forgotPasswordRequestController);
router.post('/auth/reset-password',resetPasswordController);
router.post('/auth/login',loginController);

router.patch('/user/profile-pic',jwtChecker,profilePicUpload.single('profile_pic'),setProfliePicController);
router.post('/user',jwtChecker,setPreRegistrationDetailsController);
router.get('/user/:user_id',jwtChecker,getProfileController);
router.patch('/user/know-me',jwtChecker,setKnowMeController);
router.get('/users',jwtChecker,getAllUsersInCollegeController);
router.patch('/users/mode/:mode',setVisibilityController);

export default router;