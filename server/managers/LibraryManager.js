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

    const lib = R.has('_id', library) ? library : R.assoc('_id', uuid());
    const { _id: libId } = lib;

    const existingLib = R.find(
      ({ _id }) => R.equals(libId, _id),
      conf.libraries
    );
    const libraries = existingLib
      ? conf.libraries.map(lib => (lib._id === _id ? library : lib))
      : conf.libraries.concat(library);

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
   * @param {string} library the `name` or `_id` of the library to load
   */
  load(library) {
    return this._repo
      .get()
      .libraries.find(lib => lib.name === library || lib._id === library);
  }

  list() {
    return this._repo.get().libraries;
  }
}

module.exports = new LibraryManager();
