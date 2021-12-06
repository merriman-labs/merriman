import * as _ from 'lodash';
import { readFileSync } from 'fs';
import Validator from '../Validation/Validator';

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
  pathRewrites?: {
    [documentPath: string]: string;
  };
  storage:
    | {
        scheme: 's3';
        bucket: string;
        accessKeyId: string;
        accessKeySecret: string;
        region: string;
      }
    | { scheme: 'filesystem' };

  public rewritePath(path: string) {
    if (!this.pathRewrites) return path;
    return Object.keys(this.pathRewrites).includes(path)
      ? this.pathRewrites[path]
      : path;
  }

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
      allowUnsafeFileAccess: this.allowUnsafeFileAccess,
      pathRewrites: this.pathRewrites
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
    this.pathRewrites = data.pathRewrites;

    if (data.server) {
      this.server = data.server;
    }
    this.storage = data.storage;
    return this;
  }

  private _isvalid(data: any) {
    try {
      return Validator.Utility.Configuration(data);
    } catch (error) {
      throw new Error(error.message.replace('body', 'configuration'));
    }
  }
}

export const ConfigUtil = {
  readConfig: (filename: string) => {
    const configStr = readFileSync(filename, { encoding: 'utf-8' });
    return Configuration.fromJson(configStr);
  }
};
