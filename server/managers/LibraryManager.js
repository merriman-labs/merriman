const R = require('ramda');
const uuid = require('uuid/v4');
const ConfigRepo = require('../data/ConfigRepo');
const VideoRepo = require('../data/VideoRepo');
const thumb = require('../thumb-provider');
const fs = require('fs');
const path = require('path');

const os = require('os');

class LibraryManager {
  constructor() {
    this._repo = new ConfigRepo();
  }

  /**
   * Adds or updates a library.
   * @param {{_id:string}} library
   */
  async save(library) {
    const conf = this._repo.get();

    const newLib = R.has('_id', library)
      ? library
      : await this._initLibrary(library);
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

  /**
   * List all libraries.
   */
  list() {
    return this._repo.get().libraries;
  }

  /**
   * Initialize a new library object with required properties.
   * @param {{}} library
   * @returns {LibraryConfig}
   */
  async _initLibrary(library) {
    const stats = await this._initLibraryThumbnails(library);
    const lib = R.compose(
      R.assoc('created', new Date()),
      R.assoc('_id', uuid()),
      R.merge(stats)
    )(library);
    return lib;
  }

  _initLibraryThumbnails(library) {
    const repo = new ConfigRepo();
    const vidRepo = new VideoRepo();
    const conf = repo.get();
    const { location, _id } = library;

    const files = this._getVideoFiles(location);

    files.forEach(file => vidRepo.add(file));

    if (!fs.existsSync(os.homedir() + '\\.node-media-server'))
      fs.mkdirSync(os.homedir() + '\\.node-media-server');
    const thumbProcedurePromises = thumb.ensureThumbs(
      files,
      location,
      os.homedir() + '\\.node-media-server\\thumbs\\'
    );

    return thumbProcedurePromises.then(() => {
      return {
        statistics: {
          videos: files.length
        }
      };
    });
  }

  /**
   *
   * @param {string} dir
   * @returns {Array<string>}
   */
  _getVideoFiles(dir) {
    const files = fs
      .readdirSync(dir)
      .filter(file => /\.mp4$/.test(file))
      .filter(file => !fs.statSync(path.join(dir, file)).isDirectory());
    return files;
  }
}

module.exports = new LibraryManager();
