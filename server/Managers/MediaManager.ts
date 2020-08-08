import MediaRA from '../ResourceAccess/MediaRA';
import { MediaEngine } from '../Engines/MediaEngine';
import { MediaItem } from '../models';

export class MediaManager {
  private _mediaRA: MediaRA;
  private _mediaEngine: MediaEngine;
  constructor() {
    this._mediaRA = new MediaRA();
    this._mediaEngine = new MediaEngine();
  }

  get() {
    return this._mediaRA.get();
  }

  add(filename: string, path?: string) {
    const newMediaItem = this._mediaEngine.initializeMedia(filename, path);
    return this._mediaRA.add(newMediaItem);
  }

  findById(id: string) {
    return this._mediaRA.findById(id);
  }

  async where(predicate: ((x: MediaItem) => boolean)) {
    return (await this._mediaRA.get()).filter(predicate);
  }

  update(item: MediaItem) {
    return this._mediaRA.update(item);
  }

  incrementViewCount(id: string) {
    return this._mediaRA.incrementPlayCount(id);
  }
}
