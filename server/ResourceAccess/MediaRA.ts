import * as fs from 'fs';
import * as R from 'ramda';
import * as uuid from 'uuid/v4';
import { MediaItem, MediaType } from '../models/index';
import { MongoFactory } from '../Factories/MongoFactory';
import ServerConfigRepo from '../data/ServerConfigRepo';
import { ObjectId } from 'mongodb';

export default class MediaRA {
  /**
   *
   */
  get(): Promise<Array<MediaItem>> {
    return MongoFactory.create()
      .collection<MediaItem>('media')
      .find()
      .toArray();
  }

  /**
   *
   */
  async add(item: MediaItem): Promise<MediaItem> {
    await MongoFactory.create()
      .collection<MediaItem>('media')
      .insert(item);
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
  async update(updatedVideo: MediaItem): Promise<void> {
    // @ts-ignore
    await MongoFactory.create()
      .collection<MediaItem>('media')
      .findOneAndUpdate({ _id: new ObjectId(updatedVideo._id) }, updatedVideo);
  }
}
