import AdminRA from '../ResourceAccess/AdminRA';

class AdminManager {
  getRequestLogs(skip: number, limit: number) {
    return AdminRA.getRequestLogs(skip, limit);
  }

  getFSItems() {
    return AdminRA.getFSItems();
  }

  migrateItem(mediaId: string) {
    return AdminRA.migrateItem(mediaId);
  }
}

export default new AdminManager();
