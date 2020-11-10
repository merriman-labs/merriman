import { Router } from 'express';
import { injectable } from 'inversify';
import { ensureAdmin } from '../Middleware/EnsureAdmin';
import { IController } from './IController';

@injectable()
export class AdminController implements IController {
  router: Router = Router();
  path: string = '/admin';
  constructor() {
    this.router.post(`/stop`, ensureAdmin, this.stopServer);
  }

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
