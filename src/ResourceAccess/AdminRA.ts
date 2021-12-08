import { MediaItem, RequestLogResponse } from '../../server/models';
import { get, post } from '../util/HttpMethods';

class AdminRA {
  getRequestLogs(
    skip: number,
    limit: number
  ): Promise<Array<RequestLogResponse>> {
    return get('/api/admin/request-logs', { skip, limit });
  }

  getFSItems(): Promise<Array<MediaItem>> {
    return get('/api/admin/list-fs');
  }

  migrateItem(mediaId: string): Promise<void> {
    return post('/api/admin/migrate-media', { id: mediaId });
  }
}

export default new AdminRA();
