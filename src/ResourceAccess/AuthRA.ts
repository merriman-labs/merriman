import { UserInfo } from '../../server/models/User/UserInfo';
import { get, post } from '../util/HttpMethods';

type UsernamePasswordCredentials = { username: string; password: string };

class AuthRA {
  login(creds: UsernamePasswordCredentials) {
    return post<UsernamePasswordCredentials, UserInfo>(
      '/api/auth/login',
      creds
    );
  }
  logout() {
    return get('/api/auth/logout');
  }
}

export default new AuthRA();
