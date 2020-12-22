import * as _ from 'lodash';
import { readFileSync } from 'fs';

export class Configuration {
  mediaLocation: string;
  thumbLocation: string;
  server:
    | {
        useSsl: true;
        certPath: string;
        keyPath: string;
      }
    | {
        useSsl: false;
      };
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

  public static fromJson(data: string) {
    const obj = new Configuration();
    return obj.fromObject(JSON.parse(data));
  }

  public toJson() {
    return JSON.stringify({
      name: this.name,
      port: this.port,
      mediaLocation: this.mediaLocation,
      thumbLocation: this.thumbLocation,
      session: this.session,
      server: this.server,
      mongo: this.mongo,
      allowUnsafeFileAccess: this.allowUnsafeFileAccess
    });
  }

  private fromObject(data: any) {
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

    if (data.server) {
      this.server = data.server;
    }
    return this;
  }

  private _isvalid = _.conforms({
    mediaLocation: _.isString,
    thumbLocation: _.isString,
    server: (value) =>
      _.conforms({
        useSsl: _.negate(_.identity)
      })(value) ||
      _.conforms({
        useSsl: _.identity,
        certPath: _.isString,
        keyPath: _.isString
      })(value),
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
