import { ServerLog } from '../models/index';
import { inject, injectable } from 'inversify';
import { DependencyType } from '../Constant/DependencyType';
import { Db, ObjectId } from 'mongodb';
import { RequestLog } from '../models/RequestLog';
import { MigrationLog, MigrationLogEntry } from '../models/MigrationLog';

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
  getRequestLogs(params: {
    skip: number;
    limit: number;
  }): Promise<Array<RequestLog>> {
    return this._db
      .collection<RequestLog>('request-logs')
      .find()
      .skip(params.skip)
      .limit(params.limit)
      .sort('date', -1)
      .toArray();
  }

  /**
   *
   */
  async add(item: ServerLog): Promise<ServerLog> {
    await this._db.collection<ServerLog>('logs').insertOne(item);
    return item;
  }

  addRequestLog(item: RequestLog) {
    return this._db.collection<RequestLog>('request-logs').insertOne(item);
  }

  /**
   * Create an empty migration log.
   *
   * @param item
   * @returns
   */
  async createMigrationLog(item: MigrationLog) {
    item.mediaId = new ObjectId(item.mediaId);
    item.userId = new ObjectId(item.userId);
    const log = await this._db
      .collection<MigrationLog>('migration-logs')
      .insertOne(item);
    return log.insertedId;
  }
  /**
   * Add an entry to an existing migration log.
   *
   * @param logId
   * @param update
   * @returns
   */
  addMigrationLogEntry(logId: string, update: MigrationLogEntry) {
    return this._db
      .collection<MigrationLog>('migration-logs')
      .updateOne({ _id: new ObjectId(logId) }, { $push: { entries: update } });
  }

  /**
   * Set the `endTime` on an existing migration log.
   * @param logId
   */
  finishMigrationLogEntry(logId: string) {
    this._db
      .collection<MigrationLog>('migration-logs')
      .updateOne(
        { _id: new ObjectId(logId) },
        { $set: { endTime: new Date() } }
      );
  }
}
