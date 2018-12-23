import * as fs from 'fs';
import * as R from 'ramda';
import * as uuid from 'uuid/v4';
import * as path from 'path';
import ServerConfigRepo from './ServerConfigRepo';

type MediaItem = {
  _id: string;
  favorite: boolean;
  filename: string;
  name: string;
};

export default class MediaRepo {
  private _dbpath: string;
  constructor() {
    this._dbpath = __dirname + '/db/media.json';

    this._ensureConfig();
  }

  /**
   *
   */
  get(): Array<MediaItem> {
    return JSON.parse(fs.readFileSync(this._dbpath, { encoding: 'utf8' }));
  }

  /**
   *
   */
  private _save(conf: Array<MediaItem>) {
    fs.writeFileSync(this._dbpath, JSON.stringify(conf));
  }

  /**
   *
   */
  add(filename: string): MediaItem {
    const fileParts = filename.split('.');
    const fileExtension = [...fileParts.slice(1)].join('.');
    const newId = uuid();
    const newFilename = `${newId}.${fileExtension}`;

    const videos = this.get();

    const newVideo = this._initVideo(newFilename, filename, newId);
    this._save(videos.concat(newVideo));
    return newVideo;
  }
  /**
   * Add an existing (local) media item to the database.
   * @param {string} filename Filename of the media item to add to the database
   */
  addLocalMedia(filename: string): MediaItem {
    const media = this._initVideo(filename, filename, uuid());
    const videos = this.get();
    this._save(videos.concat(media));
    return media;
  }
  /**
   *
   */
  find(predicate: ((x: MediaItem) => boolean)): MediaItem {
    return R.find(predicate, this.get());
  }
  findUnregisteredMedia(): Array<string> {
    const { mediaLocation } = new ServerConfigRepo().fetch();
    const registeredMedia = this.get().map(R.prop('filename'));
    console.log(registeredMedia);
    const allMedia = fs.readdirSync(mediaLocation);
    const unregisteredMedia = allMedia.filter(
      x => !R.contains(x, registeredMedia)
    );
    return unregisteredMedia;
  }
  /**
   *
   */
  where(predicate: ((x: MediaItem) => boolean)): Array<MediaItem> {
    return this.get().filter(predicate);
  }
  /**
   *
   */
  update(updatedVideo: MediaItem) {
    const videos = this.get();

    const newVideos = videos.map(video =>
      video._id === updatedVideo._id ? updatedVideo : video
    );

    return this._save(newVideos);
  }

  private _ensureConfig() {
    if (!fs.existsSync(this._dbpath)) this._save([]);
  }

  /**
   *
   */
  private _initVideo(name: string, originalName: string, id): MediaItem {
    return {
      name: originalName,
      filename: name,
      _id: id,
      favorite: false
    };
  }
}