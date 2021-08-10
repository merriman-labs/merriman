import * as R from 'ramda';
import { Library } from '../models';
import { Db, ObjectId } from 'mongodb';
import { inject, injectable } from 'inversify';
import { DependencyType } from '../Constant/DependencyType';
import { ItemVisibility } from '../Constant/ItemVisibility';

@injectable()
export default class LibraryRA {
  constructor(@inject(DependencyType.External.MongoDB) private _db: Db) {}
  /**
   * Load all Libraries.
   */
  get(userId: string): Promise<Array<Library>> {
    return this._db
      .collection('libraries')
      .find(this.publicOrPrivateOwner(userId))
      .toArray();
  }

  async update(library: Library) {
    if (library.items) {
      library.items = library.items.map((id) => new ObjectId(id));
    }
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
      $each: items.map((id) => new ObjectId(id.id))
    };
    return this._db
      .collection<Library>('libraries')
      .findOneAndUpdate(
        { _id: new ObjectId(library) },
        { $addToSet: { items: update } }
      )
      .then((x) => x.value);
  }
  removeMediaFromLibrary(media: string, library: string) {
    return this._db
      .collection<Library>('libraries')
      .findOneAndUpdate(
        { _id: new ObjectId(library) },
        { $pull: { items: new ObjectId(media) } }
      )
      .then((x) => x.value);
  }

  /**
   * Remove a given media ID from all libraries
   * @param mediaId
   */
  removeMediaFromLibraries(mediaId: string) {
    return this._db
      .collection<Library>('libraries')
      .updateMany(
        { items: new ObjectId(mediaId) },
        { $pull: { items: new ObjectId(mediaId) } }
      );
  }

  /**
   * @param {string} id
   */
  async delete(id: string) {
    return this._db
      .collection<Library>('libraries')
      .deleteOne({ _id: new ObjectId(id) });
  }

  private publicOrPrivateOwner(userId: string) {
    return {
      $or: [
        {
          'user.userId': new ObjectId(userId)
        },
        {
          visibility: ItemVisibility.public
        }
      ]
    };
  }
}
