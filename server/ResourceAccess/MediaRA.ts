import * as R from 'ramda';
import { MediaItem } from '../models/index';
import { Db, ObjectId } from 'mongodb';
import { inject, injectable } from 'inversify';
import { DependencyType } from '../Constant/DependencyType';
import { ItemVisibility } from '../Constant/ItemVisibility';
import { TagStatistic } from '../ViewModels/TagStatistic';
import { GetObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { AppContext } from '../appContext';

@injectable()
export default class MediaRA {
  constructor(@inject(DependencyType.External.MongoDB) private _db: Db) {}

  async random(count: number, userId: string): Promise<Array<MediaItem>> {
    const results = await this._db
      .collection('media')
      .aggregate([
        { $match: this.unlistedOrPrivateOwner(userId) },
        { $sample: { size: count } }
      ])
      .toArray();
    return results;
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
            'user.userId': new ObjectId(userId)
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
            localField: 'items',
            foreignField: '_id',
            as: 'media'
          }
        },
        { $unwind: '$media' },
        { $addFields: { _order: { $indexOfArray: ['$items', '$media._id'] } } },
        { $sort: { _order: 1 } },
        { $replaceRoot: { newRoot: '$media' } },
        { $match: this.unlistedOrPrivateOwner(userId) }
      ])
      .toArray();
  }
  /**
   * Get all unique tags from the server.
   */
  async getTags(userId: string): Promise<Array<TagStatistic>> {
    const tags = await this._db
      .collection<MediaItem>('media')
      .aggregate<TagStatistic>([
        {
          $match: {
            $or: [
              { 'user.userId': new ObjectId(userId) },
              { visibility: ItemVisibility.public }
            ]
          }
        },
        { $unwind: '$tags' },
        { $group: { _id: '$tags', count: { $sum: 1 } } },
        { $sort: { count: -1 } },
        { $project: { _id: 0, tag: '$_id', count: 1 } }
      ])
      .toArray();
    return tags;
  }

  async getMediaUrl(id: string) {
    const item = await this._db
      .collection<MediaItem>('media')
      .findOne({ _id: new ObjectId(id) });
    if (item.storageScheme === 's3') {
      const config = AppContext.get(AppContext.WellKnown.Config);
      const client = new S3Client({
        region: config.storage.region,
        credentials: {
          accessKeyId: config.storage.accessKeyId,
          secretAccessKey: config.storage.accessKeySecret
        }
      });
      const command = new GetObjectCommand({
        Key: item.filename,
        Bucket: config.storage.bucket
      });
      const url = await getSignedUrl(client, command, { expiresIn: 18400 });
      return url;
    }
    return `/api/media/play/${item._id.toString()}`;
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
