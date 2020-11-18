import { UserRole } from '../Constant/UserRole';
import { UserInfo } from '../models/User/UserInfo';

export function isAdmin(user: UserInfo) {
  return user.roles.includes(UserRole.Admin);
}
