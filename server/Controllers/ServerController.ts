import { RequestHandler, Router } from 'express';
import { inject, injectable } from 'inversify';
import { AppContext } from '../appContext';
import { DependencyType } from '../Constant/DependencyType';
import { FileSystemManager } from '../Managers/FileSystemManager';
import { IController } from './IController';

@injectable()
export class ServerController implements IController {
  path = '/server';
  router = Router();

  constructor(
    @inject(DependencyType.Managers.FileSystem)
    private _fsManager: FileSystemManager
  ) {
    this.router.get('/:path?', this.listDirectory);
  }

  listDirectory: RequestHandler = (req, res) => {
    console.log('here');
    const config = AppContext.get(AppContext.WellKnown.Config);
    const path = req.params.path || config.mediaLocation;
    const files = this._fsManager.ls(path);
    return res.json(files);
  };
}
