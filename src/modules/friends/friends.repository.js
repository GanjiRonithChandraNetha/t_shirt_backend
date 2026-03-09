import { pool } from "../../database/connection.js";

export const getFriendsRepository = async(user_id)=>{
    return await pool.query(
        `SELECT 
            CASE 
                WHEN follower = $1 THEN followee 
                ELSE follower
            END AS friend_id        
        FROM followers 
        WHERE (followee= $1 OR follower = $1)
        AND status = 'accepted';`
        ,[user_id]
    );
}

export const getPendingRequestSentRepository = async(user_id)=>{
    return await pool.query(
        `SELECT id,follower,status FROM followers
        WHERE followee=$1 AND status='pending'`,
        [user_id]
    );
}

export const getPendingRequestReceivedRepository = async(user_id)=>{
    return await pool.query(
        `SELECT id,followee,status FROM followers
        WHERE follower=$1 AND status='pending'`,
        [user_id]
    );
}
export const sendRequestRepository = async(user_id,friend_id)=>{
    return await pool.query(
        `INSERT INTO followers (followee, follower, status)
        VALUES ($1, $2, 'pending')
        ON CONFLICT ON CONSTRAINT  unique_follow_pair_min_max
        DO UPDATE
        SET status = CASE
            WHEN followers.status = 'pending' THEN 'accepted'
            WHEN followers.status = 'rejected' THEN 'pending'
            ELSE followers.status
        END
        WHERE followers.status != 'accepted'
        RETURNING status;`,
        [user_id,friend_id]
    );
}

export const acceptOrRejectRequestRepository = async({id ,user_id ,type})=>{
    // const result = await pool.query(
    //     "SELECT * FROM followers WHERE follower=$2 AND status = 'pending' AND followee=$1",
    //     [id,user_id]
    // );
    // console.log(id,user_id);
    // console.log(result);
    return await pool.query(
        `UPDATE followers SET status = $1 
        WHERE follower=$2 AND status = 'pending' AND followee=$3
        RETURNING follower,status`,
        [type,id,user_id]
    );
}

export const cancelRequestRepository = async(user_id,friend_id)=>{
    return await pool.query(
        `DELETE FROM followers 
        WHERE (
            (followee=$1 AND follower=$2)
            OR 
            (follower=$1 AND followee=$2)
        )
        AND status = 'pending'`,
        [user_id,friend_id]
    );
}

export const unfriendRepository = async(user_id,friend_id)=>{
    return await pool.query(
        `DELETE FROM followers 
        WHERE (
            (followee=$1 AND follower=$2)
            OR 
            (follower=$1 AND followee=$2)
        )
        AND status = 'accepted'`,
        [user_id,friend_id]
    );
}