import * as bcrypt from 'bcryptjs';
import { ObjectId } from 'mongodb';
import { UserRole } from '../../Constant/UserRole';
import { UserCreatePayload } from '../../Managers/UserManager';
import { MongoUser } from './MongoUser';

export class User {
  _id: ObjectId;
  username: string;
  password: string;
  roles: Array<UserRole>;
  isActive: boolean = false;

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
    const timestamp = new Date();
    return {
      _id: this._id,
      username: this.username,
      password: this.password,
      roles: this.roles,
      isActive: this.isActive,
      createdAt: timestamp,
      updatedAt: timestamp,
      lastLoginAt: timestamp
    };
  }

  toApiResponse() {
    return {
      _id: this._id,
      username: this.username,
      roles: this.roles,
      isActive: this.isActive
    };
  }

  hashPassword() {
    const salt = bcrypt.genSaltSync(10);
    const passwordHash = bcrypt.hashSync(this.password, salt);
    this.password = passwordHash;
  }
}
