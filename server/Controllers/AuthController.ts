import { RequestHandler, Router } from 'express';
import { inject, injectable } from 'inversify';
import { DependencyType } from '../Constant/DependencyType';
import { AuthManager } from '../Managers/AuthManager';
import { IController } from './IController';
import * as passport from 'passport';

@injectable()
export class AuthController implements IController {
  router = Router();
  path = '/auth';

  constructor(@inject(DependencyType.Managers.Auth) _authManager: AuthManager) {
    this.router.post(
      '/login',
      passport.authenticate('local', { failureRedirect: '/login' }),
      function(req, res) {
        res.redirect('/');
      }
    );
    this.router.get('/logout', this.logout);
  }

  logout: RequestHandler = (req, res) => {
    req.logout();
    res.redirect('/');
  };
}
