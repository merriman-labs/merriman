import { Router } from 'express';
import { injectable } from 'inversify';
import { IController } from './IController';

@injectable()
export class AdminController implements IController {
  router: Router = Router();
  path: string = '/admin';
  constructor() {
    this.router.post(`/stop`, this.stopServer);
  }

  /**
   * Stop the server.
   * @param req
   * @param res
   */
  stopServer(req, res) {
    process.exit(0);
  }
}
