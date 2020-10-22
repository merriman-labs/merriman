import { Router } from 'express';
import { Container } from 'inversify';
import { Controllers } from '../Controllers';

const getApiRouter = (container: Container) => {
  const apiRouter = Router();

  Controllers(container).forEach(({ path, router }) =>
    apiRouter.use(path, router)
  );
  return apiRouter;
};

export default getApiRouter;
