import AuthRA from '../ResourceAccess/AuthRA';

class AuthManager {
  login(creds: { username: string; password: string }) {
    return AuthRA.login(creds);
  }
}

export default new AuthManager();
