import { sign } from "crypto";
import { pool } from "../../database/connection.js";


export const sendSignAnonymousRepository = async (
    receiver_id,
    user_id,
    signData,
    anonymousLimit
) => {
    const client = await pool.connect();

    try {
        await client.query("BEGIN");

        // 🔥 Atomic check + increment
        // // console.log(receiver_id,user_id);

        const updateRes = await client.query(
            `UPDATE users
            SET anonymous_count = anonymous_count + 1
            WHERE user_id = $1
                AND visibility = 'anonymous'
                AND anonymous_count < $2
            RETURNING anonymous_count`,
            [receiver_id,anonymousLimit]
        );

        if (updateRes.rowCount === 0) {
            // console.log(updateRes);
            const checkIfAnoymousOrNot = await client.query(
                `SELECT visibility FROM users WHERE user_id = $1`,
                [receiver_id]
            );
            await client.query("ROLLBACK");
            // console.log(checkIfAnoymousOrNot.rows)
            if(checkIfAnoymousOrNot.rows[0].visibility !== "anonymous")
                return { success: false, message: "User Doesnt allow Anonymous limit",anonymousCheck:false };
            else
                return { success: false, message: "Limit reached",anonymousCheck:true };
        }

        // Insert signature
        const insertRes = await client.query(
            `INSERT INTO signatures (user_id, quote, message, sticker, type)
            VALUES ($1, $2, $3, $4, 'anonymous')
            RETURNING *`,
            [receiver_id, signData.quote, signData.message, signData.sticker]
        );

        await client.query("COMMIT");
        return {success:true,data:insertRes};

    } catch (err) {
        await client.query("ROLLBACK");
        throw err;
    } finally {
        client.release();
    }
};

export const sendSignRepository = async(receiver_id,user_id,signData)=>{
    // console.log(receiver_id,user_id);
    return await pool.query(
        `WITH is_friend AS (
            SELECT EXISTS (
                SELECT 1 FROM followers f
                WHERE (
                    (f.followee = $1 AND f.follower = $2)
                    OR
                    (f.followee = $2 AND f.follower = $1)
                )
                AND f.status = 'accepted'
            ) AS val
        )
        INSERT INTO signatures
        (user_id, author_id, quote, message, sticker, type)
        SELECT 
            $1,
            $2,
            $3,
            $4,
            $5,
            CASE 
                WHEN is_friend.val THEN 'friends_only'::message_mode_type
                ELSE 'non_anonymous'::message_mode_type
            END
        FROM users u, is_friend
        WHERE u.user_id = $1
        AND (
            u.visibility <> 'friends_only'
            OR is_friend.val
        )
        ON CONFLICT ON CONSTRAINT unique_named_signature_per_author
        DO UPDATE SET
            sticker = EXCLUDED.sticker,
            message = EXCLUDED.message,
            quote = EXCLUDED.quote,
            updated_at = NOW()
        WHERE signatures.signed_at > NOW() - INTERVAL '10 minutes';`,
        [receiver_id,user_id,signData.quote,signData.message,signData.sticker]
    );
}

export const getAllSignRepository = async(user_id)=>{
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
            u.mobile_no,
            u.email,
            u.profile_pic,
            u.visibility
        FROM signatures s
        LEFT JOIN users u ON u.user_id = s.author_id
        WHERE s.user_id = $1`,
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

export const getOldStickerAnoRepository = async(user_id,sign_id)=>{
    return await pool.query(
        `SELECT sticker FROM signatures 
        WHERE user_id = $1 AND sign_id = $2 AND type='anonymous'`,
        [user_id,sign_id]
    );
}

export const deleteNonAnonymousSignRepository = async(user_id,sign_id,author_id)=>{
    return await pool.query(
        `DELETE FROM signatures 
        WHERE user_id = $1 AND sign_id = $2 AND author_id = $3 AND type <>'anonymous'`,
        [user_id,sign_id,author_id]
    );
}

export const getOldStickerNonAnoRepository = async(user_id,sign_id,author_id)=>{
    return await pool.query(
        `SELECT sticker FROM signatures 
        WHERE user_id = $1 AND sign_id = $2 AND author_id = $3 AND type <>'anonymous'`,
        [user_id,sign_id,author_id]
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