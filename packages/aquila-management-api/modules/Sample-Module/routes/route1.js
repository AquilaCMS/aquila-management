import { Router } from 'express';
import firstController from '../controllers/controller1.js';

const firstRouter = Router();

firstRouter.get('/', async (req, res, next) => {
    try {
        res.send(await firstController.getData());
    } catch (err) {
        next(err);
    }
});

export default firstRouter;
