import * as R from 'ramda';
import { MediaType, MediaItem, RegisterLocalPayload } from '../models';
import { ObjectId } from 'mongodb';
import { injectable } from 'inversify';
import { ItemVisibility } from '../Constant/ItemVisibility';

@injectable()
export class MediaEngine {
  /**
   * Initialize a media item that is uploaded to the server.
   * @param filename
   * @param userId
   * @param path
   */
  initializeUploadedMedia(
    filename: string,
    userId: string,
    username: string,
    path?: string
  ): MediaItem {
    const ext = this._getExtension(filename);
    const _id = new ObjectId();
    const newName = `${_id.toHexString()}.${ext}`;
    const timestamp = new Date();
    return {
      _id,
      createdAt: timestamp,
      filename: newName,
      isHidden: false,
      name: filename,
      tags: [],
      type: this._mapMediaType(filename),
      updatedAt: timestamp,
      user: {
        userId,
        username
      },
      views: 0,
      visibility: ItemVisibility.public,
      path
    };
  }

  /**
   * Initialize a media item in-place on the server, i.e. from the file system.
   * @param payload
   */
  initializeLocalMedia(payload: RegisterLocalPayload): MediaItem {
    const _id = new ObjectId();
    const timestamp = new Date();
    return {
      _id,
      createdAt: timestamp,
      filename: payload.filename,
      isHidden: false,
      name: payload.filename,
      path: payload.path,
      tags: payload.tags,
      type: this._mapMediaType(payload.filename),
      updatedAt: timestamp,
      user: {
        userId: payload.userId,
        username: payload.username
      },
      views: 0,
      visibility: ItemVisibility.public
    };
  }

  private _getExtension(filename: string) {
    const parts = filename.split('.');
    if (parts.length === 1) {
      return '';
    }

    return R.last(parts);
  }
  private _mapMediaType(filename: string): MediaType {
    const mediaTypeMap: Array<[RegExp, MediaType]> = [
      [/(mp4|mpg|mpeg|avi|mov|flv|wmv|mkv|m4v)/i, MediaType.Video],
      [/(jpg|jpeg|png|tiff|tif|bmp|gif|svg)/i, MediaType.Image],
      [/(mp3|ogg|aac|wma|aiff|wav|pcm|flac|alac)/i, MediaType.Audio],
      [/(pdf|epub)/i, MediaType.Book]
    ];
    const ext = this._getExtension(filename);
    if (ext.length === 0) return MediaType.Binary;

    // test all the patterns in the map until one is found
    const testResult = mediaTypeMap.find(([pattern]) => pattern.test(ext));

    // return 'binary' by default
    if (!testResult) return MediaType.Binary;

    return testResult[1];
  }
}
