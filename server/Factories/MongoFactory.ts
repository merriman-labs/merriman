import { MongoClient } from 'mongodb';

export class MongoFactory {
  private static db: MongoClient;
  static async init() {
    MongoFactory.db = await MongoClient.connect('mongodb://localhost');
  }
  static create() {
    return MongoFactory.db.db('merriman');
  }
}
