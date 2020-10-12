import { MongoClient, Db } from 'mongodb';
import ServerConfigRepo from '../data/ServerConfigRepo';

export class MongoFactory {
  private static db: Db;
  static async init(config: ServerConfigRepo) {
    const { mongo, name } = await config.fetch();

    MongoFactory.db = await (await MongoClient.connect(mongo.url)).db(
      `merriman_${name}`
    );
  }
  static create() {
    return MongoFactory.db;
  }
}
