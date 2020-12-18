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
    return this._libraryRA.removeMediaToLibrary(mediaId, libraryId);
  }

  delete(libraryId: string) {
    return this._libraryRA.delete(libraryId);
  }

  async setMediaOrder(payload: SetMediaOrderPayload) {
    const library = await this._libraryRA.findById(payload.libraryId);
    if (!library) throw new NotFoundError('Library not found');

    const changeItem = library.items.find(
      (item) => item.id.toString() === payload.mediaId
    );
    if (!changeItem) throw new NotFoundError('Media not in library');

    if (payload.direction === 'down') {
      if (changeItem.order === 0) return;
      const previousItem = library.items.find(
        (item) => item.order === changeItem.order - 1
      );
      previousItem.order++;
      changeItem.order--;
    } else if (payload.direction === 'up') {
      const nextItem = library.items.find(
        (item) => item.order === changeItem.order + 1
      );
      nextItem.order--;
      changeItem.order++;
    }
    await this._libraryRA.update(library);
    return library;
  }
}
