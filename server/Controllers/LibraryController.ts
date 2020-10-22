import { RequestHandler, Router } from 'express';
import * as R from 'ramda';
import { MediaManager } from '../Managers/MediaManager';
import { LibraryManager } from '../Managers/LibraryManager';
import { IController } from './IController';
import { inject, injectable } from 'inversify';
import { DependencyType } from '../Constant/DependencyType';

@injectable()
export class LibraryController implements IController {
  router: Router = Router();
  path: string = '/library';
  constructor(
    @inject(DependencyType.Managers.Library)
    private _libraryManager: LibraryManager,
    @inject(DependencyType.Managers.Media) private _mediaManager: MediaManager
  ) {
    this.router.get('/', this.list);
    this.router.post('/', this.create);
    this.router.put('/', this.update);
    this.router.get('/:id', this.getById);
    this.router.get('/:library', this.getMediaForLibrary);
    this.router.patch('/', this.modifyMedia);
    this.router.delete('/:id', this.deleteLibrary);
  }
  create = async (req, res) => {
    const library = req.body;
    const result = await this._libraryManager.insert(library);
    res.json(result);
  };
  update = async (req, res) => {
    const library = req.body;
    const result = await this._libraryManager.update(library);
    return res.json(result);
  };

  deleteLibrary = (req, res) => {
    const id = req.params.id;
    if (id) this._libraryManager.delete(id).then(_ => res.sendStatus(200));
  };

  list: RequestHandler = async (req, res) => {
    const response = await this._libraryManager.get();
    res.json(response);
  };

  getById: RequestHandler = async (req, res) => {
    const { id } = req.params;
    const library = await this._libraryManager.findById(id);

    if (!library)
      return res.status(500).json({ message: 'Library not found!' });
    res.json(library);
  };

  getMediaForLibrary: RequestHandler = async (req, res) => {
    const id = req.params.library;
    const library = await this._libraryManager.findById(id);

    const media = await this._mediaManager.where(({ _id }) =>
      R.contains(_id, library.items)
    );

    if (!library)
      return res.status(500).json({ message: 'Library not found!' });
    res.json({ media });
  };

  modifyMedia: RequestHandler = async (req, res) => {
    const { library, media, action } = req.body;
    if (library && media && action) {
      if (action === 'ADD') {
        this._libraryManager
          .addMediaToLibrary(media, library)
          .then(() => res.sendStatus(200));
      }
      if (action === 'DROP') {
        this._libraryManager
          .removeMediaFromLibrary(media, library)
          .then(() => res.sendStatus(200));
      }
    } else {
      res.sendStatus(500);
    }
  };
}
