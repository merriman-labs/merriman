import { RequestHandler, Router } from 'express';
import { inject, injectable } from 'inversify';
import { DependencyType } from '../Constant/DependencyType';
import { UserManager } from '../Managers/UserManager';
import { IController } from './IController';

@injectable()
export class UserController implements IController {
  router = Router();
  path = '/users';
  constructor(
    @inject(DependencyType.Managers.User) private _userManager: UserManager
  ) {
    this.router.get('/', this.list);
    this.router.post('/create', this.create);
  }
  list: RequestHandler = async (req, res) => {
    const result = await this._userManager.list();
    return res.json(result);
  };
  create: RequestHandler = async (req, res, next) => {
    const result = await this._userManager.create(req.body);
    req.login(result, (err) => {
      if (err) next(err);
      res.json(result);
    });
  };
}
