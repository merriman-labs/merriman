import { RequestHandler, Router } from 'express';
import { LibraryManager } from '../Managers/LibraryManager';
import { IController } from './IController';
import { inject, injectable } from 'inversify';
import { DependencyType } from '../Constant/DependencyType';
import Validator from '../Validation/Validator';
import { AsyncRouter } from '../Utilities/AsyncRouter';

@injectable()
export class LibraryController implements IController {
  router: Router = AsyncRouter();
  path: string = '/library';
  constructor(
    @inject(DependencyType.Managers.Library)
    private _libraryManager: LibraryManager
  ) {
    this.router.get('/', this.list);
    this.router.post('/', this.create);
    this.router.post('/addMedia', this.addItem);
    this.router.post('/removeMedia', this.removeItem);
    this.router.put('/', this.update);
    this.router.get('/:id', this.getById);
    this.router.delete('/:id', this.deleteLibrary);
  }
  /**
   * Create a new libary.
   */
  create: RequestHandler = async (req, res) => {
    // @ts-ignore
    const library = {
      ...req.body,
      userId: req.user._id,
      username: req.user.username
    };
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

  addItem: RequestHandler = async (req, res) => {
    let { libraryId, mediaId } = req.body;
    libraryId = Validator.Utility.ObjectId(libraryId);
    mediaId = Validator.Utility.ObjectId(mediaId);
    const result = await this._libraryManager.addMediaToLibrary(
      mediaId,
      libraryId
    );
    res.json(result);
  };

  removeItem: RequestHandler = async (req, res) => {
    let { libraryId, mediaId } = req.body;
    libraryId = Validator.Utility.ObjectId(libraryId);
    mediaId = Validator.Utility.ObjectId(mediaId);
    const result = this._libraryManager.removeMediaFromLibrary(
      mediaId,
      libraryId
    );
    res.json(result);
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
    const response = await this._libraryManager.get(req.user._id);
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
