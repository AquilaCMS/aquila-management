import { Router } from 'express';
import secondController from '../controllers/controller2.js';

const secondRouter = Router();

secondRouter.get('/', async (req, res, next) => {
    try {
        res.send(await secondController.getData());
    } catch (err) {
        next(err);
    }
});

export default secondRouter;
