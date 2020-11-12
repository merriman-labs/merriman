import { RequestHandler, Router } from 'express';
import { inject, injectable } from 'inversify';
import { AppContext } from '../appContext';
import { DependencyType } from '../Constant/DependencyType';
import { HttpStatus } from '../Constant/HttpStatus';
import { FileSystemManager } from '../Managers/FileSystemManager';
import { ensureSuperadmin } from '../Middleware/EnsureSuperadmin';
import { isSuperadmin } from '../Utilities/isSuperadmin';
import { IController } from './IController';

@injectable()
export class ServerController implements IController {
  path = '/server';
  router = Router();

  constructor(
    @inject(DependencyType.Managers.FileSystem)
    private _fsManager: FileSystemManager
  ) {
    const config = AppContext.get(AppContext.WellKnown.Config);
    if (config.allowUnsafeFileAccess) {
      console.warn('Unsafe file access is being allowed to superadmins!');
      this.router.get('/:path?', ensureSuperadmin, this.listDirectory);
    } else {
      this.router.use((req, res) => {
        return res.status(HttpStatus.Unauthorized).send('NOT_ALLOWED');
      });
    }
  }

  listDirectory: RequestHandler = (req, res) => {
    const config = AppContext.get(AppContext.WellKnown.Config);
    const path = req.params.path || config.mediaLocation;
    const files = this._fsManager.ls(path);
    return res.json(files);
  };
}
