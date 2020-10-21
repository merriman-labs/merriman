import { Router } from 'express';
import { LibraryManager } from '../Managers/LibraryManager';
import { IController } from './IController';
const libraryManager = new LibraryManager();

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
