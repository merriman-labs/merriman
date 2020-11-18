import { UserInfo } from '../../server/models/User/UserInfo';

export function isSuperadmin(user: UserInfo | null) {
  return user?.roles.includes(4) ?? false;
}
