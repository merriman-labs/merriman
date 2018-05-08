const fs = require('fs');
class ConfigRepo {
  get() {
    return JSON.parse(fs.readFileSync(__dirname + '/db/config.json'));
  }
  save(conf) {
    fs.writeFileSync(__dirname + '/db/config.json', JSON.stringify(conf));
  }

  loadLibrary(library) {
    return this.get().libraries.find(lib => lib.name === library);
  }
}

module.exports = ConfigRepo;
