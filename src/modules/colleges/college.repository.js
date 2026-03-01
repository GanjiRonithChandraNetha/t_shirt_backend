import { pool } from '../../database/connection.js'

const getCollegesRepository = async()=>{
    const data = await pool.query("SELECT college_id,college_name from colleges;");
    return data.rows;
}

const getBranchesRepository = async(college_id)=>{
    const data = await pool.query(
        "SELECT branch_id,branch_name from branches WHERE college_id = $1;",
        [college_id]
    )
    return data.rows;
}

const getSectionsRepository = async(branch_id)=>{
    const data = await pool.query(
        "SELECT section_id,section_name FROM sections WHERE branch_id = $1",
        [branch_id]
    )
    return data.rows;
}

const getCollegeStatsRepository = async(user_id)=>{
    const data = await pool.query(`
            SELECT
                -- Enrollment
                COUNT(*) FILTER (WHERE b.college_id = ul.college_id) AS college_enrolled,
                COUNT(*) FILTER (WHERE s.branch_id  = ul.branch_id)  AS branch_enrolled,
                COUNT(*) FILTER (WHERE s.section_id = ul.section_id) AS section_enrolled,

                -- Capacity
                college_cap.total AS college_capacity,
                branch_cap.total  AS branch_capacity,
                ul.strength       AS section_capacity

            FROM users u
            JOIN sections s ON s.section_id = u.section_id
            JOIN branches b ON b.branch_id = s.branch_id

            CROSS JOIN (
                SELECT 
                    s2.section_id,
                    s2.strength,
                    s2.branch_id,
                    b2.college_id
                FROM users u2
                JOIN sections s2 ON s2.section_id = u2.section_id
                JOIN branches b2 ON b2.branch_id = s2.branch_id
                WHERE u2.user_id = $1
            ) ul

        -- Capacity from sections directly (NOT from users)
            JOIN (
                SELECT b2.college_id, SUM(s2.strength) AS total
                FROM sections s2
                JOIN branches b2 ON b2.branch_id = s2.branch_id
                GROUP BY b2.college_id
            ) college_cap ON college_cap.college_id = ul.college_id

            JOIN (
                SELECT branch_id, SUM(strength) AS total
                FROM sections
                GROUP BY branch_id
            ) branch_cap ON branch_cap.branch_id = ul.branch_id;
        `,[user_id]);
    return data.rows[0];
}

export default {
    getBranchesRepository,
    getCollegesRepository,
    getSectionsRepository,
    getCollegeStatsRepository
}