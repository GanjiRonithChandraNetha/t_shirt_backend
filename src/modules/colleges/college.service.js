import AppError from "../../shared/utils/AppError.js";
import { ERROR_CODES } from "../../shared/constants/errorCodes.js";
import  collegeRepoFun from "./college.repository.js";

const {
    getBranchesRepository,
    getSectionsRepository,
    getCollegesRepository,
    getCollegeStatsRepository
} = collegeRepoFun

export const getCollegesService = async () => {
    return await getCollegesRepository();
};

export const getBranchesService = async (college_id) => {
    if (!college_id || isNaN(college_id)) {
        throw new AppError(
            "INVALID_COLLEGE_ID",
            "College ID is malformed",
            ERROR_CODES.INVALID_COLLEGE_ID.statusCode
        );
    }

    const branches = await getBranchesRepository(college_id);

    if (!branches.length) {
        throw new AppError(
            "COLLEGE_NOT_FOUND",
            "No branches found for this college",
            404
        );
    }

    return branches;
};

export const getSectionsService = async (branch_id) => {
    if (!branch_id || isNaN(branch_id)) {
        throw new AppError(
            "INVALID_BRANCH_ID",
            "Branch ID is malformed",
            400
        );
    }

    const sections = await getSectionsRepository(branch_id);

    if (!sections.length) {
        throw new AppError(
            "SECTION_NOT_FOUND",
            "No sections found",
            404
        );
    }

    return sections;
};

export const getCollegeStatsService = async (user_id)=>{
    if (!user_id || isNaN(user_id)) {
        throw new AppError(
            "INVALID_USER_ID",
            "Branch ID is malformed",
            400
        );
    }
    
    const statData = await getCollegeStatsRepository(user_id);

    if(!statData){
        throw new AppError(
            "COULD_NOT_GET_STATS",
            "could not create stat data",
            500
        )
    }
}