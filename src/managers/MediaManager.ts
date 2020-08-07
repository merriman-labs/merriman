import { MediaItem } from '../../server/models';
import MediaRA from '../data/MediaRA';

class MediaManager {
  latest(count: number): Promise<Array<MediaItem>> {
    return MediaRA.latest(count);
  }
}

export default MediaManager;
