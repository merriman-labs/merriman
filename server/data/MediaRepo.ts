import * as fs from 'fs';
import * as R from 'ramda';
import * as uuid from 'uuid/v4';
import ServerConfigRepo from './ServerConfigRepo';
import { MediaItem, MediaType } from '../models/index';
import { Collection, Database } from '@johnny.reina/json-db';

export default class MediaRepo {
  private _collection: Collection<MediaItem> = new Database(
    'merriman'
  ).collection('media');

  /**
   *
   */
  get(): Promise<Array<MediaItem>> {
    return this._collection.read();
  }

  /**
   *
   */
  async add(filename: string): Promise<MediaItem> {
    const fileParts = filename.split('.');
    const fileExtension = [...fileParts.slice(1)].join('.');
    const newId = uuid();
    const newFilename = `${newId}.${fileExtension}`;

    const newVideo = this._initVideo(newFilename, filename, newId);
    const id = await this._collection.insert(newVideo);
    return newVideo;
  }
  /**
   * Add an existing (local) media item to the database.
   * @param {string} filename Filename of the media item to add to the database
   */
  async addLocalMedia(filename: string): Promise<MediaItem> {
    const media = this._initVideo(filename, filename, uuid());
    await this._collection.insert(media);
    return media;
  }
  /**
   * Add an existing media item from outside of the media directory to the database.
   * @param filename Filename of the media item to add to the database
   * @param path Path to the file
   */
  async addExternal(filename: string, path: string): Promise<MediaItem> {
    const media = this._initVideo(filename, filename, uuid(), path);
    await this._collection.insert(media);
    return media;
  }
  /**
   *
   */
  find(predicate: ((x: MediaItem) => boolean)): Promise<MediaItem> {
    return this._collection.find(predicate);
  }
  async findUnregisteredMedia(): Promise<Array<string>> {
    const { mediaLocation } = await new ServerConfigRepo().fetch();
    const registeredMedia = (await this._collection.read()).map(
      R.prop('filename')
    );
    const allMedia = fs.readdirSync(mediaLocation);
    const unregisteredMedia = allMedia.filter(
      x => !R.contains(x, registeredMedia)
    );
    return unregisteredMedia;
  }
  /**
   *
   */
  where(predicate: ((x: MediaItem) => boolean)): Promise<Array<MediaItem>> {
    return this._collection.read(predicate);
  }
  /**
   *
   */
  update(updatedVideo: MediaItem): Promise<void> {
    return this._collection.update(updatedVideo);
  }

  /**
   *
   */
  private _initVideo(
    name: string,
    originalName: string,
    id: string,
    path?: string
  ): MediaItem {
    return R.pipe(
      R.assoc('name', originalName),
      R.assoc('filename', name),
      R.assoc('_id', id),
      R.assoc('views', 0),
      R.assoc('type', this._mapMediaType(originalName)),
      R.assoc('created', new Date().toUTCString()),
      R.assoc('updated', new Date().toUTCString()),
      x => (path ? R.assoc('path', path, x) : x)
    )({}) as MediaItem;
  }

  private _mapMediaType(filename: string): MediaType {
    const mediaTypeMap: Array<[RegExp, MediaType]> = [
      [/(mp4|mpg|mpeg|avi|mov|flv|wmv|mkv)/, 'video'],
      [/(jpg|jpeg|png|tiff|bmp|gif)/, 'image'],
      [/(mp3|ogg|aac|wma|aiff|wav|pcm|flac|alac)/, 'audio']
    ];
    const filePieces = filename.split('.');
    if (filePieces.length === 0) return 'binary';

    // test all the patterns in the map until one is found
    const testResult = mediaTypeMap.find(([pattern]) => pattern.test(filename));

    // return 'binary' by default
    if (!testResult) return 'binary';

    return testResult[1];
  }
}
