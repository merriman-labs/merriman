import { MediaItem } from '../../server/models';
import MediaRA from '../data/MediaRA';

class MediaManager {
  update(item: MediaItem) {
    return MediaRA.update(item);
  }
  latest(count: number): Promise<Array<MediaItem>> {
    return MediaRA.latest(count);
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

export default MediaManager;
