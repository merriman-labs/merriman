import * as fs from 'fs';

type ServerConfig = {
  mediaLocation: string;
  thumbLocation: string;
};

const _defaultObject: ServerConfig = { mediaLocation: '', thumbLocation: '' };

export default class ServerConfigRepo {
  private _dbpath: string;
  constructor() {
    this._dbpath = __dirname + '/db/server.json';
    this._ensureConfig();
  }

  setMediaLocation(location: string) {
    const config = this._fetch();

    config.mediaLocation = location;

    this._save(config);
  }

  setThumbnailLocation(location: string) {
    const config = this._fetch();

    config.thumbLocation = location;

    this._save(config);
  }

  fetch(): ServerConfig {
    return this._fetch();
  }

  private _fetch(): ServerConfig {
    const text: string = fs.readFileSync(this._dbpath, 'utf8');
    return JSON.parse(text) as ServerConfig;
  }

  private _save(db: ServerConfig) {
    const text = JSON.stringify(db);
    fs.writeFileSync(this._dbpath, text, { encoding: 'utf8' });
  }

  private _ensureConfig() {
    if (!fs.existsSync(this._dbpath)) this._save(_defaultObject);
  }
}
