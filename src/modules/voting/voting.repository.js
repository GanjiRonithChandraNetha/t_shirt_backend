import {pool} from '../../database/connection.js'

export const voteRepository = async(user_id,candidate_id)=>{
    return await pool.query(
        `INSERT INTO votes(voter_id,voted_for)
        VALUES ($1,$2)
        ON CONFLICT ON CONSTRAINT unique_vote_per_voter
        DO UPDATE
        SET voted_id = $2;`,
        [user_id,candidate_id]
    );
}

export const submitClassImageRepository = async(user_id,file_url)=>{
    return await pool.query(
        `WITH remove_voted AS 
        (DELETE FROM votes WHERE voted_for = $1
        RETURNING voter_id),
        remove_self_vote AS
        (DELETE FROM votes WHERE voter_id = $1 
        RETURNING voter_for),
        update_image AS 
        (UPDATE users SET class_img = $2 WHERE user_id= $1 
        RETURNING user_id,class_img),
        insert_self_vote AS
        (INSERT INTO votes(voter_id,voted_for) VALUES ($1,$1)
        RETURNING voted_id,voted_for)
        SELECT 
            (SELECT COALESCE(ARRAY_AGG(voter_id),'{}') FROM remove_voted) AS voted_people,
            (SELECT COALESCE(ARRAY_AGG(voted_for),'{}') FROM remove_self_vote) AS voted_for_earler,
            (SELECT JSON_BUILD_OBJECT 
            ('user_id',user_id,'class_img',class_img)
            FROM update_image) AS updated_details,
        *
        FROM insert_self_vote;`,
        [user_id,file_url]
    );
}


export const classImagesRepository = async(section_id)=>{
    return await pool.query(
        `SELECT 
        u.name,u.user_id,u.class_img,v.vote_count
        FROM users u JOIN 
        (SELECT voter_for,COUNT(*) as vote_count 
        FROM votes GROUP BY voted_for) v ON u.user_id = v.voter_for
        WHERE u.section_id = $1;`,
        [section_id]
    );
}

export const finalClassImageRepository = async(section_id)=>{
    return await pool.query(
        `SELECT class_pic_final,image_author 
        FROM sections WHERE section_id = $1;`,
        [section_id]
    );
}

export const finalizeClassImageForeEverySectionRepository = async()=>{
    return await pool.query(
        `WITH vote_counts AS(
            SELECT 
                u.user_id,
                u.section_id,
                u.class_img,
                COUNT(v.voted_for) as vote_count
            FROM users u 
            LEFT JOIN votes v ON u.user_id = v.voted_for
            GROUP BY u.section_id, u.user_id,u.class_img
        ),
        top_users AS (
            SELECT DISTINCT ON (section_id)
                section_id,
                user_id,
                class_img,
                vote_count
            FROM vote_counts 
            ORDER BY section_id,vote_count DESC)
        UPDATE sections s
        SET 
            class_pic_final = t.class_img,
            image_author = t.user_id
        FROM top_users t
        WHERE t.section_id = s.section_id
        RETURNING 
            s.class_pic_final,
            s.image_author,
            s.section_id
        ; `
    );
}