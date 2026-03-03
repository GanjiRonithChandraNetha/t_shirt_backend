import rateLimit from 'express-rate-limit';

// only 3 request per day
const forgotPasswordLimiter = rateLimit({
    windowMs:24*60*60*100,
    max:3,
    message:"Too many password reset requests, please try again later"
})