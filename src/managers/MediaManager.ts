import { Library, MediaItem } from '../../server/models';
import MediaRA from '../ResourceAccess/MediaRA';

class MediaManager {
  registerLocal(
    item: { filename: string; path: string },
    libraries: Array<Library>,
    tags: Array<string>
  ): Promise<MediaItem> {
    const payload = {
      ...item,
      libraries,
      tags
    };
    return MediaRA.registerLocal(payload);
  }

  recentlyPlayed(limit: number) {
    return MediaRA.recentlyPlayed(limit);
  }

  updateThumbnail(mediaId: string, timestamp: string) {
    return MediaRA.regenerateThumbnail(mediaId, timestamp);
  }

  update(item: MediaItem) {
    return MediaRA.update(item);
  }
  latest(count: number): Promise<Array<MediaItem>> {
    return MediaRA.latest(count);
  }
  random(count: number): Promise<Array<MediaItem>> {
    return MediaRA.random(count);
  }
  upload(data: FormData, updateProgress: (progress: number) => void) {
    return MediaRA.upload(data, updateProgress);
  }
  search(term: string) {
    return MediaRA.search(term);
  }
  tags() {
    return MediaRA.tags();
  }
  details(id: string): Promise<MediaItem> {
    return MediaRA.details(id);
  }

  deleteById(id: string, hard: boolean = false) {
    return MediaRA.deleteById(id, hard);
  }

  getByTag(tag: string) {
    return MediaRA.getByTag(tag);
  }

  getByLibrary(libraryId: string) {
    return MediaRA.getByLibrary(libraryId);
  }

  requestMeta(id: string): Promise<{ meta: string }> {
    return MediaRA.requestMeta(id);
  }

  generateSrt(id: string, track: string): Promise<{ srt: string }> {
    return MediaRA.generateSrt(id, track);
  }

  generateWebVtt(id: string): Promise<{ webvtt: string }> {
    return MediaRA.generateWebVtt(id);
  }
}

export default new MediaManager();
