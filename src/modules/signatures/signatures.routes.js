import { Router } from "express";
import { 
    sendSignController,
    getAllSignsController,
    deleteAnonymousSignController,
    viewedSignController 
} from "./signatures.controller";

const router = Router();

router.post('/signature',sendSignController);
router.get('/signatures',getAllSignsController);
router.delete('/signature/:sign_id',deleteAnonymousSignController);
router.patch('/signature',viewedSignController);


export default router;