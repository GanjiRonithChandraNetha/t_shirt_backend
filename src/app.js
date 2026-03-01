import express from 'express';
import collegeRoutes  from './modules/colleges/college.routers.js';


const app = express();
app.use(express.json())
app.use("/college",collegeRoutes);

export default app;