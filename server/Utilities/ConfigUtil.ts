import * as _ from 'lodash';
import { readFileSync } from 'fs';

export class Configuration {
  mediaLocation: string;
  thumbLocation: string;
  mongo: {
    connectionString: string;
    database: string;
  };
  name: string;
  port: number;
  allowUnsafeFileAccess: boolean = false;
  session: {
    secret: string;
  };
  constructor(data: any) {
    if (!this._isvalid(data)) throw new Error('Configuration must be complete');
    this.mediaLocation = data.mediaLocation;
    this.thumbLocation = data.thumbLocation;
    this.mongo = {
      connectionString: data.mongo.connectionString,
      database: data.mongo.database
    };
    this.session = {
      secret: data.session.secret
    };
    this.name = data.name;
    this.port = data.port;
  }

  public static fromJson(data: string) {
    return new Configuration(JSON.parse(data));
  }

  private _isvalid = _.conforms({
    mediaLocation: _.isString,
    thumbLocation: _.isString,
    mongo: _.conforms({
      connectionString: _.isString,
      database: _.isString
    }),
    session: _.conforms({
      secret: _.isString
    }),
    name: _.isString,
    port: _.isInteger
  });
}

export const ConfigUtil = {
  readConfig: (filename: string) => {
    const configStr = readFileSync(filename, { encoding: 'utf-8' });
    return Configuration.fromJson(configStr);
  }
};
