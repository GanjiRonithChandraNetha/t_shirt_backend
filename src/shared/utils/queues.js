import Queue from 'bull';

export const emailQueue = new Queue('emailQueue',{
    redis:{host:"127.0.0.1",port:6379}
})