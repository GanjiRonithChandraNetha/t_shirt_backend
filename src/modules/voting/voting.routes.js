import { allowVotingMiddleware } from "../../shared/middleware/allowVoting.middleware";
import { 
    voteController,
    submitClassImageController,
    classImagesController,
    finalClassImageController
} from "./voting.controller";
import { voteImageUpload } from "../../shared/middleware/multer.middleware";
import { Route } from "express";


const router = Route();

router.post('/vote/:cadidate_id',allowVotingMiddleware,voteController);
router.post('/vote/upload-class-image',allowVotingMiddleware,voteImageUpload.single("classImage"),submitClassImageController);
router.get('/vote/nominees',allowVotingMiddleware,classImagesController);
router.get('/final-class-image',finalClassImageController);

export default router;