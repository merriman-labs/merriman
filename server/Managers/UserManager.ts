import { inject, injectable } from 'inversify';
import { DependencyType } from '../Constant/DependencyType';
import { ConflictError } from '../Errors/ConflictError';
import { User } from '../models/User/User';
import { UserInfo } from '../models/User/UserInfo';
import { UserRA } from '../ResourceAccess/UserRA';
import Validator from '../Validation/Validator';

export type UserCreatePayload = {
  username: string;
  password: string;
};

@injectable()
export class UserManager {
  constructor(
    @inject(DependencyType.ResourceAccess.User) private _userRA: UserRA
  ) {}
  async create(user: UserCreatePayload) {
    const payload = Validator.User.Create(user);
    const existingUser = await this._userRA.getByEmail(payload.username);
    if (existingUser) throw new ConflictError('User already exists');

    const newUser = new User(user);
    newUser.hashPassword();
    const results = await this._userRA.create(newUser);
    return results.toApiResponse();
  }

  async getById(id: string): Promise<UserInfo> {
    const dbUser = await this._userRA.getById(id);
    return {
      _id: dbUser._id.toHexString(),
      roles: dbUser.roles,
      username: dbUser.username
    };
  }
}
