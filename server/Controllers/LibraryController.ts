import { RequestHandler, Router } from 'express';
import * as R from 'ramda';
import { MediaManager } from '../Managers/MediaManager';
import { LibraryManager } from '../Managers/LibraryManager';
import { IController } from './IController';

const libraryManager = new LibraryManager();
const mediaManager = new MediaManager();

export class LibraryController implements IController {
  router: Router = Router();
  path: string = '/library';
  constructor() {
    this.router.get('/', this.list);
    this.router.post('/', this.create);
    this.router.put('/', this.update);
    this.router.get('/:id', this.getById);
    this.router.get('/:library', this.getMediaForLibrary);
    this.router.patch('/', this.modifyMedia);
    this.router.delete('/:id', this.deleteLibrary);
  }
  async create(req, res) {
    const library = req.body;
    const result = await libraryManager.insert(library);
    res.json(result);
  }
  async update(req, res) {
    const library = req.body;
    const result = await libraryManager.update(library);
    return res.json(result);
  }

  deleteLibrary(req, res) {
    const id = req.params.id;
    if (id) libraryManager.delete(id).then(_ => res.sendStatus(200));
  }

  list: RequestHandler = async (req, res) => {
    const response = await libraryManager.get();
    res.json(response);
  };

  getById: RequestHandler = async (req, res) => {
    const { id } = req.params;
    const library = await libraryManager.findById(id);

    if (!library)
      return res.status(500).json({ message: 'Library not found!' });
    res.json(library);
  };

  getMediaForLibrary: RequestHandler = async (req, res) => {
    const id = req.params.library;
    const library = await libraryManager.findById(id);

    const media = await mediaManager.where(({ _id }) =>
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
        libraryManager
          .addMediaToLibrary(media, library)
          .then(() => res.sendStatus(200));
      }
      if (action === 'DROP') {
        libraryManager
          .removeMediaFromLibrary(media, library)
          .then(() => res.sendStatus(200));
      }
    } else {
      res.sendStatus(500);
    }
  };
}
