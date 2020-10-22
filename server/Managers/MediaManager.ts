import MediaRA from '../ResourceAccess/MediaRA';
import { MediaEngine } from '../Engines/MediaEngine';
import { MediaItem } from '../models';
import { requestMeta, generateSubs } from '../ffmpeg';
import { fromSrt, toWebVTT } from '@johnny.reina/convert-srt';
import { MediaUtils } from '../Utilities/MediaUtils';
import { AppContext } from '../appContext';
import { inject, injectable } from 'inversify';
import { DependencyType } from '../Constant/DependencyType';

@injectable()
export class MediaManager {
  constructor(
    @inject(DependencyType.ResourceAccess.Media)
    private _mediaRA: MediaRA,
    @inject(DependencyType.Engines.Media)
    private _mediaEngine: MediaEngine
  ) {}

  get(includeHidden: boolean = false) {
    return this._mediaRA.get(includeHidden);
  }

  getByTag(tag: string) {
    return this._mediaRA.getByTag(tag);
  }

  getByLibraryId(libraryId: string) {
    return this._mediaRA.getByLibraryId(libraryId);
  }

  add(filename: string, path?: string) {
    const newMediaItem = this._mediaEngine.initializeMedia(filename, path);
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

  async where(predicate: ((x: MediaItem) => boolean)) {
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
