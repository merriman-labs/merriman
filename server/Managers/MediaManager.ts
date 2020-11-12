import MediaRA from '../ResourceAccess/MediaRA';
import { MediaEngine } from '../Engines/MediaEngine';
import { MediaItem } from '../models';
import { requestMeta, generateSubs } from '../ffmpeg';
import { fromSrt, toWebVTT } from '@johnny.reina/convert-srt';
import { MediaUtils } from '../Utilities/MediaUtils';
import { AppContext } from '../appContext';
import { inject, injectable } from 'inversify';
import { DependencyType } from '../Constant/DependencyType';
import { RegisterLocalPayload } from '../models/RegisterLocalPayload';
import ThumbProvider from '../thumb-provider';
import LibraryRA from '../ResourceAccess/LibraryRA';
import { ObjectId } from 'mongodb';

@injectable()
export class MediaManager {
  constructor(
    @inject(DependencyType.ResourceAccess.Media)
    private _mediaRA: MediaRA,
    @inject(DependencyType.Engines.Media)
    private _mediaEngine: MediaEngine,
    @inject(DependencyType.ResourceAccess.Library)
    private _libraryRA: LibraryRA
  ) {}

  async registerLocal(payload: RegisterLocalPayload) {
    const serverConfig = AppContext.get(AppContext.WellKnown.Config);
    // register item
    const mediaItem = await this._mediaRA.add({
      _id: new ObjectId(),
      created: new Date(),
      filename: payload.filename,
      isHidden: false,
      name: payload.filename,
      tags: payload.tags,
      type: 'video',
      updated: new Date(),
      userId: new ObjectId(payload.userId),
      views: 0,
      path: payload.path
    });

    // create thumbnail
    await ThumbProvider.ensureThumbs(
      [payload.filename],
      payload.path,
      serverConfig.thumbLocation
    ).catch(console.error);

    // add to libraries
    await Promise.all(
      payload.libraries.map((library) =>
        this._libraryRA.addMediaToLibrary(
          mediaItem._id.toString(),
          library._id.toString()
        )
      )
    );
    return mediaItem;
  }

  get(includeHidden: boolean = false) {
    return this._mediaRA.get(includeHidden);
  }

  getByTag(tag: string) {
    return this._mediaRA.getByTag(tag);
  }

  getByLibraryId(libraryId: string) {
    return this._mediaRA.getByLibraryId(libraryId);
  }

  add(filename: string, userId: string, path?: string) {
    const newMediaItem = this._mediaEngine.initializeMedia(
      filename,
      userId,
      path
    );
    return this._mediaRA.add(newMediaItem);
  }

  findById(id: string) {
    return this._mediaRA.findById(id);
  }

  async deleteById(id: string, hardDelete: boolean = false) {
    const config = AppContext.get(AppContext.WellKnown.Config);
    const media = await this._mediaRA.findById(id);
    if (!media) return false;
    if (hardDelete) {
      const path = media.path ? media.path : config.mediaLocation;
      MediaUtils.deleteMedia(path, media.filename);
    }
    return this._mediaRA.deleteById(id);
  }

  async where(predicate: (x: MediaItem) => boolean) {
    return (await this._mediaRA.get(true)).filter(predicate);
  }

  update(item: MediaItem) {
    return this._mediaRA.update(item);
  }

  incrementViewCount(id: string) {
    return this._mediaRA.incrementPlayCount(id);
  }

  getTags(): Promise<Array<string>> {
    return this._mediaRA.getTags();
  }

  async requestMeta(id: string) {
    const media = await this._mediaRA.findById(id);
    const { stdout, stderr } = await requestMeta(
      `${media.path}\\${media.filename}`
    );
    const meta = stdout === '' ? stderr : stdout;
    media.meta = meta;
    await this._mediaRA.update(media);
    return meta;
  }

  async generateSubs(id: string, track: string) {
    const media = await this._mediaRA.findById(id);
    const subs = await generateSubs(`${media.path}\\${media.filename}`, track);
    media.srt = subs;

    await this._mediaRA.update(media);
    return subs;
  }

  async generateWebVtt(id: string) {
    const media = await this._mediaRA.findById(id);
    if (!media.srt) throw new Error('No SRT subs found');
    const jsubs = fromSrt(media.srt);
    const webvtt = toWebVTT(jsubs);
    media.webvtt = webvtt;

    await this._mediaRA.update(media);
    return webvtt;
  }
}
