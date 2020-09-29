import { ServerLog } from '../models/index';
import { MongoFactory } from '../Factories/MongoFactory';

export default class ServerLogRA {
  /**
   *
   */
  get(): Promise<Array<ServerLog>> {
    return MongoFactory.create()
      .collection<ServerLog>('logs')
      .find()
      .toArray();
  }

  /**
   *
   */
  async add(item: ServerLog): Promise<ServerLog> {
    await MongoFactory.create()
      .collection<ServerLog>('logs')
      .insert(item);
    return item;
  }


}
