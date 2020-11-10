import { RequestHandler, Router } from 'express';
import { inject, injectable } from 'inversify';
import { DependencyType } from '../Constant/DependencyType';
import { AuthManager } from '../Managers/AuthManager';
import { IController } from './IController';
import passport from 'passport';

@injectable()
export class AuthController implements IController {
  router = Router();
  path = '/auth';

  constructor(@inject(DependencyType.Managers.Auth) _authManager: AuthManager) {
    this.router.post(
      '/login',
      function (req, res, next) {
        passport.authenticate('local', function (err, user) {
          if (err) {
            return res
              .status(401)
              .json({ success: false, errorDetails: err.message });
          }
          if (!user) {
            return res.status(401).json({
              success: false,
              errorDetails: 'Wrong email or password.'
            });
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
    req.logout();
    res.redirect('/');
  };
}
