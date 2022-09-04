import { inject, injectable } from 'inversify';
import { Db, ObjectId } from 'mongodb';
import { DependencyType } from '../Constant/DependencyType';
import { MongoUser } from '../models/User/MongoUser';
import { User } from '../models/User/User';
import { UserInfo } from '../models/User/UserInfo';
import _ from 'lodash';

@injectable()
export class UserRA {
  constructor(@inject(DependencyType.External.MongoDB) private _db: Db) {}

  updateLoggedIn(userId: string) {
    return this._db
      .collection('users')
      .updateOne(
        { _id: new ObjectId(userId) },
        { $set: { lastLoginAt: new Date() } }
      );
  }

  list(): Promise<Array<MongoUser>> {
    return this._db.collection('users').find().toArray();
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
    await this._db.collection('users').insertOne(user.toMongo());
    return user;
  }

  updateUser(user: Partial<UserInfo>) {
    return this._db
      .collection('users')
      .updateOne(
        { _id: new ObjectId(user._id) },
        { $set: _.omit(user, '_id') }
      );
  }
}
