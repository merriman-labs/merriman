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
    this.router.post('/create', this.create);
  }
  create: RequestHandler = async (req, res) => {
    const result = await this._userManager.create(req.body);
    res.json(result);
  };
}
