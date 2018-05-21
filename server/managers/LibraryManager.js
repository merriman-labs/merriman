const R = require('ramda');
const uuid = require('uuid/v4');
const ConfigRepo = require('../data/ConfigRepo');

class LibraryManager {
  constructor() {
    this._repo = new ConfigRepo();
  }

  /**
   * Adds or updates a library.
   * @param {{_id:string}} library
   */
  save(library) {
    const conf = this._repo.get();

    const newLib = R.has('_id', library) ? library : this._initLibrary(library);
    const { _id: libId } = newLib;

    const existingLib = R.find(({ _id }) => libId === _id, conf.libraries);
    const libraries = existingLib
      ? conf.libraries.map(lib => (lib._id === libId ? library : lib))
      : conf.libraries.concat(newLib);

    const newConfig = R.mergeAll([{}, conf, { libraries }]);

    this._repo.save(newConfig);
  }

  /**
   *
   * @param {string} idToRemove `_id` of the library to remove.
   */
  delete(idToRemove) {
    const conf = this._repo.get();
    const libraries = conf.libraries.filter(({ _id }) => _id !== idToRemove);
    const newConfig = R.mergeAll([{}, conf, { libraries }]);
    this._repo.save(newConfig);
  }

  /**
   *
   * @param {string} id the `_id` of the library to load
   */
  load(id) {
    return this._repo.get().libraries.find(lib => lib._id === id);
  }

  list() {
    return this._repo.get().libraries;
  }

  _initLibrary(library) {
    return R.compose(R.assoc('created', new Date()), R.assoc('_id', uuid()))(
      library
    );
  }
}

module.exports = new LibraryManager();
