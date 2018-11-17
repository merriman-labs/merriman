const fs = require('fs');
const R = require('ramda');
const uuid = require('uuid/v4');

const _defaultObject = { mediaLocation: '', thumbLocation: '' };

class ServerConfigRepo {
  constructor() {
    this._dbpath = __dirname + '/db/server.json';
    this._ensureConfig();
  }

  /**
   *
   * @param {string} location
   */
  setMediaLocation(location) {
    const config = this._fetch();

    config.mediaLocation = location;

    this._save(config);
  }

  /**
   *
   * @param {string} location
   */
  setThumbnailLocation(location) {
    const config = this._fetch();

    config.thumbLocation = location;

    this._save(config);
  }

  fetch() {
    return this._fetch();
  }

  /**
   * @returns {ServerConfiguration}
   */
  _fetch() {
    const text = fs.readFileSync(this._dbpath, 'utf8');
    return JSON.parse(text);
  }

  /**
   * @param {ServerConfiguration} db
   */
  _save(db) {
    const text = JSON.stringify(db);
    fs.writeFileSync(this._dbpath, text, { encoding: 'utf8' });
  }

  _ensureConfig() {
    if (!fs.existsSync(this._dbpath)) this._save(_defaultObject);
  }
}

module.exports = new ServerConfigRepo();
