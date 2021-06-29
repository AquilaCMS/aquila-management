import { Router } from 'express';
import { readFileSync } from 'fs';

const publicRouter = Router();

let modulesData = JSON.parse(readFileSync('./modules/modulesRoutes.json', 'utf8'));
modulesData = modulesData.modules;
(async () => {
    for (let i = 0; i < modulesData.length; i++) {
        const moduleRoute = `./${modulesData[i].folderName}/routes.js`;
        // TODO : Maybe a bad practice here
        const moduleRouter = await import(moduleRoute);

        publicRouter.use(modulesData[i].apiPath, moduleRouter.default);
    }
})();

export default publicRouter;
