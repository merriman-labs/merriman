import LibraryRA from '../ResourceAccess/LibraryRA';
import { LibraryEngine } from '../Engines/LibraryEngine';
import { Library } from '../models';
import { inject, injectable } from 'inversify';
import { DependencyType } from '../Constant/DependencyType';
import Validator from '../Validation/Validator';
import { SetMediaOrderPayload } from '../models/SetMediaOrderPayload';
import { NotFoundError } from '../Errors/NotFoundError';

@injectable()
export class LibraryManager {
  constructor(
    @inject(DependencyType.ResourceAccess.Library)
    private _libraryRA: LibraryRA,
    @inject(DependencyType.Engines.Library)
    private _libraryEngine: LibraryEngine
  ) {}
  get(userId: string) {
    return this._libraryRA.get(userId);
  }

  update(library: Library) {
    const item = Validator.Library.Update(library);
    return this._libraryRA.update(item);
  }

  findById(id: string) {
    return this._libraryRA.findById(id);
  }

  async insert(library: Library) {
    const item = Validator.Library.Create(library);
    const newLibrary = this._libraryEngine.initializeLibrary(item);
    const result = await this._libraryRA.insert(newLibrary);
    return newLibrary;
  }

  async addMediaToLibrary(mediaId: string | Array<string>, libraryId: string) {
    mediaId = Array.isArray(mediaId) ? mediaId : [mediaId];
    const library = await this._libraryRA.findById(libraryId);
    const items = mediaId.map((id, idx) => ({
      id,
      order: library.items.length + idx
    }));
    return this._libraryRA.addMediaToLibrary(items, libraryId);
  }

  removeMediaFromLibrary(mediaId: string, libraryId: string) {
    return this._libraryRA.removeMediaFromLibrary(mediaId, libraryId);
  }

  delete(libraryId: string) {
    return this._libraryRA.delete(libraryId);
  }

  async setMediaOrder(payload: SetMediaOrderPayload) {
    const library = await this._libraryRA.findById(payload.libraryId);
    if (!library) throw new NotFoundError('Library not found');

    const idx = library.items.findIndex(
      (item) => item.toString() === payload.mediaId
    );
    if (idx === -1) throw new NotFoundError('Media not in library');

    if (payload.direction === 'down') {
      if (idx === 0) return;

      const tmp = library.items[idx];
      library.items[idx] = library.items[idx - 1];
      library.items[idx - 1] = tmp;
    } else if (payload.direction === 'up') {
      if (idx === library.items.length - 1) return;

      const tmp = library.items[idx];
      library.items[idx] = library.items[idx + 1];
      library.items[idx + 1] = tmp;
    }
    await this._libraryRA.update(library);
    return library;
  }
}
