import { UserInfo } from '../../server/models/User/UserInfo';
import AuthRA from '../ResourceAccess/AuthRA';

class AuthManager {
  login(creds: { username: string; password: string }): Promise<UserInfo> {
    return AuthRA.login(creds);
  }
  async logout() {
    await AuthRA.logout();
  }
}

export default new AuthManager();
