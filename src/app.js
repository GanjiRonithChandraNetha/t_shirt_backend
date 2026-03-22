import express from 'express';
import collegeRoutes  from './modules/colleges/college.routers.js';
import userRouters from './modules/users/users.routes.js';
import signatureRoutes from './modules/signatures/signatures.routes.js';
import voteRoutes from './modules/voting/voting.routes.js';
import friendsRoutes from './modules/friends/friends.router.js'
import errorMiddleware from './shared/middleware/error.middleware.js';
import { jwtChecker } from './shared/middleware/jwtChecker.js';
import cors from 'cors';

import path from 'path';
import { fileURLToPath } from 'url';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use('/images', express.static('images'));
app.use(express.json());
app.use(cors({
    origin: "*",
    credentials: true
}));

app.get("/check",(req,res)=>{
    console.log(req);
    res.status(200).json({message:"hoi the server is working"});
})
app.use("/college",collegeRoutes);
app.use("/",userRouters);
app.use("/",jwtChecker,signatureRoutes);
app.use('/main-t-shirt',jwtChecker,voteRoutes);
app.use("/friends",jwtChecker,friendsRoutes);
app.use(errorMiddleware);
export default app;
