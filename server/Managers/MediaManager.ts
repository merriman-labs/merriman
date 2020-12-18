import * as path from 'path';
import MediaRA from '../ResourceAccess/MediaRA';
import { MediaEngine } from '../Engines/MediaEngine';
import { MediaItem, MediaType } from '../models';
import { requestMeta, generateSubs } from '../ffmpeg';
import { fromSrt, toWebVTT } from '@johnny.reina/convert-srt';
import { MediaUtils } from '../Utilities/MediaUtils';
import { AppContext } from '../appContext';
import { inject, injectable } from 'inversify';
import { DependencyType } from '../Constant/DependencyType';
import { RegisterLocalPayload } from '../models/RegisterLocalPayload';
import ThumbProvider from '../thumb-provider';
import LibraryRA from '../ResourceAccess/LibraryRA';
import { NotFoundError } from '../Errors/NotFoundError';
import { UnauthorizedError } from '../Errors/UnauthorizedError';

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

  random(userId: string) {
    return this._mediaRA.random(userId);
  }

  latest(skip: number, limit: number, userId: string) {
    return this._mediaRA.latest(skip, limit, userId);
  }

  recentlyPlayed(userId: string, limit: number) {
    return this._mediaRA.getRecentlyPlayed(userId, limit);
  }

  async registerLocal(payload: RegisterLocalPayload) {
    const serverConfig = AppContext.get(AppContext.WellKnown.Config);
    const newItem = this._mediaEngine.initializeLocalMedia(payload);
    // register item
    const mediaItem = await this._mediaRA.add(newItem);

    if (mediaItem.type === MediaType.Video) {
      // create thumbnail
      await ThumbProvider.ensureThumbs(
        [payload.filename],
        payload.path,
        serverConfig.thumbLocation
      ).catch(console.error);
    }

    // add to libraries
    await Promise.all(
      payload.libraries.map(async (library) => {
        const lib = await this._libraryRA.findById(library._id.toString());
        const item = { id: mediaItem._id.toString(), order: lib.items.length };

        this._libraryRA.addMediaToLibrary(item, library._id.toString());
      })
    );
    return mediaItem;
  }

  getByTag(tag: string, userId: string) {
    return this._mediaRA.getByTag(tag, userId);
  }

  getByLibraryId(libraryId: string, userId: string) {
    return this._mediaRA.getByLibraryId(libraryId, userId);
  }

  add(filename: string, userId: string, username: string, path?: string) {
    const newMediaItem = this._mediaEngine.initializeUploadedMedia(
      filename,
      userId,
      username,
      path
    );
    return this._mediaRA.add(newMediaItem);
  }

  findById(id: string, userId: string) {
    return this._mediaRA.findById(id, userId);
  }

  async deleteById(id: string, userId: string, hardDelete: boolean = false) {
    const config = AppContext.get(AppContext.WellKnown.Config);
    const media = await this._mediaRA.findById(id, userId);
    if (!media) return false;
    if (hardDelete) {
      const path = media.path ? media.path : config.mediaLocation;
      MediaUtils.deleteMedia(path, media.filename);
    }
    return this._mediaRA.deleteById(id);
  }

  async update(item: MediaItem, userId: string) {
    const existing = await this._mediaRA.findById(item._id.toString(), userId);
    if (!existing) throw new NotFoundError('NOT_FOUND');
    if (existing.user.userId.toString() !== userId)
      throw new UnauthorizedError('NOT_AUTHORIZED');
    return this._mediaRA.update(item);
  }

  incrementViewCount(id: string) {
    return this._mediaRA.incrementPlayCount(id);
  }

  getTags(): Promise<Array<string>> {
    return this._mediaRA.getTags();
  }

  async requestMeta(id: string, userId: string) {
    const media = await this._mediaRA.findById(id, userId);
    const { stdout, stderr } = await requestMeta(
      path.join(media.path, media.filename)
    );
    const meta = stdout === '' ? stderr : stdout;
    media.meta = meta;
    await this._mediaRA.update(media);
    return meta;
  }

  async generateSubs(id: string, track: string, userId: string) {
    const media = await this._mediaRA.findById(id, userId);
    const subs = await generateSubs(
      path.join(media.path, media.filename),
      track
    );
    media.srt = subs;

    await this._mediaRA.update(media);
    return subs;
  }

  async generateWebVtt(id: string, userId: string) {
    const media = await this._mediaRA.findById(id, userId);
    if (!media.srt) throw new Error('No SRT subs found');
    const jsubs = fromSrt(media.srt);
    const webvtt = toWebVTT(jsubs);
    media.webvtt = webvtt;

    await this._mediaRA.update(media);
    return webvtt;
  }
}
