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
  async setMediaTime(mediaId: string, time: number, userId: string) {
    const existing = await this._mediaStateRA.get(mediaId, userId);
    if (!existing) {
      return this._mediaStateRA.create({
        isFinished: false,
        mediaId,
        userId,
        time
      });
    }
    return this._mediaStateRA.update({
      mediaId,
      userId,
      time
    });
  }
}
