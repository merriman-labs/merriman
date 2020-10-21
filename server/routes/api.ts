import { Router } from 'express';
import { Controllers } from '../Controllers';

const apiRouter = Router();

Controllers.forEach(({ path, router }) => apiRouter.use(path, router));

export default apiRouter;
