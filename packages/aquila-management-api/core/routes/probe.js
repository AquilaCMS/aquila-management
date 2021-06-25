import { Router } from 'express';
import probeController from '../controllers/probe.js';

const probeRouter = Router();

probeRouter.get('/', async (req, res, next) => {
    try {
        res.send(probeController.getProbesList());
    } catch (err) {
        next(err);
    }
});

export default probeRouter;
