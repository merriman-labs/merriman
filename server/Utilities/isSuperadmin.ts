import { UserRole } from '../Constant/UserRole';
import { UserInfo } from '../models/User/UserInfo';

export function isSuperadmin(user: UserInfo) {
  return user.roles.includes(UserRole.Superadmin);
}
