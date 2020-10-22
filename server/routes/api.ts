import { Router } from 'express';
import { Controllers } from '../Controllers';

const getApiRouter = () => {
  const apiRouter = Router();

  Controllers().forEach(({ path, router }) => apiRouter.use(path, router));
  return apiRouter;
};

export default getApiRouter;
