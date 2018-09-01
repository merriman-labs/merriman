const fs = require('fs');
const R = require('ramda');

class ConfigRepo {
  constructor() {
    this._dbpath = __dirname + '/db/config.json';
    this._ensureConfig();
  }

  /**
   * @returns {{libraries: Array<LibraryConfig>}}
   */
  get() {
    return JSON.parse(fs.readFileSync(this._dbpath, { encoding: 'utf8' }));
  }
  save(conf) {
    fs.writeFileSync(this._dbpath, JSON.stringify(conf));
  }
  _ensureConfig() {
    if (!fs.existsSync(this._dbpath)) this.save({ libraries: [] });
  }
}

module.exports = ConfigRepo;
