import { RequestHandler } from 'express';
import { UnauthorizedError } from '../Errors/UnauthorizedError';
import { UserInfo } from '../models/User/UserInfo';
import { isSuperadmin } from '../Utilities/isSuperadmin';

export const ensureSuperadmin: RequestHandler = (req, res, next) => {
  if (!req.user || !isSuperadmin(req.user as UserInfo)) {
    throw new UnauthorizedError('Superadmin is required!');
  }
  next();
};
