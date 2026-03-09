import pino from 'pino';
import { join } from 'path';
import fs from "fs";

const folders = [
    join(process.cwd(),"logs","reset-email"),
    join(process.cwd(),"logs","finalize-vote"),
    join(process.cwd(),"logs","redis-email")
];

folders.forEach(dir=>{
if(!fs.existsSync(dir)){
    fs.mkdirSync(dir,{recursive:true});
}
});


const createLogger = (name)=>{
    return pino({
        transport:{
            target:"pino-roll",
            options:{
                file: join(process.cwd(),"logs",name,`${name}.log`),
                frequency:"daily",
                size:"10m",
                limit:{count:500}
            }
        }
    })
}

export const emailResetLogger = createLogger("reset-email");
export const finalizeVoteLogger = createLogger("finalize-vote");
export const redisEmailLogger = createLogger('redis-email')