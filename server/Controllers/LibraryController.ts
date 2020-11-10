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
    private _libraryManager: LibraryManager
  ) {
    this.router.get('/', this.list);
    this.router.post('/', this.create);
    this.router.put('/', this.update);
    this.router.get('/:id', this.getById);
    this.router.delete('/:id', this.deleteLibrary);
  }
  /**
   * Create a new libary.
   */
  create: RequestHandler = async (req, res) => {
    const library = { ...req.body, userId: req.user._id };
    const result = await this._libraryManager.insert(library);
    res.json(result);
  };
  /**
   * Update a library.
   */
  update: RequestHandler = async (req, res) => {
    const library = req.body;
    const result = await this._libraryManager.update(library);
    return res.json(result);
  };
  /**
   * Delete a library by _id.
   */
  deleteLibrary: RequestHandler = (req, res) => {
    const id = req.params.id;
    if (id) this._libraryManager.delete(id).then((_) => res.sendStatus(200));
  };
  /**
   * List all libraries.
   */
  list: RequestHandler = async (req, res) => {
    const response = await this._libraryManager.get();
    res.json(response);
  };
  /**
   * Get a library object by _id.
   */
  getById: RequestHandler = async (req, res) => {
    const { id } = req.params;
    const library = await this._libraryManager.findById(id);

    if (!library)
      return res.status(500).json({ message: 'Library not found!' });
    res.json(library);
  };
}
