import 'dotenv/config';
import Queue from 'bull';

export const emailQueue = new Queue('emailQueue',{
    redis:{
        host:process.env.REDIS_2_HOST,
        port:process.env.REDIS_2_PORT
    }
})