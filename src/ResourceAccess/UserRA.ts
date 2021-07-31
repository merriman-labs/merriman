import { UserInfo } from '../../server/models/User/UserInfo';
import { patch, post } from '../util/HttpMethods';
class UserRA {
  list(): Promise<Array<UserInfo>> {
    return fetch('/api/users/').then((x) => x.json());
  }
  create(creds: { username: string; password: string }): Promise<UserInfo> {
    return post('/api/users/create', creds);
  }

  currentUser(): Promise<UserInfo> {
    return fetch('/api/users/me')
      .then((x) => x.json())
      .catch((x) => null);
  }

  async setIsActive(_id: string, isActive: boolean) {
    await patch('/api/users/setIsActive', { _id, isActive });
  }
}

export default new UserRA();
