import * as R from 'ramda';
import { MediaItem } from '../models/index';
import { Db, ObjectId } from 'mongodb';
import { inject, injectable } from 'inversify';
import { DependencyType } from '../Constant/DependencyType';

@injectable()
export default class MediaRA {
  constructor(@inject(DependencyType.External.MongoDB) private _db: Db) {}

  async search(term: string, userId: string): Promise<Array<any>> {
    return this._db
      .collection('media')
      .aggregate([
        { $match: { name: { $regex: `.*${term}.*`, $options: 'i' } } },
        {
          $lookup: {
            from: 'users',
            localField: 'userId',
            foreignField: '_id',
            as: 'user'
          }
        },
        { $addFields: { user: { $arrayElemAt: ['$user', 0] } } },
        { $project: { user: { password: 0, isActive: 0, roles: 0 } } }
      ])
      .toArray();
  }

  /**
   *
   */
  get(includeHidden: boolean = false): Promise<Array<MediaItem>> {
    const query = includeHidden ? {} : { isHidden: false };
    return this._db.collection<MediaItem>('media').find(query).toArray();
  }

  getByTag(tag: string): Promise<Array<MediaItem>> {
    return this._db
      .collection<MediaItem>('media')
      .find({ tags: tag, isHidden: false })
      .toArray();
  }
  getByLibraryId(libraryId: string): Promise<Array<MediaItem>> {
    return this._db
      .collection('libraries')
      .aggregate([
        { $match: { _id: new ObjectId(libraryId) } },
        {
          $lookup: {
            from: 'media',
            localField: 'items.id',
            foreignField: '_id',
            as: 'items'
          }
        },
        { $unwind: '$items' },
        { $replaceRoot: { newRoot: '$items' } }
      ])
      .toArray();
  }
  /**
   * Get all unique tags from the server.
   */
  async getTags(): Promise<Array<string>> {
    const [{ items }] = await this._db
      .collection<MediaItem>('media')
      .aggregate<{ items: Array<string> }>([
        {
          $project: {
            tagList: {
              $reduce: {
                input: '$tags',
                initialValue: [],
                in: { $concatArrays: ['$$value', ['$$this']] }
              }
            }
          }
        },
        { $unwind: '$tagList' },
        { $group: { _id: null, items: { $addToSet: '$tagList' } } }
      ])
      .toArray();
    return items.sort();
  }

  /**
   *
   */
  async add(item: MediaItem): Promise<MediaItem> {
    item.userId = new ObjectId(item.userId);
    await this._db.collection<MediaItem>('media').insertOne(item);
    return item;
  }

  /**
   *
   */
  findById(id: string): Promise<MediaItem> {
    return this._db
      .collection<MediaItem>('media')
      .findOne({ _id: new ObjectId(id) });
  }

  findAllByFileName(filenames: Array<string>): Promise<Array<MediaItem>> {
    return this._db
      .collection<MediaItem>('media')
      .find({ filename: { $in: filenames } })
      .toArray();
  }

  /**
   *
   */
  async deleteById(id: string): Promise<boolean> {
    const result = await this._db
      .collection<MediaItem>('media')
      .deleteOne({ _id: new ObjectId(id) });
    return result.deletedCount === 1;
  }

  /**
   *
   */
  async update(updatedVideo: MediaItem): Promise<void> {
    // @ts-ignore
    await this._db
      .collection<MediaItem>('media')
      .updateOne(
        { _id: new ObjectId(updatedVideo._id) },
        { $set: R.omit(['_id', 'userId'], updatedVideo) }
      );
  }
  async incrementPlayCount(id: string) {
    await this._db
      .collection<MediaItem>('media')
      .findOneAndUpdate({ _id: new ObjectId(id) }, { $inc: { views: 1 } });
  }
}
