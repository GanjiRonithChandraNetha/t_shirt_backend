import { allowVotingMiddleware } from "../../shared/middleware/allowVoting.middleware.js";
import { 
    voteController,
    submitClassImageController,
    classImagesController,
    finalClassImageController
} from "./voting.controller.js";
import { voteImageUpload } from "../../shared/middleware/multer.middleware.js";
import { Router } from "express";


const router = Router();

router.post('/vote/:cadidate_id',allowVotingMiddleware,voteController);
router.post('/vote/upload-class-image',allowVotingMiddleware,voteImageUpload.single("classImage"),submitClassImageController);
router.get('/vote/nominees',allowVotingMiddleware,classImagesController);
router.get('/final-class-image',finalClassImageController);

export default router;