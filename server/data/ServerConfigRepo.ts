import { Database } from '@johnny.reina/json-db';
import uuid = require('uuid');
import { config } from 'bluebird';

type ServerConfig = {
  _id?: string;
  mediaLocation: string;
  thumbLocation: string;
  mongo: {
    url: string;
  };
  name: string;
  isConfigured: boolean;
};

const _defaultObject: ServerConfig = {
  mediaLocation: '',
  thumbLocation: '',
  name: uuid(),
  mongo: { url: '' },
  isConfigured: false
};

export default class ServerConfigRepo {
  private _coll = new Database('merriman').collection<ServerConfig>(
    'server-config'
  );

  async setMediaLocation(location: string): Promise<void> {
    const config = await this.fetch();
    return this._coll.update({
      ...config,
      mediaLocation: location
    });
  }

  async setThumbnailLocation(location: string) {
    const config = await this.fetch();
    return this._coll.update({
      ...config,
      thumbLocation: location
    });
  }

  async setMongoUrl(url: string) {
    const config = await this.fetch();
    return this._coll.update({
      ...config,
      mongo: { url }
    });
  }

  async setServerName(name: string) {
    const config = await this.fetch();
    return this._coll.update({
      ...config,
      name
    });
  }

  async fetch(): Promise<ServerConfig> {
    const configItems = await this._coll.read();
    if (configItems.length === 0) await this._coll.insert(_defaultObject);
    const config = configItems[0] || (await this._coll.read())[0];
    const isConfigured =
      config.mediaLocation !== '' &&
      config.mongo.url !== '' &&
      config.thumbLocation !== '';
    return { ...config, isConfigured };
  }
}
