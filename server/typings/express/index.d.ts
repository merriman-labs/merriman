import { UserInfo } from '../../models/User/UserInfo';

declare global {
  declare namespace Express {
    export interface Request {
      user?: Omit<UserInfo, 'password'>;
    }
  }
}
