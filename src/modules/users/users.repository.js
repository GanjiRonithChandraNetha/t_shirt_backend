import { pool } from '../../database/connection.js';
import AppError from '../../shared/utils/AppError.js';


export const findUserRepository = async(email,mobile_no)=>{
    return await pool.query(
        "SELECT user_id FROM users WHERE email=$1 OR mobile_no=$2",
        [email,mobile_no]
    );
}

export const userRegistrationRepository = async({
    name,
    section_id,
    mobile_no,
    email,
    size
})=>{
    const user_data = await pool.query(`
            INSERT INTO users (section_id,mobile_no,email,name,size) 
            VALUES ($1,$2,$3,$4,$5)
            RETURNING user_id,section_id,mobile_no,email,name,size;
        `,[section_id,mobile_no,email,name,size]); 

    return user_data.rows[0];
}

export const setProfliePicRepository = async(filePath,user_id)=>{
    const result = await pool.query(`
            UPDATE users SET profile_pic = $1 WHERE user_id = $2 RETURNING profile_pic;
        `,[filePath,user_id]
    );
    if(result.rows.length == 0) throw new AppError(
        "USER_DOESNT_EXISTS",
        "there is no user with provided user_id please login in again",
        400
    )
    return result.rows[0];
}

export const setPreRegistrationDetailsRepository = async(
    {
        name,
        section_id,
        mobile_no,
        email,
        size
    },user_id
)=>{
    const result = await pool.query(
        `UPDATE users SET 
            name = $1,
            section_id = $2,
            mobile_no = $3,
            email = $4,
            size = $5
        WHERE user_id = $6
        RETURNING name,section_id,mobile_no,email,size,user_id
        `,[name,section_id,mobile_no,email,size,user_id]
    );
    if(result.rows.length == 0) throw new AppError(
        "USER_DOESNT_EXISTS",
        "there is no user with provided user_id please login in again",
        400
    )
    return result.rows[0];
}

export const forgotPasswordRequestRepository = async({token,expires,email})=>{
    const result = await pool.query(`
            UPDATE users SET reset_token = $1 ,
            reset_token_expires = $2
            WHERE email = $3
            RETURNING reset_token_expires,user_id;
        `,[token,expires,email]
    );

    if(result.length == 0)
        throw new AppError(
            "INVALID_EMAIL",
            "user with this eamil:"+email+" doent exists ",
            404
        );
    return result.rows[0]
}


export const getUserResetToken = async(user_id)=>{
    const result = await pool.query(
        "SELECT reset_token, reset_token_expires FROM users WHERE user_id = $1",
        [user_id]
    );

    return result.rows;
}

export const updateUserPassword = async(user_id,password)=>{
    const result = await pool.query(
        "UPDATE users SET password = $1 WHERE user_id = $2",
        [password,user_id]
    );

    return result;
}

export const loginRespository = async(email)=>{
    return await pool.query(
        "SELECT user_id,password,section_id FROM users WHERE email = $1",
        [email]
    );
}

export const getProfileRepository = async(user_id)=>{
    return await pool.query(
        "SELECT name,profile_pic,visibility,know_me,visibility FROM users WHERE user_id = $1",
        [user_id]
    );
}

export const setKnowMeRepository = async(user_id,know_me)=>{
    return await pool.query(
        "UPDATE users SET know_me = $1 WHERE user_id = $2",
        [know_me,user_id]
    );
}


export const getAllUsersInCollegeRepository = async(section_id)=>{
    return await pool.query(`SELECT 
            u.user_id,
            b.branch_name,
            s.section_name,
            u.name,
            u.know_me,
            u.profile_pic
        FROM users u
        JOIN sections s ON u.section_id = s.section_id
        JOIN branches b ON s.branch_id = b.branch_id
        JOIN colleges c ON b.college_id = c.college_id
        WHERE c.college_id = (
            SELECT c2.college_id
            FROM sections s2
            JOIN branches b2 ON s2.branch_id = b2.branch_id
            JOIN colleges c2 ON b2.college_id = c2.college_id
            WHERE s2.section_id = $1
        );`,
        [section_id]
    );
}

export const setVisibilityRepository = async(user_id,mode)=>{
    return await pool.query(
        `UPDATE users SET visibiltiy=$1 WHERE user_id=$2`,
        [mode,user_id]
    );
}