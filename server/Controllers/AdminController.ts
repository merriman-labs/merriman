import { RequestHandler, Router } from 'express';
import { inject, injectable } from 'inversify';
import { DependencyType } from '../Constant/DependencyType';
import { ServerLogManager } from '../Managers/ServerLogManager';
import { ensureAdmin } from '../Middleware/EnsureAdmin';
import { IController } from './IController';

@injectable()
export class AdminController implements IController {
  router: Router = Router();
  path: string = '/admin';
  constructor(
    @inject(DependencyType.Managers.ServerLog)
    private _serverLogManager: ServerLogManager
  ) {
    this.router.post(`/stop`, ensureAdmin, this.stopServer);
    this.router.get('/request-logs', ensureAdmin, this.requestLogs);
  }

  requestLogs: RequestHandler = async (req, res, next) => {
    let { skip = '0', limit = '25' } = req.query;
    skip = +skip;
    limit = +limit;

    const logs = await this._serverLogManager.getRequestLogs({ skip, limit });
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
