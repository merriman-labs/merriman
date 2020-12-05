import * as R from 'ramda';
import { Library } from '../models';
import { Db, ObjectId } from 'mongodb';
import { inject, injectable } from 'inversify';
import { DependencyType } from '../Constant/DependencyType';

@injectable()
export default class LibraryRA {
  constructor(@inject(DependencyType.External.MongoDB) private _db: Db) {}
  /**
   * Load all Libraries.
   */
  get(): Promise<Array<Library>> {
    return this._db.collection<Library>('libraries').find().toArray();
  }

  async update(library: Library) {
    const result = await this._db
      .collection<Library>('libraries')
      .findOneAndUpdate(
        { _id: new ObjectId(library._id) },
        { $set: R.omit(['_id'], library) }
      );

    return result.value;
  }

  /**
   * Finds a library matching the predicate
   */
  async findById(id: string): Promise<Library> {
    return this._db
      .collection<Library>('libraries')
      .findOne({ _id: new ObjectId(id) });
  }
  /**
   * Insert a library.
   */
  async insert(library: Library) {
    return this._db.collection<Library>('libraries').insertOne(library);
  }
  async addMediaToLibrary(
    media: { id: string; order: number } | Array<{ id: string; order: number }>,
    library: string
  ) {
    const items = Array.isArray(media) ? media : [media];
    const update = {
      $each: items.map((id) => ({
        id: new ObjectId(id.id),
        order: id.order
      }))
    };
    return this._db
      .collection<Library>('libraries')
      .findOneAndUpdate(
        { _id: new ObjectId(library) },
        { $push: { items: update } }
      )
      .then((x) => x.value);
  }
  removeMediaToLibrary(media: string, library: string) {
    return this._db
      .collection<Library>('libraries')
      .findOneAndUpdate(
        { _id: new ObjectId(library) },
        { $pull: { items: { id: new ObjectId(media) } } }
      )
      .then((x) => x.value);
  }

  /**
   * @param {string} id
   */
  async delete(id: string) {
    return this._db
      .collection<Library>('libraries')
      .deleteOne({ _id: new ObjectId(id) });
  }
}
