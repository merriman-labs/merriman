import { RequestHandler, Router } from 'express';
import { inject, injectable } from 'inversify';
import { DependencyType } from '../Constant/DependencyType';
import { MediaManager } from '../Managers/MediaManager';
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
    private _serverLogManager: ServerLogManager,
    @inject(DependencyType.Managers.Media) private _mediaManager: MediaManager
  ) {
    this.router.post(`/stop`, ensureAdmin, this.stopServer);
    this.router.get('/request-logs', ensureAdmin, this.requestLogs);
    this.router.post('/migrate-media', ensureAdmin, this.migrateMedia);
    this.router.get('/list-fs', ensureAdmin, this.listFilesystemFiles);
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

  listFilesystemFiles: RequestHandler = async (req, res) => {
    const files = await this._mediaManager.getByStorageScheme('filesystem');
    return res.json(files);
  };

  migrateMedia: RequestHandler = async (req, res) => {
    const {
      body: { id: mediaId },
      user: { _id: userId }
    } = req;
    await this._mediaManager.migrateToS3(mediaId, userId);
    return res.json({ status: 'ok' });
  };
}
