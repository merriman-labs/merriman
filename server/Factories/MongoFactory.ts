import { MongoClient, Db } from 'mongodb';
import { Configuration } from '../Utilities/ConfigUtil';

export class MongoFactory {
  private static db: Db;
  static async init(config: Configuration) {
    const { mongo } = config;

    const db = await (
      await MongoClient.connect(mongo.connectionString, {
        useUnifiedTopology: true
      })
    ).db(mongo.database);
    MongoFactory.db = db;
    return db;
  }
}
