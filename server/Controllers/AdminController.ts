import { Router } from 'express';
import { IController } from './IController';

export class AdminController implements IController {
  router: Router = Router();
  path: string = 'admin';
  constructor() {
    this.router.post(`/stop`, this.stopServer);
  }

  stopServer(req, res) {
    process.exit(0);
  }
}
