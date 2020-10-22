import LibraryRA from '../ResourceAccess/LibraryRA';
import { LibraryEngine } from '../Engines/LibraryEngine';
import { Library } from '../models';
import { inject, injectable } from 'inversify';
import { DependencyType } from '../Constant/DependencyType';

@injectable()
export class LibraryManager {
  constructor(
    @inject(DependencyType.ResourceAccess.Library)
    private _libraryRA: LibraryRA,
    @inject(DependencyType.Engines.Library)
    private _libraryEngine: LibraryEngine
  ) {}
  get() {
    return this._libraryRA.get();
  }

  update(library: Library) {
    return this._libraryRA.update(library);
  }

  findById(id: string) {
    return this._libraryRA.findById(id);
  }

  async insert(library: Library) {
    const newLibrary = this._libraryEngine.initializeLibrary(library);
    const result = await this._libraryRA.insert(newLibrary);
    return newLibrary;
  }

  addMediaToLibrary(mediaId: string | Array<string>, libraryId: string) {
    return this._libraryRA.addMediaToLibrary(mediaId, libraryId);
  }

  removeMediaFromLibrary(mediaId: string, libraryId: string) {
    return this._libraryRA.removeMediaToLibrary(mediaId, libraryId);
  }

  delete(libraryId: string) {
    return this._libraryRA.delete(libraryId);
  }
}
