const fs = require('fs');
const R = require('ramda');

class ConfigRepo {
  constructor() {}

  /**
   * @returns {{libraries: Array<LibraryConfig>}}
   */
  get() {
    return JSON.parse(
      fs.readFileSync(__dirname + '/db/config.json', { encoding: 'utf8' })
    );
  }
  save(conf) {
    fs.writeFileSync(__dirname + '/db/config.json', JSON.stringify(conf));
  }
}

module.exports = ConfigRepo;
