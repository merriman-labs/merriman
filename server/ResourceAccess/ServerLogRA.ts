import { ServerLog } from '../models/index';
import { inject } from 'inversify';
import { DependencyType } from '../Constant/DependencyType';
import { Db } from 'mongodb';

export default class ServerLogRA {
  constructor(@inject(DependencyType.External.MongoDB) private _db: Db) {}
  /**
   *
   */
  get(): Promise<Array<ServerLog>> {
    return this._db
      .collection<ServerLog>('logs')
      .find()
      .toArray();
  }

  /**
   *
   */
  async add(item: ServerLog): Promise<ServerLog> {
    await this._db.collection<ServerLog>('logs').insert(item);
    return item;
  }
}
