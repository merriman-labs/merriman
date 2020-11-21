import { ServerLog } from '../models/index';
import { inject, injectable } from 'inversify';
import { DependencyType } from '../Constant/DependencyType';
import { Db } from 'mongodb';
import { RequestLog } from '../models/RequestLog';

@injectable()
export default class ServerLogRA {
  constructor(@inject(DependencyType.External.MongoDB) private _db: Db) {}
  /**
   *
   */
  get(): Promise<Array<ServerLog>> {
    return this._db.collection<ServerLog>('logs').find().toArray();
  }

  /**
   *
   */
  async add(item: ServerLog): Promise<ServerLog> {
    await this._db.collection<ServerLog>('logs').insertOne(item);
    return item;
  }

  addRequestLog(item: RequestLog) {
    return this._db.collection<RequestLog>('requests').insertOne(item);
  }
}
