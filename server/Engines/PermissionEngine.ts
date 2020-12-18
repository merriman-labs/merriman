import { injectable } from 'inversify';
import { ItemVisibility } from '../Constant/ItemVisibility';
import { MediaItem } from '../models';

@injectable()
export class PermissionEngine {
  obfuscateMedia(media: Array<MediaItem>, requestingUserId: string) {
    return media.map((item) =>
      item.visibility === ItemVisibility.private &&
      item.user.userId.toString() !== requestingUserId
        ? this._obfuscate(item)
        : item
    );
  }

  private _obfuscate = (media: MediaItem): MediaItem => {
    return {
      ...media,
      filename: 'Private',
      srt: undefined,
      meta: undefined,
      subs: undefined,
      subtitles: undefined,
      user: {
        userId: '',
        username: 'Private User'
      },
      webvtt: undefined,
      views: 0,
      name: 'Private'
    };
  };
}
