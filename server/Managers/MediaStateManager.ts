import { inject, injectable } from 'inversify';
import { ObjectId } from 'mongodb';
import { DependencyType } from '../Constant/DependencyType';
import { MediaStateRA } from '../ResourceAccess/MediaStateRA';

@injectable()
export class MediaStateManager {
  constructor(
    @inject(DependencyType.ResourceAccess.MediaState)
    private _mediaStateRA: MediaStateRA
  ) {}
  getMediaTime(mediaId: string, userId: string) {
    return this._mediaStateRA.get(mediaId, userId);
  }
  async create(
    mediaId: string,
    userId: string,
    time: number,
    isFinished: boolean = false
  ) {
    return this._mediaStateRA.create({
      isFinished,
      mediaId,
      userId,
      time,
      createdAt: new Date(),
      updatedAt: new Date()
    });
  }
  async setMediaTime(mediaId: string, time: number, userId: string) {
    const existing = await this._mediaStateRA.get(mediaId, userId);
    if (!existing) {
      return this.create(mediaId, userId, time);
    }
    return this._mediaStateRA.update({
      mediaId,
      userId,
      time,
      isFinished: false,
      updatedAt: new Date()
    });
  }

  async setIsFinished(mediaId: string, userId: string) {
    const existing = await this._mediaStateRA.get(mediaId, userId);
    if (!existing) {
      await this.create(mediaId, userId, 0, true);
    }
  }
}
