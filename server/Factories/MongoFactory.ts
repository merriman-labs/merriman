import { MongoClient, Db } from 'mongodb';
import { Configuration } from '../Utilities/ConfigUtil';

export class MongoFactory {
  private static db: Db;
  static async init(config: Configuration) {
    const { mongo, name } = config;

    MongoFactory.db = await (await MongoClient.connect(
      mongo.connectionString
    )).db(`merriman_${name}`);
  }
  static create() {
    return MongoFactory.db;
  }
}
