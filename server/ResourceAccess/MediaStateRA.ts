import { inject, injectable } from 'inversify';
import { Db, ObjectId } from 'mongodb';
import * as R from 'ramda';
import { DependencyType } from '../Constant/DependencyType';
import { MediaState } from '../models/MediaState';

@injectable()
export class MediaStateRA {
  constructor(@inject(DependencyType.External.MongoDB) private _db: Db) {}

  get(mediaId: string, userId: string): Promise<MediaState> {
    return this._db.collection('media-state').findOne({
      mediaId: new ObjectId(mediaId),
      userId: new ObjectId(userId)
    });
  }

  create(mediaState: {
    mediaId: string;
    userId: string;
    time: number;
    isFinished: boolean;
  }) {
    return this._db.collection<MediaState>('media-state').insertOne({
      isFinished: mediaState.isFinished,
      mediaId: new ObjectId(mediaState.mediaId),
      time: mediaState.time,
      userId: new ObjectId(mediaState.userId)
    });
  }

  update(
    mediaState: Partial<{
      mediaId: string;
      userId: string;
      time: number;
      isFinished: boolean;
    }>
  ) {
    if (!mediaState.mediaId || !mediaState.userId) throw new Error();
    return this._db.collection<MediaState>('media-state').updateOne(
      {
        mediaId: new ObjectId(mediaState.mediaId),
        userId: new ObjectId(mediaState.userId)
      },
      { $set: R.omit(['mediaId', 'userId'], mediaState) }
    );
  }
}
