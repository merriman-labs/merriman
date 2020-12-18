import * as R from 'ramda';
import { MediaItem } from '../models/index';
import { Db, ObjectId } from 'mongodb';
import { inject, injectable } from 'inversify';
import { DependencyType } from '../Constant/DependencyType';
import { ItemVisibility } from '../Constant/ItemVisibility';

@injectable()
export default class MediaRA {
  constructor(@inject(DependencyType.External.MongoDB) private _db: Db) {}

  async random(userId: string): Promise<MediaItem> {
    const results = await this._db
      .collection('media')
      .aggregate([
        { $match: this.unlistedOrPrivateOwner(userId) },
        { $sample: { size: 1 } }
      ])
      .toArray();
    if (results.length === 0) return;
    return results[0];
  }

  latest(skip: number, limit: number, userId: string) {
    return this._db
      .collection<MediaItem>('media')
      .aggregate([
        {
          $match: {
            $or: [
              { 'user.userId': new ObjectId(userId) },
              { visibility: ItemVisibility.public }
            ]
          }
        },
        { $sort: { createdAt: -1 } },
        { $skip: skip },
        { $limit: limit }
      ])
      .toArray();
  }

  async search(term: string, userId: string): Promise<Array<MediaItem>> {
    return this._db
      .collection('media')
      .find({
        name: { $regex: `.*${term}.*`, $options: 'i' },
        $or: [
          {
            'user.userId': new ObjectId(userId),
            visibility: ItemVisibility.private
          },
          {
            visibility: ItemVisibility.public
          }
        ]
      })
      .toArray();
  }

  getByTag(tag: string, userId: string): Promise<Array<MediaItem>> {
    return this._db
      .collection('media')
      .find({
        tags: tag,
        isHidden: false,
        ...this.unlistedOrPrivateOwner(userId)
      })
      .toArray();
  }
  getByLibraryId(libraryId: string, userId: string): Promise<Array<MediaItem>> {
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
        { $replaceRoot: { newRoot: '$items' } },
        { $match: this.unlistedOrPrivateOwner(userId) }
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
    item.user.userId = new ObjectId(item.user.userId);
    await this._db.collection<MediaItem>('media').insertOne(item);
    return item;
  }

  /**
   *
   */
  findById(id: string, userId: string): Promise<MediaItem> {
    return this._db.collection('media').findOne({
      _id: new ObjectId(id),
      ...this.unlistedOrPrivateOwner(userId)
    });
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
    updatedVideo.updatedAt = new Date();
    // @ts-ignore
    await this._db
      .collection<MediaItem>('media')
      .updateOne(
        { _id: new ObjectId(updatedVideo._id) },
        { $set: R.omit(['_id', 'user', 'createdAt'], updatedVideo) }
      );
  }
  async incrementPlayCount(id: string) {
    await this._db
      .collection<MediaItem>('media')
      .findOneAndUpdate({ _id: new ObjectId(id) }, { $inc: { views: 1 } });
  }

  async getRecentlyPlayed(
    userId: string,
    limit: number
  ): Promise<Array<MediaItem>> {
    return this._db
      .collection<MediaItem>('media-state')
      .aggregate([
        { $match: { userId: new ObjectId(userId) } },
        { $sort: { updatedAt: -1 } },
        { $limit: limit },
        {
          $lookup: {
            from: 'media',
            localField: 'mediaId',
            foreignField: '_id',
            as: 'media'
          }
        },
        { $replaceRoot: { newRoot: { $arrayElemAt: ['$media', 0] } } }
      ])
      .toArray();
  }

  private unlistedOrPrivateOwner(userId: string) {
    return {
      $or: [
        {
          'user.userId': new ObjectId(userId),
          visibility: ItemVisibility.private
        },
        {
          visibility: { $ne: ItemVisibility.private }
        }
      ]
    };
  }
}
