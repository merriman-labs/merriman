// @ts-nocheck
import { NextFunction, Request, Response } from 'express';

export function ensureLoggedIn(
  req: Request,
  res: Response,
  next: NextFunction
) {
  if (!req.isAuthenticated || !req.isAuthenticated() || !req.user.isActive) {
    if (req.session) {
      req.session.returnTo = req.originalUrl || req.url;
    }
    return res.redirect('/login');
  }
  next();
}
