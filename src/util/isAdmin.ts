import { UserInfo } from '../../server/models/User/UserInfo';

export function isAdmin(user: UserInfo | null) {
  return user?.roles.includes(2) ?? false;
}
