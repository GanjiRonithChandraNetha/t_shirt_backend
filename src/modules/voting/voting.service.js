import AppError from '../../shared/utils/AppError.js'
import ERROR_CODES from '../../shared/constants/errorCodes.js'
import { 
    voteRepository,
    classImagesRepository,
    submitClassImageRepository,
    finalClassImageRepository,
    finalizeClassImageForeEverySectionRepository
 } from './voting.repository.js';


export const voteService = async(user_id,candidate_id)=>{
    const result = await voteRepository(user_id,candidate_id);
    if(result.rowCount === 0)
        throw new AppError(
            "ALREADY_VOTED",
            ERROR_CODES.ALREADY_VOTED.message,
            ERROR_CODES.ALREADY_VOTED.statusCode
        );
}


export const submitClassImageService = async(user_id,file_url)=>{
    const result = await submitClassImageRepository(user_id,file_url);
    if(result.row.length == 0)
        throw new AppError(
            "IMAGE_NOT_CHANGED",
            "please try changing the image again",
            500
        )
    return result.rows[0];
}

export const classImagesService = async(section_id)=>{
    const result = await classImagesRepository(section_id);
    if(result.rows.length == 0)
        throw new AppError(
            "NO_IMAGES_IN_THE_CLASS",
            "no one has volenteired",
            404
        );
    return result.rows;
}

export const finalClassImageService = async(section_id)=>{
    const result = await finalClassImageRepository(section_id);
    if(result.rows.length === 0)
        throw new AppError(
            "NO_CLASS_IMAGE",
            "no class image has been set",
            404
        );
    return result.rows[0]
}

export const finalizeClassImageForeEverySectionService = async()=>{
    const result = await finalizeClassImageForeEverySectionRepository();
    if(result.rows.length == 0){
        console.log("sections images not set internal server error check the query ");
        console.log(result);
        return null;
    }
    return result.rows;
} 