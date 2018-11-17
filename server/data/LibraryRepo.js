const fs = require('fs');
const R = require('ramda');
const uuid = require('uuid/v4');

class LibraryRepo {
  constructor() {
    this._dbpath = __dirname + '/db/library.json';
    this._ensureConfig();
  }

  /**
   * Load all Libraries.
   * @returns {LibraryDatabase}
   */
  get() {
    return JSON.parse(fs.readFileSync(this._dbpath, { encoding: 'utf8' }));
  }
  /**
   *
   * @param {LibraryDatabase} lib
   */
  save(lib) {
    fs.writeFileSync(this._dbpath, JSON.stringify(lib));
  }
  /**
   * Finds a library matching the predicate
   * @param {((x: Library) => boolean)} predicate
   * @returns {Promise<Library>}
   */
  async find(predicate) {
    const { libraries } = this.get();
    return R.find(predicate, libraries);
  }
  /**
   * Insert a library.
   * @param {Library} lib
   * @returns {Promise<string>} The _id of the new library.
   */
  async insert(lib) {
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
  async upsert(library) {
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
  async delete(id) {
    const { libraries } = this.get();
    const filteredLibs = libraries.filter(({ _id }) => _id !== id);
    this.save({ libraries: filteredLibs });
  }
  /**
   * @param {Library} lib
   * @returns {Library}
   */
  _initLibrary(lib) {
    return R.pipe(
      R.assoc('_id', uuid()),
      R.assoc('items', [])
    )(lib);
  }
  _ensureConfig() {
    if (!fs.existsSync(this._dbpath)) this.save({ libraries: [] });
  }
}

module.exports = new LibraryRepo();
