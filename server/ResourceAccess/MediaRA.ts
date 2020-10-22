import * as R from 'ramda';
import { MediaItem } from '../models/index';
import { MongoFactory } from '../Factories/MongoFactory';
import { ObjectId } from 'mongodb';
import { injectable } from 'inversify';

@injectable()
export default class MediaRA {
  /**
   *
   */
  get(includeHidden: boolean = false): Promise<Array<MediaItem>> {
    const query = includeHidden ? {} : { isHidden: false };
    return MongoFactory.create()
      .collection<MediaItem>('media')
      .find(query)
      .toArray();
  }

  getByTag(tag: string): Promise<Array<MediaItem>> {
    return MongoFactory.create()
      .collection<MediaItem>('media')
      .find({ tags: tag, isHidden: false })
      .toArray();
  }
  /**
   * Get all unique tags from the server.
   */
  async getTags(): Promise<Array<string>> {
    const [{ items }] = await MongoFactory.create()
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
    return R.sort((a, b) => a.codePointAt(0) - b.codePointAt(0), items);
  }

  /**
   *
   */
  async add(item: MediaItem): Promise<MediaItem> {
    await MongoFactory.create()
      .collection<MediaItem>('media')
      .insertOne(item);
    return item;
  }

  /**
   *
   */
  findById(id: string): Promise<MediaItem> {
    return MongoFactory.create()
      .collection<MediaItem>('media')
      .findOne({ _id: new ObjectId(id) });
  }

  /**
   *
   */
  async deleteById(id: string): Promise<boolean> {
    const result = await MongoFactory.create()
      .collection<MediaItem>('media')
      .deleteOne({ _id: new ObjectId(id) });
    return result.deletedCount === 1;
  }

  /**
   *
   */
  async update(updatedVideo: MediaItem): Promise<void> {
    // @ts-ignore
    await MongoFactory.create()
      .collection<MediaItem>('media')
      .updateOne(
        { _id: new ObjectId(updatedVideo._id) },
        { $set: R.omit(['_id'], updatedVideo) }
      );
  }
  async incrementPlayCount(id: string) {
    await MongoFactory.create()
      .collection<MediaItem>('media')
      .findOneAndUpdate({ _id: new ObjectId(id) }, { $inc: { views: 1 } });
  }
}
