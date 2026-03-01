import {Pool} from 'pg';

console.log(process.env.DB_HOST);

export const pool = new Pool({
    host:process.env.DB_HOST,
    port:process.env.DB_PORT,
    user:process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database:process.env.DB_NAME
});

pool.on('connect',()=>{
    console.log("connected to the database");
})

pool.on('error',()=>{
    console.log("data base crached");
    process.exit(-1);
})

// export default {pool}