import { Router } from 'express';
import { Container } from 'inversify';
import {
  AuthenticatedControllers,
  UnauthenticatedControllers
} from '../Controllers';

const getApiRouter = (container: Container) => {
  const apiRouter = Router();

  UnauthenticatedControllers(container).forEach(({ path, router }) => {
    console.info(`Binding unauthenticated controller to /api${path}`);
    apiRouter.use(path, router);
  });

  AuthenticatedControllers(container).forEach(({ path, router }) => {
    console.info(`Binding authenticated controller to /api${path}`);
    apiRouter.use(
      path,
      function(req, res, next) {
        if (!req.isAuthenticated || !req.isAuthenticated()) {
          if (req.session) {
            req.session.returnTo = req.originalUrl || req.url;
          }
          return res.redirect('/login');
        }
        next();
      },
      router
    );
  });
  return apiRouter;
};

export default getApiRouter;
