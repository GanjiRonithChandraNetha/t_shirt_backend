import { Router } from "express";
import { 
    sendSignController,
    getAllSignsController,
    deleteAnonymousSignController,
    viewedSignController 
} from "./signatures.controller.js";
import { stikerUpload } from "../../shared/middleware/multer.middleware.js";
const router = Router();

router.post('/signature',stikerUpload.single("sticker"),sendSignController);
router.get('/signatures',getAllSignsController);
router.delete('/signature/:sign_id',deleteAnonymousSignController);
router.patch('/signature',viewedSignController);


export default router;