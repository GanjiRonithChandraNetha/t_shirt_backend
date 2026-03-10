import express from 'express';
import collegeRoutes  from './modules/colleges/college.routers.js';
import userRouters from './modules/users/users.routes.js';
import signatureRoutes from './modules/signatures/signatures.routes.js';
import voteRoutes from './modules/voting/voting.routes.js';
import friendsRoutes from './modules/friends/friends.router.js'
import errorMiddleware from './shared/middleware/error.middleware.js';
import { jwtChecker } from './shared/middleware/jwtChecker.js';
import cors from 'cors';

const app = express();
app.use(express.json());
// app.use(cors({
//     origin:  [
//     "http://localhost:5173",
//     "http://localhost:5174",
//     "http://192.168.29.215:8081/_expo/loading"
//   ],
//     credentials: true
// }));
app.use(cors());


app.use("/college",collegeRoutes);
app.use("/",userRouters);
app.use("/",jwtChecker,signatureRoutes);
app.use('/main-t-shirt',jwtChecker,voteRoutes);
app.use("/friends",jwtChecker,friendsRoutes);
app.use(errorMiddleware);
export default app;