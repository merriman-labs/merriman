import { inject, injectable } from 'inversify';
import _ = require('lodash');
import { DependencyType } from '../Constant/DependencyType';
import { AuthEngine } from '../Engines/AuthEngine';
import { UnauthorizedError } from '../Errors/UnauthorizedError';
import { UserRA } from '../ResourceAccess/UserRA';

@injectable()
export class AuthManager {
  constructor(
    @inject(DependencyType.ResourceAccess.User) private _userRA: UserRA,
    @inject(DependencyType.Engines.Auth) private _authEngine: AuthEngine
  ) {}
  async login(username: string, password: string) {
    const user = await this._userRA.getByEmail(username);
    if (!user) throw new UnauthorizedError('Login invalid');
    const valid = await this._authEngine.doesPasswordMatch(
      password,
      user.password
    );
    if (!valid) throw new UnauthorizedError('Login invalid');
    return _.omit(user, 'password');
  }
}
