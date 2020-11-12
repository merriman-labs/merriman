import * as bcrypt from 'bcrypt';
import { ObjectId } from 'mongodb';
import { UserRole } from '../../Constant/UserRole';
import { UserCreatePayload } from '../../Managers/UserManager';
import { MongoUser } from './MongoUser';

export class User {
  _id: ObjectId;
  username: string;
  password: string;
  roles: Array<UserRole>;

  constructor();
  constructor(user: UserCreatePayload);
  constructor(user?: UserCreatePayload) {
    if (user) {
      this.username = user.username;
      this.password = user.password;
      this.roles = [UserRole.User];
      this._id = new ObjectId();
      this.hashPassword();
    }
  }

  toMongo(): MongoUser {
    return {
      _id: this._id,
      username: this.username,
      password: this.password,
      roles: this.roles
    };
  }

  toApiResponse() {
    return {
      _id: this._id,
      username: this.username,
      roles: this.roles
    };
  }

  hashPassword() {
    const salt = bcrypt.genSaltSync(10);
    const passwordHash = bcrypt.hashSync(this.password, salt);
    this.password = passwordHash;
  }
}