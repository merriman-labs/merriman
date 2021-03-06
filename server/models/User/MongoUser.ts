import { ObjectId } from 'mongodb';
import { UserRole } from '../../Constant/UserRole';

export interface MongoUser {
  _id: ObjectId;
  username: string;
  password: string;
  roles: Array<UserRole>;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
  lastLoginAt: Date;
}
