import * as R from 'ramda';
import { MediaType, MediaItem } from '../models';
import { ObjectId } from 'mongodb';
import { injectable } from 'inversify';

@injectable()
export class MediaEngine {
  initializeMedia(filename: string, path?: string) {
    const ext = this._getExtension(filename);
    const id = new ObjectId();
    const newName = path ? filename : `${id.toHexString()}.${ext}`; // only use created name if path wasn't specified
    const timestamp = new Date();
    return R.pipe(
      R.assoc('name', filename),
      R.assoc('filename', newName),
      R.assoc('_id', id),
      R.assoc('views', 0),
      R.assoc('type', this._mapMediaType(filename)),
      R.assoc('created', timestamp),
      R.assoc('updated', timestamp),
      R.assoc('isHidden', false),
      x => (path ? R.assoc('path', path, x) : x)
    )({}) as MediaItem;
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
      [/(mp4|mpg|mpeg|avi|mov|flv|wmv|mkv)/, 'video'],
      [/(jpg|jpeg|png|tiff|bmp|gif)/, 'image'],
      [/(mp3|ogg|aac|wma|aiff|wav|pcm|flac|alac)/, 'audio']
    ];
    const ext = this._getExtension(filename);
    if (ext.length === 0) return 'binary';

    // test all the patterns in the map until one is found
    const testResult = mediaTypeMap.find(([pattern]) => pattern.test(ext));

    // return 'binary' by default
    if (!testResult) return 'binary';

    return testResult[1];
  }
}
