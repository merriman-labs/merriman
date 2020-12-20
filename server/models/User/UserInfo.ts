import { UserRole } from '../../Constant/UserRole';

export interface UserInfo {
  _id: string;
  username: string;
  roles: Array<UserRole>;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
  lastLoginAt: Date;
}
