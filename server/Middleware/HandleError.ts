import { NextFunction, Request, RequestHandler, Response } from 'express';

export function HandleError(handler: RequestHandler): RequestHandler {
  return async function HandleErrorInternalWrapper(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const result = await handler(req, res, next);
      return result;
    } catch (err) {
      next(err);
    }
  };
}
