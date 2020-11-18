import { inject, injectable } from 'inversify';
import { Db, ObjectId } from 'mongodb';
import { DependencyType } from '../Constant/DependencyType';
import { MongoUser } from '../models/User/MongoUser';
import { User } from '../models/User/User';

@injectable()
export class UserRA {
  constructor(@inject(DependencyType.External.MongoDB) private _db: Db) {}

  list(): Promise<Array<MongoUser>> {
    return this._db.collection('users').find<MongoUser>().toArray();
  }

  getByEmail(username: string): Promise<User> {
    return this._db.collection('users').findOne({ username });
  }

  getById(id: string) {
    return this._db
      .collection('users')
      .findOne<MongoUser>({ _id: new ObjectId(id) });
  }

  async create(user: User) {
    await this._db.collection('users').insertOne(user);
    return user;
  }
}
