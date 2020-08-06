import * as R from 'ramda';
import { v4 } from 'uuid';
import { Library } from '../models';
import { MongoFactory } from '../Factories/MongoFactory';
import { ObjectId } from 'mongodb';
const uuid = v4;

export default class LibraryRA {
  /**
   * Load all Libraries.
   */
  get(): Promise<Array<Library>> {
    return MongoFactory.create()
      .collection<Library>('libraries')
      .find()
      .toArray();
  }

  /**
   * Finds a library matching the predicate
   */
  async findById(id: string): Promise<Library> {
    return MongoFactory.create()
      .collection<Library>('libraries')
      .findOne({ _id: new ObjectId(id) });
  }
  /**
   * Insert a library.
   */
  async insert(library: Library) {
    return MongoFactory.create()
      .collection<Library>('libraries')
      .insertOne(library);
  }
  async addMediaToLibrary(
    media: string | Array<string>,
    library: string
  ): Promise<void> {
    const ids = Array.isArray(media) ? media : [media];
    const items = { $each: ids.map(id => new ObjectId(id)) };
    await MongoFactory.create()
      .collection<Library>('libraries')
      .findOneAndUpdate({ _id: new ObjectId(library) }, { $push: { items } });
  }
  async removeMediaToLibrary(media: string, library: string) {
    return MongoFactory.create()
      .collection<Library>('libraries')
      .findOneAndUpdate(
        { _id: new ObjectId(library) },
        { $pull: { items: new ObjectId(media) } }
      );
  }

  /**
   * @param {string} id
   */
  async delete(id: string) {
    // @ts-ignore
    return MongoFactory.create()
      .collection<Library>('libraries')
      .deleteOne({ _id: new ObjectId(id) });
  }
}
