import { pool } from '../../database/connection.js';
import AppError from '../../shared/utils/AppError.js';

export const userRegistrationRepository = async({
    name,
    section_id,
    mobile_no,
    email,
    size
})=>{
    const user_data = await pool.query(`
            INSERT INTO TABLE users (section_id,mobile_no,email,name,size) 
            VALUES ($1,$2,$3,$4,$5)
            RETURNING user_id,section_id,mobile_no,email,name,size;
        `,[name,section_id,mobile_no,email,size]); 

    return user_data.rows[0];
}

export const setProfliePicRepository = async(filePath)=>{
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
        RETURING name,section_id,mobile_no,email,size,user_id
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
        "SELECT reset_token, reset_token_expires FROM users WHERE user_id = $1"
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
        "SELECT user_id,password FROM users WHERE email = $1",
        [email]
    );
}

export const getProfileRepository = async(user_id)=>{
    return await pool.query(
        "SELECT name,profile_pic,visibility,know_me FROM users WHERE user_id = $1",
        [user_id]
    );
}

export const setKnowMeRepository = async(user_id,know_me)=>{
    return await pool.query(
        "UPDATE user SET know_me = $1 WHERE user_id = $2",
        [know_me,user_id]
    );
}