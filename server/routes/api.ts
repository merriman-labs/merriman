import { Router } from 'express';
import { Container } from 'inversify';
import {
  AuthenticatedControllers,
  UnauthenticatedControllers
} from '../Controllers';
import { ensureLoggedIn } from '../Middleware/EnsureLoggedIn';

const getApiRouter = (container: Container) => {
  const apiRouter = Router();

  UnauthenticatedControllers(container).forEach(({ path, router }) => {
    console.info(`Binding unauthenticated controller to /api${path}`);
    apiRouter.use(path, router);
  });

  AuthenticatedControllers(container).forEach(({ path, router }) => {
    console.info(`Binding authenticated controller to /api${path}`);
    apiRouter.use(path, ensureLoggedIn, router);
  });
  return apiRouter;
};

export default getApiRouter;
