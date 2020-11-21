import { RequestLogResponse } from '../../server/models';

class AdminRA {
  getRequestLogs(
    skip: number,
    limit: number
  ): Promise<Array<RequestLogResponse>> {
    return fetch(
      `/api/admin/request-logs?skip=${skip}&limit=${limit}`
    ).then((x) => x.json());
  }
}

export default new AdminRA();
