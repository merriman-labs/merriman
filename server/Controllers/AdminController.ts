import { RequestHandler, Router } from 'express';
import { inject, injectable } from 'inversify';
import { DependencyType } from '../Constant/DependencyType';
import { ServerLogManager } from '../Managers/ServerLogManager';
import { ensureAdmin } from '../Middleware/EnsureAdmin';
import { AsyncRouter } from '../Utilities/AsyncRouter';
import { IController } from './IController';

@injectable()
export class AdminController implements IController {
  router: Router = AsyncRouter();
  path: string = '/admin';
  constructor(
    @inject(DependencyType.Managers.ServerLog)
    private _serverLogManager: ServerLogManager
  ) {
    this.router.post(`/stop`, ensureAdmin, this.stopServer);
    this.router.get('/request-logs', ensureAdmin, this.requestLogs);
  }

  requestLogs: RequestHandler = async (req, res, next) => {
    const { skip = '0', limit = '25' } = req.query;

    const skipParsed = +skip;
    const limitParsed = +limit;

    const logs = await this._serverLogManager.getRequestLogs({
      skip: skipParsed,
      limit: limitParsed
    });
    res.json(logs);
  };

  /**
   * Stop the server.
   * @param req
   * @param res
   */
  stopServer(req, res) {
    console.warn('Stopping server due to admin request');
    process.exit(0);
  }
}
