import { sign } from "crypto";
import { pool } from "../../database/connection.js";


export const sendSignAnoymousRepository = async(reciver_id,user_id,signData,anonymousLimit)=>{
    const client = await pool.connect();
    try{    
        await client.query("BEGIN");
        await client.query(
            `SELECT 1 
            FROM users 
            WHERE user_id = $1
            FOR UPDATE`,
            [reciver_id]
        );
        
        const result =  await client.query(
            `INSERT INTO signatures
            (user_id,quote,message,sticker,type)
            SELECT $1,$2,$3,$4,'anonymous'
            WHERE
                (
                    SELECT COUNT(*) FROM signatures s1 
                    WHERE s1.user_id = $1 AND s1.type='anonymous'
                ) < $5
            `, 
            [reciver_id,signData.quote,signData.message,signData.sticker,anonymousLimit]
        );

        await client.query("COMMIT");

        return result;

    }catch(err){
        await client.query("ROLLBACK")
        return err;
    }
    finally{
        client.release()
    }
}

export const sendSignRepository = async(reciver_id,user_id,signData)=>{
    return await pool.query(
        `INSERT INTO signatures
        (user_id,author,quote,message,sticker,type)
        SELECT $1,$2,$3,$4,$5,'non_anonymous'
        FROM users u
        WHERE u.user_id = $1 AND
        (
            u.visibility <> 'friends_only'
            OR EXISTS(
                SELECT 1 FROM followers f
                WHERE (
                    (f.followee=$1 AND f.follower=$2)
                    OR
                    (f.followee=$2 AND f.follower=$1)
                ) AND
                f.status='accepted'
            )
        )
        ON CONFLICT ON CONSTRAINT unique_named_signature_per_author
        DO UPDATE SET
        sticker = EXCLUDED.sticker,
        message = EXCLUDED.message,
        quote = EXCLUDED.quote,
        updated_at = NOW()
        WHERE signed_at > NOW() - INTERVAL '10 minutes'`,
        [reciver_id,user_id,signData.quote,signData.message,signData.sticker]
    );
}

export const getAllSignService = async(user_id)=>{
    return await pool.query(
        `SELECT 
            s.sign_id,
            s.author_id,
            s.type,
            s.sticker,
            s.message,
            s.quote,
            s.viewed,  
            u.name,
            u.mobile AS mobile_no,
            u.email,
            u.profile_pic,
            u.visibility
        FROM signatures s
        LEFT JOIN users u ON u.user_id = s.author_id
        WHERE user_id = $1`,
        [user_id]
    );
}

export const deleteAnonymousSignRepository = async(user_id,sign_id)=>{
    return await pool.query(
        `DELETE FROM signatures 
        WHERE user_id = $1 AND sign_id = $2 AND type='anonymous'`,
        [user_id,sign_id]
    );
}

export const viewedSignRepository = async(user_id,sign_idArr)=>{
    return await pool.query(
        `UPDATE signatures 
        SET viewed = true
        WHERE sign_id = ANY($1)
        AND user_id=$2
        RETURNING sign_id`,
        [sign_idArr,user_id]
    );
}