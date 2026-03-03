import { Result } from "pg";
import { pool } from "../../database/connection";

export const getFriendsRepository = async(user_id)=>{
    return await pool.query(
        `SELECT 
            CASE 
                WHEN follower = $1 THEN followee 
                ELSE follwer
            END AS friend_id        
        FROM followers 
        WHERE (followee= $1 OR follower = $1)
        AND status = 'accepted';`
        ,[user_id]
    );
}

export const getPendingRequestSentRepository = async(user_id)=>{
    return await pool.query(
        `SELECT id,follower,status FROM 
        WHERE followee=$1 AND status='pending'`,
        [user_id]
    );
}

export const getPendingRequestReceivedRepository = async(user_id)=>{
    return await pool.query(
        `SELECT id,followee,status FROM 
        WHERE follower=$1 AND status='pending'`,
        [user_id]
    );
}