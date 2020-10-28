import { useAuth } from '../hooks/useAuth';
import AuthRA from '../ResourceAccess/AuthRA';

class AuthManager {
  login(creds: { username: string; password: string }) {
    return AuthRA.login(creds);
  }
  async logout() {
    await AuthRA.logout();
    const [, setAuth] = useAuth();
    setAuth({ initializing: true });
  }
}

export default new AuthManager();
