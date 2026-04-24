import { Router } from "express";
import { 
    // sendSignController,
    sendSignControllerV2,
    getAllSignsController,
    deleteAnonymousSignController,
    viewedSignController,
    deleteNonAnonymousSignController
} from "./signatures.controller.js";
import { stikerUpload } from "../../shared/middleware/multer.middleware.js";
const router = Router();


//vesrion 1: deonst use Object storage
// router.post('/signature',stikerUpload.single("sticker"),sendSignController);

//version 2: uses Object Storage
router.post('/signature',sendSignControllerV2);

router.get('/signatures',getAllSignsController);
router.delete('/signature/anonymous/:sign_id',deleteAnonymousSignController);
router.patch('/signature',viewedSignController);
router.delete('/signature',deleteNonAnonymousSignController);


export default router;