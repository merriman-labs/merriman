import * as R from 'ramda';
import { v4 } from 'uuid';
import { Library } from '../models';
import { Database } from '@johnny.reina/json-db';
const uuid = v4;

export default class LibraryRepo {
  private _collection = new Database('merriman').collection<Library>(
    'libraries'
  );

  /**
   * Load all Libraries.
   */
  get(): Promise<Array<Library>> {
    return this._collection.read();
  }

  /**
   * Finds a library matching the predicate
   */
  async find(predicate: ((x: Library) => boolean)): Promise<Library> {
    return this._collection.find(predicate);
  }
  /**
   * Insert a library.
   */
  async insert(lib: Library): Promise<string> {
    const newLib = this._initLibrary(lib);
    return this._collection.insert(newLib);
  }
  async addMediaToLibrary(media: string, library: string): Promise<void> {
    const lib = await this._collection.find(({ _id }) => _id === library);
    if (!lib) throw 'Library not found!';

    lib.items.push(media);
    return this._collection.update(lib);
  }
  async removeMediaToLibrary(media: string, library: string) {
    const lib = await this._collection.find(library);
    if (!lib) throw 'Library not found!';
    lib.items = lib.items.filter(_id => _id !== media);
    return this._collection.update(lib);
  }

  /**
   * @param {string} id
   */
  async delete(id: string) {
    return this._collection.delete(id);
  }
  /**
   * @param {Library} lib
   * @returns {Library}
   */
  _initLibrary(lib: Library): Library {
    return R.pipe(
      R.assoc('_id', uuid()),
      R.assoc('items', [])
    )(lib) as Library;
  }
}
