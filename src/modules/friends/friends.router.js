import { Route } from "express";
import { 
    getFriendsController,
    getPendingRequestRecievedController,
    getPendingRequestSentController,
    sendRequestController,
    acceptOrRejectRequestController,
    cancelRequestController,
    unfriendController
} from "./friends.controller";

const router = Route();

router.get('/friends',getFriendsController);
router.get('/friends/pending-request-sent',getPendingRequestSentController);
router.get('/friends/pending-request-recived',getPendingRequestRecievedController)
router.post('/frineds/:friend_id',sendRequestController);
router.patch('/friends/pending-request-recived/respond',acceptOrRejectRequestController);
router.patch('/friends/pending-request-sent/cancel',cancelRequestController);
router.patch('/friends/un-friend',unfriendController);


export default router;