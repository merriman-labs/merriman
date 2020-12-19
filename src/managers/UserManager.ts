import UserRA from '../ResourceAccess/UserRA';

class UserManager {
  list() {
    return UserRA.list();
  }
  create(creds: { username: string; password: string }) {
    return UserRA.create(creds);
  }

  currentUser() {
    return UserRA.currentUser();
  }

  setIsActive(id: string, isActive: boolean) {
    return UserRA.setIsActive(id, isActive);
  }
}

export default new UserManager();
