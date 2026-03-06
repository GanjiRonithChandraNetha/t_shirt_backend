import { pool } from "../../database/connection";

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
        `SELECT id,followee,status FROM 
        WHERE follower=$1 AND status='pending'`,
        [user_id]
    );
}
export const sendRequestRepository = async(user_id,friend_id)=>{
    return await pool.query(
        `INSERT INTO friends (followee, follower, status)
        VALUES ($1, $2, 'pending')
        ON CONFLICT ON CONSTRAINT unique_follow_pair
        DO UPDATE
        SET status = CASE
            WHEN friends.status = 'pending' THEN 'accepted'
            WHEN friends.status = 'rejected' THEN 'pending'
            ELSE friends.status
        END
        WHERE friends.status != 'accepted'
        RETURNING status;`,
        [user_id,friend_id]
    );
}

export const acceptOrRejectRequestRepository = async(id ,user_id ,type)=>{
    return await pg.query(
        `UPDATE followers SET status = $1 
        WHERE id=$2 AND status = 'pending' AND followee=$3
        RETURNING id,status`,
        [type,id, user_id]
    );
}

export const cancelRequestRepository = async(user_id,friend_id)=>{
    return await pg.query(
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
    return await pg.query(
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