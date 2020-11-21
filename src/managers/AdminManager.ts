import AdminRA from '../ResourceAccess/AdminRA';

class AdminManager {
  getRequestLogs(skip: number, limit: number) {
    return AdminRA.getRequestLogs(skip, limit);
  }
}

export default new AdminManager();
