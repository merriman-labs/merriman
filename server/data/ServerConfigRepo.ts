import * as fs from 'fs';
import { Database } from '@johnny.reina/json-db';

type ServerConfig = {
  _id?: string;
  mediaLocation: string;
  thumbLocation: string;
};

const _defaultObject: ServerConfig = { mediaLocation: '', thumbLocation: '' };

export default class ServerConfigRepo {
  private _coll = new Database('merriman').collection<ServerConfig>(
    'server-config'
  );

  async setMediaLocation(location: string): Promise<void> {
    const config = await this.fetch();
    return this._coll.update({
      mediaLocation: location,
      ...config
    });
  }

  async setThumbnailLocation(location: string) {
    const config = await this.fetch();
    return this._coll.update({
      thumbLocation: location,
      ...config
    });
  }

  async fetch(): Promise<ServerConfig> {
    const configItems = await this._coll.read();
    if (configItems.length === 0) await this._coll.insert(_defaultObject);
    return (await this._coll.read())[0];
  }
}
