import multer from 'multer';
import path from 'path';
import AppError from '../utils/AppError.js'

const storage = multer.diskStorage({
    destination:(req,file,cb)=>{
        cb(null,'../profile_pics');
    },
    filename:(req,file,cb)=>{
        const ext = path.extname(file.originalname);
        const user_id = req.users.user_id;
        if(!user_id) throw new AppError(
            "JWT_BYPASED",
            "jwt authenticaltion was bypassed illeagly",
            400
        );
        cb(null,user_id+ext);
    }
});

const filefilter = (req,file,cb)=>{
    const allowedTypes = ['image/png','image/jpeg'];
    if(allowedTypes.includes(file.mimetype)) cb(null,true);
    else throw new AppError(
        "INVALID_IMAGE_TYPE",
        "please upload png/jpeg files only of size 2MB",
        400
    );
}

export const upload = multer({
    storage,
    filefilter,
    limits: 2 * 1024 * 1024
});