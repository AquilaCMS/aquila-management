import { Router } from 'express';
import probeRoute from './core/routes/probe.js';
import modulesRoutes from './modules/routes.js'

const publicRouter = Router();
publicRouter.use('/probe', probeRoute);
publicRouter.use('/', modulesRoutes);

export default publicRouter;
