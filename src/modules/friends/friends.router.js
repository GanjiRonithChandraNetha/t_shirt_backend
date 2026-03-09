import { Router } from "express";
import { 
    getFriendsController,
    getPendingRequestRecievedController,
    getPendingRequestSentController,
    sendRequestController,
    acceptOrRejectRequestController,
    cancelRequestController,
    unfriendController
} from "./friends.controller.js";

const router = Router();

router.get('/',getFriendsController);
router.get('/pending-request-sent',getPendingRequestSentController);
router.get('/pending-request-recived',getPendingRequestRecievedController)
router.post('/:friend_id',sendRequestController);
router.patch('/pending-request-recived/respond',acceptOrRejectRequestController);
router.patch('/pending-request-sent/cancel',cancelRequestController);
router.patch('/un-friend',unfriendController);


export default router;