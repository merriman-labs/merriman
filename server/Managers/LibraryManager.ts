import LibraryRA from '../ResourceAccess/LibraryRA';
import { LibraryEngine } from '../Engines/LibraryEngine';
import { Library } from '../models';
import { inject, injectable } from 'inversify';
import { DependencyType } from '../Constant/DependencyType';
import Validator from '../Validation/Validator';

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
}
