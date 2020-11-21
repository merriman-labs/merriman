import { RequestHandler } from 'express';
import { Container } from 'inversify';
import { DependencyType } from '../Constant/DependencyType';
import { ServerLogManager } from '../Managers/ServerLogManager';
import { UserInfo } from '../models/User/UserInfo';

export default (container: Container): RequestHandler => {
  const logMgr = container.get<ServerLogManager>(
    DependencyType.Managers.ServerLog
  );
  return async function logger(req, res, next) {
    const start = process.hrtime();
    res.on('finish', () => {
      const [elapsedSec, elapsedUSec] = process.hrtime(start);
      const responseTimeMs = elapsedSec * 1e3 + elapsedUSec * 1e-6;
      logMgr.addRequestLog({
        responseTimeMs,
        contentLength: parseInt(res.get('Content-Length'), 10) || 0,
        date: new Date(),
        method: req.method,
        remoteAddr: req.ip || req.connection.remoteAddress,
        status: res.statusCode,
        url: req.url,
        user: req.user as UserInfo
      });
    });
    next();
  };
};
