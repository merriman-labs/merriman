import { RequestHandler } from 'express';
import { inject, injectable } from 'inversify';
import { DependencyType } from '../Constant/DependencyType';
import { UnauthorizedError } from '../Errors/UnauthorizedError';
import { UserManager } from '../Managers/UserManager';
import { AsyncRouter } from '../Utilities/AsyncRouter';
import { IController } from './IController';

@injectable()
export class UserController implements IController {
  router = AsyncRouter();
  path = '/users';
  constructor(
    @inject(DependencyType.Managers.User) private _userManager: UserManager
  ) {
    this.router.get('/', this.list);
    this.router.post('/create', this.create);
    this.router.get('/me', this.currentUser);
  }
  list: RequestHandler = async (req, res) => {
    const result = await this._userManager.list();
    return res.json(result);
  };
  create: RequestHandler = async (req, res, next) => {
    const result = await this._userManager.create(req.body);
    // @ts-ignore
    req.login(result, (err) => {
      if (err) next(err);
      res.json(result);
    });
  };
  currentUser: RequestHandler = async (req, res, next) => {
    const user = req.user;
    if (!user) throw new UnauthorizedError('UNAUTHORIZED');

    res.json(user);
  };
}
