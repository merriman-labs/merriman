import { RequestHandler } from 'express';
import { UnauthorizedError } from '../Errors/UnauthorizedError';
import { UserInfo } from '../models/User/UserInfo';
import { isAdmin } from '../Utilities/isAdmin';

export const ensureAdmin: RequestHandler = (req, res, next) => {
  // @ts-ignore
  if (!req.user || !isAdmin(req.user as UserInfo)) {
    throw new UnauthorizedError('Admin is required!');
  }
  next();
};
