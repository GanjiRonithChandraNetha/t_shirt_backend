import multer from 'multer';
import path from 'path';
import AppError from '../utils/AppError.js';
import crypto from 'crypto';


const profilePicStorage = multer.diskStorage({
    destination:(req,file,cb)=>{
        cb(null,'../../../images/profilePic');
    },
    filename:(req,file,cb)=>{
        const ext = path.extname(file.originalname);
        const user_id = req.user.user_id;
        if(!user_id) throw new AppError(
            "JWT_BYPASED",
            "jwt authenticaltion was bypassed illeagly",
            400
        );
        cb(null,user_id+ext);
    }
});

const profilePicFilefilter = (req,file,cb)=>{
    const allowedTypes = ['image/png','image/jpeg'];
    if(allowedTypes.includes(file.mimetype)) cb(null,true);
    else throw new AppError(
        "INVALID_IMAGE_TYPE",
        "please upload png/jpeg files only of size 2MB",
        400
    );
}

export const profilePicUpload = multer({
    storage:profilePicStorage,
    fileFilter:profilePicFilefilter,
    limits: 2 * 1024 * 1024
});


const stikerStorage = multer.diskStorage({
    diskStorage:(req,file,cb)=>{
        cb(null,"../../../images/stikers");
    },
    filename:(req,file,cb)=>{
        const ext = path.extname(file.originalname);
        const randomString = crypto.randomBytes(32).toString('hex');
        cb(null,randomString+ext);
    }
});

const stikerFileFilter = (req,file,cb)=>{
    const allowedTypes = ['image/png','image/jpeg'];
    if(allowedTypes.includes(file.mimetype)) cb(null,true);
    else throw new AppError(
        "INVALID_IMAGE_TYPE",
        "please upload png/jpeg files only of size 2MB",
        400
    );
}

export const stikerUpload = multer({
    storage:stikerStorage,
    fileFilter:stikerFileFilter,
    limits: 2 * 1024 * 1024
});

const voteImageStorage = multer.diskStorage({
    destination:(req,file,cb)=>{
        cb(null,'../../../images/voteImages');
    },
    filename:(req,file,cb)=>{
        const ext = path.extname(file.originalname);
        const newName = "vote_image_"+req.user.user_id+ext;
        cb(null,newName);
    }
});

const voteImageFileFilter = (req,file,cb)=>{
    const allowedTypes = ['image/png','image/jpeg'];
    if(allowedTypes.includes(file.mimetype)) cb(null,true);
    else throw new AppError(
        "INVALID_IMAGE_TYPE",
        "please upload png/jpeg files only of size 2MB",
        400
    );
}

export const voteImageUpload = multer({
    storage:voteImageStorage,
    fileFilter:voteImageFileFilter,
    limits: 2*1024*1024
});