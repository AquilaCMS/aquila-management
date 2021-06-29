import { Router } from 'express';
import firstRoute from './routes/route1.js';
import secondRoute from './routes/route2.js';

const sampleRouter = Router();

sampleRouter.use('/route1', firstRoute);
sampleRouter.use('/route2', secondRoute);

export default sampleRouter;
