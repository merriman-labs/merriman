import { UserInfo } from '../../server/models/User/UserInfo';

class UserRA {
  create(creds: { username: string; password: string }): Promise<UserInfo> {
    return fetch('/api/users/create', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(creds)
    }).then((x) => x.json());
  }

  currentUser(): Promise<UserInfo> {
    return fetch('/api/users/me')
      .then((x) => x.json())
      .catch((x) => null);
  }
}

export default new UserRA();
