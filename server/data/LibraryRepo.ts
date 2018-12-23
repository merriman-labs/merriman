import * as fs from 'fs';
import * as R from 'ramda';
import { v4 } from 'uuid';
import { Library, LibraryDatabase } from '../models';
const uuid = v4;

export default class LibraryRepo {
  private _dbpath: string;
  constructor() {
    this._dbpath = __dirname + '/db/library.json';
    this._ensureConfig();
  }

  /**
   * Load all Libraries.
   */
  get(): LibraryDatabase {
    return JSON.parse(fs.readFileSync(this._dbpath, { encoding: 'utf8' }));
  }
  /**
   *
   */
  save(lib: LibraryDatabase) {
    fs.writeFileSync(this._dbpath, JSON.stringify(lib));
  }
  /**
   * Finds a library matching the predicate
   */
  async find(predicate: ((x: Library) => boolean)): Promise<Library> {
    const { libraries } = this.get();
    return R.find(predicate, libraries);
  }
  /**
   * Insert a library.
   */
  async insert(lib: Library): Promise<string> {
    const newLib = this._initLibrary(lib);
    const libs = this.get();
    libs.libraries.push(newLib);
    this.save(libs);
    return newLib._id;
  }
  async addMediaToLibrary(media, library) {
    const lib = await this.find(({ _id }) => _id === library);
    if (!lib) throw 'Library not found!';

    lib.items.push(media);
    this.upsert(lib);
  }
  async removeMediaToLibrary(media, library) {
    const lib = await this.find(({ _id }) => _id === library);
    if (!lib) throw 'Library not found!';

    const items = lib.items.filter(_id => _id !== media);
    lib.items = items;
    this.upsert(lib);
  }
  /**
   * Adds or updates a library.
   * @param {Library} library
   * @returns {Promise<string>}
   */
  async upsert(library: Library): Promise<string> {
    const conf = this.get();

    const newLib = R.has('_id', library)
      ? library
      : await this._initLibrary(library);
    const { _id: libId } = newLib;

    const existingLib = R.find(({ _id }) => libId === _id, conf.libraries);
    const libraries = existingLib
      ? conf.libraries.map(lib => (lib._id === libId ? library : lib))
      : conf.libraries.concat(newLib);

    const newConfig = { libraries };

    this.save(newConfig);
    return libId;
  }
  /**
   * @param {string} id
   */
  async delete(id: string) {
    const { libraries } = this.get();
    const filteredLibs = libraries.filter(({ _id }) => _id !== id);
    this.save({ libraries: filteredLibs });
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
  _ensureConfig() {
    if (!fs.existsSync(this._dbpath)) this.save({ libraries: [] });
  }
}
