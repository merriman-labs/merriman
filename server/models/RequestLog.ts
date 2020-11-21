import { UserInfo } from './User/UserInfo';

export interface RequestLog {
  date: Date;
  method: string;
  url: string;
  status: number;
  responseTimeMs: number;
  remoteAddr: string;
  user?: UserInfo;
  contentLength: number;
}
