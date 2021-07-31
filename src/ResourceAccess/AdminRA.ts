import { RequestLogResponse } from '../../server/models';
import { get } from '../util/HttpMethods';

class AdminRA {
  getRequestLogs(
    skip: number,
    limit: number
  ): Promise<Array<RequestLogResponse>> {
    return get('/api/admin/request-logs', { skip, limit });
  }
}

export default new AdminRA();
