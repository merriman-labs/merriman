import { RequestHandler, Router } from 'express';
import { inject, injectable } from 'inversify';
import { DependencyType } from '../Constant/DependencyType';
import { AuthManager } from '../Managers/AuthManager';
import { IController } from './IController';
import passport from 'passport';
import { AsyncRouter } from '../Utilities/AsyncRouter';

@injectable()
export class AuthController implements IController {
  router = AsyncRouter();
  path = '/auth';

  constructor(@inject(DependencyType.Managers.Auth) _authManager: AuthManager) {
    this.router.post(
      '/login',
      function (req, res, next) {
        passport.authenticate('local', function (err, user) {
          if (err || !user) {
            return res.status(401).json('AUTH_INVALID');
          }
          return req.logIn(user, function (err) {
            if (err) {
              return next(err);
            }
            return next();
          });
        })(req, res, next);
      },
      (req, res) => {
        return res.json(req.user);
      }
    );
    this.router.get('/logout', this.logout);
  }

  logout: RequestHandler = (req, res) => {
    req.logout(() => {});
    res.redirect('/');
  };
}
